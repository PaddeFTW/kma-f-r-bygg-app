import { useEffect, useState } from 'react'
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import VerticalLayout from '../../layouts/VerticalLayout'
import { supabase } from '../../lib/supabase'

const statuses = ['öppen', 'pågående', 'klar']

export default function UppgiftDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('öppen')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    let mounted = true

    const load = async () => {
      setLoading(true)
      setError('')
      const { data, error: fetchError } = await supabase.from('uppgifter').select('*').eq('id', id).single()

      if (!mounted) return

      if (fetchError) {
        setError(fetchError.message)
        setItem(null)
      } else {
        setItem(data)
        setTitle(data.title || '')
        setDescription(data.description || '')
        setStatus(data.status || 'öppen')
      }
      setLoading(false)
    }

    load()
    return () => {
      mounted = false
    }
  }, [id])

  const handleSave = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    setSaved(false)

    const { data, error: updateError } = await supabase
      .from('uppgifter')
      .update({
        title: title.trim(),
        description: description.trim() || null,
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    setSaving(false)

    if (updateError) {
      setError(updateError.message)
      return
    }

    setItem(data)
    setSaved(true)
  }

  const handleDelete = async () => {
    const { error: deleteError } = await supabase.from('uppgifter').delete().eq('id', id)
    if (deleteError) {
      setError(deleteError.message)
      return
    }
    navigate('/uppgifter')
  }

  return (
    <VerticalLayout>
      <Stack spacing={3} sx={{ maxWidth: 720 }}>
        <Button
          component={RouterLink}
          to="/uppgifter"
          startIcon={<ArrowBackIcon />}
          sx={{ alignSelf: 'flex-start' }}
        >
          Tillbaka till listan
        </Button>

        {loading ? (
          <Box sx={{ py: 6, display: 'grid', placeItems: 'center' }}>
            <CircularProgress />
          </Box>
        ) : !item ? (
          <Alert severity="error">{error || 'Uppgiften hittades inte.'}</Alert>
        ) : (
          <Card>
            <CardContent>
              <Stack component="form" spacing={3} onSubmit={handleSave}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    Uppgiftsdetalj
                  </Typography>
                  <Typography color="text.secondary">
                    Ändringar sparas till tabellen <code>uppgifter</code> i Supabase.
                  </Typography>
                </Box>

                {error && <Alert severity="error">{error}</Alert>}
                {saved && <Alert severity="success">Sparat.</Alert>}

                <TextField
                  label="Titel"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  fullWidth
                />
                <TextField
                  label="Beskrivning"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  fullWidth
                  multiline
                  minRows={4}
                />
                <TextField
                  select
                  label="Status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  fullWidth
                >
                  {statuses.map((value) => (
                    <MenuItem key={value} value={value}>
                      {value}
                    </MenuItem>
                  ))}
                </TextField>

                <Stack direction="row" spacing={1.5} justifyContent="space-between" flexWrap="wrap">
                  <Button color="error" variant="outlined" onClick={handleDelete} disabled={saving}>
                    Ta bort
                  </Button>
                  <Button type="submit" variant="contained" disabled={saving || !title.trim()}>
                    {saving ? <CircularProgress size={20} color="inherit" /> : 'Spara'}
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        )}
      </Stack>
    </VerticalLayout>
  )
}
