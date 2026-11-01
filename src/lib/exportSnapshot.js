import { supabase } from './supabase'
import { EXPORT_FLIKS, flikLabel } from './exportFliks'

async function fetchByProject(table, projectId, select = '*') {
  const { data, error } = await supabase.from(table).select(select).eq('project_id', projectId)
  if (error) throw new Error(`${table}: ${error.message}`)
  return data || []
}

async function fetchProjectRoot(projectId) {
  const { data, error } = await supabase.from('projects').select('*').eq('id', projectId).single()
  if (error) throw new Error(error.message)
  return data
}

/**
 * Hämtar endast valda flikar för projektet (ägare via RLS).
 * Resultatet kan sparas som snapshot på delningslänk – mottagare ser inget mer.
 */
export async function buildExportSnapshot(projectId, flikNrs) {
  const selected = [...new Set(flikNrs)].filter((n) => n >= 1 && n <= 31).sort((a, b) => a - b)
  const project = await fetchProjectRoot(projectId)
  const sections = []

  for (const flik of selected) {
    const title = flikLabel(flik)
    let records = []
    let note = null

    switch (flik) {
      case 1:
        records = [project]
        break
      case 2:
        records = await fetchByProject('project_roles', projectId)
        break
      case 3:
        records = await fetchByProject('project_clients', projectId)
        break
      case 4:
        records = await fetchByProject('project_subcontractors', projectId)
        break
      case 5:
        records = await fetchByProject('kvalitetsplaner', projectId)
        break
      case 6:
        records = await fetchByProject('miljoplaner', projectId)
        break
      case 7:
        records = await fetchByProject('arbetsmiljoplaner', projectId)
        break
      case 8:
        records = await fetchByProject('miljoanalyser', projectId)
        break
      case 9:
        records = await fetchByProject('rivningsplaner', projectId)
        break
      case 10:
        records = await fetchByProject('protokoll', projectId)
        break
      case 11:
        records = await fetchByProject('bygghandlingar', projectId)
        break
      case 12: {
        const parents = await fetchByProject('kontrollplaner', projectId)
        const withRows = []
        for (const p of parents) {
          const { data: rader } = await supabase
            .from('kontrollplan_rader')
            .select('*')
            .eq('kontrollplan_id', p.id)
          withRows.push({ ...p, rader: rader || [] })
        }
        records = withRows
        break
      }
      case 13: {
        const parents = await fetchByProject('egenkontroller', projectId)
        const withRows = []
        for (const p of parents) {
          const { data: rader } = await supabase
            .from('egenkontroll_rader')
            .select('*')
            .eq('egenkontroll_id', p.id)
          withRows.push({ ...p, rader: rader || [] })
        }
        records = withRows
        break
      }
      case 14:
        records = await fetchByProject('egenkontroller_ue', projectId)
        break
      case 15:
        records = await fetchByProject('maskiner_ue', projectId)
        break
      case 16: {
        const [avvikelser, ata, ataLista] = await Promise.all([
          fetchByProject('avvikelser', projectId),
          fetchByProject('ata', projectId),
          fetchByProject('ata_lista', projectId),
        ])
        records = [{ avvikelser, ata, ata_lista: ataLista }]
        break
      }
      case 17:
        records = await fetchByProject('sakerhetsdatablad', projectId)
        break
      case 18: {
        const parents = await fetchByProject('nodlage', projectId)
        const withOrg = []
        for (const p of parents) {
          const { data: org } = await supabase
            .from('nodlage_organisation')
            .select('*')
            .eq('nodlage_id', p.id)
          withOrg.push({ ...p, organisation: org || [] })
        }
        records = withOrg
        break
      }
      case 19:
        records = await fetchByProject('anhoriglista', projectId)
        break
      case 20:
        records = await fetchByProject('krisberedskap', projectId)
        break
      case 21: {
        const parents = await fetchByProject('skyddsronder', projectId)
        const withChildren = []
        for (const p of parents) {
          const [{ data: checks }, { data: plans }] = await Promise.all([
            supabase.from('skyddsrond_checklista').select('*').eq('skyddsrond_id', p.id),
            supabase.from('skyddsrond_handlingsplan').select('*').eq('skyddsrond_id', p.id),
          ])
          withChildren.push({
            ...p,
            checklista: checks || [],
            handlingsplan: plans || [],
          })
        }
        records = withChildren
        break
      }
      case 22:
        records = await fetchByProject('ekonomi', projectId)
        break
      case 23: {
        const parents = await fetchByProject('arbetsplatsbesiktningar', projectId)
        const withRows = []
        for (const p of parents) {
          const { data: rader } = await supabase
            .from('arbetsplatsbesiktning_rader')
            .select('*')
            .eq('arbetsplatsbesiktning_id', p.id)
          withRows.push({ ...p, rader: rader || [] })
        }
        records = withRows
        break
      }
      case 24:
        records = await fetchByProject('slutbesiktning', projectId)
        break
      case 25: {
        const parents = await fetchByProject('uppfoljning_am', projectId)
        const withRows = []
        for (const p of parents) {
          const { data: rader } = await supabase
            .from('uppfoljning_am_rader')
            .select('*')
            .eq('uppfoljning_am_id', p.id)
          withRows.push({ ...p, rader: rader || [] })
        }
        records = withRows
        break
      }
      case 26: {
        const parents = await fetchByProject('uppfoljning_kvalitet', projectId)
        const withRows = []
        for (const p of parents) {
          const { data: rader } = await supabase
            .from('uppfoljning_kvalitet_rader')
            .select('*')
            .eq('uppfoljning_kvalitet_id', p.id)
          withRows.push({ ...p, rader: rader || [] })
        }
        records = withRows
        break
      }
      case 27: {
        const parents = await fetchByProject('uppfoljning_miljo', projectId)
        const withRows = []
        for (const p of parents) {
          const { data: rader } = await supabase
            .from('uppfoljning_miljo_rader')
            .select('*')
            .eq('uppfoljning_miljo_id', p.id)
          withRows.push({ ...p, rader: rader || [] })
        }
        records = withRows
        break
      }
      case 28: {
        const parents = await fetchByProject('riskbedomningar', projectId)
        const withChildren = []
        for (const p of parents) {
          const [{ data: afs }, { data: plan }] = await Promise.all([
            supabase.from('riskbedomning_afs').select('*').eq('riskbedomning_id', p.id),
            supabase.from('riskbedomning_handlingsplan').select('*').eq('riskbedomning_id', p.id),
          ])
          withChildren.push({ ...p, afs: afs || [], handlingsplan: plan || [] })
        }
        records = withChildren
        break
      }
      case 29: {
        const parents = await fetchByProject('kvitteringslistor', projectId)
        const withRows = []
        for (const p of parents) {
          const { data: rader } = await supabase
            .from('kvittering_rader')
            .select('*')
            .eq('kvittering_id', p.id)
          withRows.push({ ...p, rader: rader || [] })
        }
        records = withRows
        break
      }
      case 30: {
        const parents = await fetchByProject('checklista_byggparm', projectId)
        const withRows = []
        for (const p of parents) {
          const { data: rader } = await supabase
            .from('checklista_byggparm_rader')
            .select('*')
            .eq('checklista_id', p.id)
          withRows.push({ ...p, rader: rader || [] })
        }
        records = withRows
        break
      }
      case 31:
        records = await fetchByProject('distribution_signering', projectId)
        break
      default:
        note = 'Okänd flik'
    }

    if (!records.length && !note) {
      note = 'Ingen data sparad för denna flik ännu.'
    }

    sections.push({
      flik_nr: flik,
      title,
      helper: EXPORT_FLIKS.find((f) => f.flik_nr === flik)?.helper || '',
      note,
      records,
    })
  }

  const projectLabel =
    project.property_designation ||
    [project.address, project.city].filter(Boolean).join(', ') ||
    `Projekt ${projectId.slice(0, 8)}`

  return {
    generated_at: new Date().toISOString(),
    project_id: projectId,
    project_label: projectLabel,
    company_id: project.company_id,
    flik_nrs: selected,
    sections,
  }
}

