/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Supabase project URL (client/runtime). */
  readonly VITE_SUPABASE_URL?: string
  /** Supabase anon/publishable key — safe in client code. */
  readonly VITE_SUPABASE_ANON_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
