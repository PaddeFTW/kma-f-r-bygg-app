import { Grid, TextField } from '@mui/material'
import { SectionHeader, GuidedTextField } from '../../components/forms'

function SectionTitle({ children, helper, why }) {
  return <SectionHeader helper={helper} why={why}>{children}</SectionHeader>
}

/**
 * Flik 19 – Anhöriglista.
 * Fält enligt docs/kma-underlag/flikar-17-21-sakerhet-rond.md.
 */
export default function AnhoriglistaFormFields({ form, onChange }) {
  return (
    <Grid container spacing={2}>
      <SectionTitle
        helper="UE ska lämna egen lista eller till platschef."
        why="Kontaktuppgifter till anhöriga behövs för snabb och korrekt kontakt vid olycka eller sjukdom."
      >
        Anhöriglista
      </SectionTitle>
      <Grid item xs={12} md={6}>
        <GuidedTextField
          helpKey="anhorig_medarbetare"
          label="Medarbetare"
          value={form.medarbetare}
          onChange={onChange('medarbetare')}
          required
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <GuidedTextField
          helpKey="anhorig_kontakt"
          label="Närmaste anhörig"
          value={form.narmaste_anhorig}
          onChange={onChange('narmaste_anhorig')}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <GuidedTextField
          helpKey="anhorig_kontakt"
          label="Telefon/mobil"
          value={form.telefon_mobil}
          onChange={onChange('telefon_mobil')}
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
