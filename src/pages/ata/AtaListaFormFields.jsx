import { Grid, MenuItem, TextField } from '@mui/material'
import { SectionHeader, GuidedTextField } from '../../components/forms'
import { JA_NEJ_OPTIONS } from '../../lib/formHelp'

function SectionTitle({ children, helper, why }) {
  return <SectionHeader helper={helper} why={why}>{children}</SectionHeader>
}

const BESTALLD_OPTIONS = [
  { value: '', label: 'Välj…' },
  { value: 'ja', label: 'Beställd' },
  { value: 'nej', label: 'Icke beställd' },
]

/**
 * Flik 16 – ÄTA-lista.
 * Fält enligt docs/kma-underlag/flikar-13-16-egenkontroll-ata.md.
 */
export default function AtaListaFormFields({ form, onChange }) {
  return (
    <Grid container spacing={2}>
      <SectionTitle
        helper="Lista för uppföljning av ÄTA."
        why="Listan samlar status för beställning, summa och fakturering så att inget tappas bort."
      >
        ÄTA-lista
      </SectionTitle>
      <Grid item xs={12} md={4}>
        <TextField
          label="Nr"
          value={form.nr}
          onChange={onChange('nr')}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          label="Datum"
          type="date"
          value={form.datum}
          onChange={onChange('datum')}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          label="Summa"
          value={form.summa}
          onChange={onChange('summa')}
          fullWidth
          inputMode="decimal"
        />
      </Grid>
      <Grid item xs={12}>
        <GuidedTextField
          helpKey="ata_beskrivning"
          label="Beskrivning"
          value={form.beskrivning}
          onChange={onChange('beskrivning')}
          fullWidth
          multiline
          minRows={2}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <GuidedTextField
          select
          helpKey="ata_bestalld"
          label="Beställd/icke"
          value={form.bestalld}
          onChange={onChange('bestalld')}
          fullWidth
        >
          {BESTALLD_OPTIONS.map((opt) => (
            <MenuItem key={opt.value || 'empty'} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </GuidedTextField>
      </Grid>
      <Grid item xs={12} md={6}>
        <GuidedTextField
          select
          helpKey="ata_fakturerad"
          label="Fakturerad"
          value={form.fakturerad}
          onChange={onChange('fakturerad')}
          fullWidth
        >
          {JA_NEJ_OPTIONS.map((opt) => (
            <MenuItem key={opt.value || 'empty'} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </GuidedTextField>
      </Grid>
    </Grid>
  )
}
