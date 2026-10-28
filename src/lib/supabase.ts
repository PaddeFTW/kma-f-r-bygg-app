import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/** True when both Vite env vars are set. */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

/**
 * Supabase browser client.
 * Requires VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (see .env.example).
 */
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'public-anon-key',
)

export type UppgiftStatus = 'öppen' | 'pågående' | 'klar'

export type Uppgift = {
  id: string
  title: string
  description: string | null
  status: UppgiftStatus
  user_id: string
  created_at: string
  updated_at: string
}
