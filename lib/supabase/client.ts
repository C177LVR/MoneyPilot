"use client";

import { createBrowserClient } from "@supabase/ssr";
import { supabaseUrl, supabaseAnonKey } from "./config";

/** Browser-side Supabase client for use in Client Components. */
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
