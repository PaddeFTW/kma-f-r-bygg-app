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
import useSaveToContactList from '../../hooks/useSaveToContactList'
import { supabase } from '../../lib/supabase'
import {
  emptyEgenkontrollUeForm,
  egenkontrollUeFormToPayload,
  egenkontrollUeToForm,
} from '../../lib/types'
import EgenkontrollUeFormFields from './EgenkontrollUeFormFields'

export default function EgenkontrollUeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [project, setProject] = useState(null)
  const [form, setForm] = useState(emptyEgenkontrollUeForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const { offerSave, dialog: contactDialog } = useSaveToContactList(item?.company_id)

  useEffect(() => {
    let mounted = true

    const load = async () => {
      setLoading(true)
      setError('')

      const { data, error: fetchError } = await supabase
        .from('egenkontroller_ue')
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
      setForm(egenkontrollUeToForm(data))

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

  const handleSave = async (event) => {
    event.preventDefault()
    if (!form.underleverantor.trim()) {
      setError('Underleverantör krävs.')
      return
    }

    setSaving(true)
    setError('')
    setSaved(false)

    const { data, error: updateError } = await supabase
      .from('egenkontroller_ue')
      .update({
        ...egenkontrollUeFormToPayload(form),
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
    setForm(egenkontrollUeToForm(data))
    setSaved(true)

    await offerSave({
      name: form.underleverantor,
      role: 'UE-kontakt',
      company_name: form.underleverantor,
    })
  }

  const handleDelete = async () => {
    const { error: deleteError } = await supabase.from('egenkontroller_ue').delete().eq('id', id)
    if (deleteError) {
      setError(deleteError.message)
      return
    }
    navigate('/egenkontroll-ue')
  }

  const backTo = item?.project_id
    ? `/egenkontroll-ue?project=${item.project_id}`
    : '/egenkontroll-ue'

  return (
    <VerticalLayout>
      <Stack spacing={3} sx={{ maxWidth: 880 }}>
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
                    Egenkontroll från UE
                  </Typography>
                  <Typography color="text.secondary">
                    Flik 14 – {project?.property_designation || 'projekt'}
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

                <EgenkontrollUeFormFields form={form} onChange={handleChange} />

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
            <NextStep currentPath="/egenkontroll-ue" projectId={item.project_id} />
          )}

        </>
        )}
      </Stack>
      {contactDialog}
    </VerticalLayout>
  )
}
