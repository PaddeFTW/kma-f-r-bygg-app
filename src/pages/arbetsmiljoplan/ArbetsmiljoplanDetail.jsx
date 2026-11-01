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
  emptyArbetsmiljoplanForm,
  arbetsmiljoplanFormToPayload,
  arbetsmiljoplanToForm,
} from '../../lib/types'
import {
  buildAmpPrefillFromRisker,
  rowsRequireAmp,
} from '../../lib/sarskildaRisker'
import ArbetsmiljoplanFormFields from './ArbetsmiljoplanFormFields'

export default function ArbetsmiljoplanDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [project, setProject] = useState(null)
  const [form, setForm] = useState(emptyArbetsmiljoplanForm)
  const [sarskildaRisker, setSarskildaRisker] = useState([])
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
        .from('arbetsmiljoplaner')
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

      const { data: riskRows } = await supabase
        .from('project_sarskilda_risker')
        .select('*')
        .eq('project_id', data.project_id)
        .order('sort_order', { ascending: true })

      let nextForm = arbetsmiljoplanToForm(data)
      const risks = riskRows || []
      if (rowsRequireAmp(risks)) {
        const prefill = buildAmpPrefillFromRisker(risks)
        const current = (nextForm.riskbedomning_anteckningar || '').trim()
        if (!current || current.startsWith('AMP krävs enligt AFS 2023:3')) {
          nextForm = { ...nextForm, riskbedomning_anteckningar: prefill }
          if (!current) {
            await supabase
              .from('arbetsmiljoplaner')
              .update({
                riskbedomning_anteckningar: prefill,
                updated_at: new Date().toISOString(),
              })
              .eq('id', data.id)
          }
        }
      }

      if (!mounted) return

      setItem(data)
      setForm(nextForm)
      setSarskildaRisker(risks)

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

  const handleSave = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    setSaved(false)

    const { data, error: updateError } = await supabase
      .from('arbetsmiljoplaner')
      .update({
        ...arbetsmiljoplanFormToPayload(form),
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
    setForm(arbetsmiljoplanToForm(data))
    setSaved(true)
  }

  const handleDelete = async () => {
    const { error: deleteError } = await supabase.from('arbetsmiljoplaner').delete().eq('id', id)
    if (deleteError) {
      setError(deleteError.message)
      return
    }
    navigate('/arbetsmiljoplan')
  }

  const backTo = item?.project_id
    ? `/arbetsmiljoplan?project=${item.project_id}`
    : '/arbetsmiljoplan'

  return (
    <VerticalLayout>
      <Stack spacing={3} sx={{ maxWidth: 1040 }}>
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
          <Alert severity="error">{error || 'Arbetsmiljöplanen hittades inte.'}</Alert>
        ) : (
          <>
          <Card>
            <CardContent sx={{ p: 5, '&:last-child': { pb: 5 } }}>
              <Stack component="form" spacing={4} onSubmit={handleSave}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    Arbetsmiljöplan
                  </Typography>
                  <Typography color="text.secondary">
                    Flik 7 – {project?.property_designation || 'projekt'}
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

                <ArbetsmiljoplanFormFields
                  form={form}
                  onChange={handleChange}
                  onCheckboxChange={handleCheckboxChange}
                  sarskildaRisker={sarskildaRisker}
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
                      flikNr={7}
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
            <NextStep currentPath="/arbetsmiljoplan" projectId={item.project_id} />
          )}

        </>
        )}
      </Stack>
    </VerticalLayout>
  )
}
