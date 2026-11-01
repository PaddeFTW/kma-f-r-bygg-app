import { supabase } from './supabase'
import { buildExportSnapshot } from './exportSnapshot'
import { flikLabel } from './exportFliks'
import { projectFormToPayload, projectToForm } from './types'

/** Fält som aldrig ska kopieras till mall eller från mall. */
const STRIP_KEYS = new Set([
  'id',
  'user_id',
  'company_id',
  'project_id',
  'created_at',
  'updated_at',
  'file_path',
  'file_url',
  'file_name',
  'cert_file_path',
  'cert_file_name',
  // Signaturer / godkännanden (Flik 31)
  'bestallare',
  'bestallare_datum',
  'platschef',
  'platschef_datum',
  'bestallarens_ombud',
  'bestallarens_ombud_datum',
])

/** Nestade nycklar som hör till barn-tabeller / sammansatta snapshot-objekt. */
const NESTED_KEYS = new Set([
  'rader',
  'organisation',
  'checklista',
  'handlingsplan',
  'afs',
  'roller',
  'sarskilda_risker',
  'bas_overlamning',
  'avvikelser',
  'ata',
  'ata_lista',
])

/** Detaljsökväg efter skapande från flikmall. */
export const FLIK_DETAIL_BASE = {
  5: '/kvalitetsplan',
  6: '/miljoplan',
  7: '/arbetsmiljoplan',
  11: '/bygghandlingar',
  12: '/kontrollplan',
  13: '/egenkontroll',
  14: '/egenkontroll-ue',
  15: '/maskiner-ue',
  16: '/ata',
  17: '/sakerhetsdatablad',
  18: '/nodlage',
  19: '/anhoriglista',
  20: '/krisberedskap',
  21: '/skyddsrond',
  22: '/ekonomi',
  23: '/arbetsplatsbesiktning',
  24: '/slutbesiktning',
  25: '/uppfoljning-am',
  26: '/uppfoljning-kvalitet',
  27: '/uppfoljning-miljo',
  28: '/riskbedomning',
  29: '/kvittering',
  30: '/checklista-byggparm',
  31: '/distribution',
}

export function sanitizeValue(value) {
  if (Array.isArray(value)) return value.map(sanitizeValue)
  if (value && typeof value === 'object') {
    const out = {}
    Object.entries(value).forEach(([key, val]) => {
      if (STRIP_KEYS.has(key)) return
      out[key] = sanitizeValue(val)
    })
    return out
  }
  return value
}

export function sanitizeSnapshot(snapshot) {
  if (!snapshot) return { sections: [], flik_nrs: [] }
  return {
    generated_at: snapshot.generated_at || new Date().toISOString(),
    project_label: snapshot.project_label || null,
    flik_nrs: Array.isArray(snapshot.flik_nrs) ? snapshot.flik_nrs : [],
    sections: (snapshot.sections || []).map((section) => ({
      flik_nr: section.flik_nr,
      title: section.title,
      helper: section.helper || '',
      note: section.note || null,
      records: sanitizeValue(section.records || []),
    })),
  }
}

function parentPayload(record, { userId, companyId, projectId }) {
  const payload = { user_id: userId, company_id: companyId, project_id: projectId }
  if (!record || typeof record !== 'object') return payload
  Object.entries(record).forEach(([key, val]) => {
    if (STRIP_KEYS.has(key) || NESTED_KEYS.has(key)) return
    payload[key] = val ?? null
  })
  return payload
}

async function insertRows(table, rows) {
  if (!rows.length) return []
  const { data, error } = await supabase.from(table).insert(rows).select()
  if (error) throw new Error(`${table}: ${error.message}`)
  return data || []
}

/**
 * Sparar mall från projekt (hela eller valda flikar).
 */
