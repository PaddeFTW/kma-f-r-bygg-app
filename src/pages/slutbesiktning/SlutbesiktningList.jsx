import { useEffect, useMemo, useState } from 'react'
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom'
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
import FlikTemplateSelect from '../../components/templates/FlikTemplateSelect'
import { applyFlikTemplate, listTemplates } from '../../lib/projectTemplates'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'

export default function SlutbesiktningList() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const filterProjectId = searchParams.get('project') || ''

  const [company, setCompany] = useState(null)
  const [projects, setProjects] = useState([])
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)
  const [projectId, setProjectId] = useState('')
  const [namn, setNamn] = useState('')
  const [saving, setSaving] = useState(false)
  const [templateId, setTemplateId] = useState('')

  const projectLabel = useMemo(() => {
    const map = new Map(projects.map((p) => [p.id, p.property_designation]))
    return (id) => map.get(id) || 'Okänt projekt'
  }, [projects])

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
      setProjects([])
      setItems([])
      setLoading(false)
      return
    }

    setCompany(companyData)

    if (!companyData) {
      setProjects([])
      setItems([])
      setLoading(false)
      return
    }

    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .select('id, property_designation')
      .eq('company_id', companyData.id)
      .order('created_at', { ascending: false })

    if (projectError) {
      setError(projectError.message)
      setProjects([])
      setItems([])
      setLoading(false)
      return
    }

    setProjects(projectData || [])

    let query = supabase
      .from('slutbesiktning')
      .select('*')
      .eq('company_id', companyData.id)
      .order('updated_at', { ascending: false })

    if (filterProjectId) {
      query = query.eq('project_id', filterProjectId)
    }

    const { data, error: fetchError } = await query

    if (fetchError) setError(fetchError.message)
    else setItems(data || [])
    setLoading(false)
  }

  useEffect(() => {
    if (user?.id) load()
  }, [user?.id, filterProjectId])

  const handleCreate = async (event) => {
    event.preventDefault()
    if (!company?.id || !projectId || !namn.trim()) return

    setSaving(true)
    setError('')

    if (templateId) {
      try {
        const templates = await listTemplates(company.id, { scope: 'flik', flikNr: 24 })
        const template = templates.find((t) => t.id === templateId)
        if (!template) throw new Error('Mallen hittades inte.')
        const result = await applyFlikTemplate(template, {
          userId: user.id,
          companyId: company.id,
          projectId,
        })
        setOpen(false)
        setProjectId('')
        setTemplateId('')
        if (result.firstId) navigate(`/slutbesiktning/${result.firstId}`)
        else navigate('/slutbesiktning')
      } catch (err) {
        setError(err.message)
      } finally {
        setSaving(false)
      }
      return
    }


    const { data, error: insertError } = await supabase
      .from('slutbesiktning')
      .insert({
        user_id: user.id,
        company_id: company.id,
        project_id: projectId,
        namn: namn.trim(),
      })
      .select()
      .single()

    setSaving(false)

    if (insertError) {
      setError(insertError.message)
      return
    }

    setOpen(false)
    setProjectId('')
    setNamn('')
    navigate(`/slutbesiktning/${data.id}`)
  }

  const handleDelete = async (item) => {
    setError('')

    if (item.file_path) {
      await supabase.storage.from('slutbesiktning').remove([item.file_path])
    }

    const { error: deleteError } = await supabase.from('slutbesiktning').delete().eq('id', item.id)
    if (deleteError) setError(deleteError.message)
    else setItems((prev) => prev.filter((row) => row.id !== item.id))
  }

  const openCreate = () => {
    setProjectId(filterProjectId || '')
    setNamn('')
    setTemplateId('')
    setOpen(true)
  }

  return (
    <VerticalLayout>
      <Stack spacing={3}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              Slutbesiktningsprotokoll
            </Typography>
            <Typography color="text.secondary">
              Flik 24 – dokumentarkiv för besiktningsprotokoll per projekt
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openCreate}
            disabled={!company || projects.length === 0}
          >
            Nytt protokoll
          </Button>
        </Box>

        {error && <Alert severity="error">{error}</Alert>}

        {!company && !loading && (
          <Alert severity="info">
            Skapa först ett företag under{' '}
            <Button color="inherit" size="small" component={RouterLink} to="/company">
              Företag
            </Button>
            .
          </Alert>
        )}

        {company && projects.length === 0 && !loading && (
          <Alert severity="info">
            Skapa först ett projekt under{' '}
            <Button color="inherit" size="small" component={RouterLink} to="/projects">
              Projekt
            </Button>
            .
          </Alert>
        )}

        {company && projects.length > 0 && (
          <TextField
            select
            label="Filtrera på projekt"
            value={filterProjectId}
            onChange={(e) => {
              const value = e.target.value
              if (value) setSearchParams({ project: value })
              else setSearchParams({})
            }}
            sx={{ maxWidth: 360 }}
          >
            <MenuItem value="">Alla projekt</MenuItem>
            {projects.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.property_designation}
              </MenuItem>
            ))}
          </TextField>
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
                  Inga slutbesiktningsprotokoll ännu. Lägg till det första.
                </Typography>
              </Box>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Namn</TableCell>
                    <TableCell>Beskrivning</TableCell>
                    <TableCell>Projekt</TableCell>
                    <TableCell>Fil / länk</TableCell>
                    <TableCell>Uppdaterad</TableCell>
                    <TableCell align="right">Åtgärder</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item) => (
                    <TableRow
                      key={item.id}
                      hover
                      sx={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/slutbesiktning/${item.id}`)}
                    >
                      <TableCell>
                        <Typography fontWeight={500}>{item.namn}</Typography>
                      </TableCell>
                      <TableCell>
                        {item.beskrivning
                          ? item.beskrivning.length > 50
                            ? `${item.beskrivning.slice(0, 50)}…`
                            : item.beskrivning
                          : '—'}
                      </TableCell>
                      <TableCell>{projectLabel(item.project_id)}</TableCell>
                      <TableCell>{item.file_name || item.file_url || '—'}</TableCell>
                      <TableCell>{new Date(item.updated_at).toLocaleString('sv-SE')}</TableCell>
                      <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                        <IconButton
                          aria-label="Ta bort"
                          onClick={() => handleDelete(item)}
                          color="error"
                          size="small"
                        >
                          <DeleteOutlineIcon />
                        </IconButton>
                        <Button component={RouterLink} to={`/slutbesiktning/${item.id}`} size="small">
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

      <Dialog open={open} onClose={() => !saving && setOpen(false)} fullWidth maxWidth="sm">
        <Box component="form" onSubmit={handleCreate}>
          <DialogTitle>Nytt slutbesiktningsprotokoll</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ pt: 1 }}>
              <TextField
                select
                label="Projekt"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                required
                fullWidth
                autoFocus
              >
                {projects.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.property_designation}
                  </MenuItem>
                ))}
              </TextField>
              <FlikTemplateSelect
                companyId={company?.id}
                flikNr={24}
                value={templateId}
                onChange={setTemplateId}
                disabled={saving}
              />
              <TextField
                label="Namn"
                value={namn}
                onChange={(e) => setNamn(e.target.value)}
                required
                fullWidth
                placeholder="t.ex. Slutbesiktningsprotokoll"
              />
              <Typography variant="body2" color="text.secondary">
                Beskrivning, filuppladdning eller länk fylls i på nästa sida.
              </Typography>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setOpen(false)} disabled={saving}>
              Avbryt
            </Button>
            <Button type="submit" variant="contained" disabled={saving || !projectId || !namn.trim()}>
              {saving ? <CircularProgress size={20} color="inherit" /> : 'Skapa'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </VerticalLayout>
  )
}
