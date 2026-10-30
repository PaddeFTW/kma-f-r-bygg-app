/** @typedef {import('./supabase').Company} Company */
/** @typedef {import('./supabase').Project} Project */
/** @typedef {import('./supabase').ProjectRole} ProjectRole */

export const emptyCompanyForm = {
  name: '',
  org_number: '',
  address: '',
  postal_code: '',
  city: '',
  ceo_name: '',
  phone: '',
  email: '',
  website: '',
}

/** Flik 1 – Projektbeskrivning (fält enligt underlaget) */
export const emptyProjectForm = {
  property_designation: '',
  address: '',
  postal_code: '',
  city: '',
  directions: '',
  contact_name: '',
  phone: '',
  email: '',
  contact_info: '',
  client_name: '',
  client_org_number: '',
  client_address: '',
  client_postal_code: '',
  client_city: '',
  client_phone: '',
  client_email: '',
  client_info: '',
  contractor_name: '',
  contractor_org_number: '',
  contractor_address: '',
  contractor_postal_code: '',
  contractor_city: '',
  contractor_project_manager: '',
  contractor_project_manager_phone: '',
  contractor_site_manager: '',
  contractor_site_manager_phone: '',
  contract_form: '',
  contractor_info: '',
  description: '',
}

/** Entreprenadform enligt Flik 1 / Flik 2: Total / Utförande */
export const contractForms = ['Total', 'Utförande']

/**
 * Roller enligt Flik 2 Organisation.
 * Minst: Projektchef, Arbetsledare, Platschef, KMA, Huvudskyddsombud.
 */
export const projectRoleTitles = [
  'Projektchef',
  'Arbetsledare',
  'Inköpsansvarig',
  'Platschef',
  'Konstruktionsansvarig',
  'Intern revisor',
  'KMA',
  'Administrationsansvarig',
  'Kontrollansvarig',
  'Huvudskyddsombud',
]

export const requiredProjectRoleTitles = [
  'Projektchef',
  'Arbetsledare',
  'Platschef',
  'KMA',
  'Huvudskyddsombud',
]

export const emptyProjectRoleForm = {
  role_title: '',
  name: '',
  phone: '',
  email: '',
  responsibility_area: '',
}

export function projectToForm(project) {
  if (!project) return { ...emptyProjectForm }
  return {
    property_designation: project.property_designation || '',
    address: project.address || '',
    postal_code: project.postal_code || '',
    city: project.city || '',
    directions: project.directions || '',
    contact_name: project.contact_name || '',
    phone: project.phone || '',
    email: project.email || '',
    contact_info: project.contact_info || '',
    client_name: project.client_name || '',
    client_org_number: project.client_org_number || '',
    client_address: project.client_address || '',
    client_postal_code: project.client_postal_code || '',
    client_city: project.client_city || '',
    client_phone: project.client_phone || '',
    client_email: project.client_email || '',
    client_info: project.client_info || '',
    contractor_name: project.contractor_name || '',
    contractor_org_number: project.contractor_org_number || '',
    contractor_address: project.contractor_address || '',
    contractor_postal_code: project.contractor_postal_code || '',
    contractor_city: project.contractor_city || '',
    contractor_project_manager: project.contractor_project_manager || '',
    contractor_project_manager_phone: project.contractor_project_manager_phone || '',
    contractor_site_manager: project.contractor_site_manager || '',
    contractor_site_manager_phone: project.contractor_site_manager_phone || '',
    contract_form: project.contract_form || '',
    contractor_info: project.contractor_info || '',
    description: project.description || '',
  }
}

