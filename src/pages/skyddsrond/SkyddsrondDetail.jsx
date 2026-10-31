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
  emptySkyddsrondCheckRad,
  emptySkyddsrondForm,
  emptySkyddsrondHandlingsplanRad,
  skyddsrondChecklistaToPayload,
  skyddsrondFormToPayload,
  skyddsrondHandlingsplanToPayload,
  skyddsrondToForm,
} from '../../lib/types'
import SkyddsrondFormFields from './SkyddsrondFormFields'

export default function SkyddsrondDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [project, setProject] = useState(null)
  const [form, setForm] = useState(emptySkyddsrondForm)
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
        .from('skyddsronder')
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

      const [{ data: checkData, error: checkError }, { data: planData, error: planError }] =
        await Promise.all([
          supabase
            .from('skyddsrond_checklista')
            .select('*')
            .eq('skyddsrond_id', id)
            .order('sort_order', { ascending: true }),
          supabase
            .from('skyddsrond_handlingsplan')
            .select('*')
            .eq('skyddsrond_id', id)
            .order('sort_order', { ascending: true }),
        ])

      if (!mounted) return

      if (checkError || planError) {
        setError(checkError?.message || planError?.message)
        setLoading(false)
        return
      }

      setItem(data)
      setForm(skyddsrondToForm(data, checkData || [], planData || []))

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

  const handleCheckChange = (key, field) => (event) => {
    const value = event.target.value
    setForm((prev) => ({
      ...prev,
      checklista: prev.checklista.map((rad) =>
        rad._key === key ? { ...rad, [field]: value } : rad
      ),
    }))
    setSaved(false)
  }

  const handleAddCheck = () => {
    setForm((prev) => ({
      ...prev,
      checklista: [...prev.checklista, emptySkyddsrondCheckRad()],
    }))
    setSaved(false)
  }

  const handleRemoveCheck = (key) => {
    setForm((prev) => ({
      ...prev,
      checklista: prev.checklista.filter((rad) => rad._key !== key),
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
      handlingsplan: [...prev.handlingsplan, emptySkyddsrondHandlingsplanRad()],
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
      .from('skyddsronder')
      .update({
        ...skyddsrondFormToPayload(form),
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

    const { error: deleteCheckError } = await supabase
      .from('skyddsrond_checklista')
      .delete()
      .eq('skyddsrond_id', id)

    if (deleteCheckError) {
      setSaving(false)
      setError(deleteCheckError.message)
      return
    }

    const { error: deletePlanError } = await supabase
      .from('skyddsrond_handlingsplan')
      .delete()
      .eq('skyddsrond_id', id)

    if (deletePlanError) {
      setSaving(false)
      setError(deletePlanError.message)
      return
    }

    const checkPayload = skyddsrondChecklistaToPayload(id, form.checklista)
    const planPayload = skyddsrondHandlingsplanToPayload(id, form.handlingsplan)
    let savedCheck = []
    let savedPlan = []

    if (checkPayload.length > 0) {
      const { data: insertedCheck, error: insertCheckError } = await supabase
        .from('skyddsrond_checklista')
        .insert(checkPayload)
        .select()
        .order('sort_order', { ascending: true })

      if (insertCheckError) {
        setSaving(false)
        setError(insertCheckError.message)
        return
      }
      savedCheck = insertedCheck || []
    }

    if (planPayload.length > 0) {
      const { data: insertedPlan, error: insertPlanError } = await supabase
        .from('skyddsrond_handlingsplan')
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
    setForm(skyddsrondToForm(data, savedCheck, savedPlan))
    setSaved(true)
  }

  const handleDelete = async () => {
    const { error: deleteError } = await supabase.from('skyddsronder').delete().eq('id', id)
    if (deleteError) {
      setError(deleteError.message)
      return
    }
    navigate('/skyddsrond')
  }

  const backTo = item?.project_id
    ? `/skyddsrond?project=${item.project_id}`
    : '/skyddsrond'

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
          <Alert severity="error">{error || 'Posten hittades inte.'}</Alert>
        ) : (
          <Card>
            <CardContent sx={{ p: 5, '&:last-child': { pb: 5 } }}>
              <Stack component="form" spacing={4} onSubmit={handleSave}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    Skydds- och miljörond
                  </Typography>
                  <Typography color="text.secondary">
                    Flik 21 – {project?.property_designation || 'projekt'}
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

                <SkyddsrondFormFields
                  form={form}
                  onChange={handleChange}
                  onCheckChange={handleCheckChange}
                  onAddCheck={handleAddCheck}
                  onRemoveCheck={handleRemoveCheck}
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
        )}
      </Stack>
    </VerticalLayout>
  )
}
