import { useEffect, useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
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
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import VerticalLayout from '../../layouts/VerticalLayout'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'

const statusColor = {
  öppen: 'warning',
  pågående: 'info',
  klar: 'success',
}

export default function UppgifterList() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    setError('')
    const { data, error: fetchError } = await supabase
      .from('uppgifter')
      .select('*')
      .order('created_at', { ascending: false })

    if (fetchError) setError(fetchError.message)
    else setItems(data || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const handleCreate = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')

    const { data, error: insertError } = await supabase
      .from('uppgifter')
      .insert({
        title: title.trim(),
        description: description.trim() || null,
        status: 'öppen',
        user_id: user.id,
      })
      .select()
      .single()

    setSaving(false)

    if (insertError) {
      setError(insertError.message)
      return
    }

    setOpen(false)
    setTitle('')
    setDescription('')
    navigate(`/uppgifter/${data.id}`)
  }

  const handleDelete = async (id) => {
    setError('')
    const { error: deleteError } = await supabase.from('uppgifter').delete().eq('id', id)
    if (deleteError) setError(deleteError.message)
    else setItems((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <VerticalLayout>
      <Stack spacing={3}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              Uppgifter
            </Typography>
            <Typography color="text.secondary">Lista och detaljsida som sparar till Supabase</Typography>
          </Box>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
            Ny uppgift
          </Button>
        </Box>

        {error && <Alert severity="error">{error}</Alert>}

        <Card>
          <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
            {loading ? (
              <Box sx={{ py: 6, display: 'grid', placeItems: 'center' }}>
                <CircularProgress />
              </Box>
            ) : items.length === 0 ? (
              <Box sx={{ py: 6, textAlign: 'center' }}>
                <Typography color="text.secondary">Inga uppgifter ännu. Skapa den första.</Typography>
              </Box>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Titel</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Skapad</TableCell>
                    <TableCell align="right">Åtgärder</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id} hover sx={{ cursor: 'pointer' }} onClick={() => navigate(`/uppgifter/${item.id}`)}>
                      <TableCell>
                        <Typography fontWeight={500}>{item.title}</Typography>
                        {item.description && (
                          <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 360 }}>
                            {item.description}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip size="small" label={item.status} color={statusColor[item.status] || 'default'} />
                      </TableCell>
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
                        <Button component={RouterLink} to={`/uppgifter/${item.id}`} size="small">
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
          <DialogTitle>Ny uppgift</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ pt: 1 }}>
              <TextField
                label="Titel"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                fullWidth
                autoFocus
              />
              <TextField
                label="Beskrivning"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                multiline
                minRows={3}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setOpen(false)} disabled={saving}>
              Avbryt
            </Button>
            <Button type="submit" variant="contained" disabled={saving || !title.trim()}>
              {saving ? <CircularProgress size={20} color="inherit" /> : 'Skapa'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </VerticalLayout>
  )
}