/** Payload för insert/update – null för tomma valfria fält */
export function projectFormToPayload(form) {
  const t = (v) => (typeof v === 'string' ? v.trim() : '')
  return {
    property_designation: t(form.property_designation),
    address: t(form.address) || null,
    postal_code: t(form.postal_code) || null,
    city: t(form.city) || null,
    directions: t(form.directions) || null,
    contact_name: t(form.contact_name) || null,
    phone: t(form.phone) || null,
    email: t(form.email) || null,
    contact_info: t(form.contact_info) || null,
    client_name: t(form.client_name) || null,
    client_org_number: t(form.client_org_number) || null,
    client_address: t(form.client_address) || null,
    client_postal_code: t(form.client_postal_code) || null,
    client_city: t(form.client_city) || null,
    client_phone: t(form.client_phone) || null,
    client_email: t(form.client_email) || null,
    client_info: t(form.client_info) || null,
    contractor_name: t(form.contractor_name) || null,
    contractor_org_number: t(form.contractor_org_number) || null,
    contractor_address: t(form.contractor_address) || null,
    contractor_postal_code: t(form.contractor_postal_code) || null,
    contractor_city: t(form.contractor_city) || null,
    contractor_project_manager: t(form.contractor_project_manager) || null,
    contractor_project_manager_phone: t(form.contractor_project_manager_phone) || null,
    contractor_site_manager: t(form.contractor_site_manager) || null,
    contractor_site_manager_phone: t(form.contractor_site_manager_phone) || null,
    contract_form: t(form.contract_form) || null,
    contractor_info: t(form.contractor_info) || null,
    description: t(form.description) || null,
  }
}

/**
 * Obligatoriska kontaktfält för huvudparter enligt underlaget.
 * Fastighetsbeteckning + kontakt på byggplats + byggherre + entreprenör.
 */
export function isProjectFormValid(form) {
  const required = [
    form.property_designation,
    form.contact_name,
    form.phone,
    form.email,
    form.client_name,
    form.client_org_number,
    form.client_address,
    form.client_postal_code,
    form.client_city,
    form.client_phone,
    form.client_email,
    form.contractor_name,
    form.contractor_org_number,
    form.contractor_address,
    form.contractor_postal_code,
    form.contractor_city,
    form.contractor_project_manager,
    form.contractor_project_manager_phone,
    form.contractor_site_manager,
    form.contractor_site_manager_phone,
    form.contract_form,
  ]
  return required.every((v) => typeof v === 'string' && v.trim().length > 0)
}

/** Flik 3 – Beställarens organisation (fält enligt underlaget) */
export const emptyProjectClientForm = {
  ceo_name: '',
  contact_name: '',
  address: '',
  postal_code: '',
  city: '',
  phone: '',
  email: '',
  website: '',
  project_manager: '',
  quality_manager: '',
  environmental_manager: '',
  work_environment_manager: '',
  notes: '',
}

/** Flik 4 – Underleverantör (fält enligt underlaget, inkl. inköpsansvarig) */
export const emptyProjectSubcontractorForm = {
  ...emptyProjectClientForm,
  purchasing_manager: '',
}

export function projectClientToForm(row) {
  if (!row) return { ...emptyProjectClientForm }
  return {
    ceo_name: row.ceo_name || '',
    contact_name: row.contact_name || '',
    address: row.address || '',
    postal_code: row.postal_code || '',
    city: row.city || '',
    phone: row.phone || '',
    email: row.email || '',
    website: row.website || '',
    project_manager: row.project_manager || '',
    quality_manager: row.quality_manager || '',
    environmental_manager: row.environmental_manager || '',
    work_environment_manager: row.work_environment_manager || '',
    notes: row.notes || '',
  }
}

export function projectSubcontractorToForm(row) {
  if (!row) return { ...emptyProjectSubcontractorForm }
  return {
    ...projectClientToForm(row),
    purchasing_manager: row.purchasing_manager || '',
  }
}

/**
 * Obligatoriska kontaktfält för huvudparter enligt underlaget (Flik 3/4).
 * VD, Kontaktperson, Adress, Postnr/Ort, Mobil, E-post.
 */
export function isOrgContactFormValid(form) {
  const required = [
    form.ceo_name,
    form.contact_name,
    form.address,
    form.postal_code,
    form.city,
    form.phone,
    form.email,
  ]
  return required.every((v) => typeof v === 'string' && v.trim().length > 0)
}

