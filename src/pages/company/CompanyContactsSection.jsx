import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { supabase } from '../../lib/supabase'
import { loadCompanyContacts } from '../../lib/companyContacts'

/** Visar företagets återanvändbara kontaktlista. */
export default function CompanyContactsSection({ companyId }) {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    if (!companyId) {
      setContacts([])
      setLoading(false)
      return
    }
    setLoading(true)
    setError('')
    try {
      const rows = await loadCompanyContacts(companyId)
      setContacts(rows)
    } catch (err) {
      setError(
        err.message?.includes('company_contacts')
          ? 'Kontaktlistan saknas. Kör migration 033_company_contacts.sql.'
          : err.message,
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [companyId])

  const handleDelete = async (id) => {
    setError('')
    const { error: deleteError } = await supabase.from('company_contacts').delete().eq('id', id)
    if (deleteError) setError(deleteError.message)
    else setContacts((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <Card>
      <CardContent sx={{ p: 5, '&:last-child': { pb: 5 } }}>
        <Stack spacing={2}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Kontaktlista
            </Typography>
            <Typography color="text.secondary">
              Återanvändbara kontakter från roller, beställare och UE. Används i autocomplete och
              export/inbjudan.
            </Typography>
          </Box>

          {error && <Alert severity="error">{error}</Alert>}

          {loading ? (
            <Box sx={{ py: 3, display: 'grid', placeItems: 'center' }}>
              <CircularProgress />
            </Box>
          ) : contacts.length === 0 ? (
            <Typography color="text.secondary">
              Inga sparade kontakter ännu. När du sparar en roll/UE kan du välja att lägga till dem
              här.
            </Typography>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Namn</TableCell>
                  <TableCell>Roll</TableCell>
                  <TableCell>Företag</TableCell>
                  <TableCell>E-post</TableCell>
                  <TableCell>Telefon</TableCell>
                  <TableCell align="right">Ta bort</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {contacts.map((c) => (
                  <TableRow key={c.id} hover>
                    <TableCell>{c.name}</TableCell>
                    <TableCell>{c.role || '—'}</TableCell>
                    <TableCell>{c.company_name || '—'}</TableCell>
                    <TableCell>{c.email || '—'}</TableCell>
                    <TableCell>{c.phone || '—'}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        aria-label="Ta bort kontakt"
                        size="small"
                        color="error"
                        onClick={() => handleDelete(c.id)}
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
    </Card>
  )
}
