/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Supabase project URL (client/runtime). */
  readonly VITE_SUPABASE_URL?: string
  /** Supabase anon/publishable key — safe in client code. */
  readonly VITE_SUPABASE_ANON_KEY?: string
  /** Shared demo account email — backs the mock login as the single "Test User" identity. */
  readonly VITE_DEMO_EMAIL?: string
  /** Shared demo account password (intentionally client-side; RLS limits blast radius). */
  readonly VITE_DEMO_PASSWORD?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
