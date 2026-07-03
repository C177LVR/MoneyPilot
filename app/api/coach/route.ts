import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { anthropic } from "@/lib/anthropic/client";
import { anthropicModel, isAnthropicConfigured } from "@/lib/anthropic/config";
import { buildCoachSystemPrompt } from "@/lib/coach";
import { checkRateLimit } from "@/lib/rate-limit";

const MAX_MESSAGE_LENGTH = 2000;

export async function POST(request: Request) {
  const authUser = await getAuthUser();
  if (!authUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isAnthropicConfigured) {
    return NextResponse.json(
      { error: "The AI Coach isn't configured yet. Add ANTHROPIC_API_KEY to enable it." },
      { status: 503 }
    );
  }

  if (!checkRateLimit(`coach:${authUser.id}`, 15, 60_000)) {
    return NextResponse.json(
      { error: "You're sending messages too quickly. Wait a moment and try again." },
      { status: 429 }
    );
  }

  let body: { conversationId?: string; message?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const message = (body.message ?? "").trim();
  if (!message) {
    return NextResponse.json({ error: "Message can't be empty." }, { status: 400 });
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      { error: `Keep messages under ${MAX_MESSAGE_LENGTH} characters.` },
      { status: 400 }
    );
  }

  try {
    // Resolve or create the conversation, always scoped to this user.
    let conversationId = body.conversationId;
    if (conversationId) {
      const owned = await prisma.coachConversation.findFirst({
        where: { id: conversationId, userId: authUser.id },
        select: { id: true },
      });
      if (!owned) conversationId = undefined;
    }
    if (!conversationId) {
      const created = await prisma.coachConversation.create({
        data: { userId: authUser.id, title: message.slice(0, 60) },
      });
      conversationId = created.id;
    }

    await prisma.coachMessage.create({
      data: { conversationId, role: "user", content: message },
    });

    const [history, userRecord] = await Promise.all([
      prisma.coachMessage.findMany({
        where: { conversationId },
        orderBy: { createdAt: "asc" },
        take: 40, // cap the context window sent to Claude
      }),
      prisma.user.findUnique({ where: { id: authUser.id }, select: { name: true } }),
    ]);

    const systemPrompt = await buildCoachSystemPrompt(
      authUser.id,
      userRecord?.name ?? ""
    );

    const response = await anthropic.messages.create({
      model: anthropicModel,
      max_tokens: 1024,
      system: systemPrompt,
      messages: history.map((m) => ({
        role: m.role === "assistant" ? ("assistant" as const) : ("user" as const),
        content: m.content,
      })),
    });

    const textBlock = response.content.find((b) => b.type === "text");
    const reply = textBlock && "text" in textBlock ? textBlock.text : "";
    if (!reply) throw new Error("Empty response from Claude");

    await prisma.coachMessage.create({
      data: { conversationId, role: "assistant", content: reply },
    });

    return NextResponse.json({ conversationId, reply });
  } catch (err) {
    console.error("Coach API error:", err);
    return NextResponse.json(
      { error: "The AI Coach hit a snag. Please try again in a moment." },
      { status: 500 }
    );
  }
}
