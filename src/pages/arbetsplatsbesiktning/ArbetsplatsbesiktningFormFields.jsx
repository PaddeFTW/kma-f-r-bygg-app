import {
  Alert,
  Box,
  Button,
  Grid,
  IconButton,
  MenuItem,
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
import { ARBETSPLATSBESIKTNING_STATUS_OPTIONS } from '../../lib/types'

function SectionTitle({ children, helper }) {
  return (
    <Grid item xs={12}>
      <Typography variant="h6" sx={{ fontWeight: 600, mt: 1 }}>
        {children}
      </Typography>
      {helper && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {helper}
        </Typography>
      )}
    </Grid>
  )
}

/**
 * Flik 23 – Arbetsplatsbesiktning.
 * Kontrollmoment enligt docs/kma-underlag/flikar-22-31-uppfoljning-avslut.md.
 */
export default function ArbetsplatsbesiktningFormFields({
  form,
  onRadChange,
  onAddRad,
  onRemoveRad,
}) {
  return (
    <Grid container spacing={2}>
      <SectionTitle helper="Förbesiktning av arbetsplatsen.">
        Kontrollmoment
      </SectionTitle>
      <Grid item xs={12}>
        <Alert severity="info" sx={{ mb: 1.5 }}>
          1 = Kontrollerat och godkänt · 2 = Kontrollerat och ej godkänt · 3 = Ej kontrollerat
        </Alert>
        <Box sx={{ overflowX: 'auto', border: 1, borderColor: 'divider', borderRadius: 1 }}>
          <Table size="small" sx={{ minWidth: 640 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ minWidth: 280 }}>Kontrollmoment</TableCell>
                <TableCell sx={{ minWidth: 240 }}>Status (1/2/3)</TableCell>
                <TableCell align="right" sx={{ width: 48 }} />
              </TableRow>
            </TableHead>
            <TableBody>
              {form.rader.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3}>
                    <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
                      Inga kontrollmoment. Lägg till en rad.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                form.rader.map((rad) => (
                  <TableRow key={rad._key}>
                    <TableCell>
                      <TextField
                        value={rad.kontrollmoment}
                        onChange={onRadChange(rad._key, 'kontrollmoment')}
                        size="small"
                        fullWidth
                        variant="standard"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        select
                        value={rad.status}
                        onChange={onRadChange(rad._key, 'status')}
                        size="small"
                        fullWidth
                        variant="standard"
                      >
                        <MenuItem value="">—</MenuItem>
                        {ARBETSPLATSBESIKTNING_STATUS_OPTIONS.map((opt) => (
                          <MenuItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        aria-label="Ta bort rad"
                        size="small"
                        color="error"
                        onClick={() => onRemoveRad(rad._key)}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Box>
        <Button startIcon={<AddIcon />} onClick={onAddRad} sx={{ mt: 1.5 }}>
          Lägg till kontrollmoment
        </Button>
      </Grid>
    </Grid>
  )
}
