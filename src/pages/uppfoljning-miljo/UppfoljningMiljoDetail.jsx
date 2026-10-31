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
  emptyUppfoljningMiljoForm,
  emptyUppfoljningMiljoRad,
  uppfoljningMiljoRaderToPayload,
  uppfoljningMiljoToForm,
} from '../../lib/types'
import UppfoljningMiljoFormFields from './UppfoljningMiljoFormFields'

export default function UppfoljningMiljoDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [project, setProject] = useState(null)
  const [form, setForm] = useState(emptyUppfoljningMiljoForm)
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
        .from('uppfoljning_miljo')
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

      const { data: raderData, error: raderError } = await supabase
        .from('uppfoljning_miljo_rader')
        .select('*')
        .eq('uppfoljning_miljo_id', id)
        .order('sort_order', { ascending: true })

      if (!mounted) return

      if (raderError) {
        setError(raderError.message)
        setLoading(false)
        return
      }

      setItem(data)
      setForm(uppfoljningMiljoToForm(data, raderData || []))

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

  const handleRadChange = (key, field) => (event) => {
    const value = event.target.value
    setForm((prev) => ({
      ...prev,
      rader: prev.rader.map((rad) => (rad._key === key ? { ...rad, [field]: value } : rad)),
    }))
    setSaved(false)
  }

  const handleAddRad = () => {
    setForm((prev) => ({
      ...prev,
      rader: [...prev.rader, emptyUppfoljningMiljoRad()],
    }))
    setSaved(false)
  }

  const handleRemoveRad = (key) => {
    setForm((prev) => ({
      ...prev,
      rader: prev.rader.filter((rad) => rad._key !== key),
    }))
    setSaved(false)
  }

  const handleSave = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    setSaved(false)

    const { data, error: updateError } = await supabase
      .from('uppfoljning_miljo')
      .update({
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      setSaving(false)
      setError(updateError.message)
      return
    }

    const { error: deleteRaderError } = await supabase
      .from('uppfoljning_miljo_rader')
      .delete()
      .eq('uppfoljning_miljo_id', id)

    if (deleteRaderError) {
      setSaving(false)
      setError(deleteRaderError.message)
      return
    }

    const raderPayload = uppfoljningMiljoRaderToPayload(id, form.rader)
    let savedRader = []

    if (raderPayload.length > 0) {
      const { data: insertedRader, error: insertRaderError } = await supabase
        .from('uppfoljning_miljo_rader')
        .insert(raderPayload)
        .select()
        .order('sort_order', { ascending: true })

      if (insertRaderError) {
        setSaving(false)
        setError(insertRaderError.message)
        return
      }
      savedRader = insertedRader || []
    }

    setSaving(false)
    setItem(data)
    setForm(uppfoljningMiljoToForm(data, savedRader))
    setSaved(true)
  }

  const handleDelete = async () => {
    const { error: deleteError } = await supabase
      .from('uppfoljning_miljo')
      .delete()
      .eq('id', id)
    if (deleteError) {
      setError(deleteError.message)
      return
    }
    navigate('/uppfoljning-miljo')
  }

  const backTo = item?.project_id
    ? `/uppfoljning-miljo?project=${item.project_id}`
    : '/uppfoljning-miljo'

  return (
    <VerticalLayout>
      <Stack spacing={3} sx={{ maxWidth: 960 }}>
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
          <Alert severity="error">{error || 'Posten hittades inte.'}</Alert>
        ) : (
          <Card>
            <CardContent sx={{ p: 5, '&:last-child': { pb: 5 } }}>
              <Stack component="form" spacing={4} onSubmit={handleSave}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    Uppföljning Miljö
                  </Typography>
                  <Typography color="text.secondary">
                    Flik 27 – {project?.property_designation || 'projekt'}
                    {project?.id ? (
                      <>
                        {' · '}
                        <Button
                          component={RouterLink}
                          to={`/projects/${project.id}`}
                          size="small"
                          sx={{ verticalAlign: 'baseline', minWidth: 0, p: 0, textTransform: 'none' }}
                        >
                          Öppna projekt
                        </Button>
                      </>
                    ) : null}
                  </Typography>
                </Box>

                {error && <Alert severity="error">{error}</Alert>}
                {saved && <Alert severity="success">Sparat.</Alert>}

                <UppfoljningMiljoFormFields
                  form={form}
                  onRadChange={handleRadChange}
                  onAddRad={handleAddRad}
                  onRemoveRad={handleRemoveRad}
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
