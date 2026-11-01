import { Grid, TextField } from '@mui/material'
import { SectionHeader, GuidedTextField, SuggestionAutocomplete } from '../../components/forms'
import { SUGGESTIONS } from '../../lib/formHelp'

/**
 * Flik 16 – Avvikelserapport.
 * Fält enligt docs/kma-underlag/flikar-13-16-egenkontroll-ata.md.
 */
export default function AvvikelseFormFields({ form, onChange }) {
  return (
    <Grid container spacing={2}>
      <SectionHeader
        why="Avvikelser spåras till åtgärd, ÄTA och lärande i projektet."
        showKbLink
      >
        Avvikelserapport
      </SectionHeader>
      <Grid item xs={12} md={4}>
        <TextField label="Ordernr" value={form.ordernr} onChange={onChange('ordernr')} fullWidth />
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
        <SuggestionAutocomplete
          label="Inlämnat av"
          value={form.inlamnat_av}
          onChangeField={onChange('inlamnat_av')}
          options={SUGGESTIONS.kontaktroller}
        />
      </Grid>
      <Grid item xs={12}>
        <GuidedTextField
          helpKey="avvikelse"
          label="Beskrivning"
          value={form.beskrivning}
          onChange={onChange('beskrivning')}
          fullWidth
          multiline
          minRows={3}
        />
      </Grid>
      <Grid item xs={12}>
        <SuggestionAutocomplete
          label="Korrigerande åtgärd"
          value={form.korrigerande_atgard}
          onChangeField={onChange('korrigerande_atgard')}
          options={SUGGESTIONS.atgarder}
          helpKey="atgard"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Grundorsak"
          value={form.grundorsak}
          onChange={onChange('grundorsak')}
          fullWidth
          multiline
          minRows={2}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Kostnad"
          value={form.kostnad}
          onChange={onChange('kostnad')}
          fullWidth
          inputMode="decimal"
        />
      </Grid>
      <Grid item xs={12}>
        <SuggestionAutocomplete
          label="Förebyggande åtgärd"
          value={form.forebyggande_atgard}
          onChangeField={onChange('forebyggande_atgard')}
          options={SUGGESTIONS.atgarder}
        />
      </Grid>
      <Grid item xs={12}>
        <SuggestionAutocomplete
          label="Uppföljning"
          value={form.uppfoljning}
          onChangeField={onChange('uppfoljning')}
          options={SUGGESTIONS.statusAnteckning}
        />
      </Grid>
    </Grid>
  )
}
