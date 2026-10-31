import { Grid, TextField, Typography } from '@mui/material'

function SectionTitle({ children, helper }) {
  return (
    <Grid item xs={12}>
      <Typography variant="h6" sx={{ fontWeight: 600, mt: 1 }}>
        {children}
      </Typography>
      {helper && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {helper}
        </Typography>
      )}
    </Grid>
  )
}

/**
 * Flik 15 – Inventering av maskiner för UE.
 * Fält enligt docs/kma-underlag/flikar-13-16-egenkontroll-ata.md.
 */
export default function MaskinUeFormFields({ form, onChange }) {
  return (
    <Grid container spacing={2}>
      <SectionTitle helper="Lista över maskiner/fordon från UE.">
        Inventering av maskiner för UE
      </SectionTitle>
      <Grid item xs={12} md={6}>
        <TextField
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
        <TextField
          label="Maskiner"
          value={form.maskiner}
          onChange={onChange('maskiner')}
          fullWidth
          multiline
          minRows={3}
          placeholder="Maskiner och fordon från underleverantören"
        />
      </Grid>
    </Grid>
  )
}
