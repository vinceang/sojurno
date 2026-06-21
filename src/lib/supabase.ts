import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Browser Supabase client (→ ADR-0026). Created from `VITE_` env; `null` when unconfigured so the
 * app degrades to the mock-only session/data behavior (local dev without keys still runs). The anon
 * key is safe in client code — writes are gated by RLS + the authenticated demo session.
 */
const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase: SupabaseClient | null = url && anonKey ? createClient(url, anonKey) : null

/** Shared "Test User" demo credentials — the mock login signs into this single real account. */
export const DEMO_EMAIL = import.meta.env.VITE_DEMO_EMAIL
export const DEMO_PASSWORD = import.meta.env.VITE_DEMO_PASSWORD

/** True when the live backend (client + demo creds) is fully configured. */
export const isSupabaseConfigured = Boolean(supabase && DEMO_EMAIL && DEMO_PASSWORD)
