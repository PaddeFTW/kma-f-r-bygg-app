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
  emptyChecklistaByggparmForm,
  emptyChecklistaByggparmRad,
  checklistaByggparmRaderToPayload,
  checklistaByggparmToForm,
} from '../../lib/types'
import ChecklistaByggparmFormFields from './ChecklistaByggparmFormFields'

export default function ChecklistaByggparmDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [project, setProject] = useState(null)
  const [form, setForm] = useState(emptyChecklistaByggparmForm)
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
        .from('checklista_byggparm')
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
        .from('checklista_byggparm_rader')
        .select('*')
        .eq('checklista_id', id)
        .order('sort_order', { ascending: true })

      if (!mounted) return

      if (raderError) {
        setError(raderError.message)
        setLoading(false)
        return
      }

      setItem(data)
      setForm(checklistaByggparmToForm(data, raderData || []))

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
    let value = event.target.value
    if (field === 'flik_nr') {
      value = value === '' ? null : Number(value)
    }
    setForm((prev) => ({
      ...prev,
      rader: prev.rader.map((rad) => (rad._key === key ? { ...rad, [field]: value } : rad)),
    }))
    setSaved(false)
  }

  const handleAddRad = () => {
    setForm((prev) => ({
      ...prev,
      rader: [...prev.rader, emptyChecklistaByggparmRad()],
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
      .from('checklista_byggparm')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      setSaving(false)
      setError(updateError.message)
      return
    }

    const { error: deleteError } = await supabase
      .from('checklista_byggparm_rader')
      .delete()
      .eq('checklista_id', id)

    if (deleteError) {
      setSaving(false)
      setError(deleteError.message)
      return
    }

    const raderPayload = checklistaByggparmRaderToPayload(id, form.rader)
    let savedRader = []

    if (raderPayload.length > 0) {
      const { data: insertedRader, error: insertError } = await supabase
        .from('checklista_byggparm_rader')
        .insert(raderPayload)
        .select()
        .order('sort_order', { ascending: true })

      if (insertError) {
        setSaving(false)
        setError(insertError.message)
        return
      }
      savedRader = insertedRader || []
    }

    setSaving(false)
    setItem(data)
    setForm(checklistaByggparmToForm(data, savedRader))
    setSaved(true)
  }

  const handleDelete = async () => {
    const { error: deleteError } = await supabase.from('checklista_byggparm').delete().eq('id', id)
    if (deleteError) {
      setError(deleteError.message)
      return
    }
    navigate('/checklista-byggparm')
  }

  const backTo = item?.project_id
    ? `/checklista-byggparm?project=${item.project_id}`
    : '/checklista-byggparm'

  const klartCount = form.rader.filter((rad) => rad.klart === 'ja').length

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
          <>
          <Card>
            <CardContent sx={{ p: 5, '&:last-child': { pb: 5 } }}>
              <Stack component="form" spacing={4} onSubmit={handleSave}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    Checklista byggpärm
                  </Typography>
                  <Typography color="text.secondary">
                    Flik 30 – {project?.property_designation || 'projekt'}
                    {form.rader.length > 0
                      ? ` · ${klartCount}/${form.rader.length} klara`
                      : null}
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

                <ChecklistaByggparmFormFields
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
                      flikNr={30}
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
            <NextStep currentPath="/checklista-byggparm" projectId={item.project_id} />
          )}

        </>
        )}
      </Stack>
    </VerticalLayout>
  )
}
