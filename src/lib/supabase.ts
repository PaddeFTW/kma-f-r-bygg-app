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

/** Flik 6 – Miljöplan */
export type Miljoplan = {
  id: string
  user_id: string
  company_id: string
  project_id: string
  miljopolicy: string | null
  aspekt_transporter: boolean
  aspekt_byggavfall: boolean
  aspekt_kemikalier: boolean
  aspekt_farligt_avfall: boolean
  aspekt_el: boolean
  aspekt_kallsortering: boolean
  miljoaspekter_anteckningar: string | null
  kallsortering_kemikalier_sdb: string | null
  lagar_krav: string | null
  ansvar: string | null
  utbildning: string | null
  kommunikation: string | null
  egenkontroll_miljo: string | null
  avvikelser: string | null
  nodlage: string | null
  created_at: string
  updated_at: string
}

/** Flik 7 – Arbetsmiljöplan */
export type Arbetsmiljoplan = {
  id: string
  user_id: string
  company_id: string
  project_id: string
  arbetsmiljopolicy: string | null
  uppfoljning_skyddsronder: string | null
  regel_skyddsutrustning: boolean
  regel_heta_arbeten: boolean
  regel_tillfallig_el: boolean
  regel_buller: boolean
  regel_droger: boolean
  ordningsregler_anteckningar: string | null
  samordning_ue: string | null
  skyddsrond_anteckningar: string | null
  riskbedomning_anteckningar: string | null
  created_at: string
  updated_at: string
}

/** Flik 8 – Miljöanalys */
export type Miljoanalys = {
  id: string
  user_id: string
  company_id: string
  project_id: string
  atgard_transporter: string | null
  atgard_tomgang: string | null
  atgard_damm: string | null
  atgard_buller: string | null
  atgard_materialhantering: string | null
  atgard_kallsortering: string | null
  atgard_byggavfall: string | null
  atgard_nodlagesberedskap: string | null
  created_at: string
  updated_at: string
}

/** Flik 9 – Farligt avfall (tabellrad) */
export type FarligtAvfallRow = {
  avfallsslag: string
  fa: boolean
  mangd: string
  hantering: string
  transportor_mottagare: string
}

/** Flik 9 – Övrigt avfall (fraktion) */
export type OvrigtAvfallRow = {
  fraktioner: string
  mangd: string
  transportor: string
  hantering_nr: string
  analys_bilaga: string
}

/** Flik 9 – Rivningsplan */
export type Rivningsplan = {
  id: string
  user_id: string
  company_id: string
  project_id: string
  fastighetsbeteckning_adress: string | null
  start_stoppdatum_rivning: string | null
  byggherre: string | null
  byggherre_kontakt: string | null
  entreprenor: string | null
  entreprenor_kontakt: string | null
  kvalitetsansvarig: string | null
  rivare: string | null
  bygganmalan_lamnas_till: string | null
  bygganmalan_kravs_inte: boolean
  materialinventering_utford: boolean
  materialinventering_ej_utford: boolean
  materialinventering_anteckningar: string | null
  byggnadstyp: string | null
  byggar: string | null
  ombyggnad_ar: string | null
  byggnadsyta: string | null
  antal_vaningar: string | null
  material_grund: string | null
  material_stomme: string | null
  material_tak: string | null
  nuvarande_anvandning: string | null
  nuvarande_anvandning_fran_ar: string | null
  tidigare_anvandning: string | null
  tidigare_anvandning_fran_ar: string | null
  rivning_omfattning: string | null
  rivning_byggnadsyta_m2: string | null
  bilagor: string | null
  farligt_avfall: FarligtAvfallRow[]
  ovrigt_avfall: OvrigtAvfallRow[]
  created_at: string
  updated_at: string
}

/** Flik 10 – Protokoll byggmöte */
export type Protokoll = {
  id: string
  user_id: string
  company_id: string
  project_id: string
  projektnr: string | null
  namn: string | null
  mote_nr: string | null
  datum: string | null
  plats: string | null
  narvarande_entreprenor: string | null
  narvarande_bestallare: string | null
  narvarande_underentreprenor: string | null
  dagordning_kvalitet: string | null
  dagordning_miljo: string | null
  dagordning_arbetsmiljo: string | null
  dagordning_ovrigt: string | null
  beslut: string | null
  created_at: string
  updated_at: string
}
