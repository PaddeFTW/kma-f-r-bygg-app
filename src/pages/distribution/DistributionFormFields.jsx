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
 * Flik 31 – Distribution och signering.
 * Pärmstatus, distributionslista och signering enligt underlag.
 */
export default function DistributionFormFields({ form, onChange }) {
  return (
    <Grid container spacing={2}>
      <SectionTitle helper="Pärmstatus vid projektstart eller avslut.">
        Pärmstatus
      </SectionTitle>
      <Grid item xs={12}>
        <TextField
          label="Pärmstatus"
          value={form.parmstatus}
          onChange={onChange('parmstatus')}
          fullWidth
        />
      </Grid>

      <SectionTitle helper="Vem som fått pärmen / dokumentationen.">
        Distributionslista
      </SectionTitle>
      <Grid item xs={12}>
        <TextField
          label="Distributionslista"
          value={form.distributionslista}
          onChange={onChange('distributionslista')}
          fullWidth
          multiline
          minRows={4}
        />
      </Grid>

      <SectionTitle helper="Godkännande med namn och datum.">Signering</SectionTitle>
      <Grid item xs={12} md={6}>
        <TextField
          label="Beställare"
          value={form.bestallare}
          onChange={onChange('bestallare')}
          fullWidth
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
        <TextField
          label="Platschef"
          value={form.platschef}
          onChange={onChange('platschef')}
          fullWidth
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
