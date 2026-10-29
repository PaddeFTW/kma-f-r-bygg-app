import {
  Alert,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  Link,
  TextField,
  Typography,
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

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

const MILJOASPEKTER = [
  { field: 'aspekt_transporter', label: 'Transporter' },
  { field: 'aspekt_byggavfall', label: 'Byggavfall' },
  { field: 'aspekt_kemikalier', label: 'Kemikalier' },
  { field: 'aspekt_farligt_avfall', label: 'Farligt avfall' },
  { field: 'aspekt_el', label: 'El' },
  { field: 'aspekt_kallsortering', label: 'Källsortering' },
]

/**
 * Flik 6 – Miljöplan.
 * Avsnitt enligt docs/kma-underlag/flikar-05-07-planer.md.
 */
export default function MiljoplanFormFields({ form, onChange, onCheckboxChange }) {
  return (
    <Grid container spacing={2}>
      <SectionTitle>Miljöpolicy</SectionTitle>
      <Grid item xs={12}>
        <TextField
          label="Miljöpolicy"
          value={form.miljopolicy}
          onChange={onChange('miljopolicy')}
          fullWidth
          multiline
          minRows={3}
        />
      </Grid>

      <SectionTitle helper="Markera aktuella miljöaspekter. Detaljerad analys hör till Flik 8.">
        Miljöaspekter
      </SectionTitle>
      <Grid item xs={12}>
        <Alert severity="info" sx={{ mb: 1 }}>
          Miljöaspekter kopplas till Flik 8 (miljöanalys)
          {projectId ? (
            <>
              {' – '}
              <Link
                component={RouterLink}
                to={`/miljoanalys?project=${projectId}`}
                underline="hover"
              >
                öppna miljöanalyser för projektet
              </Link>
            </>
          ) : null}
          .
        </Alert>
        <FormGroup>
          {MILJOASPEKTER.map(({ field, label }) => (
            <FormControlLabel
              key={field}
              control={
                <Checkbox
                  checked={Boolean(form[field])}
                  onChange={onCheckboxChange(field)}
                />
              }
              label={label}
            />
          ))}
        </FormGroup>
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Anteckningar till miljöaspekter"
          value={form.miljoaspekter_anteckningar}
          onChange={onChange('miljoaspekter_anteckningar')}
          fullWidth
          multiline
          minRows={2}
        />
      </Grid>

      <SectionTitle>Källsortering och kemikalier (SDB)</SectionTitle>
      <Grid item xs={12}>
        <TextField
          label="Källsortering och kemikalier (SDB)"
          value={form.kallsortering_kemikalier_sdb}
          onChange={onChange('kallsortering_kemikalier_sdb')}
          fullWidth
          multiline
          minRows={3}
          helperText="Hänvisar till säkerhetsdatablad (Flik 17) när den finns."
        />
      </Grid>

      <SectionTitle>Lagar och andra krav</SectionTitle>
      <Grid item xs={12}>
        <TextField
          label="Lagar och andra krav"
          value={form.lagar_krav}
          onChange={onChange('lagar_krav')}
          fullWidth
          multiline
          minRows={3}
        />
      </Grid>

      <SectionTitle helper="Ansvar, utbildning och kommunikation.">
        Ansvar, utbildning, kommunikation
      </SectionTitle>
      <Grid item xs={12}>
        <TextField
          label="Ansvar"
          value={form.ansvar}
          onChange={onChange('ansvar')}
          fullWidth
          multiline
          minRows={2}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Utbildning"
          value={form.utbildning}
          onChange={onChange('utbildning')}
          fullWidth
          multiline
          minRows={2}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Kommunikation"
          value={form.kommunikation}
          onChange={onChange('kommunikation')}
          fullWidth
          multiline
          minRows={2}
        />
      </Grid>

      <SectionTitle helper="Egenkontroll för miljö, avvikelser och nödläge.">
        Egenkontroll, avvikelser, nödläge
      </SectionTitle>
      <Grid item xs={12}>
        <TextField
          label="Egenkontroll för miljö"
          value={form.egenkontroll_miljo}
          onChange={onChange('egenkontroll_miljo')}
          fullWidth
          multiline
          minRows={2}
          helperText="Hänvisar till egenkontroll (Flik 13)."
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Avvikelser"
          value={form.avvikelser}
          onChange={onChange('avvikelser')}
          fullWidth
          multiline
          minRows={2}
          helperText="Hänvisar till avvikelserapport (Flik 16) när den finns."
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Nödläge"
          value={form.nodlage}
          onChange={onChange('nodlage')}
          fullWidth
          multiline
          minRows={2}
          helperText="Hänvisar till nödlägesberedskap (Flik 18) när den finns."
        />
      </Grid>
    </Grid>
  )
}
