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
 * Flik 16 – Avvikelserapport.
 * Fält enligt docs/kma-underlag/flikar-13-16-egenkontroll-ata.md.
 */
export default function AvvikelseFormFields({ form, onChange }) {
  return (
    <Grid container spacing={2}>
      <SectionTitle>Avvikelserapport</SectionTitle>
      <Grid item xs={12} md={4}>
        <TextField
          label="Ordernr"
          value={form.ordernr}
          onChange={onChange('ordernr')}
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
          label="Inlämnat av"
          value={form.inlamnat_av}
          onChange={onChange('inlamnat_av')}
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
      <Grid item xs={12}>
        <TextField
          label="Korrigerande åtgärd"
          value={form.korrigerande_atgard}
          onChange={onChange('korrigerande_atgard')}
          fullWidth
          multiline
          minRows={2}
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
        <TextField
          label="Förebyggande åtgärd"
          value={form.forebyggande_atgard}
          onChange={onChange('forebyggande_atgard')}
          fullWidth
          multiline
          minRows={2}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Uppföljning"
          value={form.uppfoljning}
          onChange={onChange('uppfoljning')}
          fullWidth
          multiline
          minRows={2}
        />
      </Grid>
    </Grid>
  )
}
