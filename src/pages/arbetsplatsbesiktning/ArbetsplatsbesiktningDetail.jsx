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
import SaveFlikAsTemplateButton from '../../components/templates/SaveFlikAsTemplateButton'
import NextStep from '../../components/NextStep'
import { supabase } from '../../lib/supabase'
import {
  emptyArbetsplatsbesiktningForm,
  emptyArbetsplatsbesiktningRad,
  arbetsplatsbesiktningRaderToPayload,
  arbetsplatsbesiktningToForm,
} from '../../lib/types'
import ArbetsplatsbesiktningFormFields from './ArbetsplatsbesiktningFormFields'

export default function ArbetsplatsbesiktningDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [project, setProject] = useState(null)
  const [form, setForm] = useState(emptyArbetsplatsbesiktningForm)
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
        .from('arbetsplatsbesiktningar')
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
        .from('arbetsplatsbesiktning_rader')
        .select('*')
        .eq('arbetsplatsbesiktning_id', id)
        .order('sort_order', { ascending: true })

      if (!mounted) return

      if (raderError) {
        setError(raderError.message)
        setLoading(false)
        return
      }

      setItem(data)
      setForm(arbetsplatsbesiktningToForm(data, raderData || []))

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
      rader: [...prev.rader, emptyArbetsplatsbesiktningRad()],
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
      .from('arbetsplatsbesiktningar')
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
      .from('arbetsplatsbesiktning_rader')
      .delete()
      .eq('arbetsplatsbesiktning_id', id)

    if (deleteRaderError) {
      setSaving(false)
      setError(deleteRaderError.message)
      return
    }

    const raderPayload = arbetsplatsbesiktningRaderToPayload(id, form.rader)
    let savedRader = []

    if (raderPayload.length > 0) {
      const { data: insertedRader, error: insertRaderError } = await supabase
        .from('arbetsplatsbesiktning_rader')
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
    setForm(arbetsplatsbesiktningToForm(data, savedRader))
    setSaved(true)
  }

  const handleDelete = async () => {
    const { error: deleteError } = await supabase
      .from('arbetsplatsbesiktningar')
      .delete()
      .eq('id', id)
    if (deleteError) {
      setError(deleteError.message)
      return
    }
    navigate('/arbetsplatsbesiktning')
  }

  const backTo = item?.project_id
    ? `/arbetsplatsbesiktning?project=${item.project_id}`
    : '/arbetsplatsbesiktning'

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
          <>
          <Card>
            <CardContent sx={{ p: 5, '&:last-child': { pb: 5 } }}>
              <Stack component="form" spacing={4} onSubmit={handleSave}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    Arbetsplatsbesiktning
                  </Typography>
                  <Typography color="text.secondary">
                    Flik 23 – {project?.property_designation || 'projekt'}
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

                <ArbetsplatsbesiktningFormFields
                  form={form}
                  onRadChange={handleRadChange}
                  onAddRad={handleAddRad}
                  onRemoveRad={handleRemoveRad}
                />

                <Stack direction="row" spacing={1.5} justifyContent="space-between" flexWrap="wrap">
                  <Stack direction="row" spacing={1.5} flexWrap="wrap">
                    <Button color="error" variant="outlined" onClick={handleDelete} disabled={saving}>
                      Ta bort
                    </Button>
                    <SaveFlikAsTemplateButton
                      companyId={item.company_id}
                      projectId={item.project_id}
                      projectLabel={project?.property_designation}
                      flikNr={23}
                      disabled={saving}
                    />
                  </Stack>
                  <Button type="submit" variant="contained" disabled={saving}>
                    {saving ? <CircularProgress size={20} color="inherit" /> : 'Spara'}
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          {saved && (
            <NextStep currentPath="/arbetsplatsbesiktning" projectId={item.project_id} />
          )}

        </>
        )}
      </Stack>
    </VerticalLayout>
  )
}
