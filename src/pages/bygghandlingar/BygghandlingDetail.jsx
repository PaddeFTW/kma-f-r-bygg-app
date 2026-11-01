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
import { useAuth } from '../../context/AuthContext'
import {
  emptyBygghandlingForm,
  bygghandlingFormToPayload,
  bygghandlingToForm,
} from '../../lib/types'
import BygghandlingFormFields from './BygghandlingFormFields'

export default function BygghandlingDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [item, setItem] = useState(null)
  const [project, setProject] = useState(null)
  const [form, setForm] = useState(emptyBygghandlingForm)
  const [selectedFile, setSelectedFile] = useState(null)
  const [fileLink, setFileLink] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const loadSignedUrl = async (path) => {
    if (!path) {
      setFileLink('')
      return
    }
    const { data, error: urlError } = await supabase.storage
      .from('bygghandlingar')
      .createSignedUrl(path, 60 * 60)
    if (urlError) {
      setFileLink('')
      return
    }
    setFileLink(data?.signedUrl || '')
  }

  useEffect(() => {
    let mounted = true

    const load = async () => {
      setLoading(true)
      setError('')

      const { data, error: fetchError } = await supabase
        .from('bygghandlingar')
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
      setForm(bygghandlingToForm(data))
      await loadSignedUrl(data.file_path)

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

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null
    setSelectedFile(file)
    setSaved(false)
  }

  const handleClearFile = () => {
    setSelectedFile(null)
  }

  const uploadFile = async () => {
    if (!selectedFile || !user?.id || !item) return null

    const safeName = selectedFile.name.replace(/[^\w.\-åäöÅÄÖ ]+/gi, '_')
    const path = `${user.id}/${item.project_id}/${item.id}/${Date.now()}-${safeName}`

    const { error: uploadError } = await supabase.storage
      .from('bygghandlingar')
      .upload(path, selectedFile, { upsert: false })

    if (uploadError) throw new Error(uploadError.message)

    if (item.file_path) {
      await supabase.storage.from('bygghandlingar').remove([item.file_path])
    }

    return { path, name: selectedFile.name }
  }

  const handleSave = async (event) => {
    event.preventDefault()
    if (!form.namn.trim()) {
      setError('Namn krävs.')
      return
    }

    setSaving(true)
    setError('')
    setSaved(false)

    try {
      let fileMeta = null
      if (selectedFile) {
        fileMeta = await uploadFile()
      }

      const payload = {
        ...bygghandlingFormToPayload(form),
        updated_at: new Date().toISOString(),
      }

      if (fileMeta) {
        payload.file_path = fileMeta.path
        payload.file_name = fileMeta.name
      }

      const { data, error: updateError } = await supabase
        .from('bygghandlingar')
        .update(payload)
        .eq('id', id)
        .select()
        .single()

      if (updateError) throw new Error(updateError.message)

      setItem(data)
      setForm(bygghandlingToForm(data))
      setSelectedFile(null)
      await loadSignedUrl(data.file_path)
      setSaved(true)
    } catch (err) {
      setError(err.message || 'Kunde inte spara.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (item?.file_path) {
      await supabase.storage.from('bygghandlingar').remove([item.file_path])
    }
    const { error: deleteError } = await supabase.from('bygghandlingar').delete().eq('id', id)
    if (deleteError) {
      setError(deleteError.message)
      return
    }
    navigate('/bygghandlingar')
  }

  const backTo = item?.project_id
    ? `/bygghandlingar?project=${item.project_id}`
    : '/bygghandlingar'

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
          <Alert severity="error">{error || 'Bygghandlingen hittades inte.'}</Alert>
        ) : (
          <>
          <Card>
            <CardContent sx={{ p: 5, '&:last-child': { pb: 5 } }}>
              <Stack component="form" spacing={4} onSubmit={handleSave}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    Bygghandling
                  </Typography>
                  <Typography color="text.secondary">
                    Flik 11 – {project?.property_designation || 'projekt'}
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

                <BygghandlingFormFields
                  form={form}
                  onChange={handleChange}
                  onFileChange={handleFileChange}
                  selectedFile={selectedFile}
                  onClearFile={handleClearFile}
                  fileLink={fileLink}
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
                      flikNr={11}
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
            <NextStep currentPath="/bygghandlingar" projectId={item.project_id} />
          )}

        </>
        )}
      </Stack>
    </VerticalLayout>
  )
}
