import {
  Alert,
  Checkbox,
  Chip,
  Grid,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import {
  KB_AFS_2023_3_URL,
  getRiskHelper,
  rowsRequireAmp,
} from '../../lib/sarskildaRisker'

import { SectionHeader, GuidedTextField } from '../../components/forms'

function SectionTitle({ children, helper, why, showKbLink }) {
  return (
    <SectionHeader helper={helper} why={why} showKbLink={showKbLink}>
      {children}
    </SectionHeader>
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
 * Avsnitt enligt docs/kma-underlag/flikar-05-07-planer.md + AFS 2023:3 särskilda risker.
 */
export default function ArbetsmiljoplanFormFields({
  form,
  onChange,
  onCheckboxChange,
  sarskildaRisker = [],
}) {
  const ampRequired = rowsRequireAmp(sarskildaRisker)
  const jaRisker = (sarskildaRisker || []).filter((r) => r.svar === 'ja')

  return (
    <Grid container spacing={2}>
      {ampRequired ? (
        <Grid item xs={12}>
          <Alert
            severity="warning"
            action={<Chip size="small" color="warning" label="AMP krävs" />}
          >
            Projektet har särskilda risker markerade Ja (AFS 2023:3 11 kap. 12 §). Avsnittet
            riskbedömning förifylls från checklistan.{' '}
            <Link href={KB_AFS_2023_3_URL} target="_blank" rel="noopener noreferrer">
              Knowledge base
            </Link>
          </Alert>
        </Grid>
      ) : null}

      {jaRisker.length > 0 ? (
        <>
          <SectionTitle helper="Hämtas från projektets 13-punktschecklista.">
            Särskilda risker som kräver AMP
          </SectionTitle>
          <Grid item xs={12}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell width={48}>Nr</TableCell>
                  <TableCell>Risk</TableCell>
                  <TableCell>Åtgärd</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {jaRisker.map((row) => {
                  const meta = getRiskHelper(row.punkt_nr)
                  return (
                    <TableRow key={row.punkt_nr}>
                      <TableCell>{row.punkt_nr}</TableCell>
                      <TableCell>
                        <Typography variant="body2" component="span" sx={{ mr: 0.5 }}>
                          {row.benamning}
                        </Typography>
                        {meta ? (
                          <Tooltip title={`${meta.helper} Förslag: ${meta.atgard_forslag}`} arrow>
                            <InfoOutlinedIcon
                              sx={{ fontSize: 16, color: 'text.disabled', verticalAlign: 'middle' }}
                            />
                          </Tooltip>
                        ) : null}
                      </TableCell>
                      <TableCell>{row.atgard || meta?.atgard_forslag || '—'}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </Grid>
        </>
      ) : null}

      <SectionTitle
        why="Policyn är kärnan i AMP och visar Bas-P/Bas-U-ansvaret."
        showKbLink
      >
        Arbetsmiljöpolicy
      </SectionTitle>
      <Grid item xs={12}>
        <GuidedTextField
          helpKey="arbetsmiljopolicy"
          label="Arbetsmiljöpolicy"
          value={form.arbetsmiljopolicy}
          onChange={onChange('arbetsmiljopolicy')}
          fullWidth
          multiline
          minRows={3}
        />
      </Grid>

      <SectionTitle
        helper="Uppföljning sker via skyddsronder (Flik 21)."
        why="Skyddsronderna är beviset att AMP följs upp ute på plats."
      >
        Uppföljning via skyddsronder
      </SectionTitle>
      <Grid item xs={12}>
        <Alert severity="info" sx={{ mb: 1 }}>
          Hänvisar till skyddsrond (Flik 21) när den finns.
        </Alert>
        <GuidedTextField
          helpKey="skyddsrond"
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

      <SectionTitle why="UE måste få samma AMP-krav och ordningsregler som egna anställda.">
        Samordning med underentreprenörer
      </SectionTitle>
      <Grid item xs={12}>
        <GuidedTextField
          tooltip="Hur Bas-U samordnar UE kring AMP, ordningsregler och skyddsronder."
          why="Samordningen minskar gränssnittsrisker mellan entreprenörer."
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

      <SectionTitle helper="Förifylls när särskilda risker är Ja. Detaljerad riskmatris finns i Flik 28.">
        Riskbedömning och handlingsplan
      </SectionTitle>
      <Grid item xs={12}>
        <Alert severity="info" sx={{ mb: 1 }}>
          Hänvisar till riskbedömning och handlingsplan (Flik 28). Texten ovan speglar AFS 2023:3
          11 kap. 12 §.
        </Alert>
        <TextField
          label="Anteckningar till riskbedömning och handlingsplan"
          value={form.riskbedomning_anteckningar}
          onChange={onChange('riskbedomning_anteckningar')}
          fullWidth
          multiline
          minRows={ampRequired ? 5 : 2}
        />
      </Grid>
    </Grid>
  )
}
