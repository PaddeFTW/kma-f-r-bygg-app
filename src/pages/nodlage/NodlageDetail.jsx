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
  emptyNodlageForm,
  emptyNodlageOrgRad,
  nodlageFormToPayload,
  nodlageOrganisationToPayload,
  nodlageToForm,
} from '../../lib/types'
import NodlageFormFields from './NodlageFormFields'

export default function NodlageDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [project, setProject] = useState(null)
  const [form, setForm] = useState(emptyNodlageForm)
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
        .from('nodlage')
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

      const { data: orgData, error: orgError } = await supabase
        .from('nodlage_organisation')
        .select('*')
        .eq('nodlage_id', id)
        .order('sort_order', { ascending: true })

      if (!mounted) return

      if (orgError) {
        setError(orgError.message)
        setLoading(false)
        return
      }

      setItem(data)
      setForm(nodlageToForm(data, orgData || []))

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

  const handleOrgChange = (key, field) => (event) => {
    const value = event.target.value
    setForm((prev) => ({
      ...prev,
      organisation: prev.organisation.map((rad) =>
        rad._key === key ? { ...rad, [field]: value } : rad
      ),
    }))
    setSaved(false)
  }

  const handleAddOrg = () => {
    setForm((prev) => ({
      ...prev,
      organisation: [...prev.organisation, emptyNodlageOrgRad()],
    }))
    setSaved(false)
  }

  const handleRemoveOrg = (key) => {
    setForm((prev) => ({
      ...prev,
      organisation: prev.organisation.filter((rad) => rad._key !== key),
    }))
    setSaved(false)
  }

  const handleSave = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    setSaved(false)

    const { data, error: updateError } = await supabase
      .from('nodlage')
      .update({
        ...nodlageFormToPayload(form),
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

    const { error: deleteOrgError } = await supabase
      .from('nodlage_organisation')
      .delete()
      .eq('nodlage_id', id)

    if (deleteOrgError) {
      setSaving(false)
      setError(deleteOrgError.message)
      return
    }

    const orgPayload = nodlageOrganisationToPayload(id, form.organisation)
    let savedOrg = []

    if (orgPayload.length > 0) {
      const { data: insertedOrg, error: insertOrgError } = await supabase
        .from('nodlage_organisation')
        .insert(orgPayload)
        .select()
        .order('sort_order', { ascending: true })

      if (insertOrgError) {
        setSaving(false)
        setError(insertOrgError.message)
        return
      }
      savedOrg = insertedOrg || []
    }

    setSaving(false)
    setItem(data)
    setForm(nodlageToForm(data, savedOrg))
    setSaved(true)
  }

  const handleDelete = async () => {
    const { error: deleteError } = await supabase.from('nodlage').delete().eq('id', id)
    if (deleteError) {
      setError(deleteError.message)
      return
    }
    navigate('/nodlage')
  }

  const backTo = item?.project_id
    ? `/nodlage?project=${item.project_id}`
    : '/nodlage'

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
                    Nödlägesberedskap
                  </Typography>
                  <Typography color="text.secondary">
                    Flik 18 – {project?.property_designation || 'projekt'}
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

                <NodlageFormFields
                  form={form}
                  onChange={handleChange}
                  onOrgChange={handleOrgChange}
                  onAddOrg={handleAddOrg}
                  onRemoveOrg={handleRemoveOrg}
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
                      flikNr={18}
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
            <NextStep currentPath="/nodlage" projectId={item.project_id} />
          )}

        </>
        )}
      </Stack>
    </VerticalLayout>
  )
}
