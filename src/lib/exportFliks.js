import { CHECKLISTA_BYGGPARM_AVSNITT } from './types'

/** AMP-relaterade flikar enligt underlaget (AMP + säkerhet/uppföljning AM). */
export const AMP_RELATED_FLIKS = [7, 18, 19, 20, 21, 25, 28, 29]

/** Egenkontroll / kontrollkedja. */
export const EGENKONTROLL_FLIKS = [12, 13, 14, 15]

/**
 * Korta beskrivningar från docs/kma-underlag (KB/underlag) – tooltip på fliknamn.
 * SoT: docs/kma-underlag/INDEX.md + flikar-*.md; termer enligt docs/KNOWLEDGE_BASE.md.
 */
export const FLIK_KB_HELPERS = {
  1: 'Projektstart och grunddata om fastighet, byggherre och entreprenör.',
  2: 'Roller, kontakt och ansvar i entreprenörens organisation.',
  3: 'Beställarens / byggherrens organisation och kontakt.',
  4: 'Underleverantörer (UE) och inköpsansvar.',
  5: 'Kvalitetsstyrning enligt PBL och projektkrav.',
  6: 'Miljöarbete, miljöaspekter och källsortering.',
  7: 'Arbetsmiljöplan (AMP) enligt AFS, ordnings- och skyddsregler.',
  8: 'Miljöanalys – aspekter och källsortering.',
  9: 'Rivningsplan och avfallshantering.',
  10: 'Protokoll från byggmöten och beslut.',
  11: 'Bygghandlingar och relationsritningar (dokumentarkiv).',
  12: 'Kontrollplan enligt PBL med kontrollpunkter.',
  13: 'Egenkontroller – mall och varianter.',
  14: 'Egenkontroller från underentreprenör (UE-bevis).',
  15: 'Inventering av maskiner för UE och behörighet.',
  16: 'ÄTA, avvikelserapport och ÄTA-lista.',
  17: 'Säkerhetsdatablad för kemikalier (SDB).',
  18: 'Nödlägesberedskap och larmrutiner.',
  19: 'Anhöriglista för personal.',
  20: 'Krisberedskap och handlingsplan vid olycka.',
  21: 'Skydds- och miljörond med checklista.',
  22: 'Ekonomi och betalningsplan.',
  23: 'Arbetsplatsbesiktning / förbesiktning.',
  24: 'Slutbesiktningsprotokoll.',
  25: 'Uppföljning arbetsmiljö.',
  26: 'Uppföljning kvalitet.',
  27: 'Uppföljning miljö.',
  28: 'Riskbedömning och tillämpliga lagar/AFS.',
  29: 'Kvitteringslistor – information och bevis.',
  30: 'Checklista byggpärm Flik 1–31.',
  31: 'Distribution och signering / godkännande av pärmen.',
}

export const EXPORT_FLIKS = CHECKLISTA_BYGGPARM_AVSNITT.map((item) => ({
  flik_nr: item.flik_nr,
  label: item.avsnitt,
  helper: FLIK_KB_HELPERS[item.flik_nr] || '',
}))

export const PERMISSION_OPTIONS = [
  { value: 'read', label: 'Läs' },
  { value: 'sign', label: 'Signera' },
  { value: 'approve', label: 'Godkänna' },
]

export function flikLabel(flikNr) {
  const hit = EXPORT_FLIKS.find((f) => f.flik_nr === flikNr)
  return hit ? `Flik ${flikNr} – ${hit.label}` : `Flik ${flikNr}`
}

export function formatExpiresLabel(iso) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleString('sv-SE')
  } catch {
    return iso
  }
}
