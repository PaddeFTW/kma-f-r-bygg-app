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

export default function MaskinerUeList() {
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
  const [underleverantor, setUnderleverantor] = useState('')
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
      .from('maskiner_ue')
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
    if (!company?.id || !projectId || !underleverantor.trim()) return

    setSaving(true)
    setError('')

    if (templateId) {
      try {
        const templates = await listTemplates(company.id, { scope: 'flik', flikNr: 15 })
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
        if (result.firstId) navigate(`/maskiner-ue/${result.firstId}`)
        else navigate('/maskiner-ue')
      } catch (err) {
        setError(err.message)
      } finally {
        setSaving(false)
      }
      return
    }


    const { data, error: insertError } = await supabase
      .from('maskiner_ue')
      .insert({
        user_id: user.id,
        company_id: company.id,
        project_id: projectId,
        underleverantor: underleverantor.trim(),
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
    setUnderleverantor('')
    navigate(`/maskiner-ue/${data.id}`)
  }

  const handleDelete = async (id) => {
    setError('')
    const { error: deleteError } = await supabase.from('maskiner_ue').delete().eq('id', id)
    if (deleteError) setError(deleteError.message)
    else setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const openCreate = () => {
    setProjectId(filterProjectId || '')
    setUnderleverantor('')
    setTemplateId('')
    setOpen(true)
  }

  const formatDatum = (value) => {
    if (!value) return '—'
    return new Date(value).toLocaleDateString('sv-SE')
  }

  return (
    <VerticalLayout>
      <Stack spacing={3}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              Inventering av maskiner för UE
            </Typography>
            <Typography color="text.secondary">
              Flik 15 – lista över maskiner/fordon från underleverantörer
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openCreate}
            disabled={!company || projects.length === 0}
          >
            Ny post
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
                  Ingen inventering ännu. Lägg till den första.
                </Typography>
              </Box>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Underleverantör</TableCell>
                    <TableCell>Maskiner</TableCell>
                    <TableCell>Datum</TableCell>
                    <TableCell>Projekt</TableCell>
                    <TableCell align="right">Åtgärder</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item) => (
                    <TableRow
                      key={item.id}
                      hover
                      sx={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/maskiner-ue/${item.id}`)}
                    >
                      <TableCell>
                        <Typography fontWeight={500}>{item.underleverantor}</Typography>
                      </TableCell>
                      <TableCell>
                        {item.maskiner
                          ? item.maskiner.length > 60
                            ? `${item.maskiner.slice(0, 60)}…`
                            : item.maskiner
                          : '—'}
                      </TableCell>
                      <TableCell>{formatDatum(item.datum)}</TableCell>
                      <TableCell>{projectLabel(item.project_id)}</TableCell>
                      <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                        <IconButton
                          aria-label="Ta bort"
                          onClick={() => handleDelete(item.id)}
                          color="error"
                          size="small"
                        >
                          <DeleteOutlineIcon />
                        </IconButton>
                        <Button component={RouterLink} to={`/maskiner-ue/${item.id}`} size="small">
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
          <DialogTitle>Ny inventering av maskiner</DialogTitle>
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
                flikNr={15}
                value={templateId}
                onChange={setTemplateId}
                disabled={saving}
              />
              <TextField
                label="Underleverantör"
                value={underleverantor}
                onChange={(e) => setUnderleverantor(e.target.value)}
                required
                fullWidth
              />
              <Typography variant="body2" color="text.secondary">
                Maskiner och datum fylls i på nästa sida.
              </Typography>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setOpen(false)} disabled={saving}>
              Avbryt
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={saving || !projectId || !underleverantor.trim()}
            >
              {saving ? <CircularProgress size={20} color="inherit" /> : 'Skapa'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </VerticalLayout>
  )
}
