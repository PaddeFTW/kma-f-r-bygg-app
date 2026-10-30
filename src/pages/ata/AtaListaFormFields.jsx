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
 * Flik 16 – ÄTA-lista.
 * Fält enligt docs/kma-underlag/flikar-13-16-egenkontroll-ata.md.
 */
export default function AtaListaFormFields({ form, onChange }) {
  return (
    <Grid container spacing={2}>
      <SectionTitle helper="Lista för uppföljning av ÄTA.">ÄTA-lista</SectionTitle>
      <Grid item xs={12} md={4}>
        <TextField
          label="Nr"
          value={form.nr}
          onChange={onChange('nr')}
          fullWidth
        />
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
        <TextField
          label="Summa"
          value={form.summa}
          onChange={onChange('summa')}
          fullWidth
          inputMode="decimal"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Beskrivning"
          value={form.beskrivning}
          onChange={onChange('beskrivning')}
          fullWidth
          multiline
          minRows={2}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          select
          label="Beställd/icke"
          value={form.bestalld}
          onChange={onChange('bestalld')}
          fullWidth
        >
          <MenuItem value="">—</MenuItem>
          <MenuItem value="ja">Beställd</MenuItem>
          <MenuItem value="nej">Icke beställd</MenuItem>
        </TextField>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          select
          label="Fakturerad"
          value={form.fakturerad}
          onChange={onChange('fakturerad')}
          fullWidth
        >
          <MenuItem value="">—</MenuItem>
          <MenuItem value="ja">Ja</MenuItem>
          <MenuItem value="nej">Nej</MenuItem>
        </TextField>
      </Grid>
    </Grid>
  )
}
