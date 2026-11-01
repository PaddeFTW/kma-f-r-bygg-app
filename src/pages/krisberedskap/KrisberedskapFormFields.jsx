import { Grid, TextField } from '@mui/material'
import { SectionHeader, GuidedTextField, SuggestionAutocomplete } from '../../components/forms'
import { SUGGESTIONS } from '../../lib/formHelp'

function SectionTitle({ children, helper, why }) {
  return <SectionHeader helper={helper} why={why}>{children}</SectionHeader>
}

/**
 * Flik 20 – Krisberedskap.
 * Innehåll enligt docs/kma-underlag/flikar-17-21-sakerhet-rond.md.
 */
export default function KrisberedskapFormFields({ form, onChange }) {
  return (
    <Grid container spacing={2}>
      <SectionTitle
        helper="Exempel: olycka, våld, hot."
        why="Tydliga scenarier gör det enklare att veta när krisplanen ska aktiveras."
      >
        Exempel på händelser
      </SectionTitle>
      <Grid item xs={12}>
        <GuidedTextField
          helpKey="kris_handelser"
          label="Exempel på händelser"
          value={form.exempel_handelser}
          onChange={onChange('exempel_handelser')}
          fullWidth
          multiline
          minRows={3}
          placeholder="Olycka, våld, hot m.m."
        />
      </Grid>

      <SectionTitle
        helper="Rädda, larma 112, utrym."
        why="Åtgärderna ska vara kända innan något händer så att första minuterna används rätt."
      >
        Omedelbara åtgärder
      </SectionTitle>
      <Grid item xs={12}>
        <SuggestionAutocomplete
          helpKey="kris_atgarder"
          label="Omedelbara åtgärder"
          value={form.omedelbara_atgarder}
          onChangeField={onChange('omedelbara_atgarder')}
          options={SUGGESTIONS.atgarder}
          placeholder="Rädda, larma 112, utrym"
        />
      </Grid>

      <SectionTitle why="Krisgruppen visar vilka som leder kommunikation, beslut och uppföljning vid kris.">
        Krisgrupp
      </SectionTitle>
      <Grid item xs={12}>
        <GuidedTextField
          helpKey="contact_name"
          label="Krisgrupp"
          value={form.krisgrupp}
          onChange={onChange('krisgrupp')}
          fullWidth
          multiline
          minRows={2}
        />
      </Grid>

      <SectionTitle why="Samlade telefonnummer minskar söktid när ansvariga och myndigheter behöver nås snabbt.">
        Viktiga telefonnummer
      </SectionTitle>
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

      <SectionTitle why="Vissa allvarliga händelser ska anmälas direkt och behöver därför ha en förberedd rutin.">
        Anmälan till Arbetsmiljöverket
      </SectionTitle>
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

      <SectionTitle why="Uppföljningen fångar lärdomar och säkerställer att beslutade åtgärder blir genomförda.">
        Uppföljning
      </SectionTitle>
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
