import { useEffect, useState } from 'react'
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import VerticalLayout from '../../layouts/VerticalLayout'
import { supabase } from '../../lib/supabase'
import { contractForms, emptyProjectForm } from '../../lib/types'

function toForm(project) {
  if (!project) return { ...emptyProjectForm }
  return {
    property_designation: project.property_designation || '',
    address: project.address || '',
    postal_code: project.postal_code || '',
    city: project.city || '',
    contact_name: project.contact_name || '',
    phone: project.phone || '',
    email: project.email || '',
    client_name: project.client_name || '',
    contractor_name: project.contractor_name || '',
    contract_form: project.contract_form || '',
    description: project.description || '',
  }
}

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [form, setForm] = useState(emptyProjectForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

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
        setForm(toForm(data))
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
  }

  const handleSave = async (event) => {
    event.preventDefault()
    if (!form.property_designation.trim()) return

    setSaving(true)
    setError('')
    setSaved(false)

    const { data, error: updateError } = await supabase
      .from('projects')
      .update({
        property_designation: form.property_designation.trim(),
        address: form.address.trim() || null,
        postal_code: form.postal_code.trim() || null,
        city: form.city.trim() || null,
        contact_name: form.contact_name.trim() || null,
        phone: form.phone.trim() || null,
        email: form.email.trim() || null,
        client_name: form.client_name.trim() || null,
        contractor_name: form.contractor_name.trim() || null,
        contract_form: form.contract_form.trim() || null,
        description: form.description.trim() || null,
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
    setForm(toForm(data))
    setSaved(true)
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
      <Stack spacing={3} sx={{ maxWidth: 960 }}>
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
          <Card>
            <CardContent sx={{ p: 5, '&:last-child': { pb: 5 } }}>
              <Stack component="form" spacing={4} onSubmit={handleSave}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    Projektdetalj
                  </Typography>
                  <Typography color="text.secondary">
                    Fält enligt Flik 1. Guided flöde förbereds via <code>guided_answers</code> (ej aktivt ännu).
                  </Typography>
                </Box>

                {error && <Alert severity="error">{error}</Alert>}
                {saved && <Alert severity="success">Sparat.</Alert>}

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Fastighetsbeteckning"
                      value={form.property_designation}
                      onChange={handleChange('property_designation')}
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Adress"
                      value={form.address}
                      onChange={handleChange('address')}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Postnr"
                      value={form.postal_code}
                      onChange={handleChange('postal_code')}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <TextField label="Ort" value={form.city} onChange={handleChange('city')} fullWidth />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Kontaktperson"
                      value={form.contact_name}
                      onChange={handleChange('contact_name')}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Mobil"
                      value={form.phone}
                      onChange={handleChange('phone')}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="E-post"
                      type="email"
                      value={form.email}
                      onChange={handleChange('email')}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Byggherre"
                      value={form.client_name}
                      onChange={handleChange('client_name')}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Entreprenör"
                      value={form.contractor_name}
                      onChange={handleChange('contractor_name')}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      select
                      label="Entreprenadform"
                      value={form.contract_form}
                      onChange={handleChange('contract_form')}
                      fullWidth
                    >
                      <MenuItem value="">
                        <em>Välj…</em>
                      </MenuItem>
                      {contractForms.map((value) => (
                        <MenuItem key={value} value={value}>
                          {value}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Projektbeskrivning"
                      value={form.description}
                      onChange={handleChange('description')}
                      fullWidth
                      multiline
                      minRows={4}
                    />
                  </Grid>
                </Grid>

                <Stack direction="row" spacing={1.5} justifyContent="space-between" flexWrap="wrap">
                  <Button color="error" variant="outlined" onClick={handleDelete} disabled={saving}>
                    Ta bort
                  </Button>
                  <Button type="submit" variant="contained" disabled={saving || !form.property_designation.trim()}>
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