/** Payload för insert/update – null för tomma valfria fält */
export function orgContactFormToPayload(form, { includePurchasing = false } = {}) {
  const t = (v) => (typeof v === 'string' ? v.trim() : '')
  const payload = {
    ceo_name: t(form.ceo_name) || null,
    contact_name: t(form.contact_name) || null,
    address: t(form.address) || null,
    postal_code: t(form.postal_code) || null,
    city: t(form.city) || null,
    phone: t(form.phone) || null,
    email: t(form.email) || null,
    website: t(form.website) || null,
    project_manager: t(form.project_manager) || null,
    quality_manager: t(form.quality_manager) || null,
    environmental_manager: t(form.environmental_manager) || null,
    work_environment_manager: t(form.work_environment_manager) || null,
    notes: t(form.notes) || null,
  }
  if (includePurchasing) {
    payload.purchasing_manager = t(form.purchasing_manager) || null
  }
  return payload
}

/** Flik 5 – Kvalitetsplan (avsnitt enligt underlaget) */
export const emptyKvalitetsplanForm = {
  kvalitetspolicy: '',
  orientering_allman_info: '',
  orientering_entreprenadform: '',
  orientering_art: '',
  orientering_tidplan: '',
  organisation: '',
  projektgenomgang_byggmote: '',
  projektgenomgang_andringar: '',
  projektgenomgang_protokoll: '',
  projektering_kontrollplan: '',
  produktion_egenkontroll: '',
  produktion_dagbok: '',
  produktion_ata: '',
  produktion_personalliggare: '',
  produktion_avvikelser: '',
  montage_matutrustning: '',
  avslutning_provning: '',
  avslutning_besiktning: '',
  dokumentstyrning: '',
  distributionsforteckning: '',
}

export function kvalitetsplanToForm(row) {
  if (!row) return { ...emptyKvalitetsplanForm }
  return {
    kvalitetspolicy: row.kvalitetspolicy || '',
    orientering_allman_info: row.orientering_allman_info || '',
    orientering_entreprenadform: row.orientering_entreprenadform || '',
    orientering_art: row.orientering_art || '',
    orientering_tidplan: row.orientering_tidplan || '',
    organisation: row.organisation || '',
    projektgenomgang_byggmote: row.projektgenomgang_byggmote || '',
    projektgenomgang_andringar: row.projektgenomgang_andringar || '',
    projektgenomgang_protokoll: row.projektgenomgang_protokoll || '',
    projektering_kontrollplan: row.projektering_kontrollplan || '',
    produktion_egenkontroll: row.produktion_egenkontroll || '',
    produktion_dagbok: row.produktion_dagbok || '',
    produktion_ata: row.produktion_ata || '',
    produktion_personalliggare: row.produktion_personalliggare || '',
    produktion_avvikelser: row.produktion_avvikelser || '',
    montage_matutrustning: row.montage_matutrustning || '',
    avslutning_provning: row.avslutning_provning || '',
    avslutning_besiktning: row.avslutning_besiktning || '',
    dokumentstyrning: row.dokumentstyrning || '',
    distributionsforteckning: row.distributionsforteckning || '',
  }
}

/** Payload för insert/update – null för tomma fält */
export function kvalitetsplanFormToPayload(form) {
  const t = (v) => (typeof v === 'string' ? v.trim() : '')
  return {
    kvalitetspolicy: t(form.kvalitetspolicy) || null,
    orientering_allman_info: t(form.orientering_allman_info) || null,
    orientering_entreprenadform: t(form.orientering_entreprenadform) || null,
    orientering_art: t(form.orientering_art) || null,
    orientering_tidplan: t(form.orientering_tidplan) || null,
    organisation: t(form.organisation) || null,
    projektgenomgang_byggmote: t(form.projektgenomgang_byggmote) || null,
    projektgenomgang_andringar: t(form.projektgenomgang_andringar) || null,
    projektgenomgang_protokoll: t(form.projektgenomgang_protokoll) || null,
    projektering_kontrollplan: t(form.projektering_kontrollplan) || null,
    produktion_egenkontroll: t(form.produktion_egenkontroll) || null,
    produktion_dagbok: t(form.produktion_dagbok) || null,
    produktion_ata: t(form.produktion_ata) || null,
    produktion_personalliggare: t(form.produktion_personalliggare) || null,
    produktion_avvikelser: t(form.produktion_avvikelser) || null,
    montage_matutrustning: t(form.montage_matutrustning) || null,
    avslutning_provning: t(form.avslutning_provning) || null,
    avslutning_besiktning: t(form.avslutning_besiktning) || null,
    dokumentstyrning: t(form.dokumentstyrning) || null,
    distributionsforteckning: t(form.distributionsforteckning) || null,
  }
}

