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

export type Company = {
  id: string
  user_id: string
  name: string
  org_number: string | null
  address: string | null
  postal_code: string | null
  city: string | null
  ceo_name: string | null
  phone: string | null
  email: string | null
  website: string | null
  created_at: string
  updated_at: string
}

export type Project = {
  id: string
  user_id: string
  company_id: string
  property_designation: string
  address: string | null
  postal_code: string | null
  city: string | null
  directions: string | null
  contact_name: string | null
  phone: string | null
  email: string | null
  contact_info: string | null
  client_name: string | null
  client_org_number: string | null
  client_address: string | null
  client_postal_code: string | null
  client_city: string | null
  client_phone: string | null
  client_email: string | null
  client_info: string | null
  contractor_name: string | null
  contractor_org_number: string | null
  contractor_address: string | null
  contractor_postal_code: string | null
  contractor_city: string | null
  contractor_project_manager: string | null
  contractor_project_manager_phone: string | null
  contractor_site_manager: string | null
  contractor_site_manager_phone: string | null
  contract_form: string | null
  contractor_info: string | null
  description: string | null
  /** Reserved for future guided Q&A flow */
  guided_answers: Record<string, unknown>
  created_at: string
  updated_at: string
}

/** Flik 2 – Roller och ansvar */
export type ProjectRole = {
  id: string
  user_id: string
  company_id: string
  project_id: string
  role_title: string
  name: string
  phone: string | null
  email: string | null
  responsibility_area: string | null
  created_at: string
  updated_at: string
}

/** Flik 3 – Beställarens organisation */
export type ProjectClient = {
  id: string
  user_id: string
  company_id: string
  project_id: string
  ceo_name: string | null
  contact_name: string | null
  address: string | null
  postal_code: string | null
  city: string | null
  phone: string | null
  email: string | null
  website: string | null
  project_manager: string | null
  quality_manager: string | null
  environmental_manager: string | null
  work_environment_manager: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

/** Flik 4 – Underleverantör */
export type ProjectSubcontractor = ProjectClient & {
  purchasing_manager: string | null
}

/** Flik 5 – Kvalitetsplan */
export type Kvalitetsplan = {
  id: string
  user_id: string
  company_id: string
  project_id: string
  kvalitetspolicy: string | null
  orientering_allman_info: string | null
  orientering_entreprenadform: string | null
  orientering_art: string | null
  orientering_tidplan: string | null
  organisation: string | null
  projektgenomgang_byggmote: string | null
  projektgenomgang_andringar: string | null
  projektgenomgang_protokoll: string | null
  projektering_kontrollplan: string | null
  produktion_egenkontroll: string | null
  produktion_dagbok: string | null
  produktion_ata: string | null
  produktion_personalliggare: string | null
  produktion_avvikelser: string | null
  montage_matutrustning: string | null
  avslutning_provning: string | null
  avslutning_besiktning: string | null
  dokumentstyrning: string | null
  distributionsforteckning: string | null
  created_at: string
  updated_at: string
}
