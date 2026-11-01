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
import { KONTROLLPLAN_UTFOR_AV_OPTIONS } from '../../lib/types'
import { SectionHeader, GuidedTextField, SuggestionAutocomplete } from '../../components/forms'
import { SUGGESTIONS } from '../../lib/formHelp'

function SectionTitle({ children, helper, why }) {
  return (
    <SectionHeader helper={helper} why={why}>
      {children}
    </SectionHeader>
  )
}

/**
 * Flik 12 – Kontrollplan enligt PBL.
 * Fält enligt docs/kma-underlag/flikar-08-12-analys-kontroll.md.
 */
export default function KontrollplanFormFields({
  form,
  onChange,
  onRadChange,
  onAddRad,
  onRemoveRad,
}) {
  return (
    <Grid container spacing={2}>
      <SectionTitle>Objektinfo</SectionTitle>
      <Grid item xs={12}>
        <TextField
          label="Objektinfo"
          value={form.objektinfo}
          onChange={onChange('objektinfo')}
          fullWidth
          multiline
          minRows={2}
        />
      </Grid>

      <SectionTitle
        helper="Kontrollansvarig ska vara certifierad enligt underlaget."
        why="Parterna i kontrollplanen måste vara spårbara vid tillsyn och slutbesked."
      >
        Parter
      </SectionTitle>
      <Grid item xs={12} md={4}>
        <GuidedTextField
          helpKey="kontrollansvarig"
          label="Kontrollansvarig (certifierad)"
          value={form.kontrollansvarig}
          onChange={onChange('kontrollansvarig')}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <SuggestionAutocomplete
          label="Byggherre"
          value={form.byggherre}
          onChangeField={onChange('byggherre')}
          options={SUGGESTIONS.kontaktroller}
          helpKey="client_name"
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          label="Entreprenör"
          value={form.entreprenor}
          onChange={onChange('entreprenor')}
          fullWidth
        />
      </Grid>

      <SectionTitle>Underlag</SectionTitle>
      <Grid item xs={12}>
        <TextField
          label="Underlag"
          value={form.underlag}
          onChange={onChange('underlag')}
          fullWidth
          multiline
          minRows={2}
          placeholder="T.ex. ritningar, beskrivningar, beslut"
        />
      </Grid>

      <SectionTitle helper="Kontroll avser, utförs av S/E, metod, underlag, anmärkning, åtgärd, datum, sign.">
        Kontrolltabell
      </SectionTitle>
      <Grid item xs={12}>
        <Box sx={{ overflowX: 'auto', border: 1, borderColor: 'divider', borderRadius: 1 }}>
          <Table size="small" sx={{ minWidth: 960 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ minWidth: 140 }}>Kontroll avser</TableCell>
                <TableCell sx={{ minWidth: 110 }}>Utförs av</TableCell>
                <TableCell sx={{ minWidth: 110 }}>Metod</TableCell>
                <TableCell sx={{ minWidth: 120 }}>Underlag</TableCell>
                <TableCell sx={{ minWidth: 120 }}>Anmärkning</TableCell>
                <TableCell sx={{ minWidth: 120 }}>Åtgärd</TableCell>
                <TableCell sx={{ minWidth: 130 }}>Datum</TableCell>
                <TableCell sx={{ minWidth: 90 }}>Sign</TableCell>
                <TableCell align="right" sx={{ width: 48 }} />
              </TableRow>
            </TableHead>
            <TableBody>
              {form.rader.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9}>
                    <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
                      Inga kontrollrader ännu. Lägg till en rad.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                form.rader.map((rad) => (
                  <TableRow key={rad._key}>
                    <TableCell>
                      <TextField
                        value={rad.kontroll_avser}
                        onChange={onRadChange(rad._key, 'kontroll_avser')}
                        size="small"
                        fullWidth
                        variant="standard"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        select
                        value={rad.utfor_av}
                        onChange={onRadChange(rad._key, 'utfor_av')}
                        size="small"
                        fullWidth
                        variant="standard"
                      >
                        <MenuItem value="">—</MenuItem>
                        {KONTROLLPLAN_UTFOR_AV_OPTIONS.map((opt) => (
                          <MenuItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={rad.metod}
                        onChange={onRadChange(rad._key, 'metod')}
                        size="small"
                        fullWidth
                        variant="standard"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={rad.underlag}
                        onChange={onRadChange(rad._key, 'underlag')}
                        size="small"
                        fullWidth
                        variant="standard"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={rad.anmarkning}
                        onChange={onRadChange(rad._key, 'anmarkning')}
                        size="small"
                        fullWidth
                        variant="standard"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={rad.atgard}
                        onChange={onRadChange(rad._key, 'atgard')}
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
                    <TableCell>
                      <TextField
                        value={rad.sign}
                        onChange={onRadChange(rad._key, 'sign')}
                        size="small"
                        fullWidth
                        variant="standard"
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
          Lägg till kontrollrad
        </Button>
      </Grid>

      <SectionTitle helper="Signeras av kontrollansvarig och byggherre.">
        Signering
      </SectionTitle>
      <Grid item xs={12} md={6}>
        <TextField
          label="Signatur kontrollansvarig"
          value={form.signatur_kontrollansvarig}
          onChange={onChange('signatur_kontrollansvarig')}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Signatur byggherre"
          value={form.signatur_byggherre}
          onChange={onChange('signatur_byggherre')}
          fullWidth
        />
      </Grid>
    </Grid>
  )
}
