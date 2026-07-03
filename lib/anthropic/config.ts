/** Central place to read Anthropic env + report whether the AI Coach is configured. */
export const anthropicApiKey = process.env.ANTHROPIC_API_KEY ?? "";
export const anthropicModel = process.env.ANTHROPIC_MODEL || "claude-sonnet-5";

/**
 * True only when an API key is present. Used to degrade gracefully: the app
 * runs fine without it, and the Coach screen shows a clear "configure
 * Anthropic" notice instead of crashing or silently failing.
 */
export const isAnthropicConfigured = anthropicApiKey.length > 0;
