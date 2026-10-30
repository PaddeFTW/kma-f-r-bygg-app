import { FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, TextField, Typography } from '@mui/material'

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
 * Flik 16 – ÄTA.
 * Fält enligt docs/kma-underlag/flikar-13-16-egenkontroll-ata.md.
 */
export default function AtaFormFields({ form, onChange }) {
  return (
    <Grid container spacing={2}>
      <SectionTitle>ÄTA</SectionTitle>
      <Grid item xs={12} md={4}>
        <TextField
          label="Ordernr"
          value={form.ordernr}
          onChange={onChange('ordernr')}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={8}>
        <TextField
          label="Objekt"
          value={form.objekt}
          onChange={onChange('objekt')}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Beskrivning"
          value={form.beskrivning}
          onChange={onChange('beskrivning')}
          fullWidth
          multiline
          minRows={3}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Rapportör"
          value={form.rapportor}
          onChange={onChange('rapportor')}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Orsak"
          value={form.orsak}
          onChange={onChange('orsak')}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Hänvisning"
          value={form.hanvisning}
          onChange={onChange('hanvisning')}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <FormControl>
          <FormLabel>Fast pris / Löpande räkning</FormLabel>
          <RadioGroup
            row
            value={form.pris_modell || ''}
            onChange={onChange('pris_modell')}
          >
            <FormControlLabel value="fast_pris" control={<Radio />} label="Fast pris" />
            <FormControlLabel value="lopande_rakning" control={<Radio />} label="Löpande räkning" />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Signatur"
          value={form.signatur}
          onChange={onChange('signatur')}
          fullWidth
        />
      </Grid>
    </Grid>
  )
}
