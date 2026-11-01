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
  bas_overlamning_gjord?: boolean
  bas_overlamning_datum?: string | null
  bas_overlamning_from?: string | null
  bas_overlamning_to?: string | null
  bas_overlamning_anteckning?: string | null
  created_at: string
  updated_at: string
}

/** Flik 2 – Roller och ansvar (inkl. Bas-P/Bas-U kompetens) */
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
  competence?: string | null
  education?: string | null
  cert_file_path?: string | null
  cert_file_name?: string | null
  created_at: string
  updated_at: string
}

/** Företagets återanvändbara kontaktlista */
export type CompanyContact = {
  id: string
  user_id: string
  company_id: string
  name: string
  email: string | null
  phone: string | null
  company_name: string | null
  role: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

/** Företagets återanvändbara projekt-/flikmallar */
export type ProjectTemplate = {
  id: string
  user_id: string
  company_id: string
  name: string
  description: string | null
  scope: 'project' | 'flik'
  flik_nr: number | null
  flik_nrs: number[]
  payload: Record<string, unknown>
  source_project_id: string | null
  created_at: string
  updated_at: string
}

/** AFS 2023:3 11 kap. 12 § – särskilda risker */
export type ProjectSarskildRisk = {
  id: string
  user_id: string
  company_id: string
  project_id: string
  sort_order: number
  punkt_nr: number
  benamning: string
  svar: '' | 'ja' | 'nej'
  atgard: string | null
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

/** Flik 11 – Bygghandlingar / relationsritningar */
export type BygghandlingTyp = 'ritning' | 'relationsritning' | 'handling'

export type Bygghandling = {
  id: string
  user_id: string
  company_id: string
  project_id: string
  namn: string
  beskrivning: string | null
  typ: BygghandlingTyp | string | null
  file_url: string | null
  file_path: string | null
  file_name: string | null
  created_at: string
  updated_at: string
}

/** Flik 12 – Kontrollplan enligt PBL */
export type KontrollplanUtforAv = 'S' | 'E'

export type Kontrollplan = {
  id: string
  user_id: string
  company_id: string
  project_id: string
  objektinfo: string | null
  kontrollansvarig: string | null
  byggherre: string | null
  entreprenor: string | null
  underlag: string | null
  signatur_kontrollansvarig: string | null
  signatur_byggherre: string | null
  created_at: string
  updated_at: string
}

export type KontrollplanRad = {
  id: string
  kontrollplan_id: string
  sort_order: number
  kontroll_avser: string | null
  utfor_av: KontrollplanUtforAv | string | null
  metod: string | null
  underlag: string | null
  anmarkning: string | null
  atgard: string | null
  datum: string | null
  sign: string | null
  created_at: string
  updated_at: string
}

/** Flik 13 – Egenkontroll */
export type EgenkontrollStatus = '1' | '2' | '3'

export type Egenkontroll = {
  id: string
  user_id: string
  company_id: string
  project_id: string
  typ: string | null
  bestallare: string | null
  entreprenor: string | null
  objekt: string | null
  projektnr: string | null
  referens: string | null
  ovriga_anteckningar: string | null
  kontrollansvarig: string | null
  created_at: string
  updated_at: string
}

export type EgenkontrollRad = {
  id: string
  egenkontroll_id: string
  sort_order: number
  kontrollmoment: string | null
  status: EgenkontrollStatus | string | null
  datum: string | null
  signatur: string | null
  created_at: string
  updated_at: string
}

/** Flik 14 – Egenkontroller från UE */
export type EgenkontrollUe = {
  id: string
  user_id: string
  company_id: string
  project_id: string
  underleverantor: string
  egenkontroll: string | null
  datum: string | null
  created_at: string
  updated_at: string
}

/** Flik 15 – Inventering av maskiner för UE */
export type MaskinUe = {
  id: string
  user_id: string
  company_id: string
  project_id: string
  underleverantor: string
  maskiner: string | null
  datum: string | null
  created_at: string
  updated_at: string
}

/** Flik 16 – Avvikelserapport */
export type Avvikelse = {
  id: string
  user_id: string
  company_id: string
  project_id: string
  ordernr: string | null
  datum: string | null
  inlamnat_av: string | null
  beskrivning: string | null
  korrigerande_atgard: string | null
  grundorsak: string | null
  kostnad: number | null
  forebyggande_atgard: string | null
  uppfoljning: string | null
  created_at: string
  updated_at: string
}

/** Flik 16 – ÄTA */
export type Ata = {
  id: string
  user_id: string
  company_id: string
  project_id: string
  ordernr: string | null
  objekt: string | null
  beskrivning: string | null
  rapportor: string | null
  orsak: string | null
  hanvisning: string | null
  pris_modell: 'fast_pris' | 'lopande_rakning' | string | null
  signatur: string | null
  created_at: string
  updated_at: string
}

/** Flik 16 – ÄTA-lista */
export type AtaLista = {
  id: string
  user_id: string
  company_id: string
  project_id: string
  nr: string | null
  datum: string | null
  beskrivning: string | null
  bestalld: boolean | null
  summa: number | null
  fakturerad: boolean | null
  created_at: string
  updated_at: string
}

/** Flik 17 – Säkerhetsdatablad */
export type Sakerhetsdatablad = {
  id: string
  user_id: string
  company_id: string
  project_id: string
  produkt: string
  sakerhetsdatablad: boolean | null
  ansvarig: string | null
  datum: string | null
  created_at: string
  updated_at: string
}

/** Flik 18 – Nödlägesberedskap */
export type Nodlage = {
  id: string
  user_id: string
  company_id: string
  project_id: string
  raddningshjalp: string | null
  larmrutin_miljoolycka: string | null
  larmrutin_personskada: string | null
  information_narboende: string | null
  created_at: string
  updated_at: string
}

export type NodlageOrganisation = {
  id: string
  nodlage_id: string
  sort_order: number
  befattning: string | null
  namn: string | null
  telefon: string | null
  created_at: string
  updated_at: string
}

/** Flik 19 – Anhöriglista */
export type Anhoriglista = {
  id: string
  user_id: string
  company_id: string
  project_id: string
  medarbetare: string
  narmaste_anhorig: string | null
  telefon_mobil: string | null
  datum: string | null
  created_at: string
  updated_at: string
}

/** Flik 20 – Krisberedskap */
export type Krisberedskap = {
  id: string
  user_id: string
  company_id: string
  project_id: string
  exempel_handelser: string | null
  omedelbara_atgarder: string | null
  krisgrupp: string | null
  viktiga_telefonnummer: string | null
  anmalan_arbetsmiljoverket: string | null
  uppfoljning: string | null
  created_at: string
  updated_at: string
}

/** Flik 21 – Skydds- och miljörond */
export type Skyddsrond = {
  id: string
  user_id: string
  company_id: string
  project_id: string
  platschef: string | null
  arbetsledare: string | null
  skyddsombud: string | null
  ue: string | null
  created_at: string
  updated_at: string
}

export type SkyddsrondChecklista = {
  id: string
  skyddsrond_id: string
  sort_order: number
  punkt: string | null
  status: 'ja' | 'nej' | string | null
  created_at: string
  updated_at: string
}

export type SkyddsrondHandlingsplan = {
  id: string
  skyddsrond_id: string
  sort_order: number
  nr: string | null
  fel_brister: string | null
  atgardas_senast: string | null
  ansvarig: string | null
  atgardat_datum: string | null
  created_at: string
  updated_at: string
}

/** Flik 22 – Ekonomi, betalningsplan (dokumentarkiv) */
export type Ekonomi = {
  id: string
  user_id: string
  company_id: string
  project_id: string
  namn: string
  beskrivning: string | null
  file_url: string | null
  file_path: string | null
  file_name: string | null
  created_at: string
  updated_at: string
}

/** Flik 23 – Arbetsplatsbesiktning */
export type Arbetsplatsbesiktning = {
  id: string
  user_id: string
  company_id: string
  project_id: string
  created_at: string
  updated_at: string
}

export type ArbetsplatsbesiktningRad = {
  id: string
  arbetsplatsbesiktning_id: string
  sort_order: number
  kontrollmoment: string | null
  status: '1' | '2' | '3' | string | null
  created_at: string
  updated_at: string
}

/** Flik 24 – Slutbesiktningsprotokoll (dokumentarkiv) */
export type Slutbesiktning = {
  id: string
  user_id: string
  company_id: string
  project_id: string
  namn: string
  beskrivning: string | null
  file_url: string | null
  file_path: string | null
  file_name: string | null
  created_at: string
  updated_at: string
}

/** Flik 25 – Uppföljning Arbetsmiljö */
export type UppfoljningAm = {
  id: string
  user_id: string
  company_id: string
  project_id: string
  created_at: string
  updated_at: string
}

export type UppfoljningAmRad = {
  id: string
  uppfoljning_am_id: string
  sort_order: number
  kontrollmoment: string | null
  status: '1' | '2' | '3' | string | null
  created_at: string
  updated_at: string
}

/** Flik 26 – Uppföljning Kvalitet */
export type UppfoljningKvalitet = {
  id: string
  user_id: string
  company_id: string
  project_id: string
  created_at: string
  updated_at: string
}

export type UppfoljningKvalitetRad = {
  id: string
  uppfoljning_kvalitet_id: string
  sort_order: number
  kontrollmoment: string | null
  status: '1' | '2' | '3' | string | null
  created_at: string
  updated_at: string
}

/** Flik 27 – Uppföljning Miljö */
export type UppfoljningMiljo = {
  id: string
  user_id: string
  company_id: string
  project_id: string
  created_at: string
  updated_at: string
}

export type UppfoljningMiljoRad = {
  id: string
  uppfoljning_miljo_id: string
  sort_order: number
  kontrollmoment: string | null
  status: '1' | '2' | '3' | string | null
  created_at: string
  updated_at: string
}

/** Flik 28 – Riskbedömning + Lagar */
export type Riskbedomning = {
  id: string
  user_id: string
  company_id: string
  project_id: string
  upprattare: string | null
  vd: string | null
  arbetstagarrepresentant: string | null
  created_at: string
  updated_at: string
}

export type RiskbedomningAfs = {
  id: string
  riskbedomning_id: string
  sort_order: number
  afs_nummer: string | null
  titel: string | null
  tillamplig: 'ja' | 'nej' | string | null
  riskniva: 'lag' | 'medel' | 'hog' | string | null
  ansvarig: string | null
  handlingsplan_nr: string | null
  datum: string | null
  created_at: string
  updated_at: string
}

export type RiskbedomningHandlingsplan = {
  id: string
  riskbedomning_id: string
  sort_order: number
  fran_afs: string | null
  atgard: string | null
  ansvarig: string | null
  klart_datum: string | null
  created_at: string
  updated_at: string
}

/** Flik 29 – Kvitteringslistor */
export type KvitteringKategori = 'anstalld' | 'ue'

export type Kvitteringslista = {
  id: string
  user_id: string
  company_id: string
  project_id: string
  dokument_amp: boolean
  dokument_riskbedomning: boolean
  dokument_ordningsregler: boolean
  created_at: string
  updated_at: string
}

export type KvitteringRad = {
  id: string
  kvittering_id: string
  sort_order: number
  kategori: KvitteringKategori | string
  namn: string | null
  datum: string | null
  signatur: string | null
  created_at: string
  updated_at: string
}

/** Flik 30 – Checklista byggpärm */
export type ChecklistaByggparm = {
  id: string
  user_id: string
  company_id: string
  project_id: string
  created_at: string
  updated_at: string
}

export type ChecklistaByggparmRad = {
  id: string
  checklista_id: string
  sort_order: number
  flik_nr: number | null
  avsnitt: string | null
  klart: 'ja' | 'nej' | string | null
  ansvarig: string | null
  datum: string | null
  created_at: string
  updated_at: string
}

/** Flik 31 – Distribution och signering */
export type DistributionSignering = {
  id: string
  user_id: string
  company_id: string
  project_id: string
  parmstatus: string | null
  distributionslista: string | null
  bestallare: string | null
  bestallare_datum: string | null
  platschef: string | null
  platschef_datum: string | null
  bestallarens_ombud: string | null
  bestallarens_ombud_datum: string | null
  created_at: string
  updated_at: string
}

/** Export & delning – snapshot-baserad länk */
export type ProjectShare = {
  id: string
  user_id: string
  company_id: string
  project_id: string
  token: string
  title: string | null
  flik_nrs: number[]
  can_read: boolean
  can_sign: boolean
  can_approve: boolean
  password_hash: string | null
  expires_at: string
  revoked_at: string | null
  snapshot: Record<string, unknown>
  project_label: string | null
  created_at: string
  updated_at: string
}

export type ProjectShareInvite = {
  id: string
  share_id: string
  user_id: string
  project_id: string
  recipient_name: string | null
  recipient_email: string
  permission: 'read' | 'sign' | 'approve'
  status: 'pending' | 'sent' | 'opened' | 'signed' | 'approved' | 'revoked'
  message: string | null
  sent_at: string | null
  opened_at: string | null
  completed_at: string | null
  created_at: string
  updated_at: string
}

export type ProjectShareAction = {
  id: string
  share_id: string
  invite_id: string | null
  action: 'sign' | 'approve'
  actor_name: string
  actor_email: string | null
  note: string | null
  created_at: string
}
