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

  // Flik 2
  role_title: {
    tooltip: 'Välj projektroll, t.ex. Platschef, Bas-P eller Bas-U.',
    why: 'Rollerna visar vem som ansvarar för KMA, arbetsmiljö och produktion.',
  },
  role_competence: {
    tooltip: 'Relevant utbildning eller behörighet för rollen (särskilt Bas-P/Bas-U).',
    why: 'Kompetenskrav enligt AFS ska kunna visas vid revision och Bas-överlämning.',
  },

  // Flik 11
  bygghandling_namn: {
    tooltip: 'Tydligt namn på ritning eller handling.',
    example: 'Exempel: A-40-1-001 Relationsritning plan 1',
    why: 'Gör handlingen sökbar i pärmen och vid egenkontroll.',
  },
  bygghandling_typ: {
    tooltip: 'Typ av bygghandling (ritning, relationsritning, övrigt).',
    why: 'Skiljer produktionsunderlag från relationsritningar vid avslut.',
  },

  // Flik 14–15
  ue_namn: {
    tooltip: 'Underentreprenörens företagsnamn enligt avtal.',
    why: 'Kopplar egenkontroll/maskiner till rätt UE i organisationen (Flik 4).',
  },
  egenkontroll_ue: {
    tooltip: 'Vad UE har kontrollerat och lämnat in.',
    why: 'Bevis att UE:s arbete följer projektets egenkontrollkrav.',
  },
  maskin_ue: {
    tooltip: 'Maskiner/fordon som UE tar in på arbetsplatsen.',
    why: 'Inventering krävs för arbetsmiljö, miljö och tillträdeskontroll.',
  },

  // Flik 16 ÄTA
  ata_beskrivning: {
    tooltip: 'Vad som ändrats jämfört med kontraktshandlingarna.',
    why: 'Underlag för beställning, prissättning och fakturauppföljning.',
  },
  ata_orsak: {
    tooltip: 'Varför ÄTA uppstått (beställare, fel, tilläggsönskemål …).',
    why: 'Förklarar kostnad och ansvar mellan parterna.',
  },
  ata_bestalld: {
    tooltip: 'Om ÄTA är beställd av beställaren eller inte.',
    why: 'Status styr om posten får utföras och faktureras.',
  },
  ata_fakturerad: {
    tooltip: 'Om ÄTA redan är fakturerad.',
    why: 'Förhindrar dubbelfakturering och ger ekonomiöversikt.',
  },

  // Flik 17
  sdb_produkt: {
    tooltip: 'Produktnamn enligt etikett / säkerhetsdatablad.',
    why: 'Identifierar kemikalien i inventering och vid olycka.',
  },
  sdb_status: {
    tooltip: 'Finns aktuellt säkerhetsdatablad på plats?',
    why: 'Krav enligt kemikalielagstiftning och miljöplan.',
  },

  // Flik 18–20
  nodlage_befattning: {
    tooltip: 'Roll i nödlägesorganisationen, t.ex. larmansvarig.',
    why: 'Alla ska veta vem som leder vid olycka eller miljöutsläpp.',
  },
  nodlage_larmrutin: {
    tooltip: 'Steg-för-steg: larma, rädda, spärra av, kontakta myndighet.',
    why: 'Minskar tid till rätt åtgärd när något går fel.',
  },
  anhorig_medarbetare: {
    tooltip: 'Namn på medarbetaren på arbetsplatsen.',
    why: 'Kopplar rätt anhörig vid olycka eller sjukdom.',
  },
  anhorig_kontakt: {
    tooltip: 'Närmaste anhörig med telefonnummer.',
    why: 'Måste kunna nås snabbt vid nödläge.',
  },
  kris_handelser: {
    tooltip: 'Vilka krisscenarier som planen täcker.',
    example: 'Exempel: allvarlig olycka, våld, hot, brand',
    why: 'Avgränsar vad krisgruppen övat och förberett.',
  },
  kris_atgarder: {
    tooltip: 'Omedelbara åtgärder: rädda, larma 112, utrym.',
    why: 'Första minuterna avgör skadeutfallet.',
  },

  // Flik 21
  skyddsrond_deltagare: {
    tooltip: 'Vem som deltog i ronden (platschef, skyddsombud, UE …).',
    why: 'Visar att ronden genomförts med rätt parter enligt AMP.',
  },
  skyddsrond_punkt: {
    tooltip: 'Kontrollpunkt för skydds- eller miljörond.',
    why: 'Systematisk genomgång av risker ute på plats.',
  },

  // Flik 22–24
  ekonomi_dokument: {
    tooltip: 'Namn på betalningsplan eller ekonomidokument.',
    why: 'Håller ekonomiunderlag samlat i KMA-pärmen.',
  },
  ekonomi_beskrivning: {
    tooltip: 'Kort beskrivning av dokumentets innehåll.',
    why: 'Hjälper andra att hitta rätt plan utan att öppna filen.',
  },
  slutbesiktning_dokument: {
    tooltip: 'Namn på slutbesiktningsprotokoll.',
    why: 'Bevis för godkännande och kvarstående anmärkningar.',
  },
  slutbesiktning_beskrivning: {
    tooltip: 'Sammanfattning av besiktningsresultat.',
    why: 'Snabb överblick inför åtgärd och överlämning.',
  },

  // Flik 23, 25–27
  kontrollmoment: {
    tooltip: 'Vad som kontrolleras i uppföljningen.',
    why: 'Gör uppföljningen spårbar och jämförbar över tid.',
  },
  uppfoljning_poang: {
    tooltip: '1 = icke godkänt, 2 = godkänt, 3 = väl godkänt.',
    why: 'Poängen visar status och vad som måste åtgärdas.',
  },
  arbetsplatsbesiktning_status: {
    tooltip: '1 = kontrollerat OK, 2 = ej OK, 3 = ej kontrollerat.',
    why: 'Status styr åtgärd innan produktion fortsätter.',
  },

  // Flik 28
  risk_afs: {
    tooltip: 'AFS-nummer som riskraden bygger på.',
    example: 'Exempel: 2023:3',
    why: 'Kopplar bedömningen till gällande föreskrift.',
  },
  risk_niva: {
    tooltip: 'Samlad risknivå: låg, medel eller hög.',
    why: 'Styr prioritering i handlingsplanen.',
  },
  risk_upprattare: {
    tooltip: 'Vem som upprättat riskbedömningen.',
    why: 'Ansvarig signering krävs innan anslag på arbetsplatsen.',
  },

  // Flik 29–30
  kvittering_dokument: {
    tooltip: 'Vilka dokument som kvitterats (AMP, risk, ordningsregler).',
    why: 'Visar vilken information mottagaren tagit del av.',
  },
  kvittering_namn: {
    tooltip: 'Namn på den som kvitterar.',
    why: 'Personlig bekräftelse att informationen mottagits.',
  },
  checklista_ansvarig: {
    tooltip: 'Vem som ansvarar för att fliken blir klar.',
    why: 'Tydlig ägare per avsnitt innan distribution.',
  },
  checklista_klart: {
    tooltip: 'Ja = avsnittet är komplett i pärmen.',
    why: 'Ger snabb status över Flik 1–31.',
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
  bygghandlingTypExtra: ['Relationsritning', 'Bygghandling', 'Ändring', 'Övrigt'],
  maskiner: [
    'Grävmaskin',
    'Hjullastare',
    'Mobilkran',
    'Saxlift',
    'Bomlift',
    'Betongpump',
    'Kompressor',
  ],
  kemikalier: [
    'Fogmassa',
    'Lim',
    'Färg / lack',
    'Lösningsmedel',
    'Olja / smörjmedel',
    'Betongtillsats',
  ],
  kontrollmomentForslag: [
    'Fallskydd',
    'El / belysning',
    'Ordning och reda',
    'Avfallshantering',
    'Personlig skyddsutrustning',
    'Kemikaliehantering',
    'Tillträdesvägar',
  ],
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
