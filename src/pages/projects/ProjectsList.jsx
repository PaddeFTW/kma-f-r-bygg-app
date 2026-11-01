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
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import VerticalLayout from '../../layouts/VerticalLayout'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import {
  emptyProjectForm,
  isProjectFormValid,
  projectFormToPayload,
} from '../../lib/types'
import ProjectFormFields from './ProjectFormFields'

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
      .select(
        `
        *,
        project_clients ( contact_name, ceo_name ),
        project_subcontractors ( id )
      `,
      )
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
    if (!company?.id || !isProjectFormValid(form)) return

    setSaving(true)
    setError('')

    const { data, error: insertError } = await supabase
      .from('projects')
      .insert({
        user_id: user.id,
        company_id: company.id,
        ...projectFormToPayload(form),
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
    navigate(`/projects/${data.id}`, { state: { justCreated: true } })
  }

  const handleDelete = async (id) => {
    setError('')
    const { error: deleteError } = await supabase.from('projects').delete().eq('id', id)
    if (deleteError) setError(deleteError.message)
    else setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const locationLabel = (item) => {
    const parts = [item.address, [item.postal_code, item.city].filter(Boolean).join(' ')].filter(
      Boolean,
    )
    return parts.join(', ') || '—'
  }

  const clientLabel = (item) => {
    const client = Array.isArray(item.project_clients)
      ? item.project_clients[0]
      : item.project_clients
    if (!client) return '—'
    return client.contact_name || client.ceo_name || '—'
  }

  const subcontractorCount = (item) => {
    const rows = item.project_subcontractors
    return Array.isArray(rows) ? rows.length : 0
  }

  return (
    <VerticalLayout>
      <Stack spacing={3}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              Projekt
            </Typography>
            <Typography color="text.secondary">
              Projektstart Flik 1–4: beskrivning, roller, beställare och underleverantörer
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setForm({ ...emptyProjectForm })
              setOpen(true)
            }}
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
                  {company
                    ? 'Inga projekt ännu. Skapa det första.'
                    : 'Inga projekt – skapa först ett företag.'}
                </Typography>
              </Box>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Fastighetsbeteckning</TableCell>
                    <TableCell>Plats</TableCell>
                    <TableCell>Byggherre</TableCell>
                    <TableCell>Beställare</TableCell>
                    <TableCell>UE</TableCell>
                    <TableCell>Entreprenör</TableCell>
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
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            noWrap
                            sx={{ maxWidth: 280 }}
                          >
                            {item.description}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>{locationLabel(item)}</TableCell>
                      <TableCell>{item.client_name || '—'}</TableCell>
                      <TableCell>{clientLabel(item)}</TableCell>
                      <TableCell>{subcontractorCount(item)}</TableCell>
                      <TableCell>{item.contractor_name || '—'}</TableCell>
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
          <DialogTitle>Nytt projekt – Flik 1 Projektbeskrivning</DialogTitle>
          <DialogContent>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              Fyll i grunddata. Kontaktfält för huvudparter är obligatoriska. Roller läggs till i
              nästa steg.
            </Typography>
            <ProjectFormFields form={form} onChange={handleChange} />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setOpen(false)} disabled={saving}>
              Avbryt
            </Button>
            <Button type="submit" variant="contained" disabled={saving || !isProjectFormValid(form)}>
              {saving ? <CircularProgress size={20} color="inherit" /> : 'Skapa'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </VerticalLayout>
  )
}
