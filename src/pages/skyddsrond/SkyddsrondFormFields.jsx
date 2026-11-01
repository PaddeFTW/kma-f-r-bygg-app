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
import { SKYDDSROND_STATUS_OPTIONS } from '../../lib/types'
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
 * Flik 21 – Skydds- och miljörond.
 * Checklista + handlingsplan enligt docs/kma-underlag/flikar-17-21-sakerhet-rond.md.
 */
export default function SkyddsrondFormFields({
  form,
  onChange,
  onCheckChange,
  onAddCheck,
  onRemoveCheck,
  onPlanChange,
  onAddPlan,
  onRemovePlan,
}) {
  return (
    <Grid container spacing={2}>
      <SectionTitle
        helper="Platschef, arbetsledare, skyddsombud och UE."
        why="Deltagare och status visar att skyddsronden genomförts enligt AMP."
      >
        Deltagare
      </SectionTitle>
      <Grid item xs={12} md={6}>
        <SuggestionAutocomplete
          label="Platschef"
          value={form.platschef}
          onChangeField={onChange('platschef')}
          options={SUGGESTIONS.kontaktroller}
          helpKey="contact_name"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <SuggestionAutocomplete
          label="Arbetsledare"
          value={form.arbetsledare}
          onChangeField={onChange('arbetsledare')}
          options={SUGGESTIONS.kontaktroller}
          helpKey="skyddsrond_deltagare"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <SuggestionAutocomplete
          label="Skyddsombud"
          value={form.skyddsombud}
          onChangeField={onChange('skyddsombud')}
          options={SUGGESTIONS.kontaktroller}
          helpKey="skyddsrond_deltagare"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <SuggestionAutocomplete
          label="UE"
          value={form.ue}
          onChangeField={onChange('ue')}
          options={SUGGESTIONS.kontaktroller}
          helpKey="skyddsrond_deltagare"
        />
      </Grid>

      <SectionTitle
        helper="Ja/Nej. Lägg till fler punkter vid behov (m.fl.)."
        why="Checklistan säkrar att ronden går igenom återkommande risker på samma sätt varje gång."
      >
        Checklista
      </SectionTitle>
      <Grid item xs={12}>
        <Box sx={{ overflowX: 'auto', border: 1, borderColor: 'divider', borderRadius: 1 }}>
          <Table size="small" sx={{ minWidth: 520 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ minWidth: 260 }}>Punkt</TableCell>
                <TableCell sx={{ minWidth: 140 }}>Ja/Nej</TableCell>
                <TableCell align="right" sx={{ width: 48 }} />
              </TableRow>
            </TableHead>
            <TableBody>
              {form.checklista.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3}>
                    <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
                      Inga checklistapunkter. Lägg till en rad.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                form.checklista.map((rad) => (
                  <TableRow key={rad._key}>
                    <TableCell>
                      <GuidedTextField
                        value={rad.punkt}
                        onChange={onCheckChange(rad._key, 'punkt')}
                        size="small"
                        fullWidth
                        variant="standard"
                        compact
                        helpKey="skyddsrond_punkt"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        select
                        value={rad.status}
                        onChange={onCheckChange(rad._key, 'status')}
                        size="small"
                        fullWidth
                        variant="standard"
                      >
                        <MenuItem value="">—</MenuItem>
                        {SKYDDSROND_STATUS_OPTIONS.map((opt) => (
                          <MenuItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        aria-label="Ta bort punkt"
                        size="small"
                        color="error"
                        onClick={() => onRemoveCheck(rad._key)}
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
        <Button startIcon={<AddIcon />} onClick={onAddCheck} sx={{ mt: 1.5 }}>
          Lägg till punkt
        </Button>
      </Grid>

      <SectionTitle
        helper="Nr, fel & brister, åtgärdas senast, ansvarig, åtgärdat datum."
        why="Handlingsplanen gör brister åtgärdbara med ansvarig person och datum."
      >
        Sammanställning + Handlingsplan
      </SectionTitle>
      <Grid item xs={12}>
        <Box sx={{ overflowX: 'auto', border: 1, borderColor: 'divider', borderRadius: 1 }}>
          <Table size="small" sx={{ minWidth: 820 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ minWidth: 70 }}>Nr</TableCell>
                <TableCell sx={{ minWidth: 220 }}>Fel & brister</TableCell>
                <TableCell sx={{ minWidth: 140 }}>Åtgärdas senast</TableCell>
                <TableCell sx={{ minWidth: 140 }}>Ansvarig</TableCell>
                <TableCell sx={{ minWidth: 140 }}>Åtgärdat datum</TableCell>
                <TableCell align="right" sx={{ width: 48 }} />
              </TableRow>
            </TableHead>
            <TableBody>
              {form.handlingsplan.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
                      Ingen handlingsplan ännu. Lägg till en rad.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                form.handlingsplan.map((rad) => (
                  <TableRow key={rad._key}>
                    <TableCell>
                      <TextField
                        value={rad.nr}
                        onChange={onPlanChange(rad._key, 'nr')}
                        size="small"
                        fullWidth
                        variant="standard"
                      />
                    </TableCell>
                    <TableCell>
                      <GuidedTextField
                        value={rad.fel_brister}
                        onChange={onPlanChange(rad._key, 'fel_brister')}
                        size="small"
                        fullWidth
                        variant="standard"
                        compact
                        tooltip="Beskriv bristen så att åtgärden kan följas upp."
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="date"
                        value={rad.atgardas_senast}
                        onChange={onPlanChange(rad._key, 'atgardas_senast')}
                        size="small"
                        fullWidth
                        variant="standard"
                        InputLabelProps={{ shrink: true }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={rad.ansvarig}
                        onChange={onPlanChange(rad._key, 'ansvarig')}
                        size="small"
                        fullWidth
                        variant="standard"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="date"
                        value={rad.atgardat_datum}
                        onChange={onPlanChange(rad._key, 'atgardat_datum')}
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
                        onClick={() => onRemovePlan(rad._key)}
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
        <Button startIcon={<AddIcon />} onClick={onAddPlan} sx={{ mt: 1.5 }}>
          Lägg till i handlingsplan
        </Button>
      </Grid>
    </Grid>
  )
}
