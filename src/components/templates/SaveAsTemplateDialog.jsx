import { useEffect, useState } from 'react'
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import FlikSelector from '../export/FlikSelector'
import { useAuth } from '../../context/AuthContext'
import {
  defaultTemplateName,
  saveTemplateFromProject,
} from '../../lib/projectTemplates'
import { flikLabel } from '../../lib/exportFliks'

/**
 * Dialog för att spara projekt eller vald/enskild flik som mall.
 * mode: 'project' | 'flik'
 */
export default function SaveAsTemplateDialog({
  open,
  onClose,
  onSaved,
  companyId,
  projectId,
  projectLabel,
  mode = 'project',
  flikNr = null,
}) {
  const { user } = useAuth()
  const isFlik = mode === 'flik'
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [scopeMode, setScopeMode] = useState('all')
  const [flikNrs, setFlikNrs] = useState(flikNr ? [flikNr] : [])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return
    setError('')
    setSaving(false)
    setDescription('')
    setScopeMode(isFlik ? 'flik' : 'all')
    setFlikNrs(flikNr ? [flikNr] : [])
    setName(
      defaultTemplateName({
        scope: isFlik ? 'flik' : 'project',
        flikNr,
        projectLabel,
      }),
    )
  }, [open, isFlik, flikNr, projectLabel])

  const handleSave = async (event) => {
    event.preventDefault()
    if (!user?.id || !companyId || !projectId) return

    setSaving(true)
    setError('')

    try {
      let scope = 'project'
      let selected = []
      let singleFlik = null

      if (isFlik) {
        scope = 'flik'
        singleFlik = flikNr
        selected = [flikNr]
      } else if (scopeMode === 'all') {
        selected = Array.from({ length: 31 }, (_, i) => i + 1)
      } else {
        selected = [...flikNrs]
        if (selected.length === 1) {
          scope = 'flik'
          singleFlik = selected[0]
        }
      }

      const data = await saveTemplateFromProject({
        userId: user.id,
        companyId,
        projectId,
        name,
        description,
        flikNrs: selected,
        scope,
        flikNr: singleFlik,
      })
      onSaved?.(data)
      onClose?.()
    } catch (err) {
      setError(err.message || 'Kunde inte spara mallen.')
    } finally {
      setSaving(false)
    }
  }

  const canSubmit =
    Boolean(name.trim()) &&
    (isFlik || scopeMode === 'all' || flikNrs.length > 0)

  return (
    <Dialog open={open} onClose={saving ? undefined : onClose} fullWidth maxWidth="md">
      <form onSubmit={handleSave}>
        <DialogTitle>
          {isFlik ? `Spara ${flikLabel(flikNr)} som mall` : 'Spara som mall'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Typography color="text.secondary">
              Mallen sparas för ditt företag och innehåller formulärdata – inte delningslänkar
              eller signaturer.
            </Typography>

            {!isFlik && (
              <RadioGroup value={scopeMode} onChange={(e) => setScopeMode(e.target.value)}>
                <FormControlLabel
                  value="all"
                  control={<Radio />}
                  label="Hela projektet (Flik 1–31)"
                />
                <FormControlLabel
                  value="selected"
                  control={<Radio />}
                  label="Valda flikar (en flik sparas som flikmall)"
                />
              </RadioGroup>
            )}

            {!isFlik && scopeMode === 'selected' && (
              <FlikSelector selected={flikNrs} onChange={setFlikNrs} />
            )}

            <TextField
              label="Namn"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Beskrivning (valfritt)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              minRows={2}
            />

            {error && <Alert severity="error">{error}</Alert>}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={saving}>
            Avbryt
          </Button>
          <Button type="submit" variant="contained" disabled={saving || !canSubmit}>
            {saving ? <CircularProgress size={20} color="inherit" /> : 'Spara mall'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
