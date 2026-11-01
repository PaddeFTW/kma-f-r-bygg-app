/**
 * Korta förklaringar / “varför”-texter för formulär.
 * SoT: docs/kma-underlag/ + docs/KNOWLEDGE_BASE.md
 */
export const KB_URL = 'https://github.com/PaddeFTW/knowledge-base'

export const FORM_HELP = {
  property_designation: {
    tooltip: 'Unik beteckning för fastigheten, t.ex. Stockholm Torget 1:2.',
    example: 'Exempel: Solna Berga 3:14',
    why: 'Identifierar objektet i hela KMA-pärmen och i AMP/egenkontroller.',
  },
  contact_name: {
    tooltip: 'Person som går att nå på plats under produktion.',
    example: 'Exempel: Anna Andersson',
    why: 'Behövs för samordning, nödläge och kontakt med beställare/UE.',
  },
  client_name: {
    tooltip: 'Byggherre eller beställare enligt avtal.',
    why: 'Krävs för organisation, kontrollplan och distribution/signering.',
  },
  contract_form: {
    tooltip: 'Totalentreprenad eller utförandeentreprenad enligt underlaget.',
    why: 'Påverkar ansvarsfördelning och hur kvalitets-/arbetsmiljöplaner skrivs.',
  },
  kvalitetspolicy: {
    tooltip: 'Kort policy för hur kvalitet styrs i projektet.',
    why: 'Grund för Flik 5 och kopplas till egenkontroll och avvikelser.',
  },
  miljoaspekter: {
    tooltip: 'Projektets viktigaste miljöaspekter (avfall, transporter, kemikalier …).',
    why: 'Styr miljöplan, SDB och uppföljning miljö.',
  },
  arbetsmiljopolicy: {
    tooltip: 'Policy för arbetsmiljöarbete på arbetsplatsen.',
    why: 'Krävs i AMP (AFS) och synliggör Bas-P/Bas-U-ansvaret.',
  },
  kontrollansvarig: {
    tooltip: 'Certifierad kontrollansvarig enligt PBL.',
    why: 'Obligatorisk part i kontrollplanen och för bygglovsprocessen.',
  },
  egenkontroll_typ: {
    tooltip: 'Välj mall så att kontrollmoment fylls i från underlaget.',
    why: 'Säkerställer enhetliga bevis och rätt statuskoder (1/2/3).',
  },
  egenkontroll_status: {
    tooltip: '1 = godkänt, 2 = ej godkänt, 3 = ej kontrollerat.',
    why: 'Status används som bevis i pärmen och vid uppföljning.',
  },
  avvikelse: {
    tooltip: 'Beskriv vad som avviker från avtal, ritning eller rutin.',
    why: 'Underlag för ÄTA, åtgärder och lärande i projektet.',
  },
  risk_sannolikhet: {
    tooltip: 'Bedöm hur trolig risken är.',
    why: 'Tillsammans med konsekvens ger poäng för prioritering (Flik 28).',
  },
  risk_konsekvens: {
    tooltip: 'Bedöm hur allvarlig konsekvensen blir om risken inträffar.',
    why: 'Styr handlingsplan och vilka åtgärder som måste göras först.',
  },
  skyddsrond: {
    tooltip: 'Regelbundna skydds- och miljörondspunkter.',
    why: 'Uppföljning av AMP och ordningsregler ute på plats.',
  },
  kvittering: {
    tooltip: 'Namn + datum som bevis att information tagits emot.',
    why: 'Visar att AMP, riskbedömning eller ordningsregler kommunicerats.',
  },
  distribution: {
    tooltip: 'Vilka som fått pärmen / dokumenten och vem som signerat.',
    why: 'Avslutar pärmen med spårbar distribution och godkännande.',
  },
  checklista_byggparm: {
    tooltip: 'Ja/nej per flik – är avsnittet klart i pärmen?',
    why: 'Ger snabb status över Flik 1–31 innan distribution.',
  },
  bas_roll: {
    tooltip: 'Bas-P (projektering) och Bas-U (utförande) enligt AFS 2023:3.',
    why: 'Obligatoriska samordningsroller för arbetsmiljö i byggprojekt.',
  },
  atgard: {
    tooltip: 'Vad ska göras för att hantera risken eller avvikelsen?',
    example: 'Exempel: Montera skyddsräcke innan arbete över 2 m.',
    why: 'Åtgärden blir bevis och underlag för uppföljning.',
  },
}

/** Återkommande förslag för autocomplete (fri text tillåten). */
export const SUGGESTIONS = {
  atgarder: [
    'Skyddsräcke / fallskydd',
    'Arbetsberedning före start',
    'Information till UE',
    'Byte till mindre farligt ämne',
    'Avspärrning och skyltning',
    'Medicinsk kontroll',
    'Kontakt med nätägare',
    'Uppföljning vid skyddsrond',
  ],
  kontaktroller: [
    'Platschef',
    'Projektledare',
    'Bas-P',
    'Bas-U',
    'KMA',
    'Huvudskyddsombud',
    'Kontrollansvarig',
    'UE-kontakt',
  ],
  statusAnteckning: [
    'Åtgärdad',
    'Under utredning',
    'Ej aktuell',
    'Väntar på beställare',
    'Följs upp vid nästa rond',
  ],
  entreprenadArt: ['Nybyggnad', 'Ombyggnad', 'Rivning', 'Mark', 'Installation'],
}

export const JA_NEJ_OPTIONS = [
  { value: '', label: 'Välj…' },
  { value: 'ja', label: 'Ja' },
  { value: 'nej', label: 'Nej' },
]

export const POANG_123_OPTIONS = [
  { value: '', label: 'Välj…' },
  { value: '1', label: '1 – Icke godkänt / ej OK' },
  { value: '2', label: '2 – Godkänt' },
  { value: '3', label: '3 – Väl godkänt' },
]