/** Flik 6 – Miljöplan (avsnitt enligt underlaget) */
export const emptyMiljoplanForm = {
  miljopolicy: '',
  aspekt_transporter: false,
  aspekt_byggavfall: false,
  aspekt_kemikalier: false,
  aspekt_farligt_avfall: false,
  aspekt_el: false,
  aspekt_kallsortering: false,
  miljoaspekter_anteckningar: '',
  kallsortering_kemikalier_sdb: '',
  lagar_krav: '',
  ansvar: '',
  utbildning: '',
  kommunikation: '',
  egenkontroll_miljo: '',
  avvikelser: '',
  nodlage: '',
}

export function miljoplanToForm(row) {
  if (!row) return { ...emptyMiljoplanForm }
  return {
    miljopolicy: row.miljopolicy || '',
    aspekt_transporter: Boolean(row.aspekt_transporter),
    aspekt_byggavfall: Boolean(row.aspekt_byggavfall),
    aspekt_kemikalier: Boolean(row.aspekt_kemikalier),
    aspekt_farligt_avfall: Boolean(row.aspekt_farligt_avfall),
    aspekt_el: Boolean(row.aspekt_el),
    aspekt_kallsortering: Boolean(row.aspekt_kallsortering),
    miljoaspekter_anteckningar: row.miljoaspekter_anteckningar || '',
    kallsortering_kemikalier_sdb: row.kallsortering_kemikalier_sdb || '',
    lagar_krav: row.lagar_krav || '',
    ansvar: row.ansvar || '',
    utbildning: row.utbildning || '',
    kommunikation: row.kommunikation || '',
    egenkontroll_miljo: row.egenkontroll_miljo || '',
    avvikelser: row.avvikelser || '',
    nodlage: row.nodlage || '',
  }
}

/** Payload för insert/update – null för tomma textfält */
export function miljoplanFormToPayload(form) {
  const t = (v) => (typeof v === 'string' ? v.trim() : '')
  return {
    miljopolicy: t(form.miljopolicy) || null,
    aspekt_transporter: Boolean(form.aspekt_transporter),
    aspekt_byggavfall: Boolean(form.aspekt_byggavfall),
    aspekt_kemikalier: Boolean(form.aspekt_kemikalier),
    aspekt_farligt_avfall: Boolean(form.aspekt_farligt_avfall),
    aspekt_el: Boolean(form.aspekt_el),
    aspekt_kallsortering: Boolean(form.aspekt_kallsortering),
    miljoaspekter_anteckningar: t(form.miljoaspekter_anteckningar) || null,
    kallsortering_kemikalier_sdb: t(form.kallsortering_kemikalier_sdb) || null,
    lagar_krav: t(form.lagar_krav) || null,
    ansvar: t(form.ansvar) || null,
    utbildning: t(form.utbildning) || null,
    kommunikation: t(form.kommunikation) || null,
    egenkontroll_miljo: t(form.egenkontroll_miljo) || null,
    avvikelser: t(form.avvikelser) || null,
    nodlage: t(form.nodlage) || null,
  }
}

/** Flik 7 – Arbetsmiljöplan (avsnitt enligt underlaget) */
export const emptyArbetsmiljoplanForm = {
  arbetsmiljopolicy: '',
  uppfoljning_skyddsronder: '',
  regel_skyddsutrustning: false,
  regel_heta_arbeten: false,
  regel_tillfallig_el: false,
  regel_buller: false,
  regel_droger: false,
  ordningsregler_anteckningar: '',
  samordning_ue: '',
  skyddsrond_anteckningar: '',
  riskbedomning_anteckningar: '',
}

