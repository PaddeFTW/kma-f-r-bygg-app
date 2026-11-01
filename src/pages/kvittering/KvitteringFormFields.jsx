import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
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

function SignatureTable({ rows, onChange, onRemove, emptyLabel }) {
  return (
    <Box sx={{ overflowX: 'auto', border: 1, borderColor: 'divider', borderRadius: 1 }}>
      <Table size="small" sx={{ minWidth: 560 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ minWidth: 180 }}>Namn</TableCell>
            <TableCell sx={{ minWidth: 140 }}>Datum</TableCell>
            <TableCell sx={{ minWidth: 180 }}>Signatur</TableCell>
            <TableCell align="right" sx={{ width: 48 }} />
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4}>
                <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
                  {emptyLabel}
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            rows.map((rad) => (
              <TableRow key={rad._key}>
                <TableCell>
                  <TextField
                    value={rad.namn}
                    onChange={onChange(rad._key, 'namn')}
                    size="small"
                    fullWidth
                    variant="standard"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="date"
                    value={rad.datum}
                    onChange={onChange(rad._key, 'datum')}
                    size="small"
                    fullWidth
                    variant="standard"
                    InputLabelProps={{ shrink: true }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={rad.signatur}
                    onChange={onChange(rad._key, 'signatur')}
                    size="small"
                    fullWidth
                    variant="standard"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    aria-label="Ta bort rad"
                    size="small"
                    color="error"
                    onClick={() => onRemove(rad._key)}
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
  )
}

/**
 * Flik 29 – Kvitteringslistor.
 * Dokument + namn/datum/signatur för anställda och UE enligt underlag.
 */
export default function KvitteringFormFields({
  form,
  onDokumentChange,
  onAnstalldChange,
  onAddAnstalld,
  onRemoveAnstalld,
  onUeChange,
  onAddUe,
  onRemoveUe,
}) {
  return (
    <Grid container spacing={2}>
      <SectionTitle helper="Bevis att personal och UE fått säkerhetsinformation.">
        Dokument
      </SectionTitle>
      <Grid item xs={12}>
        <FormGroup row>
          <FormControlLabel
            control={
              <Checkbox
                checked={Boolean(form.dokument_amp)}
                onChange={onDokumentChange('dokument_amp')}
              />
            }
            label="AMP"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={Boolean(form.dokument_riskbedomning)}
                onChange={onDokumentChange('dokument_riskbedomning')}
              />
            }
            label="Riskbedömning"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={Boolean(form.dokument_ordningsregler)}
                onChange={onDokumentChange('dokument_ordningsregler')}
              />
            }
            label="Ordningsregler"
          />
        </FormGroup>
      </Grid>

      <SectionTitle helper="Kvittering från anställda.">Anställda</SectionTitle>
      <Grid item xs={12}>
        <SignatureTable
          rows={form.anstallda}
          onChange={onAnstalldChange}
          onRemove={onRemoveAnstalld}
          emptyLabel="Inga anställda ännu. Lägg till en rad."
        />
        <Button startIcon={<AddIcon />} onClick={onAddAnstalld} sx={{ mt: 1.5 }}>
          Lägg till anställd
        </Button>
      </Grid>

      <SectionTitle helper="Kvittering från underentreprenörer.">UE</SectionTitle>
      <Grid item xs={12}>
        <SignatureTable
          rows={form.ue}
          onChange={onUeChange}
          onRemove={onRemoveUe}
          emptyLabel="Inga UE ännu. Lägg till en rad."
        />
        <Button startIcon={<AddIcon />} onClick={onAddUe} sx={{ mt: 1.5 }}>
          Lägg till UE
        </Button>
      </Grid>
    </Grid>
  )
}
