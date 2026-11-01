import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined'
import VerticalLayout from '../../layouts/VerticalLayout'
import NextStep from '../../components/NextStep'
import CompanyContactsSection from './CompanyContactsSection'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { emptyCompanyForm } from '../../lib/types'

function toForm(company) {
  if (!company) return { ...emptyCompanyForm }
  return {
    name: company.name || '',
    org_number: company.org_number || '',
    address: company.address || '',
    postal_code: company.postal_code || '',
    city: company.city || '',
    ceo_name: company.ceo_name || '',
    phone: company.phone || '',
    email: company.email || '',
    website: company.website || '',
  }
}

function toPayload(form) {
  return {
    name: form.name.trim(),
    org_number: form.org_number.trim() || null,
    address: form.address.trim() || null,
    postal_code: form.postal_code.trim() || null,
    city: form.city.trim() || null,
    ceo_name: form.ceo_name.trim() || null,
    phone: form.phone.trim() || null,
    email: form.email.trim() || null,
    website: form.website.trim() || null,
    updated_at: new Date().toISOString(),
  }
}

export default function CompanyPage() {
  const { user } = useAuth()
  const [company, setCompany] = useState(null)
  const [form, setForm] = useState(emptyCompanyForm)
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
        .from('companies')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      if (!mounted) return

      if (fetchError) {
        setError(fetchError.message)
        setCompany(null)
        setForm({ ...emptyCompanyForm })
      } else {
        setCompany(data)
        setForm(toForm(data))
      }
      setLoading(false)
    }

    if (user?.id) load()
    return () => {
      mounted = false
    }
  }, [user?.id])

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
    setSaved(false)
  }

  const handleSave = async (event) => {
    event.preventDefault()
    if (!form.name.trim()) return

    setSaving(true)
    setError('')
    setSaved(false)

    const payload = toPayload(form)
    let result

    if (company?.id) {
      result = await supabase.from('companies').update(payload).eq('id', company.id).select().single()
    } else {
      result = await supabase
        .from('companies')
        .insert({ ...payload, user_id: user.id })
        .select()
        .single()
    }

    setSaving(false)

    if (result.error) {
      setError(result.error.message)
      return
    }

    setCompany(result.data)
    setForm(toForm(result.data))
    setSaved(true)
  }

  return (
    <VerticalLayout>
      <Stack spacing={3} sx={{ maxWidth: 960 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Företagskonto
          </Typography>
          <Typography color="text.secondary">
            Grunduppgifter om företaget och VD. En användare har ett företagskonto.
          </Typography>
        </Box>

        {error && <Alert severity="error">{error}</Alert>}
        {saved && <Alert severity="success">Företagskonto sparat.</Alert>}

        {loading ? (
          <Box sx={{ py: 6, display: 'grid', placeItems: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Card>
              <CardContent sx={{ p: 5, '&:last-child': { pb: 5 } }}>
                <Stack component="form" spacing={4} onSubmit={handleSave}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 42,
                        height: 42,
                        borderRadius: 1.5,
                        display: 'grid',
                        placeItems: 'center',
                        bgcolor: 'primary.main',
                        color: '#fff',
                        opacity: 0.9,
                      }}
                    >
                      <BusinessOutlinedIcon />
                    </Box>
                    <Box>
                      <Typography variant="h5">
                        {company ? 'Redigera företag' : 'Skapa företagskonto'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Fält enligt Flik 2 – företagsinformation
                      </Typography>
                    </Box>
                  </Box>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                      <TextField
                        label="Företagsnamn"
                        value={form.name}
                        onChange={handleChange('name')}
                        required
                        fullWidth
                        autoFocus={!company}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        label="Org.nr"
                        value={form.org_number}
                        onChange={handleChange('org_number')}
                        fullWidth
                        placeholder="XXXXXX-XXXX"
                      />
                    </Grid>
                    <Grid item xs={12}>
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
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="VD-namn"
                        value={form.ceo_name}
                        onChange={handleChange('ceo_name')}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Mobil"
                        value={form.phone}
                        onChange={handleChange('phone')}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
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
                        label="Hemsida"
                        value={form.website}
                        onChange={handleChange('website')}
                        fullWidth
                        placeholder="https://"
                      />
                    </Grid>
                  </Grid>

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button type="submit" variant="contained" disabled={saving || !form.name.trim()}>
                      {saving ? <CircularProgress size={20} color="inherit" /> : company ? 'Spara' : 'Skapa företag'}
                    </Button>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {company?.id ? <CompanyContactsSection companyId={company.id} /> : null}

            {saved && (
              <NextStep
                currentPath="/company"
                description="Företaget är sparat. Vill du skapa ett projekt nu, eller gå till dashboard?"
              />
            )}
          </>
        )}
      </Stack>
    </VerticalLayout>
  )
}