export function arbetsmiljoplanToForm(row) {
  if (!row) return { ...emptyArbetsmiljoplanForm }
  return {
    arbetsmiljopolicy: row.arbetsmiljopolicy || '',
    uppfoljning_skyddsronder: row.uppfoljning_skyddsronder || '',
    regel_skyddsutrustning: Boolean(row.regel_skyddsutrustning),
    regel_heta_arbeten: Boolean(row.regel_heta_arbeten),
    regel_tillfallig_el: Boolean(row.regel_tillfallig_el),
    regel_buller: Boolean(row.regel_buller),
    regel_droger: Boolean(row.regel_droger),
    ordningsregler_anteckningar: row.ordningsregler_anteckningar || '',
    samordning_ue: row.samordning_ue || '',
    skyddsrond_anteckningar: row.skyddsrond_anteckningar || '',
    riskbedomning_anteckningar: row.riskbedomning_anteckningar || '',
  }
}

/** Payload för insert/update – null för tomma textfält */
export function arbetsmiljoplanFormToPayload(form) {
  const t = (v) => (typeof v === 'string' ? v.trim() : '')
  return {
    arbetsmiljopolicy: t(form.arbetsmiljopolicy) || null,
    uppfoljning_skyddsronder: t(form.uppfoljning_skyddsronder) || null,
    regel_skyddsutrustning: Boolean(form.regel_skyddsutrustning),
    regel_heta_arbeten: Boolean(form.regel_heta_arbeten),
    regel_tillfallig_el: Boolean(form.regel_tillfallig_el),
    regel_buller: Boolean(form.regel_buller),
    regel_droger: Boolean(form.regel_droger),
    ordningsregler_anteckningar: t(form.ordningsregler_anteckningar) || null,
    samordning_ue: t(form.samordning_ue) || null,
    skyddsrond_anteckningar: t(form.skyddsrond_anteckningar) || null,
    riskbedomning_anteckningar: t(form.riskbedomning_anteckningar) || null,
  }
}

/** Flik 11 – Bygghandlingar / relationsritningar (dokumentarkiv) */
export const BYGGHANDLING_TYP_OPTIONS = [
  { value: 'ritning', label: 'Ritning' },
  { value: 'relationsritning', label: 'Relationsritning' },
  { value: 'handling', label: 'Handling' },
]

export const BYGGHANDLING_TYP_LABELS = Object.fromEntries(
  BYGGHANDLING_TYP_OPTIONS.map((o) => [o.value, o.label]),
)

export const emptyBygghandlingForm = {
  namn: '',
  beskrivning: '',
  typ: '',
  file_url: '',
  file_name: '',
}

export function bygghandlingToForm(row) {
  if (!row) return { ...emptyBygghandlingForm }
  return {
    namn: row.namn || '',
    beskrivning: row.beskrivning || '',
    typ: row.typ || '',
    file_url: row.file_url || '',
    file_name: row.file_name || '',
  }
}

/** Payload för insert/update – null för tomma fält (filmetadata sätts separat vid uppladdning) */
export function bygghandlingFormToPayload(form) {
  const t = (v) => (typeof v === 'string' ? v.trim() : '')
  return {
    namn: t(form.namn),
    beskrivning: t(form.beskrivning) || null,
    typ: t(form.typ) || null,
    file_url: t(form.file_url) || null,
  }
}

/** Flik 12 – Kontrollplan enligt PBL */
export const KONTROLLPLAN_UTFOR_AV_OPTIONS = [
  { value: 'S', label: 'S (sakkunnig)' },
  { value: 'E', label: 'E (entreprenör)' },
]

