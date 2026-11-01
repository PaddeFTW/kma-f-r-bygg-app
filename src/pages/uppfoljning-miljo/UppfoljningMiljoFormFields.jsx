import {
  Alert,
  Box,
  Button,
  Grid,
  IconButton,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { UPPFOLJNING_MILJO_STATUS_OPTIONS } from '../../lib/types'
import { SectionHeader, GuidedTextField } from '../../components/forms'

function SectionTitle({ children, helper, why }) {
  return <SectionHeader helper={helper} why={why}>{children}</SectionHeader>
}

/**
 * Flik 27 – Uppföljning Miljö.
 * Kontrollmoment enligt docs/kma-underlag/flikar-22-31-uppfoljning-avslut.md.
 */
export default function UppfoljningMiljoFormFields({
  form,
  onRadChange,
  onAddRad,
  onRemoveRad,
}) {
  return (
    <Grid container spacing={2}>
      <SectionTitle
        helper="Uppföljning av miljö."
        why="Poängen visar om miljökraven följs och vilka områden som behöver styras om."
      >
        Kontrollmoment
      </SectionTitle>
      <Grid item xs={12}>
        <Alert severity="info" sx={{ mb: 1.5 }}>
          1 = Icke godkänt · 2 = Godkänt · 3 = Väl godkänt
        </Alert>
        <Box sx={{ overflowX: 'auto', border: 1, borderColor: 'divider', borderRadius: 1 }}>
          <Table size="small" sx={{ minWidth: 640 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ minWidth: 280 }}>Kontrollmoment</TableCell>
                <TableCell sx={{ minWidth: 240 }}>Poäng (1/2/3)</TableCell>
                <TableCell align="right" sx={{ width: 48 }} />
              </TableRow>
            </TableHead>
            <TableBody>
              {form.rader.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3}>
                    <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
                      Inga kontrollmoment. Lägg till en rad.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                form.rader.map((rad, index) => (
                  <TableRow key={rad._key}>
                    <TableCell>
                      <GuidedTextField
                        value={rad.kontrollmoment}
                        onChange={onRadChange(rad._key, 'kontrollmoment')}
                        size="small"
                        fullWidth
                        variant="standard"
                        compact
                        helpKey={index === 0 ? 'kontrollmoment' : undefined}
                      />
                    </TableCell>
                    <TableCell>
                      <GuidedTextField
                        select
                        value={rad.status}
                        onChange={onRadChange(rad._key, 'status')}
                        size="small"
                        fullWidth
                        variant="standard"
                        compact
                        helpKey={index === 0 ? 'uppfoljning_poang' : undefined}
                      >
                        <MenuItem value="">—</MenuItem>
                        {UPPFOLJNING_MILJO_STATUS_OPTIONS.map((opt) => (
                          <MenuItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </MenuItem>
                        ))}
                      </GuidedTextField>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        aria-label="Ta bort rad"
                        size="small"
                        color="error"
                        onClick={() => onRemoveRad(rad._key)}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Box>
        <Button startIcon={<AddIcon />} onClick={onAddRad} sx={{ mt: 1.5 }}>
          Lägg till kontrollmoment
        </Button>
      </Grid>
    </Grid>
  )
}
