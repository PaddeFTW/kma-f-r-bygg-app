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
  emptyRiskbedomningAfsRad,
  emptyRiskbedomningForm,
  emptyRiskbedomningHandlingsplanRad,
  riskbedomningAfsToPayload,
  riskbedomningFormToPayload,
  riskbedomningHandlingsplanToPayload,
  riskbedomningToForm,
} from '../../lib/types'
import RiskbedomningFormFields from './RiskbedomningFormFields'

export default function RiskbedomningDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [project, setProject] = useState(null)
  const [form, setForm] = useState(emptyRiskbedomningForm)
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
        .from('riskbedomningar')
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

      const [{ data: afsData, error: afsError }, { data: planData, error: planError }] =
        await Promise.all([
          supabase
            .from('riskbedomning_afs')
            .select('*')
            .eq('riskbedomning_id', id)
            .order('sort_order', { ascending: true }),
          supabase
            .from('riskbedomning_handlingsplan')
            .select('*')
            .eq('riskbedomning_id', id)
            .order('sort_order', { ascending: true }),
        ])

      if (!mounted) return

      if (afsError || planError) {
        setError(afsError?.message || planError?.message)
        setLoading(false)
        return
      }

      setItem(data)
      setForm(riskbedomningToForm(data, afsData || [], planData || []))

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

  const handleAfsChange = (key, field) => (event) => {
    const value = event.target.value
    setForm((prev) => ({
      ...prev,
      afs_rader: prev.afs_rader.map((rad) =>
        rad._key === key ? { ...rad, [field]: value } : rad
      ),
    }))
    setSaved(false)
  }

  const handleAddAfs = () => {
    setForm((prev) => ({
      ...prev,
      afs_rader: [...prev.afs_rader, emptyRiskbedomningAfsRad()],
    }))
    setSaved(false)
  }

  const handleRemoveAfs = (key) => {
    setForm((prev) => ({
      ...prev,
      afs_rader: prev.afs_rader.filter((rad) => rad._key !== key),
    }))
    setSaved(false)
  }

  const handlePlanChange = (key, field) => (event) => {
    const value = event.target.value
    setForm((prev) => ({
      ...prev,
      handlingsplan: prev.handlingsplan.map((rad) =>
        rad._key === key ? { ...rad, [field]: value } : rad
      ),
    }))
    setSaved(false)
  }

  const handleAddPlan = () => {
    setForm((prev) => ({
      ...prev,
      handlingsplan: [...prev.handlingsplan, emptyRiskbedomningHandlingsplanRad()],
    }))
    setSaved(false)
  }

  const handleRemovePlan = (key) => {
    setForm((prev) => ({
      ...prev,
      handlingsplan: prev.handlingsplan.filter((rad) => rad._key !== key),
    }))
    setSaved(false)
  }

  const handleSave = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    setSaved(false)

    const { data, error: updateError } = await supabase
      .from('riskbedomningar')
      .update({
        ...riskbedomningFormToPayload(form),
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

    const { error: deleteAfsError } = await supabase
      .from('riskbedomning_afs')
      .delete()
      .eq('riskbedomning_id', id)

    if (deleteAfsError) {
      setSaving(false)
      setError(deleteAfsError.message)
      return
    }

    const { error: deletePlanError } = await supabase
      .from('riskbedomning_handlingsplan')
      .delete()
      .eq('riskbedomning_id', id)

    if (deletePlanError) {
      setSaving(false)
      setError(deletePlanError.message)
      return
    }

    const afsPayload = riskbedomningAfsToPayload(id, form.afs_rader)
    const planPayload = riskbedomningHandlingsplanToPayload(id, form.handlingsplan)
    let savedAfs = []
    let savedPlan = []

    if (afsPayload.length > 0) {
      const { data: insertedAfs, error: insertAfsError } = await supabase
        .from('riskbedomning_afs')
        .insert(afsPayload)
        .select()
        .order('sort_order', { ascending: true })

      if (insertAfsError) {
        setSaving(false)
        setError(insertAfsError.message)
        return
      }
      savedAfs = insertedAfs || []
    }

    if (planPayload.length > 0) {
      const { data: insertedPlan, error: insertPlanError } = await supabase
        .from('riskbedomning_handlingsplan')
        .insert(planPayload)
        .select()
        .order('sort_order', { ascending: true })

      if (insertPlanError) {
        setSaving(false)
        setError(insertPlanError.message)
        return
      }
      savedPlan = insertedPlan || []
    }

    setSaving(false)
    setItem(data)
    setForm(riskbedomningToForm(data, savedAfs, savedPlan))
    setSaved(true)
  }

  const handleDelete = async () => {
    const { error: deleteError } = await supabase.from('riskbedomningar').delete().eq('id', id)
    if (deleteError) {
      setError(deleteError.message)
      return
    }
    navigate('/riskbedomning')
  }

  const backTo = item?.project_id
    ? `/riskbedomning?project=${item.project_id}`
    : '/riskbedomning'

  return (
    <VerticalLayout>
      <Stack spacing={3} sx={{ maxWidth: 1200 }}>
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
                    Riskbedömning + Lagar
                  </Typography>
                  <Typography color="text.secondary">
                    Flik 28 – {project?.property_designation || 'projekt'}
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

                <RiskbedomningFormFields
                  form={form}
                  onChange={handleChange}
                  onAfsChange={handleAfsChange}
                  onAddAfs={handleAddAfs}
                  onRemoveAfs={handleRemoveAfs}
                  onPlanChange={handlePlanChange}
                  onAddPlan={handleAddPlan}
                  onRemovePlan={handleRemovePlan}
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
            <NextStep currentPath="/riskbedomning" projectId={item.project_id} />
          )}

        </>
        )}
      </Stack>
    </VerticalLayout>
  )
}