export const emptyKontrollplanRad = () => ({
  _key: `new-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  id: null,
  kontroll_avser: '',
  utfor_av: '',
  metod: '',
  underlag: '',
  anmarkning: '',
  atgard: '',
  datum: '',
  sign: '',
})

export const emptyKontrollplanForm = {
  objektinfo: '',
  kontrollansvarig: '',
  byggherre: '',
  entreprenor: '',
  underlag: '',
  signatur_kontrollansvarig: '',
  signatur_byggherre: '',
  rader: [],
}

export function kontrollplanToForm(row, rader = []) {
  if (!row) return { ...emptyKontrollplanForm, rader: [] }
  return {
    objektinfo: row.objektinfo || '',
    kontrollansvarig: row.kontrollansvarig || '',
    byggherre: row.byggherre || '',
    entreprenor: row.entreprenor || '',
    underlag: row.underlag || '',
    signatur_kontrollansvarig: row.signatur_kontrollansvarig || '',
    signatur_byggherre: row.signatur_byggherre || '',
    rader: (rader || []).map((r, index) => ({
      _key: r.id || `row-${index}`,
      id: r.id || null,
      kontroll_avser: r.kontroll_avser || '',
      utfor_av: r.utfor_av || '',
      metod: r.metod || '',
      underlag: r.underlag || '',
      anmarkning: r.anmarkning || '',
      atgard: r.atgard || '',
      datum: r.datum || '',
      sign: r.sign || '',
    })),
  }
}

/** Payload för plan (utan rader) */
export function kontrollplanFormToPayload(form) {
  const t = (v) => (typeof v === 'string' ? v.trim() : '')
  return {
    objektinfo: t(form.objektinfo) || null,
    kontrollansvarig: t(form.kontrollansvarig) || null,
    byggherre: t(form.byggherre) || null,
    entreprenor: t(form.entreprenor) || null,
    underlag: t(form.underlag) || null,
    signatur_kontrollansvarig: t(form.signatur_kontrollansvarig) || null,
    signatur_byggherre: t(form.signatur_byggherre) || null,
  }
}

/** Payload för rader som ska insertas */
export function kontrollplanRaderToPayload(kontrollplanId, rader) {
  const t = (v) => (typeof v === 'string' ? v.trim() : '')
  return (rader || []).map((r, index) => ({
    kontrollplan_id: kontrollplanId,
    sort_order: index,
    kontroll_avser: t(r.kontroll_avser) || null,
    utfor_av: t(r.utfor_av) || null,
    metod: t(r.metod) || null,
    underlag: t(r.underlag) || null,
    anmarkning: t(r.anmarkning) || null,
    atgard: t(r.atgard) || null,
    datum: t(r.datum) || null,
    sign: t(r.sign) || null,
  }))
}

/** Flik 13 – Egenkontroll (mall + varianter från underlaget) */
export const EGENKONTROLL_STATUS_OPTIONS = [
  { value: '1', label: '1 – Kontrollerat och godkänt' },
  { value: '2', label: '2 – Kontrollerat och ej godkänt' },
  { value: '3', label: '3 – Ej kontrollerat' },
]

export const EGENKONTROLL_STATUS_LABELS = Object.fromEntries(
  EGENKONTROLL_STATUS_OPTIONS.map((o) => [o.value, o.label]),
)

/** Kontrollmoment per typ – endast namngivna i underlaget (flikar-13-16). */
export const EGENKONTROLL_TYP_TEMPLATES = {
  administration: {
    label: 'Administration',
    moments: ['Bygglov', 'Ekonomi', 'Ritningar', 'Projektplan', 'Material', 'Myndigheter'],
  },
  kvalitetsplan: {
    label: 'Kvalitetsplan',
    moments: [
      'Plan upprättad',
      'Info till medarbetare',
      'Kalibrering',
      'Dagbok',
      'ÄTA',
      'Personalliggare',
    ],
  },
  miljoplan: {
    label: 'Miljöplan',
    moments: [
      'Miljöaspekter',
      'Lagar',
      'SDB',
      'Källsortering',
      'Farligt avfall',
      'Utbildning',
    ],
  },
  arbetsmiljoplan: {
    label: 'Arbetsmiljöplan',
    moments: [
      'Organisation',
      'UE informerade',
      'Anhöriglista',
      'Ordningsregler',
      'Skyddsrond',
    ],
  },
  personal: {
    label: 'Personal',
    moments: ['Identifikation', 'Behörighet', 'Utbildning', 'Källsortering'],
  },
  uppfoljning_arbetsmiljo_kvalitet: {
    label: 'Uppföljning arbetsmiljö/kvalitet',
    moments: [],
  },
  ankommande_gods: {
    label: 'Ankommande gods',
    moments: [],
  },
}

export const EGENKONTROLL_TYP_OPTIONS = Object.entries(EGENKONTROLL_TYP_TEMPLATES).map(
  ([value, meta]) => ({ value, label: meta.label }),
)

export const EGENKONTROLL_TYP_LABELS = Object.fromEntries(
  EGENKONTROLL_TYP_OPTIONS.map((o) => [o.value, o.label]),
)

export const emptyEgenkontrollRad = (kontrollmoment = '') => ({
  _key: `new-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  id: null,
  kontrollmoment,
  status: '',
  datum: '',
  signatur: '',
})

