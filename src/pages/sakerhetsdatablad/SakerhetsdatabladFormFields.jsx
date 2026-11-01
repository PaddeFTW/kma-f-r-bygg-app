import { Grid, MenuItem, TextField } from '@mui/material'
import { SectionHeader, GuidedTextField, SuggestionAutocomplete } from '../../components/forms'
import { JA_NEJ_OPTIONS, SUGGESTIONS } from '../../lib/formHelp'

function SectionTitle({ children, helper, why }) {
  return <SectionHeader helper={helper} why={why}>{children}</SectionHeader>
}

/**
 * Flik 17 – Säkerhetsdatablad.
 * Fält enligt docs/kma-underlag/flikar-17-21-sakerhet-rond.md.
 */
export default function SakerhetsdatabladFormFields({ form, onChange }) {
  return (
    <Grid container spacing={2}>
      <SectionTitle
        helper="Lista över farliga kemikalier med SDB-status."
        why="Säkerhetsdatablad behöver vara spårbara så att rätt skyddsåtgärder finns vid hantering och olycka."
      >
        Säkerhetsdatablad
      </SectionTitle>
      <Grid item xs={12} md={6}>
        <SuggestionAutocomplete
          helpKey="sdb_produkt"
          label="Produkt"
          value={form.produkt}
          onChangeField={onChange('produkt')}
          options={SUGGESTIONS.kemikalier}
          required
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <GuidedTextField
          select
          helpKey="sdb_status"
          label="Säkerhetsdatablad ja/nej"
          value={form.sakerhetsdatablad}
          onChange={onChange('sakerhetsdatablad')}
          fullWidth
        >
          {JA_NEJ_OPTIONS.map((opt) => (
            <MenuItem key={opt.value || 'empty'} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </GuidedTextField>
      </Grid>
      <Grid item xs={12} md={6}>
        <GuidedTextField
          helpKey="contact_name"
          label="Ansvarig"
          value={form.ansvarig}
          onChange={onChange('ansvarig')}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Datum"
          type="date"
          value={form.datum}
          onChange={onChange('datum')}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
    </Grid>
  )
}
