import { useEffect, useState } from 'react'
import { Link as RouterLink, useLocation, useNavigate, useParams } from 'react-router-dom'
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
  emptyProjectForm,
  isProjectFormValid,
  projectFormToPayload,
  projectToForm,
} from '../../lib/types'
import ProjectFormFields from './ProjectFormFields'
import ProjectRolesSection from './ProjectRolesSection'
import ProjectClientSection from './ProjectClientSection'
import ProjectSubcontractorsSection from './ProjectSubcontractorsSection'

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [item, setItem] = useState(null)
  const [form, setForm] = useState(emptyProjectForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const [showNextStep, setShowNextStep] = useState(Boolean(location.state?.justCreated))

  useEffect(() => {
    let mounted = true

    const load = async () => {
      setLoading(true)
      setError('')
      const { data, error: fetchError } = await supabase.from('projects').select('*').eq('id', id).single()

      if (!mounted) return

      if (fetchError) {
        setError(fetchError.message)
        setItem(null)
      } else {
        setItem(data)
        setForm(projectToForm(data))
      }
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
    setShowNextStep(false)
  }

  const handleSave = async (event) => {
    event.preventDefault()
    if (!isProjectFormValid(form)) return

    setSaving(true)
    setError('')
    setSaved(false)
    setShowNextStep(false)

    const { data, error: updateError } = await supabase
      .from('projects')
      .update({
        ...projectFormToPayload(form),
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
    setForm(projectToForm(data))
    setSaved(true)
    setShowNextStep(true)
  }

  const handleDelete = async () => {
    const { error: deleteError } = await supabase.from('projects').delete().eq('id', id)
    if (deleteError) {
      setError(deleteError.message)
      return
    }
    navigate('/projects')
  }

  return (
    <VerticalLayout>
      <Stack spacing={3} sx={{ maxWidth: 1040 }}>
        <Button
          component={RouterLink}
          to="/projects"
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
          <Alert severity="error">{error || 'Projektet hittades inte.'}</Alert>
        ) : (
          <>
            <Card>
              <CardContent sx={{ p: 5, '&:last-child': { pb: 5 } }}>
                <Stack component="form" spacing={4} onSubmit={handleSave}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 600 }}>
                      Projektbeskrivning
                    </Typography>
                    <Typography color="text.secondary">
                      Flik 1 – grunddata om fastighet, byggherre och entreprenör.
                    </Typography>
                  </Box>

                  {error && <Alert severity="error">{error}</Alert>}
                  {saved && <Alert severity="success">Sparat.</Alert>}

                  <ProjectFormFields form={form} onChange={handleChange} />

                  <Stack direction="row" spacing={1.5} justifyContent="space-between" flexWrap="wrap">
                    <Button color="error" variant="outlined" onClick={handleDelete} disabled={saving}>
                      Ta bort
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={saving || !isProjectFormValid(form)}
                    >
                      {saving ? <CircularProgress size={20} color="inherit" /> : 'Spara'}
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>

            <ProjectRolesSection projectId={item.id} companyId={item.company_id} />

            <ProjectClientSection projectId={item.id} companyId={item.company_id} />

            <ProjectSubcontractorsSection projectId={item.id} companyId={item.company_id} />

            {showNextStep && (
              <NextStep
                currentPath="/projects"
                projectId={item.id}
                description="Projektet är sparat. Gå vidare till kvalitetsplan eller tillbaka till dashboard."
              />
            )}
          </>
        )}
      </Stack>
    </VerticalLayout>
  )
}
