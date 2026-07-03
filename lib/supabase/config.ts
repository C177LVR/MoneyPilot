/** Central place to read Supabase env + report whether auth is configured. */
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/**
 * True only when both public Supabase env vars are present. Used to degrade
 * gracefully: the marketing site still runs with auth unconfigured, and auth
 * screens show a clear "configure Supabase" notice instead of crashing.
 */
export const isSupabaseConfigured =
  supabaseUrl.length > 0 && supabaseAnonKey.length > 0;
