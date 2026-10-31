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
 * Flik 19 – Anhöriglista.
 * Fält enligt docs/kma-underlag/flikar-17-21-sakerhet-rond.md.
 */
export default function AnhoriglistaFormFields({ form, onChange }) {
  return (
    <Grid container spacing={2}>
      <SectionTitle helper="UE ska lämna egen lista eller till platschef.">
        Anhöriglista
      </SectionTitle>
      <Grid item xs={12} md={6}>
        <TextField
          label="Medarbetare"
          value={form.medarbetare}
          onChange={onChange('medarbetare')}
          required
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Närmaste anhörig"
          value={form.narmaste_anhorig}
          onChange={onChange('narmaste_anhorig')}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
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
