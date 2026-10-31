import { Grid, MenuItem, TextField, Typography } from '@mui/material'

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
 * Flik 17 – Säkerhetsdatablad.
 * Fält enligt docs/kma-underlag/flikar-17-21-sakerhet-rond.md.
 */
export default function SakerhetsdatabladFormFields({ form, onChange }) {
  return (
    <Grid container spacing={2}>
      <SectionTitle helper="Lista över farliga kemikalier med SDB-status.">
        Säkerhetsdatablad
      </SectionTitle>
      <Grid item xs={12} md={6}>
        <TextField
          label="Produkt"
          value={form.produkt}
          onChange={onChange('produkt')}
          required
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          select
          label="Säkerhetsdatablad ja/nej"
          value={form.sakerhetsdatablad}
          onChange={onChange('sakerhetsdatablad')}
          fullWidth
        >
          <MenuItem value="">—</MenuItem>
          <MenuItem value="ja">Ja</MenuItem>
          <MenuItem value="nej">Nej</MenuItem>
        </TextField>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
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
