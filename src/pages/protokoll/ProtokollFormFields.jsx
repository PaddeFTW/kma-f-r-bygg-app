import { Alert, Grid, TextField, Typography } from '@mui/material'

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
 * Flik 10 – Protokoll byggmöte.
 * Avsnitt enligt docs/kma-underlag/flikar-08-12-analys-kontroll.md
 * och originalmall i docs/KMA-wordfilerna/Flik 10 Protokoll - byggmöte mm/.
 */
export default function ProtokollFormFields({ form, onChange }) {
  return (
    <Grid container spacing={2}>
      <SectionTitle>Uppgifter om mötet</SectionTitle>
      <Grid item xs={12} md={4}>
        <TextField
          label="Projektnr"
          value={form.projektnr}
          onChange={onChange('projektnr')}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={8}>
        <TextField
          label="Namn"
          value={form.namn}
          onChange={onChange('namn')}
          fullWidth
          helperText="Projektnamn"
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          label="Möte nr"
          value={form.mote_nr}
          onChange={onChange('mote_nr')}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          label="Datum"
          value={form.datum}
          onChange={onChange('datum')}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          label="Plats"
          value={form.plats}
          onChange={onChange('plats')}
          fullWidth
        />
      </Grid>

      <SectionTitle helper="Närvarande för entreprenör, beställare och underentreprenör.">
        Närvarande
      </SectionTitle>
      <Grid item xs={12}>
        <TextField
          label="Närvarande – entreprenören"
          value={form.narvarande_entreprenor}
          onChange={onChange('narvarande_entreprenor')}
          fullWidth
          multiline
          minRows={2}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Närvarande – för beställaren"
          value={form.narvarande_bestallare}
          onChange={onChange('narvarande_bestallare')}
          fullWidth
          multiline
          minRows={2}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Närvarande – för underentreprenören"
          value={form.narvarande_underentreprenor}
          onChange={onChange('narvarande_underentreprenor')}
          fullWidth
          multiline
          minRows={2}
        />
      </Grid>

      <SectionTitle helper="Anteckningar per punkt. Kvalitet, miljö, arbetsmiljö och övrigt.">
        Dagordning
      </SectionTitle>
      <Grid item xs={12}>
        <TextField
          label="Kvalitet"
          value={form.dagordning_kvalitet}
          onChange={onChange('dagordning_kvalitet')}
          fullWidth
          multiline
          minRows={2}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Miljö"
          value={form.dagordning_miljo}
          onChange={onChange('dagordning_miljo')}
          fullWidth
          multiline
          minRows={2}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Arbetsmiljö"
          value={form.dagordning_arbetsmiljo}
          onChange={onChange('dagordning_arbetsmiljo')}
          fullWidth
          multiline
          minRows={2}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Övriga punkter"
          value={form.dagordning_ovrigt}
          onChange={onChange('dagordning_ovrigt')}
          fullWidth
          multiline
          minRows={2}
          helperText="Övriga dagordningspunkter enligt mötet."
        />
      </Grid>

      <SectionTitle>Beslut</SectionTitle>
      <Grid item xs={12}>
        <Alert severity="info" sx={{ mb: 1 }}>
          Beslut ska protokollföras och distribueras till berörda parter efter mötet.
        </Alert>
        <TextField
          label="Beslut"
          value={form.beslut}
          onChange={onChange('beslut')}
          fullWidth
          multiline
          minRows={4}
        />
      </Grid>
    </Grid>
  )
}
