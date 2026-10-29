import {
  Alert,
  Checkbox,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'

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

/** Ordnings- och skyddsregler namngivna i underlaget (Flik 7). */
const ORDNINGSREGLER = [
  { field: 'regel_skyddsutrustning', label: 'Skyddsutrustning' },
  { field: 'regel_heta_arbeten', label: 'Heta arbeten' },
  { field: 'regel_tillfallig_el', label: 'Tillfällig el' },
  { field: 'regel_buller', label: 'Buller' },
  { field: 'regel_droger', label: 'Droger' },
]

/**
 * Flik 7 – Arbetsmiljöplan.
 * Avsnitt enligt docs/kma-underlag/flikar-05-07-planer.md.
 */
export default function ArbetsmiljoplanFormFields({ form, onChange, onCheckboxChange }) {
  return (
    <Grid container spacing={2}>
      <SectionTitle>Arbetsmiljöpolicy</SectionTitle>
      <Grid item xs={12}>
        <TextField
          label="Arbetsmiljöpolicy"
          value={form.arbetsmiljopolicy}
          onChange={onChange('arbetsmiljopolicy')}
          fullWidth
          multiline
          minRows={3}
        />
      </Grid>

      <SectionTitle helper="Uppföljning sker via skyddsronder (Flik 21).">
        Uppföljning via skyddsronder
      </SectionTitle>
      <Grid item xs={12}>
        <Alert severity="info" sx={{ mb: 1 }}>
          Hänvisar till skyddsrond (Flik 21) när den finns.
        </Alert>
        <TextField
          label="Uppföljning via skyddsronder"
          value={form.uppfoljning_skyddsronder}
          onChange={onChange('uppfoljning_skyddsronder')}
          fullWidth
          multiline
          minRows={2}
        />
      </Grid>

      <SectionTitle helper="Markera aktuella ordnings- och skyddsregler.">
        Ordnings- och skyddsregler
      </SectionTitle>
      <Grid item xs={12}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">Aktuell</TableCell>
              <TableCell>Regel / avsnitt</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ORDNINGSREGLER.map(({ field, label }) => (
              <TableRow key={field} hover>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={Boolean(form[field])}
                    onChange={onCheckboxChange(field)}
                    inputProps={{ 'aria-label': label }}
                  />
                </TableCell>
                <TableCell>{label}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Anteckningar till ordnings- och skyddsregler"
          value={form.ordningsregler_anteckningar}
          onChange={onChange('ordningsregler_anteckningar')}
          fullWidth
          multiline
          minRows={2}
        />
      </Grid>

      <SectionTitle>Samordning med underentreprenörer</SectionTitle>
      <Grid item xs={12}>
        <TextField
          label="Samordning med underentreprenörer"
          value={form.samordning_ue}
          onChange={onChange('samordning_ue')}
          fullWidth
          multiline
          minRows={3}
          helperText="Hänvisar till underleverantörer under projektet (Flik 4)."
        />
      </Grid>

      <SectionTitle>Skyddsrond</SectionTitle>
      <Grid item xs={12}>
        <Alert severity="info" sx={{ mb: 1 }}>
          Hänvisar till skyddsrond (Flik 21). Full modul byggs i ett senare steg.
        </Alert>
        <TextField
          label="Anteckningar till skyddsrond"
          value={form.skyddsrond_anteckningar}
          onChange={onChange('skyddsrond_anteckningar')}
          fullWidth
          multiline
          minRows={2}
        />
      </Grid>

      <SectionTitle>Riskbedömning och handlingsplan</SectionTitle>
      <Grid item xs={12}>
        <Alert severity="info" sx={{ mb: 1 }}>
          Hänvisar till riskbedömning och handlingsplan (Flik 28). Full modul byggs i ett senare steg.
        </Alert>
        <TextField
          label="Anteckningar till riskbedömning och handlingsplan"
          value={form.riskbedomning_anteckningar}
          onChange={onChange('riskbedomning_anteckningar')}
          fullWidth
          multiline
          minRows={2}
        />
      </Grid>
    </Grid>
  )
}