export async function saveTemplateFromProject({
  userId,
  companyId,
  projectId,
  name,
  description = null,
  flikNrs,
  scope = 'project',
  flikNr = null,
}) {
  const selected =
    scope === 'flik'
      ? [flikNr]
      : [...new Set(flikNrs || [])].filter((n) => n >= 1 && n <= 31).sort((a, b) => a - b)

  if (!name?.trim()) throw new Error('Ange ett namn på mallen.')
  if (!selected.length) throw new Error('Välj minst en flik.')

  const snapshot = sanitizeSnapshot(await buildExportSnapshot(projectId, selected))

  const { data, error } = await supabase
    .from('project_templates')
    .insert({
      user_id: userId,
      company_id: companyId,
      name: name.trim(),
      description: description?.trim() || null,
      scope,
      flik_nr: scope === 'flik' ? flikNr : null,
      flik_nrs: selected,
      payload: snapshot,
      source_project_id: projectId,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function listTemplates(companyId, { scope = null, flikNr = null } = {}) {
  let query = supabase
    .from('project_templates')
    .select('*')
    .eq('company_id', companyId)
    .order('updated_at', { ascending: false })

  if (scope) query = query.eq('scope', scope)
  if (flikNr != null) query = query.eq('flik_nr', flikNr)

  const { data, error } = await query
  if (error) throw new Error(error.message)
  return data || []
}

export async function renameTemplate(id, name) {
  const trimmed = (name || '').trim()
  if (!trimmed) throw new Error('Ange ett namn.')
  const { data, error } = await supabase
    .from('project_templates')
    .update({ name: trimmed, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function deleteTemplate(id) {
  const { error } = await supabase.from('project_templates').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

function sectionByFlik(payload, flikNr) {
  return (payload?.sections || []).find((s) => s.flik_nr === flikNr) || null
}

async function applyFlik2(section, ctx) {
  const rec = section?.records?.[0]
  if (!rec) return

  if (Array.isArray(rec.roller) && rec.roller.length) {
    await insertRows(
      'project_roles',
      rec.roller.map((role) => parentPayload(role, ctx)),
    )
  }

  if (Array.isArray(rec.sarskilda_risker) && rec.sarskilda_risker.length) {
    await insertRows(
      'project_sarskilda_risker',
      rec.sarskilda_risker.map((r) => parentPayload(r, ctx)),
    )
  }

  if (rec.bas_overlamning && typeof rec.bas_overlamning === 'object') {
    const b = rec.bas_overlamning
    await supabase
      .from('projects')
      .update({
        bas_overlamning_gjord: b.gjord ?? null,
        bas_overlamning_datum: b.datum ?? null,
        bas_overlamning_from: b.from ?? null,
        bas_overlamning_to: b.to ?? null,
        bas_overlamning_anteckning: b.anteckning ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', ctx.projectId)
  }
}

async function applySimpleTable(table, records, ctx) {
  if (!records?.length) return []
  return insertRows(
    table,
    records.map((r) => parentPayload(r, ctx)),
  )
}

async function applyParentWithChildren({
  table,
  records,
  ctx,
  children,
}) {
  const created = []
  for (const rec of records || []) {
    const { data, error } = await supabase
      .from(table)
      .insert(parentPayload(rec, ctx))
      .select()
      .single()
    if (error) throw new Error(`${table}: ${error.message}`)
    created.push(data)

    for (const child of children) {
      const list = rec[child.key]
      if (!list?.length) continue
      const rows = list.map((item) => {
        const row = { [child.fk]: data.id }
        Object.entries(item || {}).forEach(([key, val]) => {
          if (STRIP_KEYS.has(key) || NESTED_KEYS.has(key) || key === child.fk) return
          row[key] = val ?? null
        })
        return row
      })
      const { error: childError } = await supabase.from(child.table).insert(rows)
      if (childError) throw new Error(`${child.table}: ${childError.message}`)
    }
  }
  return created
}

/**
 * Applicerar en fliksektion på ett befintligt projekt.
 * @returns {{ firstId: string|null, ids: string[], listPath: string|null }}
 */
export async function applyFlikSection(section, { userId, companyId, projectId, skipRisker = false }) {
  const ctx = { userId, companyId, projectId }
  const flik = section?.flik_nr
  const records = section?.records || []
  if (!flik || !records.length) {
    return { firstId: null, ids: [], listPath: FLIK_DETAIL_BASE[flik] || null }
  }

  let created = []

  switch (flik) {
    case 1:
      // Flik 1 är själva projektet – hanteras separat
      break
    case 2:
      await applyFlik2(section, ctx)
      break
    case 3:
      created = await applySimpleTable('project_clients', records, ctx)
      break
    case 4:
      created = await applySimpleTable('project_subcontractors', records, ctx)
      break
    case 5:
      created = await applySimpleTable('kvalitetsplaner', records, ctx)
      break
    case 6:
      created = await applySimpleTable('miljoplaner', records, ctx)
      break
    case 7: {
      const amps = records.map((r) => {
        const copy = { ...r }
        delete copy.sarskilda_risker
        return copy
      })
      created = await applySimpleTable('arbetsmiljoplaner', amps, ctx)
      if (!skipRisker) {
        const risker = records[0]?.sarskilda_risker
        if (Array.isArray(risker) && risker.length) {
          await applySimpleTable('project_sarskilda_risker', risker, ctx)
        }
      }
      break
    }
    case 8:
      created = await applySimpleTable('miljoanalyser', records, ctx)
      break
    case 9:
      created = await applySimpleTable('rivningsplaner', records, ctx)
      break
    case 10:
      created = await applySimpleTable('protokoll', records, ctx)
      break
    case 11:
      created = await applySimpleTable('bygghandlingar', records, ctx)
      break
    case 12:
      created = await applyParentWithChildren({
        table: 'kontrollplaner',
        records,
        ctx,
        children: [{ key: 'rader', table: 'kontrollplan_rader', fk: 'kontrollplan_id' }],
      })
      break
    case 13:
      created = await applyParentWithChildren({
        table: 'egenkontroller',
        records,
        ctx,
        children: [{ key: 'rader', table: 'egenkontroll_rader', fk: 'egenkontroll_id' }],
      })
      break
    case 14:
      created = await applySimpleTable('egenkontroller_ue', records, ctx)
      break
    case 15:
      created = await applySimpleTable('maskiner_ue', records, ctx)
      break
    case 16: {
      const pack = records[0] || {}
      const a = await applySimpleTable('avvikelser', pack.avvikelser || [], ctx)
      const b = await applySimpleTable('ata', pack.ata || [], ctx)
      const c = await applySimpleTable('ata_lista', pack.ata_lista || [], ctx)
      created = [...a, ...b, ...c]
      break
    }
    case 17:
      created = await applySimpleTable('sakerhetsdatablad', records, ctx)
      break
    case 18:
      created = await applyParentWithChildren({
        table: 'nodlage',
        records,
        ctx,
        children: [{ key: 'organisation', table: 'nodlage_organisation', fk: 'nodlage_id' }],
      })
      break
    case 19:
      created = await applySimpleTable('anhoriglista', records, ctx)
      break
    case 20:
      created = await applySimpleTable('krisberedskap', records, ctx)
      break
    case 21:
      created = await applyParentWithChildren({
        table: 'skyddsronder',
        records,
        ctx,
        children: [
          { key: 'checklista', table: 'skyddsrond_checklista', fk: 'skyddsrond_id' },
          { key: 'handlingsplan', table: 'skyddsrond_handlingsplan', fk: 'skyddsrond_id' },
        ],
      })
      break
    case 22:
      created = await applySimpleTable('ekonomi', records, ctx)
      break
    case 23:
      created = await applyParentWithChildren({
        table: 'arbetsplatsbesiktningar',
        records,
        ctx,
        children: [{ key: 'rader', table: 'arbetsplatsbesiktning_rader', fk: 'arbetsplatsbesiktning_id' }],
      })
      break
    case 24:
      created = await applySimpleTable('slutbesiktning', records, ctx)
      break
    case 25:
      created = await applyParentWithChildren({
        table: 'uppfoljning_am',
        records,
        ctx,
        children: [{ key: 'rader', table: 'uppfoljning_am_rader', fk: 'uppfoljning_am_id' }],
      })
      break
    case 26:
      created = await applyParentWithChildren({
        table: 'uppfoljning_kvalitet',
        records,
        ctx,
        children: [{ key: 'rader', table: 'uppfoljning_kvalitet_rader', fk: 'uppfoljning_kvalitet_id' }],
      })
      break
    case 27:
      created = await applyParentWithChildren({
        table: 'uppfoljning_miljo',
        records,
        ctx,
        children: [{ key: 'rader', table: 'uppfoljning_miljo_rader', fk: 'uppfoljning_miljo_id' }],
      })
      break
    case 28:
      created = await applyParentWithChildren({
        table: 'riskbedomningar',
        records,
        ctx,
        children: [
          { key: 'afs', table: 'riskbedomning_afs', fk: 'riskbedomning_id' },
          { key: 'handlingsplan', table: 'riskbedomning_handlingsplan', fk: 'riskbedomning_id' },
        ],
      })
      break
    case 29:
      created = await applyParentWithChildren({
        table: 'kvitteringslistor',
        records,
        ctx,
        children: [{ key: 'rader', table: 'kvittering_rader', fk: 'kvittering_id' }],
      })
      break
    case 30:
      created = await applyParentWithChildren({
        table: 'checklista_byggparm',
        records,
        ctx,
        children: [{ key: 'rader', table: 'checklista_byggparm_rader', fk: 'checklista_id' }],
      })
      break
    case 31:
      created = await applySimpleTable('distribution_signering', records, ctx)
      break
    default:
      break
  }

  const ids = created.map((r) => r.id).filter(Boolean)
  return {
    firstId: ids[0] || null,
    ids,
    listPath: FLIK_DETAIL_BASE[flik] || null,
  }
}

/**
 * Skapar nytt projekt från projektmall (Flik 1 + övriga sektioner).
 * @param {object} template
 * @param {{ userId: string, companyId: string, projectOverrides?: object }} opts
 */
export async function applyProjectTemplate(template, { userId, companyId, projectOverrides = {} }) {
  const payload = template.payload || {}
  const flik1 = sectionByFlik(payload, 1)
  const sourceProject = flik1?.records?.[0] || {}
  const form = {
    ...projectToForm(sourceProject),
    ...projectOverrides,
  }

  if (!form.property_designation?.trim()) {
    form.property_designation = template.name || 'Nytt projekt från mall'
  }

  const { data: project, error } = await supabase
    .from('projects')
    .insert({
      user_id: userId,
      company_id: companyId,
      ...projectFormToPayload(form),
      guided_answers: {},
    })
    .select()
    .single()

  if (error) throw new Error(error.message)

  const ctx = { userId, companyId, projectId: project.id }
  const hasFlik2 = (payload.sections || []).some((s) => s.flik_nr === 2)

  for (const section of payload.sections || []) {
    if (section.flik_nr === 1) continue
    await applyFlikSection(section, {
      ...ctx,
      skipRisker: section.flik_nr === 7 && hasFlik2,
    })
  }

  return project
}

/**
 * Applicerar en flikmall på ett projekt (skapar poster).
 */
export async function applyFlikTemplate(template, { userId, companyId, projectId }) {
  const section =
    sectionByFlik(template.payload, template.flik_nr) ||
    (template.payload?.sections || [])[0]

  if (!section) throw new Error('Mallen saknar flikdata.')

  if (template.flik_nr === 1 || section.flik_nr === 1) {
    throw new Error('Flik 1 appliceras via projektmall.')
  }

  return applyFlikSection(section, { userId, companyId, projectId })
}

export function templateScopeLabel(template) {
  if (!template) return ''
  if (template.scope === 'flik') {
    return flikLabel(template.flik_nr)
  }
  const n = Array.isArray(template.flik_nrs) ? template.flik_nrs.length : 0
  return n ? `Hela projektet (${n} flikar)` : 'Hela projektet'
}

export function defaultTemplateName({ scope, flikNr, projectLabel }) {
  const base = projectLabel || 'Projekt'
  if (scope === 'flik') return `${flikLabel(flikNr)} – ${base}`
  return `Projektmall – ${base}`
}
