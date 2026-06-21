import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Browser Supabase client (→ ADR-0026). Created from `VITE_` env; `null` when unconfigured so the
 * app degrades to the mock-only session/data behavior (local dev without keys still runs). The anon
 * key is safe in client code — writes are gated by RLS + the authenticated demo session.
 */
const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase: SupabaseClient | null = url && anonKey ? createClient(url, anonKey) : null

/**
 * Public shared demo credentials — a single real Supabase account, posted on the login screen so
 * anyone can try the host side (→ ADR-0024/0026). Not a secret; RLS limits writes to its own rows.
 */
export const DEMO_EMAIL = 'test@sojurno.com'
export const DEMO_PASSWORD = 'demo123'

/** True when the live backend (client) is configured; false → mock fallback. */
export const isSupabaseConfigured = Boolean(supabase)
