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
import {
  EGENKONTROLL_STATUS_OPTIONS,
  EGENKONTROLL_TYP_OPTIONS,
} from '../../lib/types'
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
 * Flik 13 – Egenkontroll.
 * Fält och typmallar enligt docs/kma-underlag/flikar-13-16-egenkontroll-ata.md.
 */
export default function EgenkontrollFormFields({
  form,
  onChange,
  onTypChange,
  onRadChange,
  onAddRad,
  onRemoveRad,
}) {
  return (
    <Grid container spacing={2}>
      <SectionTitle
        helper="Välj typ för att ladda kontrollmoment från underlaget."
        why="Rätt mall ger enhetliga bevis och statuskoder i pärmen."
      >
        Typ
      </SectionTitle>
      <Grid item xs={12} md={6}>
        <GuidedTextField
          select
          helpKey="egenkontroll_typ"
          label="Typ"
          value={form.typ}
          onChange={onTypChange}
          fullWidth
          required
        >
          <MenuItem value="">Välj typ</MenuItem>
          {EGENKONTROLL_TYP_OPTIONS.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </GuidedTextField>
      </Grid>

      <SectionTitle>Generell mall</SectionTitle>
      <Grid item xs={12} md={6}>
        <TextField
          label="Beställare"
          value={form.bestallare}
          onChange={onChange('bestallare')}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Entreprenör"
          value={form.entreprenor}
          onChange={onChange('entreprenor')}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Objekt"
          value={form.objekt}
          onChange={onChange('objekt')}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <TextField
          label="Projektnr"
          value={form.projektnr}
          onChange={onChange('projektnr')}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <TextField
          label="Referens"
          value={form.referens}
          onChange={onChange('referens')}
          fullWidth
        />
      </Grid>

      <SectionTitle
        helper="1 = Kontrollerat och godkänt, 2 = Kontrollerat och ej godkänt, 3 = Ej kontrollerat."
        why="Status 1/2/3 är beviset som följs upp i kvalitetsarbetet."
      >
        Kontrollmoment
      </SectionTitle>
      <Grid item xs={12}>
        <Alert severity="info" sx={{ mb: 1.5 }}>
          1 = Kontrollerat och godkänt · 2 = Kontrollerat och ej godkänt · 3 = Ej kontrollerat.
          Välj status i listan; komplettera gärna med åtgärdsförslag i fritext där det behövs.
        </Alert>
        <Box sx={{ overflowX: 'auto', border: 1, borderColor: 'divider', borderRadius: 1 }}>
          <Table size="small" sx={{ minWidth: 720 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ minWidth: 220 }}>Kontrollmoment</TableCell>
                <TableCell sx={{ minWidth: 200 }}>Status (1/2/3)</TableCell>
                <TableCell sx={{ minWidth: 140 }}>Datum</TableCell>
                <TableCell sx={{ minWidth: 120 }}>Signatur</TableCell>
                <TableCell align="right" sx={{ width: 48 }} />
              </TableRow>
            </TableHead>
            <TableBody>
              {form.rader.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
                      Inga kontrollmoment. Välj typ eller lägg till en rad.
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
                        {EGENKONTROLL_STATUS_OPTIONS.map((opt) => (
                          <MenuItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </MenuItem>
                        ))}
                      </TextField>
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
                        value={rad.signatur}
                        onChange={onRadChange(rad._key, 'signatur')}
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
          Lägg till kontrollmoment
        </Button>
      </Grid>

      <SectionTitle why="Anteckningar kompletterar statusvalet när något behöver förklaras.">
        Övrigt
      </SectionTitle>
      <Grid item xs={12}>
        <SuggestionAutocomplete
          label="Övriga anteckningar / fritext"
          value={form.ovriga_anteckningar}
          onChangeField={onChange('ovriga_anteckningar')}
          options={SUGGESTIONS.statusAnteckning}
          helpKey="egenkontroll_status"
          placeholder="Välj förslag eller skriv fritext"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Kontrollansvarig"
          value={form.kontrollansvarig}
          onChange={onChange('kontrollansvarig')}
          fullWidth
        />
      </Grid>
    </Grid>
  )
}
