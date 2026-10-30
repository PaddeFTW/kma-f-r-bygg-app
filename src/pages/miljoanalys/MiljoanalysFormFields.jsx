import {
  Alert,
  Grid,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
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

/** Miljöaspekter enligt Flik 8 – underlaget. */
const MILJOASPEKTER = [
  { field: 'atgard_transporter', label: 'Transporter', group: 'Arbetsmetodik' },
  { field: 'atgard_tomgang', label: 'Tomgång', group: 'Arbetsmetodik' },
  { field: 'atgard_damm', label: 'Damm', group: 'Arbetsmetodik' },
  { field: 'atgard_buller', label: 'Buller', group: 'Arbetsmetodik' },
  { field: 'atgard_materialhantering', label: 'Materialhantering', group: null },
  { field: 'atgard_kallsortering', label: 'Källsortering', group: null },
  { field: 'atgard_byggavfall', label: 'Byggavfall', group: null },
  { field: 'atgard_nodlagesberedskap', label: 'Nödlägesberedskap', group: null },
]

/**
 * Flik 8 – Miljöanalys.
 * Avsnitt enligt docs/kma-underlag/flikar-08-12-analys-kontroll.md.
 */
export default function MiljoanalysFormFields({ form, onChange, projectId }) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Alert severity="info">
          Miljöanalysen kompletterar miljöplanen (Flik 6)
          {projectId ? (
            <>
              {' – '}
              <Link
                component={RouterLink}
                to={`/miljoplan?project=${projectId}`}
                underline="hover"
              >
                öppna miljöplaner för projektet
              </Link>
            </>
          ) : null}
          .
        </Alert>
      </Grid>

      <SectionTitle helper="Fyll i åtgärd per miljöaspekt. Arbetsmetodik: transporter, tomgång, damm och buller.">
        Miljöaspekter och åtgärder
      </SectionTitle>
      <Grid item xs={12}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '32%' }}>Miljöaspekt</TableCell>
              <TableCell>Åtgärd</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {MILJOASPEKTER.map(({ field, label, group }) => (
              <TableRow key={field} hover>
                <TableCell>
                  <Typography fontWeight={500}>{label}</Typography>
                  {group && (
                    <Typography variant="caption" color="text.secondary" display="block">
                      {group}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <TextField
                    value={form[field]}
                    onChange={onChange(field)}
                    fullWidth
                    multiline
                    minRows={2}
                    placeholder="Beskriv åtgärd"
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Grid>
    </Grid>
  )
}
