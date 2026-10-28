import { useEffect, useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import VerticalLayout from '../../layouts/VerticalLayout'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { contractForms, emptyProjectForm } from '../../lib/types'

export default function ProjectsList() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [company, setCompany] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(emptyProjectForm)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    setError('')

    const { data: companyData, error: companyError } = await supabase
      .from('companies')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    if (companyError) {
      setError(companyError.message)
      setCompany(null)
      setItems([])
      setLoading(false)
      return
    }

    setCompany(companyData)

    if (!companyData) {
      setItems([])
      setLoading(false)
      return
    }

    const { data, error: fetchError } = await supabase
      .from('projects')
      .select('*')
      .eq('company_id', companyData.id)
      .order('created_at', { ascending: false })

    if (fetchError) setError(fetchError.message)
    else setItems(data || [])
    setLoading(false)
  }

  useEffect(() => {
    if (user?.id) load()
  }, [user?.id])

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleCreate = async (event) => {
    event.preventDefault()
    if (!company?.id || !form.property_designation.trim()) return

    setSaving(true)
    setError('')

    const { data, error: insertError } = await supabase
      .from('projects')
      .insert({
        user_id: user.id,
        company_id: company.id,
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
        guided_answers: {},
      })
      .select()
      .single()

    setSaving(false)

    if (insertError) {
      setError(insertError.message)
      return
    }

    setOpen(false)
    setForm({ ...emptyProjectForm })
    navigate(`/projects/${data.id}`)
  }

  const handleDelete = async (id) => {
    setError('')
    const { error: deleteError } = await supabase.from('projects').delete().eq('id', id)
    if (deleteError) setError(deleteError.message)
    else setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const locationLabel = (item) => {
    const parts = [item.address, [item.postal_code, item.city].filter(Boolean).join(' ')].filter(Boolean)
    return parts.join(', ') || '—'
  }

  return (
    <VerticalLayout>
      <Stack spacing={3}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              Projekt
            </Typography>
            <Typography color="text.secondary">
              Lista och detalj för byggprojekt kopplade till ditt företag
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
            disabled={!company}
          >
            Nytt projekt
          </Button>
        </Box>

        {error && <Alert severity="error">{error}</Alert>}

        {!loading && !company && (
          <Alert
            severity="info"
            action={
              <Button color="inherit" size="small" component={RouterLink} to="/company">
                Skapa företag
              </Button>
            }
          >
            Skapa ett företagskonto innan du lägger till projekt.
          </Alert>
        )}

        <Card>
          <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
            {loading ? (
              <Box sx={{ py: 6, display: 'grid', placeItems: 'center' }}>
                <CircularProgress />
              </Box>
            ) : items.length === 0 ? (
              <Box sx={{ py: 6, textAlign: 'center' }}>
                <Typography color="text.secondary">
                  {company ? 'Inga projekt ännu. Skapa det första.' : 'Inga projekt – skapa först ett företag.'}
                </Typography>
              </Box>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Fastighetsbeteckning</TableCell>
                    <TableCell>Plats</TableCell>
                    <TableCell>Byggherre</TableCell>
                    <TableCell>Entreprenadform</TableCell>
                    <TableCell>Skapad</TableCell>
                    <TableCell align="right">Åtgärder</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item) => (
                    <TableRow
                      key={item.id}
                      hover
                      sx={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/projects/${item.id}`)}
                    >
                      <TableCell>
                        <Typography fontWeight={500}>{item.property_designation}</Typography>
                        {item.description && (
                          <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 280 }}>
                            {item.description}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>{locationLabel(item)}</TableCell>
                      <TableCell>{item.client_name || '—'}</TableCell>
                      <TableCell>{item.contract_form || '—'}</TableCell>
                      <TableCell>{new Date(item.created_at).toLocaleString('sv-SE')}</TableCell>
                      <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                        <IconButton
                          aria-label="Ta bort"
                          onClick={() => handleDelete(item.id)}
                          color="error"
                          size="small"
                        >
                          <DeleteOutlineIcon />
                        </IconButton>
                        <Button component={RouterLink} to={`/projects/${item.id}`} size="small">
                          Öppna
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </Stack>

      <Dialog open={open} onClose={() => !saving && setOpen(false)} fullWidth maxWidth="md">
        <Box component="form" onSubmit={handleCreate}>
          <DialogTitle>Nytt projekt</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ pt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Fastighetsbeteckning"
                  value={form.property_designation}
                  onChange={handleChange('property_designation')}
                  required
                  fullWidth
                  autoFocus
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
                <TextField label="Mobil" value={form.phone} onChange={handleChange('phone')} fullWidth />
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
                  minRows={3}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setOpen(false)} disabled={saving}>
              Avbryt
            </Button>
            <Button type="submit" variant="contained" disabled={saving || !form.property_designation.trim()}>
              {saving ? <CircularProgress size={20} color="inherit" /> : 'Skapa'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </VerticalLayout>
  )
}
