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
  Link,
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
  competenceRoleTitles,
  emptyProjectRoleForm,
  projectRoleTitles,
  requiredProjectRoleTitles,
} from '../../lib/types'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { KB_AFS_2023_3_URL } from '../../lib/sarskildaRisker'

/**
 * Flik 2 – Roller och ansvar (inkl. Bas-P / Bas-U med kompetens & intyg).
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
  const [certFile, setCertFile] = useState(null)

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

  const showCompetence = competenceRoleTitles.includes(form.role_title)

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const openCreate = (presetTitle = '') => {
    setEditingId(null)
    setForm({ ...emptyProjectRoleForm, role_title: presetTitle })
    setCertFile(null)
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
      competence: role.competence || '',
      education: role.education || '',
      cert_file_path: role.cert_file_path || '',
      cert_file_name: role.cert_file_name || '',
    })
    setCertFile(null)
    setOpen(true)
  }

  const uploadCert = async (roleId) => {
    if (!certFile) return { path: form.cert_file_path || null, name: form.cert_file_name || null }

    const safeName = certFile.name.replace(/[^\w.\-åäöÅÄÖ ]+/gi, '_')
    const path = `${user.id}/${projectId}/${roleId}/${Date.now()}-${safeName}`
    const { error: uploadError } = await supabase.storage
      .from('kompetensbevis')
      .upload(path, certFile, { upsert: false })
    if (uploadError) throw new Error(uploadError.message)

    if (form.cert_file_path) {
      await supabase.storage.from('kompetensbevis').remove([form.cert_file_path])
    }

    return { path, name: certFile.name }
  }

  const handleSave = async (event) => {
    event.preventDefault()
    if (!form.role_title.trim() || !form.name.trim()) return

    setSaving(true)
    setError('')

    try {
      const basePayload = {
        role_title: form.role_title.trim(),
        name: form.name.trim(),
        phone: form.phone.trim() || null,
        email: form.email.trim() || null,
        responsibility_area: form.responsibility_area.trim() || null,
        competence: form.competence.trim() || null,
        education: form.education.trim() || null,
        updated_at: new Date().toISOString(),
      }

      let roleId = editingId

      if (editingId) {
        const { error: updateError } = await supabase
          .from('project_roles')
          .update(basePayload)
          .eq('id', editingId)
        if (updateError) throw new Error(updateError.message)
      } else {
        const { data, error: insertError } = await supabase
          .from('project_roles')
          .insert({
            ...basePayload,
            user_id: user.id,
            company_id: companyId,
            project_id: projectId,
          })
          .select()
          .single()
        if (insertError) throw new Error(insertError.message)
        roleId = data.id
      }

      if (certFile && roleId) {
        const uploaded = await uploadCert(roleId)
        const { error: certError } = await supabase
          .from('project_roles')
          .update({
            cert_file_path: uploaded.path,
            cert_file_name: uploaded.name,
            updated_at: new Date().toISOString(),
          })
          .eq('id', roleId)
        if (certError) throw new Error(certError.message)
      }

      setOpen(false)
      setForm({ ...emptyProjectRoleForm })
      setEditingId(null)
      setCertFile(null)
      await load()
    } catch (err) {
      setError(
        err.message?.includes('competence') || err.message?.includes('cert_file')
          ? 'Rollfält för kompetens saknas. Kör migration 032_bas_sarskilda_risker.sql.'
          : err.message || 'Kunde inte spara rollen.',
      )
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (role) => {
    setError('')
    if (role.cert_file_path) {
      await supabase.storage.from('kompetensbevis').remove([role.cert_file_path])
    }
    const { error: deleteError } = await supabase.from('project_roles').delete().eq('id', role.id)
    if (deleteError) setError(deleteError.message)
    else setRoles((prev) => prev.filter((item) => item.id !== role.id))
  }

  const openCert = async (role) => {
    if (!role.cert_file_path) return
    const { data, error: signedError } = await supabase.storage
      .from('kompetensbevis')
      .createSignedUrl(role.cert_file_path, 3600)
    if (signedError) {
      setError(signedError.message)
      return
    }
    window.open(data.signedUrl, '_blank', 'noopener,noreferrer')
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
                Flik 2 – Organisation. Bas-P och Bas-U är obligatoriska enligt AFS 2023:3.{' '}
                <Link href={KB_AFS_2023_3_URL} target="_blank" rel="noopener noreferrer">
                  Knowledge base
                </Link>
              </Typography>
            </Box>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => openCreate()}>
              Lägg till roll
            </Button>
          </Box>

          {error && <Alert severity="error">{error}</Alert>}

          {missingRequired.length > 0 && (
            <Alert severity="info">
              Saknas ännu: {missingRequired.join(', ')}. Lägg till minst dessa roller.
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
                  <TableCell>Kompetens</TableCell>
                  <TableCell>Intyg</TableCell>
                  <TableCell>Mobil</TableCell>
                  <TableCell>E-post</TableCell>
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
                    <TableCell>{role.competence || role.education || '—'}</TableCell>
                    <TableCell>
                      {role.cert_file_name ? (
                        <Button size="small" onClick={() => openCert(role)}>
                          {role.cert_file_name}
                        </Button>
                      ) : (
                        '—'
                      )}
                    </TableCell>
                    <TableCell>{role.phone || '—'}</TableCell>
                    <TableCell>{role.email || '—'}</TableCell>
                    <TableCell align="right">
                      <IconButton aria-label="Redigera" size="small" onClick={() => openEdit(role)}>
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        aria-label="Ta bort"
                        size="small"
                        color="error"
                        onClick={() => handleDelete(role)}
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

              {showCompetence ? (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Kompetens"
                      value={form.competence}
                      onChange={handleChange('competence')}
                      fullWidth
                      placeholder="T.ex. Bas-P/U utbildning"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Utbildning"
                      value={form.education}
                      onChange={handleChange('education')}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant="outlined" component="label">
                      Bifoga intyg
                      <input
                        type="file"
                        hidden
                        onChange={(e) => setCertFile(e.target.files?.[0] || null)}
                      />
                    </Button>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {certFile?.name || form.cert_file_name || 'Ingen fil vald'}
                    </Typography>
                  </Grid>
                </>
              ) : null}
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
