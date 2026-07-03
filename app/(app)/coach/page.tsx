import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isAnthropicConfigured } from "@/lib/anthropic/config";
import { PageHeader } from "@/components/app/page-header";
import { CoachChat } from "@/components/coach/coach-chat";

export const metadata: Metadata = {
  title: "AI Coach",
  robots: { index: false, follow: false },
};

export default async function CoachPage() {
  const { appUser } = await getCurrentUser();
  if (!appUser) redirect("/login");

  const latest = await prisma.coachConversation.findFirst({
    where: { userId: appUser.id },
    orderBy: { createdAt: "desc" },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });

  const initialMessages =
    latest?.messages.map((m) => ({
      role: m.role === "assistant" ? ("assistant" as const) : ("user" as const),
      content: m.content,
    })) ?? [];

  return (
    <div>
      <PageHeader
        title="AI Money Coach"
        subtitle="Ask anything about your money — your coach explains the trade-offs, not just the answer."
      />
      <CoachChat
        configured={isAnthropicConfigured}
        initialConversationId={latest?.id ?? null}
        initialMessages={initialMessages}
      />
    </div>
  );
}
