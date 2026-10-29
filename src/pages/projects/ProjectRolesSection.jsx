import { useEffect, useMemo, useState } from 'react'
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
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import {
  emptyProjectRoleForm,
  projectRoleTitles,
  requiredProjectRoleTitles,
} from '../../lib/types'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'

/**
 * Flik 2 – Roller och ansvar.
 * Samma person kan ha flera roller.
 */
export default function ProjectRolesSection({ projectId, companyId }) {
  const { user } = useAuth()
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyProjectRoleForm)

  const load = async () => {
    setLoading(true)
    setError('')
    const { data, error: fetchError } = await supabase
      .from('project_roles')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true })

    if (fetchError) setError(fetchError.message)
    else setRoles(data || [])
    setLoading(false)
  }

  useEffect(() => {
    if (projectId) load()
  }, [projectId])

  const missingRequired = useMemo(() => {
    const present = new Set(roles.map((r) => r.role_title))
    return requiredProjectRoleTitles.filter((title) => !present.has(title))
  }, [roles])

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const openCreate = (presetTitle = '') => {
    setEditingId(null)
    setForm({ ...emptyProjectRoleForm, role_title: presetTitle })
    setOpen(true)
  }

  const openEdit = (role) => {
    setEditingId(role.id)
    setForm({
      role_title: role.role_title || '',
      name: role.name || '',
      phone: role.phone || '',
      email: role.email || '',
      responsibility_area: role.responsibility_area || '',
    })
    setOpen(true)
  }

  const handleSave = async (event) => {
    event.preventDefault()
    if (!form.role_title.trim() || !form.name.trim()) return

    setSaving(true)
    setError('')

    const payload = {
      role_title: form.role_title.trim(),
      name: form.name.trim(),
      phone: form.phone.trim() || null,
      email: form.email.trim() || null,
      responsibility_area: form.responsibility_area.trim() || null,
      updated_at: new Date().toISOString(),
    }

    let saveError
    if (editingId) {
      const { error: updateError } = await supabase
        .from('project_roles')
        .update(payload)
        .eq('id', editingId)
      saveError = updateError
    } else {
      const { error: insertError } = await supabase.from('project_roles').insert({
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
    setForm({ ...emptyProjectRoleForm })
    setEditingId(null)
    await load()
  }

  const handleDelete = async (id) => {
    setError('')
    const { error: deleteError } = await supabase.from('project_roles').delete().eq('id', id)
    if (deleteError) setError(deleteError.message)
    else setRoles((prev) => prev.filter((r) => r.id !== id))
  }

  return (
    <Card>
      <CardContent sx={{ p: 5, '&:last-child': { pb: 5 } }}>
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Roller och ansvar
              </Typography>
              <Typography color="text.secondary">
                Flik 2 – Organisation. Samma person kan ha flera roller.
              </Typography>
            </Box>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => openCreate()}>
              Lägg till roll
            </Button>
          </Box>

          {error && <Alert severity="error">{error}</Alert>}

          {missingRequired.length > 0 && (
            <Alert severity="info">
              Saknas ännu: {missingRequired.join(', ')}. Lägg till minst dessa roller enligt
              underlaget.
              <Box sx={{ mt: 1.5, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {missingRequired.map((title) => (
                  <Button key={title} size="small" variant="outlined" onClick={() => openCreate(title)}>
                    {title}
                  </Button>
                ))}
              </Box>
            </Alert>
          )}

          {loading ? (
            <Box sx={{ py: 4, display: 'grid', placeItems: 'center' }}>
              <CircularProgress />
            </Box>
          ) : roles.length === 0 ? (
            <Typography color="text.secondary">Inga roller ännu. Lägg till den första.</Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Roll</TableCell>
                  <TableCell>Namn</TableCell>
                  <TableCell>Mobil</TableCell>
                  <TableCell>E-post</TableCell>
                  <TableCell>Ansvarsområde</TableCell>
                  <TableCell align="right">Åtgärder</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.id} hover>
                    <TableCell>
                      <Typography fontWeight={500}>{role.role_title}</Typography>
                    </TableCell>
                    <TableCell>{role.name}</TableCell>
                    <TableCell>{role.phone || '—'}</TableCell>
                    <TableCell>{role.email || '—'}</TableCell>
                    <TableCell>{role.responsibility_area || '—'}</TableCell>
                    <TableCell align="right">
                      <IconButton aria-label="Redigera" size="small" onClick={() => openEdit(role)}>
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        aria-label="Ta bort"
                        size="small"
                        color="error"
                        onClick={() => handleDelete(role.id)}
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

      <Dialog open={open} onClose={() => !saving && setOpen(false)} fullWidth maxWidth="sm">
        <Box component="form" onSubmit={handleSave}>
          <DialogTitle>{editingId ? 'Redigera roll' : 'Ny roll'}</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ pt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  select
                  label="Roll"
                  value={form.role_title}
                  onChange={handleChange('role_title')}
                  required
                  fullWidth
                >
                  <MenuItem value="">
                    <em>Välj…</em>
                  </MenuItem>
                  {projectRoleTitles.map((title) => (
                    <MenuItem key={title} value={title}>
                      {title}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Namn"
                  value={form.name}
                  onChange={handleChange('name')}
                  required
                  fullWidth
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Mobil" value={form.phone} onChange={handleChange('phone')} fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="E-post"
                  type="email"
                  value={form.email}
                  onChange={handleChange('email')}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Ansvarsområde"
                  value={form.responsibility_area}
                  onChange={handleChange('responsibility_area')}
                  fullWidth
                  multiline
                  minRows={2}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setOpen(false)} disabled={saving}>
              Avbryt
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={saving || !form.role_title.trim() || !form.name.trim()}
            >
              {saving ? <CircularProgress size={20} color="inherit" /> : 'Spara'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Card>
  )
}
