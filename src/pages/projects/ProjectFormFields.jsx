import { Grid, MenuItem, TextField, Typography } from '@mui/material'
import { contractForms } from '../../lib/types'

function SectionTitle({ children }) {
  return (
    <Grid item xs={12}>
      <Typography variant="h6" sx={{ fontWeight: 600, mt: 1 }}>
        {children}
      </Typography>
    </Grid>
  )
}

/**
 * Flik 1 – Projektbeskrivning.
 * Obligatoriska kontaktfält för huvudparter enligt underlaget.
 */
export default function ProjectFormFields({ form, onChange }) {
  return (
    <Grid container spacing={2}>
      <SectionTitle>Fastighet</SectionTitle>
      <Grid item xs={12} md={6}>
        <TextField
          label="Fastighetsbeteckning"
          value={form.property_designation}
          onChange={onChange('property_designation')}
          required
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Fastighetsadress"
          value={form.address}
          onChange={onChange('address')}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField label="Postnr" value={form.postal_code} onChange={onChange('postal_code')} fullWidth />
      </Grid>
      <Grid item xs={12} sm={8}>
        <TextField label="Ort" value={form.city} onChange={onChange('city')} fullWidth />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Vägbeskrivning"
          value={form.directions}
          onChange={onChange('directions')}
          fullWidth
          multiline
          minRows={2}
        />
      </Grid>

      <SectionTitle>Kontaktperson på byggplatsen</SectionTitle>
      <Grid item xs={12} md={4}>
        <TextField
          label="Namn"
          value={form.contact_name}
          onChange={onChange('contact_name')}
          required
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField label="Mobil" value={form.phone} onChange={onChange('phone')} required fullWidth />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          label="E-post"
          type="email"
          value={form.email}
          onChange={onChange('email')}
          required
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Information"
          value={form.contact_info}
          onChange={onChange('contact_info')}
          fullWidth
          multiline
          minRows={2}
        />
      </Grid>

      <SectionTitle>Byggherre / beställare</SectionTitle>
      <Grid item xs={12} md={6}>
        <TextField
          label="Företag / namn"
          value={form.client_name}
          onChange={onChange('client_name')}
          required
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Org.nr"
          value={form.client_org_number}
          onChange={onChange('client_org_number')}
          required
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Adress"
          value={form.client_address}
          onChange={onChange('client_address')}
          required
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          label="Postnr"
          value={form.client_postal_code}
          onChange={onChange('client_postal_code')}
          required
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={8}>
        <TextField
          label="Ort"
          value={form.client_city}
          onChange={onChange('client_city')}
          required
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Mobil"
          value={form.client_phone}
          onChange={onChange('client_phone')}
          required
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="E-post"
          type="email"
          value={form.client_email}
          onChange={onChange('client_email')}
          required
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Information"
          value={form.client_info}
          onChange={onChange('client_info')}
          fullWidth
          multiline
          minRows={2}
        />
      </Grid>

      <SectionTitle>Entreprenör</SectionTitle>
      <Grid item xs={12} md={6}>
        <TextField
          label="Företag"
          value={form.contractor_name}
          onChange={onChange('contractor_name')}
          required
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Org.nr"
          value={form.contractor_org_number}
          onChange={onChange('contractor_org_number')}
          required
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Adress"
          value={form.contractor_address}
          onChange={onChange('contractor_address')}
          required
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          label="Postnr"
          value={form.contractor_postal_code}
          onChange={onChange('contractor_postal_code')}
          required
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={8}>
        <TextField
          label="Ort"
          value={form.contractor_city}
          onChange={onChange('contractor_city')}
          required
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Projektansvarig"
          value={form.contractor_project_manager}
          onChange={onChange('contractor_project_manager')}
          required
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Mobil (projektansvarig)"
          value={form.contractor_project_manager_phone}
          onChange={onChange('contractor_project_manager_phone')}
          required
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Arbetsledare"
          value={form.contractor_site_manager}
          onChange={onChange('contractor_site_manager')}
          required
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Mobil (arbetsledare)"
          value={form.contractor_site_manager_phone}
          onChange={onChange('contractor_site_manager_phone')}
          required
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          select
          label="Entreprenadform"
          value={form.contract_form}
          onChange={onChange('contract_form')}
          required
          fullWidth
        >
          <MenuItem value="">
            <em>Välj…</em>
          </MenuItem>
          {contractForms.map((value) => (
            <MenuItem key={value} value={value}>
              {value}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Information"
          value={form.contractor_info}
          onChange={onChange('contractor_info')}
          fullWidth
          multiline
          minRows={2}
        />
      </Grid>

      <SectionTitle>Projektbeskrivning</SectionTitle>
      <Grid item xs={12}>
        <TextField
          label="Projektbeskrivning"
          value={form.description}
          onChange={onChange('description')}
          fullWidth
          multiline
          minRows={4}
        />
      </Grid>
    </Grid>
  )
}
