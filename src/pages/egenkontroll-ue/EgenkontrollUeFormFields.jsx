import { Grid, TextField } from '@mui/material'
import { SectionHeader, GuidedTextField } from '../../components/forms'

function SectionTitle({ children, helper, why }) {
  return <SectionHeader helper={helper} why={why}>{children}</SectionHeader>
}

/**
 * Flik 14 – Egenkontroller från UE.
 * Fält enligt docs/kma-underlag/flikar-13-16-egenkontroll-ata.md.
 */
export default function EgenkontrollUeFormFields({ form, onChange }) {
  return (
    <Grid container spacing={2}>
      <SectionTitle
        helper="Lista över UE som lämnat egenkontroll."
        why="Egenkontrollen visar att underentreprenörens arbete är kontrollerat och kan följas upp."
      >
        Egenkontroll från UE
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
        <GuidedTextField
          helpKey="egenkontroll_ue"
          label="Egenkontroll"
          value={form.egenkontroll}
          onChange={onChange('egenkontroll')}
          fullWidth
          multiline
          minRows={3}
          placeholder="Beskrivning av lämnad egenkontroll"
        />
      </Grid>
    </Grid>
  )
}
