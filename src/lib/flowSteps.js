/**
 * Ordnad kedja för guided flöde (sidebar utan Dashboard).
 * currentPath matchas med startsWith för detaljsidor.
 */
export const flowSteps = [
  { path: '/company', label: 'Företag', nextCta: 'Skapa projekt' },
  { path: '/projects', label: 'Projekt', nextCta: 'Fortsätt till Kvalitetsplan' },
  { path: '/kvalitetsplan', label: 'Kvalitetsplan', nextCta: 'Fortsätt till Miljöplan' },
  { path: '/miljoplan', label: 'Miljöplan', nextCta: 'Fortsätt till Arbetsmiljöplan' },
  { path: '/arbetsmiljoplan', label: 'Arbetsmiljöplan', nextCta: 'Fortsätt till Bygghandlingar' },
  { path: '/bygghandlingar', label: 'Bygghandlingar', nextCta: 'Fortsätt till Kontrollplan' },
  { path: '/kontrollplan', label: 'Kontrollplan', nextCta: 'Fortsätt till Egenkontroll' },
  { path: '/egenkontroll', label: 'Egenkontroll', nextCta: 'Fortsätt till Egenkontroll UE' },
  { path: '/egenkontroll-ue', label: 'Egenkontroll UE', nextCta: 'Fortsätt till Maskiner UE' },
  { path: '/maskiner-ue', label: 'Maskiner UE', nextCta: 'Fortsätt till ÄTA / Avvikelse' },
  { path: '/ata', label: 'ÄTA / Avvikelse', nextCta: 'Fortsätt till Säkerhetsdatablad' },
  { path: '/sakerhetsdatablad', label: 'Säkerhetsdatablad', nextCta: 'Fortsätt till Nödlägesberedskap' },
  { path: '/nodlage', label: 'Nödlägesberedskap', nextCta: 'Fortsätt till Anhöriglista' },
  { path: '/anhoriglista', label: 'Anhöriglista', nextCta: 'Fortsätt till Krisberedskap' },
  { path: '/krisberedskap', label: 'Krisberedskap', nextCta: 'Fortsätt till Skyddsrond' },
  { path: '/skyddsrond', label: 'Skyddsrond', nextCta: 'Fortsätt till Ekonomi' },
  { path: '/ekonomi', label: 'Ekonomi', nextCta: 'Fortsätt till Arbetsplatsbesiktning' },
  {
    path: '/arbetsplatsbesiktning',
    label: 'Arbetsplatsbesiktning',
    nextCta: 'Fortsätt till Slutbesiktning',
  },
  { path: '/slutbesiktning', label: 'Slutbesiktning', nextCta: 'Fortsätt till Uppföljning AM' },
  { path: '/uppfoljning-am', label: 'Uppföljning AM', nextCta: 'Fortsätt till Uppföljning Kvalitet' },
  {
    path: '/uppfoljning-kvalitet',
    label: 'Uppföljning Kvalitet',
    nextCta: 'Fortsätt till Uppföljning Miljö',
  },
  { path: '/uppfoljning-miljo', label: 'Uppföljning Miljö', nextCta: 'Fortsätt till Riskbedömning' },
  { path: '/riskbedomning', label: 'Riskbedömning', nextCta: 'Fortsätt till Kvittering' },
  { path: '/kvittering', label: 'Kvittering', nextCta: 'Fortsätt till Checklista byggpärm' },
  {
    path: '/checklista-byggparm',
    label: 'Checklista byggpärm',
    nextCta: 'Fortsätt till Distribution',
  },
  { path: '/distribution', label: 'Distribution', nextCta: null },
]

export function findFlowStep(pathname) {
  if (!pathname) return null
  // Längre path först så /egenkontroll-ue inte matchar /egenkontroll
  const sorted = [...flowSteps].sort((a, b) => b.path.length - a.path.length)
  return sorted.find((step) => pathname === step.path || pathname.startsWith(`${step.path}/`)) || null
}

export function getNextFlowStep(pathname) {
  const current = findFlowStep(pathname)
  if (!current) return null
  const index = flowSteps.findIndex((step) => step.path === current.path)
  if (index < 0 || index >= flowSteps.length - 1) return null
  return flowSteps[index + 1]
}

export function buildFlowPath(stepPath, projectId) {
  if (!stepPath) return '/'
  if (!projectId) return stepPath
  if (stepPath === '/company' || stepPath === '/projects') return stepPath
  return `${stepPath}?project=${projectId}`
}
