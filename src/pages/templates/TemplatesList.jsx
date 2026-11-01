import { useEffect, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
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
  TextField,
  Typography,
} from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import VerticalLayout from '../../layouts/VerticalLayout'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import {
  deleteTemplate,
  listTemplates,
  renameTemplate,
  templateScopeLabel,
} from '../../lib/projectTemplates'

export default function TemplatesList() {
  const { user } = useAuth()
  const [company, setCompany] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [renameOpen, setRenameOpen] = useState(false)
  const [renameTarget, setRenameTarget] = useState(null)
  const [renameValue, setRenameValue] = useState('')
  const [busy, setBusy] = useState(false)

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

    try {
      const rows = await listTemplates(companyData.id)
      setItems(rows)
    } catch (err) {
      setError(err.message)
      setItems([])
    }
    setLoading(false)
  }

  useEffect(() => {
    if (user?.id) load()
  }, [user?.id])

  const openRename = (item) => {
    setRenameTarget(item)
    setRenameValue(item.name)
    setRenameOpen(true)
  }

  const handleRename = async (event) => {
    event.preventDefault()
    if (!renameTarget) return
    setBusy(true)
    setError('')
    try {
      const updated = await renameTemplate(renameTarget.id, renameValue)
      setItems((prev) => prev.map((row) => (row.id === updated.id ? updated : row)))
      setRenameOpen(false)
      setRenameTarget(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const handleDelete = async (id) => {
    setError('')
    try {
      await deleteTemplate(id)
      setItems((prev) => prev.filter((row) => row.id !== id))
    } catch (err) {
      setError(err.message)
    }
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
              Mallar
            </Typography>
            <Typography color="text.secondary">
              Återanvändbara projekt- och flikmallar för ditt företag
            </Typography>
          </Box>
          <Button component={RouterLink} to="/projects" variant="outlined">
            Till projekt
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
            Skapa ett företagskonto innan du sparar mallar.
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
                  Inga mallar ännu. Spara från ett projekt eller en flik via ”Spara som mall”.
                </Typography>
              </Box>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Namn</TableCell>
                    <TableCell>Typ</TableCell>
                    <TableCell>Beskrivning</TableCell>
                    <TableCell>Uppdaterad</TableCell>
                    <TableCell align="right">Åtgärder</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell>
                        <Typography fontWeight={500}>{item.name}</Typography>
                      </TableCell>
                      <TableCell>{templateScopeLabel(item)}</TableCell>
                      <TableCell>{item.description || '—'}</TableCell>
                      <TableCell>
                        {new Date(item.updated_at).toLocaleString('sv-SE')}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          aria-label="Byt namn"
                          size="small"
                          onClick={() => openRename(item)}
                        >
                          <EditOutlinedIcon />
                        </IconButton>
                        <IconButton
                          aria-label="Ta bort"
                          size="small"
                          color="error"
                          onClick={() => handleDelete(item.id)}
                        >
                          <DeleteOutlineIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </Stack>

      <Dialog open={renameOpen} onClose={() => !busy && setRenameOpen(false)} fullWidth maxWidth="sm">
        <Box component="form" onSubmit={handleRename}>
          <DialogTitle>Byt namn på mall</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              label="Namn"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              fullWidth
              required
              sx={{ mt: 1 }}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setRenameOpen(false)} disabled={busy}>
              Avbryt
            </Button>
            <Button type="submit" variant="contained" disabled={busy || !renameValue.trim()}>
              {busy ? <CircularProgress size={20} color="inherit" /> : 'Spara'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </VerticalLayout>
  )
}
