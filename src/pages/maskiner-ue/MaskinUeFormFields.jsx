import { Grid, TextField } from '@mui/material'
import { SectionHeader, GuidedTextField, SuggestionAutocomplete } from '../../components/forms'
import { SUGGESTIONS } from '../../lib/formHelp'

function SectionTitle({ children, helper, why }) {
  return <SectionHeader helper={helper} why={why}>{children}</SectionHeader>
}

/**
 * Flik 15 – Inventering av maskiner för UE.
 * Fält enligt docs/kma-underlag/flikar-13-16-egenkontroll-ata.md.
 */
export default function MaskinUeFormFields({ form, onChange }) {
  return (
    <Grid container spacing={2}>
      <SectionTitle
        helper="Lista över maskiner/fordon från UE."
        why="Maskininventeringen ger kontroll över utrustning, miljörisker och arbetsmiljöansvar på plats."
      >
        Inventering av maskiner för UE
      </SectionTitle>
      <Grid item xs={12} md={6}>
        <GuidedTextField
          helpKey="ue_namn"
          label="Underleverantör"
          value={form.underleverantor}
          onChange={onChange('underleverantor')}
          required
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
      <Grid item xs={12}>
        <SuggestionAutocomplete
          helpKey="maskin_ue"
          label="Maskiner"
          value={form.maskiner}
          onChangeField={onChange('maskiner')}
          options={SUGGESTIONS.maskiner}
          placeholder="Maskiner och fordon från underleverantören"
        />
      </Grid>
    </Grid>
  )
}
