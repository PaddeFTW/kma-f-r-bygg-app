import { useEffect, useState } from 'react'
import { MenuItem, TextField } from '@mui/material'
import { listTemplates, templateScopeLabel } from '../../lib/projectTemplates'

/** Valfri mallväljare för skapa-ny-flik-dialoger. */
export default function FlikTemplateSelect({
  companyId,
  flikNr,
  value,
  onChange,
  disabled = false,
}) {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      if (!companyId || !flikNr) {
        setTemplates([])
        return
      }
      setLoading(true)
      try {
        const rows = await listTemplates(companyId, { scope: 'flik', flikNr })
        if (mounted) setTemplates(rows)
      } catch {
        if (mounted) setTemplates([])
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [companyId, flikNr])

  if (!companyId) return null

  return (
    <TextField
      select
      label="Starta från mall (valfritt)"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      fullWidth
      disabled={disabled || loading}
      helperText={
        templates.length
          ? 'Välj en sparad flikmall för att kopiera formulärdata.'
          : 'Inga flikmallar sparade ännu för denna flik.'
      }
    >
      <MenuItem value="">Ingen mall – tom flik</MenuItem>
      {templates.map((t) => (
        <MenuItem key={t.id} value={t.id}>
          {t.name}
          {t.description ? ` – ${t.description}` : ''}
        </MenuItem>
      ))}
    </TextField>
  )
}

export function findTemplate(templatesOrId, id) {
  if (Array.isArray(templatesOrId)) {
    return templatesOrId.find((t) => t.id === id) || null
  }
  return null
}

export { templateScopeLabel }
