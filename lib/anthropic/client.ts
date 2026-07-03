import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { anthropicApiKey } from "./config";

/**
 * Server-only Anthropic client. Only call this when `isAnthropicConfigured`
 * is true — the SDK throws immediately if the key is empty.
 */
export const anthropic = new Anthropic({ apiKey: anthropicApiKey });
