import { useEffect, useState } from 'react'
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
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import {
  emptyProjectSubcontractorForm,
  isOrgContactFormValid,
  orgContactFormToPayload,
  projectSubcontractorToForm,
} from '../../lib/types'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { useContactList } from '../../context/ContactListContext'
import OrgContactFormFields from './OrgContactFormFields'
import useSaveToContactList from '../../hooks/useSaveToContactList'

/**
 * Flik 4 – Underleverantörer.
 * Flera UE per projekt. Lägg till, redigera och ta bort.
 */
export default function ProjectSubcontractorsSection({ projectId, companyId }) {
  const { user } = useAuth()
  const { refresh: refreshContacts } = useContactList()
  const { offerSave, dialog: contactDialog } = useSaveToContactList(companyId, {
    onSaved: () => refreshContacts(),
  })
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyProjectSubcontractorForm)

  const load = async () => {
    setLoading(true)
    setError('')
    const { data, error: fetchError } = await supabase
      .from('project_subcontractors')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true })

    if (fetchError) setError(fetchError.message)
    else setItems(data || [])
    setLoading(false)
  }

  useEffect(() => {
    if (projectId) load()
  }, [projectId])

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const openCreate = () => {
    setEditingId(null)
    setForm({ ...emptyProjectSubcontractorForm })
    setOpen(true)
  }

  const openEdit = (row) => {
    setEditingId(row.id)
    setForm(projectSubcontractorToForm(row))
    setOpen(true)
  }

  const handleSave = async (event) => {
    event.preventDefault()
    if (!isOrgContactFormValid(form)) return

    setSaving(true)
    setError('')

    const payload = {
      ...orgContactFormToPayload(form, { includePurchasing: true }),
      updated_at: new Date().toISOString(),
    }

    let saveError
    if (editingId) {
      const { error: updateError } = await supabase
        .from('project_subcontractors')
        .update(payload)
        .eq('id', editingId)
      saveError = updateError
    } else {
      const { error: insertError } = await supabase.from('project_subcontractors').insert({
        ...payload,
        user_id: user.id,
        company_id: companyId,
        project_id: projectId,
      })
      saveError = insertError
    }

    setSaving(false)

    if (saveError) {
      setError(saveError.message)
      return
    }

    setOpen(false)
    setForm({ ...emptyProjectSubcontractorForm })
    setEditingId(null)
    await load()

    await offerSave({
      name: form.contact_name,
      email: form.email,
      phone: form.phone,
      company_name: form.ceo_name || null,
      role: 'UE-kontakt',
      notes: form.purchasing_manager ? `Inköpsansvarig: ${form.purchasing_manager}` : null,
    })
  }

  const handleDelete = async (id) => {
    setError('')
    const { error: deleteError } = await supabase
      .from('project_subcontractors')
      .delete()
      .eq('id', id)
    if (deleteError) setError(deleteError.message)
    else setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const placeLabel = (row) => {
    const parts = [row.postal_code, row.city].filter(Boolean).join(' ')
    return [row.address, parts].filter(Boolean).join(', ') || '—'
  }

  return (
    <Card>
      <CardContent sx={{ p: 5, '&:last-child': { pb: 5 } }}>
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Underleverantörer
              </Typography>
              <Typography color="text.secondary">
                Flik 4 – flera underleverantörer per projekt. Kontaktfält är obligatoriska.
              </Typography>
            </Box>
            <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
              Lägg till underleverantör
            </Button>
          </Box>

          {error && <Alert severity="error">{error}</Alert>}

          {loading ? (
            <Box sx={{ py: 4, display: 'grid', placeItems: 'center' }}>
              <CircularProgress />
            </Box>
          ) : items.length === 0 ? (
            <Typography color="text.secondary">
              Inga underleverantörer ännu. Lägg till den första.
            </Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Kontaktperson</TableCell>
                  <TableCell>VD</TableCell>
                  <TableCell>Adress / ort</TableCell>
                  <TableCell>Mobil</TableCell>
                  <TableCell>E-post</TableCell>
                  <TableCell>Projektansvarig</TableCell>
                  <TableCell align="right">Åtgärder</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell>
                      <Typography fontWeight={500}>{row.contact_name || '—'}</Typography>
                    </TableCell>
                    <TableCell>{row.ceo_name || '—'}</TableCell>
                    <TableCell>{placeLabel(row)}</TableCell>
                    <TableCell>{row.phone || '—'}</TableCell>
                    <TableCell>{row.email || '—'}</TableCell>
                    <TableCell>{row.project_manager || '—'}</TableCell>
                    <TableCell align="right">
                      <IconButton aria-label="Redigera" size="small" onClick={() => openEdit(row)}>
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        aria-label="Ta bort"
                        size="small"
                        color="error"
                        onClick={() => handleDelete(row.id)}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Stack>
      </CardContent>

      <Dialog open={open} onClose={() => !saving && setOpen(false)} fullWidth maxWidth="md">
        <Box component="form" onSubmit={handleSave}>
          <DialogTitle>
            {editingId ? 'Redigera underleverantör' : 'Ny underleverantör'}
          </DialogTitle>
          <DialogContent>
            <Typography color="text.secondary" sx={{ mb: 2, pt: 1 }}>
              Fält enligt Flik 4. Inklusive inköpsansvarig.
            </Typography>
            <OrgContactFormFields
              form={form}
              onChange={handleChange}
              includePurchasing
              requireContact
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setOpen(false)} disabled={saving}>
              Avbryt
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={saving || !isOrgContactFormValid(form)}
            >
              {saving ? <CircularProgress size={20} color="inherit" /> : 'Spara'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
      {contactDialog}
    </Card>
  )
}