/** Hämtar kontakter från Flik 2–4 + projektfält för inbjudningar. */
export async function loadProjectContacts(projectId) {
  const project = await fetchProjectRoot(projectId)
  const [roles, clients, subcontractors] = await Promise.all([
    fetchByProject('project_roles', projectId),
    fetchByProject('project_clients', projectId),
    fetchByProject('project_subcontractors', projectId),
  ])

  const contacts = []
  const push = (name, email, source) => {
    const trimmed = (email || '').trim()
    if (!trimmed) return
    contacts.push({
      id: `${source}-${trimmed.toLowerCase()}`,
      name: (name || '').trim() || trimmed,
      email: trimmed,
      source,
    })
  }

  if (project.email) push(project.contact_name || project.contractor_name, project.email, 'Projekt')
  if (project.client_email) push(project.client_name, project.client_email, 'Byggherre')

  roles.forEach((r) => push(r.name || r.role, r.email, 'Roll'))
  clients.forEach((c) => push(c.contact_name || c.name, c.email, 'Beställare'))
  subcontractors.forEach((c) => push(c.contact_name || c.name, c.email, 'UE'))

  const seen = new Set()
  return contacts.filter((c) => {
    const key = c.email.toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

/** Platt text för dokumentexport. */
export function snapshotToPlainLines(snapshot) {
  const lines = []
  lines.push(`KMA-pärm – ${snapshot.project_label}`)
  lines.push(`Exporterad: ${new Date(snapshot.generated_at).toLocaleString('sv-SE')}`)
  lines.push(`Flikar: ${snapshot.flik_nrs.join(', ')}`)
  lines.push('')

  for (const section of snapshot.sections) {
    lines.push('='.repeat(48))
    lines.push(section.title)
    if (section.helper) lines.push(section.helper)
    lines.push('')
    if (section.note) {
      lines.push(section.note)
      lines.push('')
      continue
    }
    section.records.forEach((rec, idx) => {
      lines.push(`— Post ${idx + 1}`)
      flattenRecord(rec).forEach(([k, v]) => lines.push(`${k}: ${v}`))
      lines.push('')
    })
  }
  return lines
}

function flattenRecord(obj, prefix = '') {
  const rows = []
  if (obj == null) return rows
  if (Array.isArray(obj)) {
    obj.forEach((item, i) => {
      rows.push(...flattenRecord(item, `${prefix}[${i}]`))
    })
    return rows
  }
  if (typeof obj !== 'object') {
    rows.push([prefix || 'värde', String(obj)])
    return rows
  }
  Object.entries(obj).forEach(([key, value]) => {
    if (['id', 'user_id', 'company_id', 'project_id', 'created_at', 'updated_at', 'file_path'].includes(key)) {
      return
    }
    const path = prefix ? `${prefix}.${key}` : key
    if (value == null || value === '') return
    if (typeof value === 'object') {
      rows.push(...flattenRecord(value, path))
    } else {
      rows.push([path, String(value)])
    }
  })
  return rows
}
