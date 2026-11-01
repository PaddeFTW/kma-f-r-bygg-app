import {
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
import { CHECKLISTA_BYGGPARM_JA_NEJ_OPTIONS } from '../../lib/types'

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
 * Flik 30 – Checklista byggpärm.
 * Avsnitt (Flik 1–31), Klart ja/nej, Ansvarig, Datum.
 */
export default function ChecklistaByggparmFormFields({
  form,
  onRadChange,
  onAddRad,
  onRemoveRad,
}) {
  return (
    <Grid container spacing={2}>
      <SectionTitle helper="Kontroll att alla flikar är klara.">
        Avsnitt (Flik 1–31)
      </SectionTitle>
      <Grid item xs={12}>
        <Box sx={{ overflowX: 'auto', border: 1, borderColor: 'divider', borderRadius: 1 }}>
          <Table size="small" sx={{ minWidth: 780 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ minWidth: 70 }}>Flik</TableCell>
                <TableCell sx={{ minWidth: 220 }}>Avsnitt</TableCell>
                <TableCell sx={{ minWidth: 100 }}>Klart</TableCell>
                <TableCell sx={{ minWidth: 140 }}>Ansvarig</TableCell>
                <TableCell sx={{ minWidth: 140 }}>Datum</TableCell>
                <TableCell align="right" sx={{ width: 48 }} />
              </TableRow>
            </TableHead>
            <TableBody>
              {form.rader.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
                      Inga avsnitt. Lägg till en rad.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                form.rader.map((rad) => (
                  <TableRow key={rad._key}>
                    <TableCell>
                      <TextField
                        type="number"
                        value={rad.flik_nr ?? ''}
                        onChange={onRadChange(rad._key, 'flik_nr')}
                        size="small"
                        fullWidth
                        variant="standard"
                        inputProps={{ min: 1, max: 31 }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={rad.avsnitt}
                        onChange={onRadChange(rad._key, 'avsnitt')}
                        size="small"
                        fullWidth
                        variant="standard"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        select
                        value={rad.klart}
                        onChange={onRadChange(rad._key, 'klart')}
                        size="small"
                        fullWidth
                        variant="standard"
                      >
                        <MenuItem value="">—</MenuItem>
                        {CHECKLISTA_BYGGPARM_JA_NEJ_OPTIONS.map((opt) => (
                          <MenuItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={rad.ansvarig}
                        onChange={onRadChange(rad._key, 'ansvarig')}
                        size="small"
                        fullWidth
                        variant="standard"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="date"
                        value={rad.datum}
                        onChange={onRadChange(rad._key, 'datum')}
                        size="small"
                        fullWidth
                        variant="standard"
                        InputLabelProps={{ shrink: true }}
                      />
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
          Lägg till avsnitt
        </Button>
      </Grid>
    </Grid>
  )
}
