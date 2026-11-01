/**
 * 13 särskilda risker enligt AFS 2023:3 11 kap. 12 §.
 * SoT: docs/KNOWLEDGE_BASE.md + AFS 2023:3; app-underlag docs/kma-underlag/.
 */
export const KB_AFS_2023_3_URL =
  'https://github.com/PaddeFTW/knowledge-base'

export const SARSKILDA_RISKER_PUNKTER = [
  {
    punkt_nr: 1,
    benamning: 'Fall ≥2 m',
    helper: 'Risk för fall från höjd minst 2 meter. Planera fallskydd, ställning och tillträdesvägar.',
    atgard_forslag: 'Fallskydd, skyddsräcke, ställning, personligt fallskydd och arbetsberedning.',
  },
  {
    punkt_nr: 2,
    benamning: 'Begravas under jordmassor / lös mark',
    helper: 'Risk att begravas av jordmassor eller i lös mark (schakt, slänt).',
    atgard_forslag: 'Schaktslänt, stöttning, geoteknisk bedömning och tillträdesbegränsning.',
  },
  {
    punkt_nr: 3,
    benamning: 'Tunga byggelement / formbyggnadselement',
    helper: 'Montage av tunga bygg- eller formbyggnadselement.',
    atgard_forslag: 'Lyftplan, lastberäkning, certifierade lyfthjälpmedel och avspärrning.',
  },
  {
    punkt_nr: 4,
    benamning: 'Kemiska/biologiska ämnen (särskild fara eller medicinsk kontroll)',
    helper: 'Ämnen som kan innebära särskild fara eller kräver medicinsk kontroll.',
    atgard_forslag: 'SDB, substitutionsbedömning, skyddsutrustning och medicinsk kontroll vid behov.',
  },
  {
    punkt_nr: 5,
    benamning: 'Rivning bärande konstruktioner / hälsofarliga material',
    helper: 'Rivning av bärande delar eller material som kan vara hälsofarliga (t.ex. asbest).',
    atgard_forslag: 'Rivningsplan, inventering, behörig rivning och saneringsrutiner.',
  },
  {
    punkt_nr: 6,
    benamning: 'Närhet högspänningsledningar',
    helper: 'Arbete nära högspänningsledningar.',
    atgard_forslag: 'Säkerhetsavstånd, kontakt med nätägare och el-säkerhetsplan.',
  },
  {
    punkt_nr: 7,
    benamning: 'Fordonstrafik passerar',
    helper: 'Fordonstrafik passerar arbetsplatsen.',
    atgard_forslag: 'Trafikplan, avstängning, skyltning och vakter vid behov.',
  },
  {
    punkt_nr: 8,
    benamning: 'Sprängämnen',
    helper: 'Arbete med eller i närheten av sprängämnen.',
    atgard_forslag: 'Behörig sprängare, sprängplan, avspärrning och varningssystem.',
  },
  {
    punkt_nr: 9,
    benamning: 'Brunnar/tunnlar/under jord',
    helper: 'Arbete i brunnar, tunnlar eller under jord.',
    atgard_forslag: 'Gas/syrgas-mätning, ventilation, räddningsplan och behörig personal.',
  },
  {
    punkt_nr: 10,
    benamning: 'Risk att drunkna',
    helper: 'Risk för drunkning vid arbete nära vatten.',
    atgard_forslag: 'Skyddsräcke, flytväst, räddningsutrustning och övervakning.',
  },
  {
    punkt_nr: 11,
    benamning: 'Dykarutrustning under vatten',
    helper: 'Arbete under vatten med dykarutrustning.',
    atgard_forslag: 'Certifierad dykning, dykplan och räddningsberedskap.',
  },
  {
    punkt_nr: 12,
    benamning: 'Kassun förhöjt lufttryck',
    helper: 'Arbete i kassun med förhöjt lufttryck.',
    atgard_forslag: 'Tryckreglering, medicinsk kontroll och särskild arbetsberedning.',
  },
  {
    punkt_nr: 13,
    benamning: 'Joniserande strålning (kontrollerat/skyddat område)',
    helper: 'Arbete i område med joniserande strålning (kontrollerat eller skyddat).',
    atgard_forslag: 'Strålskyddsplan, dosimetri och behörig ansvarig.',
  },
]

export const SARSKILDA_RISKER_SVAR_OPTIONS = [
  { value: '', label: 'Ej ifyllt' },
  { value: 'ja', label: 'Ja' },
  { value: 'nej', label: 'Nej' },
]

export function sarskildaRiskerDefaults() {
  return SARSKILDA_RISKER_PUNKTER.map((p, index) => ({
    _key: `risk-${p.punkt_nr}`,
    punkt_nr: p.punkt_nr,
    benamning: p.benamning,
    svar: '',
    atgard: '',
    sort_order: index + 1,
  }))
}

export function rowsRequireAmp(rows) {
  return (rows || []).some((r) => r.svar === 'ja')
}

export function buildAmpPrefillFromRisker(rows) {
  const ja = (rows || []).filter((r) => r.svar === 'ja')
  if (!ja.length) return null

  const lines = [
    'AMP krävs enligt AFS 2023:3 11 kap. 12 § – följande särskilda risker är markerade Ja:',
    ...ja.map((r) => {
      const punkt = SARSKILDA_RISKER_PUNKTER.find((p) => p.punkt_nr === r.punkt_nr)
      const atgard = (r.atgard || '').trim() || punkt?.atgard_forslag || 'Åtgärd ska anges i AMP.'
      return `${r.punkt_nr}. ${r.benamning} – Åtgärd: ${atgard}`
    }),
  ]
  return lines.join('\n')
}

export function getRiskHelper(punktNr) {
  return SARSKILDA_RISKER_PUNKTER.find((p) => p.punkt_nr === punktNr) || null
}
