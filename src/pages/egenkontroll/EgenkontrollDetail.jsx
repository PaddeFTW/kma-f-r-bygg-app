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
import NextStep from '../../components/NextStep'
import { supabase } from '../../lib/supabase'
import {
  emptyEgenkontrollForm,
  emptyEgenkontrollRad,
  egenkontrollFormToPayload,
  egenkontrollRaderFromTyp,
  egenkontrollRaderToPayload,
  egenkontrollToForm,
} from '../../lib/types'
import EgenkontrollFormFields from './EgenkontrollFormFields'

export default function EgenkontrollDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [project, setProject] = useState(null)
  const [form, setForm] = useState(emptyEgenkontrollForm)
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
        .from('egenkontroller')
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
        .from('egenkontroll_rader')
        .select('*')
        .eq('egenkontroll_id', id)
        .order('sort_order', { ascending: true })

      if (!mounted) return

      if (raderError) {
        setError(raderError.message)
        setLoading(false)
        return
      }

      setItem(data)
      setForm(egenkontrollToForm(data, raderData || []))

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

  const handleTypChange = (event) => {
    const nextTyp = event.target.value
    setForm((prev) => ({
      ...prev,
      typ: nextTyp,
      rader: nextTyp ? egenkontrollRaderFromTyp(nextTyp) : [],
    }))
    setSaved(false)
  }

  const handleRadChange = (key, field) => (event) => {
    const value = event.target.value
    setForm((prev) => ({
      ...prev,
      rader: prev.rader.map((rad) => (rad._key === key ? { ...rad, [field]: value } : rad)),
    }))
    setSaved(false)
  }

  const handleAddRad = () => {
    setForm((prev) => ({ ...prev, rader: [...prev.rader, emptyEgenkontrollRad()] }))
    setSaved(false)
  }

  const handleRemoveRad = (key) => {
    setForm((prev) => ({ ...prev, rader: prev.rader.filter((rad) => rad._key !== key) }))
    setSaved(false)
  }

  const handleSave = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    setSaved(false)

    const { data, error: updateError } = await supabase
      .from('egenkontroller')
      .update({
        ...egenkontrollFormToPayload(form),
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
      .from('egenkontroll_rader')
      .delete()
      .eq('egenkontroll_id', id)

    if (deleteRaderError) {
      setSaving(false)
      setError(deleteRaderError.message)
      return
    }

    const raderPayload = egenkontrollRaderToPayload(id, form.rader)
    let savedRader = []

    if (raderPayload.length > 0) {
      const { data: insertedRader, error: insertRaderError } = await supabase
        .from('egenkontroll_rader')
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
    setForm(egenkontrollToForm(data, savedRader))
    setSaved(true)
  }

  const handleDelete = async () => {
    const { error: deleteError } = await supabase.from('egenkontroller').delete().eq('id', id)
    if (deleteError) {
      setError(deleteError.message)
      return
    }
    navigate('/egenkontroll')
  }

  const backTo = item?.project_id
    ? `/egenkontroll?project=${item.project_id}`
    : '/egenkontroll'

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
          <Alert severity="error">{error || 'Egenkontrollen hittades inte.'}</Alert>
        ) : (
          <>
          <Card>
            <CardContent sx={{ p: 5, '&:last-child': { pb: 5 } }}>
              <Stack component="form" spacing={4} onSubmit={handleSave}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    Egenkontroll
                  </Typography>
                  <Typography color="text.secondary">
                    Flik 13 – {project?.property_designation || 'projekt'}
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

                <EgenkontrollFormFields
                  form={form}
                  onChange={handleChange}
                  onTypChange={handleTypChange}
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

          {saved && (
            <NextStep currentPath="/egenkontroll" projectId={item.project_id} />
          )}

        </>
        )}
      </Stack>
    </VerticalLayout>
  )
}
