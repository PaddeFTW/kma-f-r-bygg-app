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
import { buildAmpPrefillFromRisker, rowsRequireAmp } from '../../lib/sarskildaRisker'

export default function ArbetsmiljoplanerList() {
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
      .from('arbetsmiljoplaner')
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
    if (!company?.id || !projectId) return

    setSaving(true)
    setError('')

    if (templateId) {
      try {
        const templates = await listTemplates(company.id, { scope: 'flik', flikNr: 7 })
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
        if (result.firstId) navigate(`/arbetsmiljoplan/${result.firstId}`)
        else navigate('/arbetsmiljoplan')
      } catch (err) {
        setError(err.message)
      } finally {
        setSaving(false)
      }
      return
    }


    const { data: riskRows } = await supabase
      .from('project_sarskilda_risker')
      .select('*')
      .eq('project_id', projectId)
      .order('sort_order', { ascending: true })

    const riskbedomning_anteckningar = rowsRequireAmp(riskRows || [])
      ? buildAmpPrefillFromRisker(riskRows || [])
      : null

    const { data, error: insertError } = await supabase
      .from('arbetsmiljoplaner')
      .insert({
        user_id: user.id,
        company_id: company.id,
        project_id: projectId,
        riskbedomning_anteckningar,
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
    navigate(`/arbetsmiljoplan/${data.id}`)
  }

  const handleDelete = async (id) => {
    setError('')
    const { error: deleteError } = await supabase.from('arbetsmiljoplaner').delete().eq('id', id)
    if (deleteError) setError(deleteError.message)
    else setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const openCreate = () => {
    setProjectId(filterProjectId || '')
    setTemplateId('')
    setOpen(true)
  }

  return (
    <VerticalLayout>
      <Stack spacing={3}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              Arbetsmiljöplaner
            </Typography>
            <Typography color="text.secondary">
              Flik 7 – arbetsmiljöplan (AMP) kopplad till projekt
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openCreate}
            disabled={!company || projects.length === 0}
          >
            Ny arbetsmiljöplan
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
                  Inga arbetsmiljöplaner ännu. Skapa den första.
                </Typography>
              </Box>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Projekt</TableCell>
                    <TableCell>Uppdaterad</TableCell>
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
                      onClick={() => navigate(`/arbetsmiljoplan/${item.id}`)}
                    >
                      <TableCell>
                        <Typography fontWeight={500}>{projectLabel(item.project_id)}</Typography>
                      </TableCell>
                      <TableCell>{new Date(item.updated_at).toLocaleString('sv-SE')}</TableCell>
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
                        <Button component={RouterLink} to={`/arbetsmiljoplan/${item.id}`} size="small">
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
          <DialogTitle>Ny arbetsmiljöplan</DialogTitle>
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
                flikNr={7}
                value={templateId}
                onChange={setTemplateId}
                disabled={saving}
              />
              <Typography variant="body2" color="text.secondary">
                Avsnitten fylls i på nästa sida (policy, ordningsregler, samordning m.m.).
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
