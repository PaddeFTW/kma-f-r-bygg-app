import { Alert, Grid, Link, MenuItem, TextField, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { contractForms } from '../../lib/types'

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
 * Flik 5 – Kvalitetsplan.
 * Avsnitt enligt docs/kma-underlag/flikar-05-07-planer.md.
 */
export default function KvalitetsplanFormFields({ form, onChange, projectId }) {
  return (
    <Grid container spacing={2}>
      <SectionTitle>Kvalitetspolicy</SectionTitle>
      <Grid item xs={12}>
        <TextField
          label="Kvalitetspolicy"
          value={form.kvalitetspolicy}
          onChange={onChange('kvalitetspolicy')}
          fullWidth
          multiline
          minRows={3}
        />
      </Grid>

      <SectionTitle helper="Allmän info, entreprenadform, art och tidplan.">Orientering</SectionTitle>
      <Grid item xs={12}>
        <TextField
          label="Allmän info"
          value={form.orientering_allman_info}
          onChange={onChange('orientering_allman_info')}
          fullWidth
          multiline
          minRows={2}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          select
          label="Entreprenadform"
          value={form.orientering_entreprenadform}
          onChange={onChange('orientering_entreprenadform')}
          fullWidth
        >
          <MenuItem value="">
            <em>Välj</em>
          </MenuItem>
          {contractForms.map((value) => (
            <MenuItem key={value} value={value}>
              {value}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          label="Art"
          value={form.orientering_art}
          onChange={onChange('orientering_art')}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          label="Tidplan"
          value={form.orientering_tidplan}
          onChange={onChange('orientering_tidplan')}
          fullWidth
          multiline
          minRows={1}
        />
      </Grid>

      <SectionTitle>Organisation</SectionTitle>
      <Grid item xs={12}>
        <Alert severity="info" sx={{ mb: 1 }}>
          Hänvisar till Flik 2–4 (roller, beställare och underleverantörer)
          {projectId ? (
            <>
              {' – '}
              <Link component={RouterLink} to={`/projects/${projectId}`} underline="hover">
                öppna projektet
              </Link>
            </>
          ) : null}
          .
        </Alert>
        <TextField
          label="Organisation"
          value={form.organisation}
          onChange={onChange('organisation')}
          fullWidth
          multiline
          minRows={2}
          helperText="Kompletterande anteckningar. Roller och parter finns under Flik 2–4."
        />
      </Grid>

      <SectionTitle helper="Byggmöte, ändringar och protokoll.">Projektgenomgång</SectionTitle>
      <Grid item xs={12}>
        <TextField
          label="Byggmöte"
          value={form.projektgenomgang_byggmote}
          onChange={onChange('projektgenomgang_byggmote')}
          fullWidth
          multiline
          minRows={2}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Ändringar"
          value={form.projektgenomgang_andringar}
          onChange={onChange('projektgenomgang_andringar')}
          fullWidth
          multiline
          minRows={2}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Protokoll"
          value={form.projektgenomgang_protokoll}
          onChange={onChange('projektgenomgang_protokoll')}
          fullWidth
          multiline
          minRows={2}
        />
      </Grid>

      <SectionTitle>Projektering och kontrollplan</SectionTitle>
      <Grid item xs={12}>
        <TextField
          label="Projektering och kontrollplan"
          value={form.projektering_kontrollplan}
          onChange={onChange('projektering_kontrollplan')}
          fullWidth
          multiline
          minRows={3}
          helperText="Hänvisar till kontrollplan (Flik 12) när den finns."
        />
      </Grid>

      <SectionTitle helper="Egenkontroll, dagbok, ÄTA, personalliggare och avvikelser.">
        Produktionsförberedelser
      </SectionTitle>
      <Grid item xs={12}>
        <TextField
          label="Egenkontroll"
          value={form.produktion_egenkontroll}
          onChange={onChange('produktion_egenkontroll')}
          fullWidth
          multiline
          minRows={2}
          helperText="Hänvisar till egenkontroll (Flik 13)."
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Dagbok"
          value={form.produktion_dagbok}
          onChange={onChange('produktion_dagbok')}
          fullWidth
          multiline
          minRows={2}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="ÄTA"
          value={form.produktion_ata}
          onChange={onChange('produktion_ata')}
          fullWidth
          multiline
          minRows={2}
          helperText="Hänvisar till ÄTA (Flik 16)."
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Personalliggare"
          value={form.produktion_personalliggare}
          onChange={onChange('produktion_personalliggare')}
          fullWidth
          multiline
          minRows={2}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Avvikelser"
          value={form.produktion_avvikelser}
          onChange={onChange('produktion_avvikelser')}
          fullWidth
          multiline
          minRows={2}
          helperText="Hänvisar till avvikelserapport (Flik 16)."
        />
      </Grid>

      <SectionTitle>Montage och mätutrustning</SectionTitle>
      <Grid item xs={12}>
        <TextField
          label="Montage och mätutrustning"
          value={form.montage_matutrustning}
          onChange={onChange('montage_matutrustning')}
          fullWidth
          multiline
          minRows={3}
        />
      </Grid>

      <SectionTitle helper="Provning och besiktning.">Avslutningsskede</SectionTitle>
      <Grid item xs={12}>
        <TextField
          label="Provning"
          value={form.avslutning_provning}
          onChange={onChange('avslutning_provning')}
          fullWidth
          multiline
          minRows={2}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Besiktning"
          value={form.avslutning_besiktning}
          onChange={onChange('avslutning_besiktning')}
          fullWidth
          multiline
          minRows={2}
        />
      </Grid>

      <SectionTitle>Dokumentstyrning och distributionsförteckning</SectionTitle>
      <Grid item xs={12}>
        <TextField
          label="Dokumentstyrning"
          value={form.dokumentstyrning}
          onChange={onChange('dokumentstyrning')}
          fullWidth
          multiline
          minRows={2}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Distributionsförteckning"
          value={form.distributionsforteckning}
          onChange={onChange('distributionsforteckning')}
          fullWidth
          multiline
          minRows={2}
        />
      </Grid>
    </Grid>
  )
}
