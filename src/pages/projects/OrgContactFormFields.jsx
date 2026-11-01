import { Grid, TextField } from '@mui/material'
import { SectionHeader, GuidedTextField } from '../../components/forms'

function SectionTitle({ children, why }) {
  return <SectionHeader why={why}>{children}</SectionHeader>
}

/**
 * Delade fält för Flik 3 (beställare) och Flik 4 (underleverantör).
 * Endast fält enligt underlaget. includePurchasing = Flik 4.
 */
export default function OrgContactFormFields({
  form,
  onChange,
  includePurchasing = false,
  requireContact = true,
}) {
  return (
    <Grid container spacing={2}>
      <SectionTitle why="Kontaktuppgifter behövs för samordning, inbjudningar och distribution.">
        Kontaktuppgifter
      </SectionTitle>
      <Grid item xs={12} md={6}>
        <TextField
          label="VD"
          value={form.ceo_name}
          onChange={onChange('ceo_name')}
          required={requireContact}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <GuidedTextField
          helpKey="contact_name"
          label="Kontaktperson"
          value={form.contact_name}
          onChange={onChange('contact_name')}
          required={requireContact}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Adress"
          value={form.address}
          onChange={onChange('address')}
          required={requireContact}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          label="Postnr"
          value={form.postal_code}
          onChange={onChange('postal_code')}
          required={requireContact}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={8}>
        <TextField
          label="Ort"
          value={form.city}
          onChange={onChange('city')}
          required={requireContact}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          label="Mobil"
          value={form.phone}
          onChange={onChange('phone')}
          required={requireContact}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          label="E-post"
          type="email"
          value={form.email}
          onChange={onChange('email')}
          required={requireContact}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          label="Hemsida"
          value={form.website}
          onChange={onChange('website')}
          fullWidth
          placeholder="https://"
        />
      </Grid>

      <SectionTitle>Ansvariga</SectionTitle>
      <Grid item xs={12} md={6}>
        <TextField
          label="Projektansvarig"
          value={form.project_manager}
          onChange={onChange('project_manager')}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Kvalitetsansvarig"
          value={form.quality_manager}
          onChange={onChange('quality_manager')}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Miljöansvarig"
          value={form.environmental_manager}
          onChange={onChange('environmental_manager')}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Arbetsmiljöansvarig"
          value={form.work_environment_manager}
          onChange={onChange('work_environment_manager')}
          fullWidth
        />
      </Grid>
      {includePurchasing && (
        <Grid item xs={12} md={6}>
          <TextField
            label="Inköpsansvarig"
            value={form.purchasing_manager || ''}
            onChange={onChange('purchasing_manager')}
            fullWidth
          />
        </Grid>
      )}

      <SectionTitle>Anteckningar</SectionTitle>
      <Grid item xs={12}>
        <TextField
          label="Anteckningar"
          value={form.notes}
          onChange={onChange('notes')}
          fullWidth
          multiline
          minRows={3}
        />
      </Grid>
    </Grid>
  )
}
