import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { supabase } from '../../lib/supabase'

/** Överlämning Bas-P → Bas-U (enkel markering + datum). */
export default function ProjectBasHandoverSection({ projectId, project }) {
  const [form, setForm] = useState({
    bas_overlamning_gjord: false,
    bas_overlamning_datum: '',
    bas_overlamning_from: '',
    bas_overlamning_to: '',
    bas_overlamning_anteckning: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!project) return
    setForm({
      bas_overlamning_gjord: Boolean(project.bas_overlamning_gjord),
      bas_overlamning_datum: project.bas_overlamning_datum || '',
      bas_overlamning_from: project.bas_overlamning_from || '',
      bas_overlamning_to: project.bas_overlamning_to || '',
      bas_overlamning_anteckning: project.bas_overlamning_anteckning || '',
    })
  }, [project])

  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
    setForm((prev) => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  const handleSave = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    setSaved(false)

    const { error: updateError } = await supabase
      .from('projects')
      .update({
        bas_overlamning_gjord: Boolean(form.bas_overlamning_gjord),
        bas_overlamning_datum: form.bas_overlamning_datum || null,
        bas_overlamning_from: form.bas_overlamning_from.trim() || null,
        bas_overlamning_to: form.bas_overlamning_to.trim() || null,
        bas_overlamning_anteckning: form.bas_overlamning_anteckning.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', projectId)

    setSaving(false)
    if (updateError) {
      setError(
        updateError.message?.includes('bas_overlamning')
          ? 'Kolumner för överlämning saknas. Kör migration 032_bas_sarskilda_risker.sql.'
          : updateError.message,
      )
      return
    }
    setSaved(true)
  }

  return (
    <Card>
      <CardContent sx={{ p: 5, '&:last-child': { pb: 5 } }}>
        <Stack component="form" spacing={3} onSubmit={handleSave}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Överlämning Bas-P → Bas-U
            </Typography>
            <Typography color="text.secondary">
              Markera när projekteringens Bas-P lämnat över till utförandets Bas-U.
            </Typography>
          </Box>

          {error && <Alert severity="error">{error}</Alert>}
          {saved && <Alert severity="success">Överlämning sparad.</Alert>}

          <FormControlLabel
            control={
              <Checkbox
                checked={form.bas_overlamning_gjord}
                onChange={handleChange('bas_overlamning_gjord')}
              />
            }
            label="Överlämning genomförd"
          />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              label="Datum"
              type="date"
              value={form.bas_overlamning_datum}
              onChange={handleChange('bas_overlamning_datum')}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="Från Bas-P"
              value={form.bas_overlamning_from}
              onChange={handleChange('bas_overlamning_from')}
              fullWidth
            />
            <TextField
              label="Till Bas-U"
              value={form.bas_overlamning_to}
              onChange={handleChange('bas_overlamning_to')}
              fullWidth
            />
          </Stack>

          <TextField
            label="Anteckning"
            value={form.bas_overlamning_anteckning}
            onChange={handleChange('bas_overlamning_anteckning')}
            fullWidth
            multiline
            minRows={2}
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="submit" variant="contained" disabled={saving}>
              {saving ? <CircularProgress size={20} color="inherit" /> : 'Spara överlämning'}
            </Button>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}
