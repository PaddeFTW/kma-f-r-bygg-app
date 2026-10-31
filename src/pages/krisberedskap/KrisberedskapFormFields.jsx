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
 * Flik 20 – Krisberedskap.
 * Innehåll enligt docs/kma-underlag/flikar-17-21-sakerhet-rond.md.
 */
export default function KrisberedskapFormFields({ form, onChange }) {
  return (
    <Grid container spacing={2}>
      <SectionTitle helper="Exempel: olycka, våld, hot.">
        Exempel på händelser
      </SectionTitle>
      <Grid item xs={12}>
        <TextField
          label="Exempel på händelser"
          value={form.exempel_handelser}
          onChange={onChange('exempel_handelser')}
          fullWidth
          multiline
          minRows={3}
          placeholder="Olycka, våld, hot m.m."
        />
      </Grid>

      <SectionTitle helper="Rädda, larma 112, utrym.">
        Omedelbara åtgärder
      </SectionTitle>
      <Grid item xs={12}>
        <TextField
          label="Omedelbara åtgärder"
          value={form.omedelbara_atgarder}
          onChange={onChange('omedelbara_atgarder')}
          fullWidth
          multiline
          minRows={3}
          placeholder="Rädda, larma 112, utrym"
        />
      </Grid>

      <SectionTitle>Krisgrupp</SectionTitle>
      <Grid item xs={12}>
        <TextField
          label="Krisgrupp"
          value={form.krisgrupp}
          onChange={onChange('krisgrupp')}
          fullWidth
          multiline
          minRows={2}
        />
      </Grid>

      <SectionTitle>Viktiga telefonnummer</SectionTitle>
      <Grid item xs={12}>
        <TextField
          label="Viktiga telefonnummer"
          value={form.viktiga_telefonnummer}
          onChange={onChange('viktiga_telefonnummer')}
          fullWidth
          multiline
          minRows={2}
        />
      </Grid>

      <SectionTitle>Anmälan till Arbetsmiljöverket</SectionTitle>
      <Grid item xs={12}>
        <TextField
          label="Anmälan till Arbetsmiljöverket"
          value={form.anmalan_arbetsmiljoverket}
          onChange={onChange('anmalan_arbetsmiljoverket')}
          fullWidth
          multiline
          minRows={2}
        />
      </Grid>

      <SectionTitle>Uppföljning</SectionTitle>
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
