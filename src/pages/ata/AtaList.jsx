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
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import VerticalLayout from '../../layouts/VerticalLayout'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'

const TABS = [
  { key: 'avvikelser', label: 'Avvikelserapport', table: 'avvikelser', detailPath: '/ata/avvikelser' },
  { key: 'ata', label: 'ÄTA', table: 'ata', detailPath: '/ata/ata' },
  { key: 'ata-lista', label: 'ÄTA-lista', table: 'ata_lista', detailPath: '/ata/ata-lista' },
]

function formatDatum(value) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('sv-SE')
}

function formatBool(value) {
  if (value == null) return '—'
  return value ? 'Ja' : 'Nej'
}

function truncate(value, max = 60) {
  if (!value) return '—'
  return value.length > max ? `${value.slice(0, max)}…` : value
}

export default function AtaList() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const filterProjectId = searchParams.get('project') || ''
  const tabKey = searchParams.get('tab') || 'avvikelser'
  const activeTab = TABS.find((t) => t.key === tabKey) || TABS[0]

  const [company, setCompany] = useState(null)
  const [projects, setProjects] = useState([])
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)
  const [projectId, setProjectId] = useState('')
  const [createLabel, setCreateLabel] = useState('')
  const [saving, setSaving] = useState(false)

  const projectLabel = useMemo(() => {
    const map = new Map(projects.map((p) => [p.id, p.property_designation]))
    return (id) => map.get(id) || 'Okänt projekt'
  }, [projects])

  const setParams = (next) => {
    const params = new URLSearchParams(searchParams)
    Object.entries(next).forEach(([key, value]) => {
      if (value) params.set(key, value)
      else params.delete(key)
    })
    setSearchParams(params)
  }

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
      .from(activeTab.table)
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
  }, [user?.id, filterProjectId, activeTab.key])

  const openCreate = () => {
    setProjectId(filterProjectId || '')
    setCreateLabel('')
    setOpen(true)
  }

  const handleCreate = async (event) => {
    event.preventDefault()
    if (!company?.id || !projectId) return

    setSaving(true)
    setError('')

    const insert =
      activeTab.key === 'avvikelser'
        ? { ordernr: createLabel.trim() || null }
        : activeTab.key === 'ata'
          ? { ordernr: createLabel.trim() || null }
          : { nr: createLabel.trim() || null }

    const { data, error: insertError } = await supabase
      .from(activeTab.table)
      .insert({
        user_id: user.id,
        company_id: company.id,
        project_id: projectId,
        ...insert,
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
    setCreateLabel('')
    navigate(`${activeTab.detailPath}/${data.id}`)
  }

  const handleDelete = async (id) => {
    setError('')
    const { error: deleteError } = await supabase.from(activeTab.table).delete().eq('id', id)
    if (deleteError) setError(deleteError.message)
    else setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const createFieldLabel =
    activeTab.key === 'ata-lista' ? 'Nr' : 'Ordernr'

  const emptyText =
    activeTab.key === 'avvikelser'
      ? 'Inga avvikelserapporter ännu. Lägg till den första.'
      : activeTab.key === 'ata'
        ? 'Inga ÄTA ännu. Lägg till den första.'
        : 'Ingen ÄTA-lista ännu. Lägg till den första.'

  return (
    <VerticalLayout>
      <Stack spacing={3}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              ÄTA / Avvikelse
            </Typography>
            <Typography color="text.secondary">
              Flik 16 – avvikelserapport, ÄTA och ÄTA-lista
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

        <Tabs
          value={activeTab.key}
          onChange={(_, value) => setParams({ tab: value })}
          variant="scrollable"
          allowScrollButtonsMobile
        >
          {TABS.map((tab) => (
            <Tab key={tab.key} value={tab.key} label={tab.label} />
          ))}
        </Tabs>

        {company && projects.length > 0 && (
          <TextField
            select
            label="Filtrera på projekt"
            value={filterProjectId}
            onChange={(e) => setParams({ project: e.target.value || null })}
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
                <Typography color="text.secondary">{emptyText}</Typography>
              </Box>
            ) : activeTab.key === 'avvikelser' ? (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Ordernr</TableCell>
                    <TableCell>Datum</TableCell>
                    <TableCell>Inlämnat av</TableCell>
                    <TableCell>Beskrivning</TableCell>
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
                      onClick={() => navigate(`${activeTab.detailPath}/${item.id}`)}
                    >
                      <TableCell>
                        <Typography fontWeight={500}>{item.ordernr || '—'}</Typography>
                      </TableCell>
                      <TableCell>{formatDatum(item.datum)}</TableCell>
                      <TableCell>{item.inlamnat_av || '—'}</TableCell>
                      <TableCell>{truncate(item.beskrivning)}</TableCell>
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
                        <Button component={RouterLink} to={`${activeTab.detailPath}/${item.id}`} size="small">
                          Öppna
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : activeTab.key === 'ata' ? (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Ordernr</TableCell>
                    <TableCell>Objekt</TableCell>
                    <TableCell>Rapportör</TableCell>
                    <TableCell>Pris</TableCell>
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
                      onClick={() => navigate(`${activeTab.detailPath}/${item.id}`)}
                    >
                      <TableCell>
                        <Typography fontWeight={500}>{item.ordernr || '—'}</Typography>
                      </TableCell>
                      <TableCell>{truncate(item.objekt)}</TableCell>
                      <TableCell>{item.rapportor || '—'}</TableCell>
                      <TableCell>
                        {item.pris_modell === 'fast_pris'
                          ? 'Fast pris'
                          : item.pris_modell === 'lopande_rakning'
                            ? 'Löpande räkning'
                            : '—'}
                      </TableCell>
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
                        <Button component={RouterLink} to={`${activeTab.detailPath}/${item.id}`} size="small">
                          Öppna
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nr</TableCell>
                    <TableCell>Datum</TableCell>
                    <TableCell>Beskrivning</TableCell>
                    <TableCell>Beställd</TableCell>
                    <TableCell>Summa</TableCell>
                    <TableCell>Fakturerad</TableCell>
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
                      onClick={() => navigate(`${activeTab.detailPath}/${item.id}`)}
                    >
                      <TableCell>
                        <Typography fontWeight={500}>{item.nr || '—'}</Typography>
                      </TableCell>
                      <TableCell>{formatDatum(item.datum)}</TableCell>
                      <TableCell>{truncate(item.beskrivning)}</TableCell>
                      <TableCell>
                        {item.bestalld == null ? '—' : item.bestalld ? 'Beställd' : 'Icke'}
                      </TableCell>
                      <TableCell>{item.summa != null ? item.summa : '—'}</TableCell>
                      <TableCell>{formatBool(item.fakturerad)}</TableCell>
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
                        <Button component={RouterLink} to={`${activeTab.detailPath}/${item.id}`} size="small">
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
          <DialogTitle>Ny {activeTab.label.toLowerCase()}</DialogTitle>
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
              <TextField
                label={createFieldLabel}
                value={createLabel}
                onChange={(e) => setCreateLabel(e.target.value)}
                fullWidth
              />
              <Typography variant="body2" color="text.secondary">
                Övriga fält fylls i på nästa sida.
              </Typography>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setOpen(false)} disabled={saving}>
              Avbryt
            </Button>
            <Button type="submit" variant="contained" disabled={saving || !projectId}>
              {saving ? <CircularProgress size={20} color="inherit" /> : 'Skapa'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </VerticalLayout>
  )
}
