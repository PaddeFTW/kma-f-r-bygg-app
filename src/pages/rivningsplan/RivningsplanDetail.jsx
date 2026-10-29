import { useEffect, useState } from 'react'
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import VerticalLayout from '../../layouts/VerticalLayout'
import { supabase } from '../../lib/supabase'
import {
  emptyFarligtAvfallRow,
  emptyOvrigtAvfallRow,
  emptyRivningsplanForm,
  rivningsplanFormToPayload,
  rivningsplanToForm,
} from '../../lib/types'
import RivningsplanFormFields from './RivningsplanFormFields'

export default function RivningsplanDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [project, setProject] = useState(null)
  const [form, setForm] = useState(emptyRivningsplanForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    let mounted = true

    const load = async () => {
      setLoading(true)
      setError('')

      const { data, error: fetchError } = await supabase
        .from('rivningsplaner')
        .select('*')
        .eq('id', id)
        .single()

      if (!mounted) return

      if (fetchError) {
        setError(fetchError.message)
        setItem(null)
        setProject(null)
        setLoading(false)
        return
      }

      setItem(data)
      setForm(rivningsplanToForm(data))

      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('id, property_designation')
        .eq('id', data.project_id)
        .maybeSingle()

      if (!mounted) return

      if (projectError) setError(projectError.message)
      setProject(projectData)
      setLoading(false)
    }

    load()
    return () => {
      mounted = false
    }
  }, [id])

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
    setSaved(false)
  }

  const handleCheckboxChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.checked }))
    setSaved(false)
  }

  const handleFarligtChange = (index, field, isCheckbox = false) => (event) => {
    const value = isCheckbox ? event.target.checked : event.target.value
    setForm((prev) => {
      const rows = [...(prev.farligt_avfall || [])]
      rows[index] = { ...rows[index], [field]: value }
      return { ...prev, farligt_avfall: rows }
    })
    setSaved(false)
  }

  const handleOvrigtChange = (index, field) => (event) => {
    const value = event.target.value
    setForm((prev) => {
      const rows = [...(prev.ovrigt_avfall || [])]
      rows[index] = { ...rows[index], [field]: value }
      return { ...prev, ovrigt_avfall: rows }
    })
    setSaved(false)
  }

  const handleAddFarligt = () => {
    setForm((prev) => ({
      ...prev,
      farligt_avfall: [...(prev.farligt_avfall || []), emptyFarligtAvfallRow()],
    }))
    setSaved(false)
  }

  const handleRemoveFarligt = (index) => {
    setForm((prev) => ({
      ...prev,
      farligt_avfall: (prev.farligt_avfall || []).filter((_, i) => i !== index),
    }))
    setSaved(false)
  }

  const handleAddOvrigt = () => {
    setForm((prev) => ({
      ...prev,
      ovrigt_avfall: [...(prev.ovrigt_avfall || []), emptyOvrigtAvfallRow()],
    }))
    setSaved(false)
  }

  const handleRemoveOvrigt = (index) => {
    setForm((prev) => ({
      ...prev,
      ovrigt_avfall: (prev.ovrigt_avfall || []).filter((_, i) => i !== index),
    }))
    setSaved(false)
  }

  const handleSave = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    setSaved(false)

    const { data, error: updateError } = await supabase
      .from('rivningsplaner')
      .update({
        ...rivningsplanFormToPayload(form),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    setSaving(false)

    if (updateError) {
      setError(updateError.message)
      return
    }

    setItem(data)
    setForm(rivningsplanToForm(data))
    setSaved(true)
  }

  const handleDelete = async () => {
    const { error: deleteError } = await supabase.from('rivningsplaner').delete().eq('id', id)
    if (deleteError) {
      setError(deleteError.message)
      return
    }
    navigate('/rivningsplan')
  }

  const backTo = item?.project_id
    ? `/rivningsplan?project=${item.project_id}`
    : '/rivningsplan'

  return (
    <VerticalLayout>
      <Stack spacing={3} sx={{ maxWidth: 1100 }}>
        <Button
          component={RouterLink}
          to={backTo}
          startIcon={<ArrowBackIcon />}
          sx={{ alignSelf: 'flex-start' }}
        >
          Tillbaka till listan
        </Button>

        {loading ? (
          <Box sx={{ py: 6, display: 'grid', placeItems: 'center' }}>
            <CircularProgress />
          </Box>
        ) : !item ? (
          <Alert severity="error">{error || 'Rivningsplanen hittades inte.'}</Alert>
        ) : (
          <Card>
            <CardContent sx={{ p: 5, '&:last-child': { pb: 5 } }}>
              <Stack component="form" spacing={4} onSubmit={handleSave}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    Rivningsplan
                  </Typography>
                  <Typography color="text.secondary">
                    Flik 9 – {project?.property_designation || 'projekt'}
                    {project?.id ? (
                      <>
                        {' · '}
                        <Button
                          component={RouterLink}
                          to={`/projects/${project.id}`}
                          size="small"
                          sx={{ verticalAlign: 'baseline', minWidth: 0, p: 0, textTransform: 'none' }}
                        >
                          Öppna projekt (Flik 1–4)
                        </Button>
                      </>
                    ) : null}
                  </Typography>
                </Box>

                {error && <Alert severity="error">{error}</Alert>}
                {saved && <Alert severity="success">Sparat.</Alert>}

                <RivningsplanFormFields
                  form={form}
                  onChange={handleChange}
                  onCheckboxChange={handleCheckboxChange}
                  onFarligtChange={handleFarligtChange}
                  onOvrigtChange={handleOvrigtChange}
                  onAddFarligt={handleAddFarligt}
                  onRemoveFarligt={handleRemoveFarligt}
                  onAddOvrigt={handleAddOvrigt}
                  onRemoveOvrigt={handleRemoveOvrigt}
                />

                <Stack direction="row" spacing={1.5} justifyContent="space-between" flexWrap="wrap">
                  <Button color="error" variant="outlined" onClick={handleDelete} disabled={saving}>
                    Ta bort
                  </Button>
                  <Button type="submit" variant="contained" disabled={saving}>
                    {saving ? <CircularProgress size={20} color="inherit" /> : 'Spara'}
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        )}
      </Stack>
    </VerticalLayout>
  )
}