export function egenkontrollRaderFromTyp(typ) {
  const moments = EGENKONTROLL_TYP_TEMPLATES[typ]?.moments || []
  return moments.map((m) => emptyEgenkontrollRad(m))
}

export const emptyEgenkontrollForm = {
  typ: '',
  bestallare: '',
  entreprenor: '',
  objekt: '',
  projektnr: '',
  referens: '',
  ovriga_anteckningar: '',
  kontrollansvarig: '',
  rader: [],
}

export function egenkontrollToForm(row, rader = []) {
  if (!row) return { ...emptyEgenkontrollForm, rader: [] }
  return {
    typ: row.typ || '',
    bestallare: row.bestallare || '',
    entreprenor: row.entreprenor || '',
    objekt: row.objekt || '',
    projektnr: row.projektnr || '',
    referens: row.referens || '',
    ovriga_anteckningar: row.ovriga_anteckningar || '',
    kontrollansvarig: row.kontrollansvarig || '',
    rader: (rader || []).map((r, index) => ({
      _key: r.id || `row-${index}`,
      id: r.id || null,
      kontrollmoment: r.kontrollmoment || '',
      status: r.status || '',
      datum: r.datum || '',
      signatur: r.signatur || '',
    })),
  }
}

export function egenkontrollFormToPayload(form) {
  const t = (v) => (typeof v === 'string' ? v.trim() : '')
  return {
    typ: t(form.typ) || null,
    bestallare: t(form.bestallare) || null,
    entreprenor: t(form.entreprenor) || null,
    objekt: t(form.objekt) || null,
    projektnr: t(form.projektnr) || null,
    referens: t(form.referens) || null,
    ovriga_anteckningar: t(form.ovriga_anteckningar) || null,
    kontrollansvarig: t(form.kontrollansvarig) || null,
  }
}

export function egenkontrollRaderToPayload(egenkontrollId, rader) {
  const t = (v) => (typeof v === 'string' ? v.trim() : '')
  return (rader || []).map((r, index) => ({
    egenkontroll_id: egenkontrollId,
    sort_order: index,
    kontrollmoment: t(r.kontrollmoment) || null,
    status: t(r.status) || null,
    datum: t(r.datum) || null,
    signatur: t(r.signatur) || null,
  }))
}

/** Flik 14 – Egenkontroller från UE */
export const emptyEgenkontrollUeForm = {
  underleverantor: '',
  egenkontroll: '',
  datum: '',
}

export function egenkontrollUeToForm(row) {
  if (!row) return { ...emptyEgenkontrollUeForm }
  return {
    underleverantor: row.underleverantor || '',
    egenkontroll: row.egenkontroll || '',
    datum: row.datum || '',
  }
}

export function egenkontrollUeFormToPayload(form) {
  const t = (v) => (typeof v === 'string' ? v.trim() : '')
  return {
    underleverantor: t(form.underleverantor),
    egenkontroll: t(form.egenkontroll) || null,
    datum: t(form.datum) || null,
  }
}
