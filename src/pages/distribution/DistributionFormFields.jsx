import { Grid, TextField } from '@mui/material'
import { SectionHeader, GuidedTextField, SelectWithOther, SuggestionAutocomplete } from '../../components/forms'
import { SUGGESTIONS } from '../../lib/formHelp'

const PARMSTATUS_OPTIONS = [
  { value: '', label: 'Välj…' },
  { value: 'Under upprättande', label: 'Under upprättande' },
  { value: 'Komplett', label: 'Komplett' },
  { value: 'Distribuerad', label: 'Distribuerad' },
  { value: 'Signerad', label: 'Signerad' },
  { value: 'Arkiverad', label: 'Arkiverad' },
]

/**
 * Flik 31 – Distribution och signering.
 */
export default function DistributionFormFields({ form, onChange }) {
  return (
    <Grid container spacing={2}>
      <SectionHeader
        helper="Pärmstatus vid projektstart eller avslut."
        why="Status visar om pärmen är klar för distribution och signering."
        showKbLink
      >
        Pärmstatus
      </SectionHeader>
      <Grid item xs={12} md={6}>
        <SelectWithOther
          label="Pärmstatus"
          value={form.parmstatus}
          onChange={onChange('parmstatus')}
          options={PARMSTATUS_OPTIONS}
          helpKey="distribution"
          otherLabel="Egen status (fritext)"
        />
      </Grid>

      <SectionHeader
        helper="Vem som fått pärmen / dokumentationen."
        why="Distributionslistan ger spårbarhet innan godkännande."
      >
        Distributionslista
      </SectionHeader>
      <Grid item xs={12}>
        <GuidedTextField
          helpKey="distribution"
          label="Distributionslista"
          value={form.distributionslista}
          onChange={onChange('distributionslista')}
          fullWidth
          multiline
          minRows={4}
        />
      </Grid>

      <SectionHeader helper="Godkännande med namn och datum." why="Signering avslutar pärmen formellt.">
        Signering
      </SectionHeader>
      <Grid item xs={12} md={6}>
        <SuggestionAutocomplete
          label="Beställare"
          value={form.bestallare}
          onChangeField={onChange('bestallare')}
          options={SUGGESTIONS.kontaktroller}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Datum beställare"
          type="date"
          value={form.bestallare_datum}
          onChange={onChange('bestallare_datum')}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <SuggestionAutocomplete
          label="Platschef"
          value={form.platschef}
          onChangeField={onChange('platschef')}
          options={SUGGESTIONS.kontaktroller}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Datum platschef"
          type="date"
          value={form.platschef_datum}
          onChange={onChange('platschef_datum')}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Beställarens ombud"
          value={form.bestallarens_ombud}
          onChange={onChange('bestallarens_ombud')}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Datum beställarens ombud"
          type="date"
          value={form.bestallarens_ombud_datum}
          onChange={onChange('bestallarens_ombud_datum')}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
    </Grid>
  )
}
