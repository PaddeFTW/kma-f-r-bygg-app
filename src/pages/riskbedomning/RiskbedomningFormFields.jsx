import {
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
import {
  RISKBEDOMNING_JA_NEJ_OPTIONS,
  RISKBEDOMNING_RISKNIVA_OPTIONS,
} from '../../lib/types'

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
 * Flik 28 – Riskbedömning + Lagar.
 * Riskmatris + handlingsplan enligt docs/kma-underlag/flikar-22-31-uppfoljning-avslut.md.
 */
export default function RiskbedomningFormFields({
  form,
  onChange,
  onAfsChange,
  onAddAfs,
  onRemoveAfs,
  onPlanChange,
  onAddPlan,
  onRemovePlan,
}) {
  return (
    <Grid container spacing={2}>
      <SectionTitle helper="Riskbedömning baserad på AFS. Anslås på arbetsplatsen.">
        Riskmatris (AFS)
      </SectionTitle>
      <Grid item xs={12}>
        <Box sx={{ overflowX: 'auto', border: 1, borderColor: 'divider', borderRadius: 1 }}>
          <Table size="small" sx={{ minWidth: 980 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ minWidth: 100 }}>AFS-nr</TableCell>
                <TableCell sx={{ minWidth: 160 }}>Titel</TableCell>
                <TableCell sx={{ minWidth: 100 }}>Ja/Nej</TableCell>
                <TableCell sx={{ minWidth: 110 }}>Låg/Medel/Hög</TableCell>
                <TableCell sx={{ minWidth: 120 }}>Ansvarig</TableCell>
                <TableCell sx={{ minWidth: 110 }}>Handlingsplan nr</TableCell>
                <TableCell sx={{ minWidth: 130 }}>Datum</TableCell>
                <TableCell align="right" sx={{ width: 48 }} />
              </TableRow>
            </TableHead>
            <TableBody>
              {form.afs_rader.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8}>
                    <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
                      Inga AFS-rader. Lägg till en rad.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                form.afs_rader.map((rad) => (
                  <TableRow key={rad._key}>
                    <TableCell>
                      <TextField
                        value={rad.afs_nummer}
                        onChange={onAfsChange(rad._key, 'afs_nummer')}
                        size="small"
                        fullWidth
                        variant="standard"
                        placeholder="2023:1"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={rad.titel}
                        onChange={onAfsChange(rad._key, 'titel')}
                        size="small"
                        fullWidth
                        variant="standard"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        select
                        value={rad.tillamplig}
                        onChange={onAfsChange(rad._key, 'tillamplig')}
                        size="small"
                        fullWidth
                        variant="standard"
                      >
                        <MenuItem value="">—</MenuItem>
                        {RISKBEDOMNING_JA_NEJ_OPTIONS.map((opt) => (
                          <MenuItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </TableCell>
                    <TableCell>
                      <TextField
                        select
                        value={rad.riskniva}
                        onChange={onAfsChange(rad._key, 'riskniva')}
                        size="small"
                        fullWidth
                        variant="standard"
                      >
                        <MenuItem value="">—</MenuItem>
                        {RISKBEDOMNING_RISKNIVA_OPTIONS.map((opt) => (
                          <MenuItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={rad.ansvarig}
                        onChange={onAfsChange(rad._key, 'ansvarig')}
                        size="small"
                        fullWidth
                        variant="standard"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={rad.handlingsplan_nr}
                        onChange={onAfsChange(rad._key, 'handlingsplan_nr')}
                        size="small"
                        fullWidth
                        variant="standard"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="date"
                        value={rad.datum}
                        onChange={onAfsChange(rad._key, 'datum')}
                        size="small"
                        fullWidth
                        variant="standard"
                        InputLabelProps={{ shrink: true }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        aria-label="Ta bort AFS-rad"
                        size="small"
                        color="error"
                        onClick={() => onRemoveAfs(rad._key)}
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
        <Button startIcon={<AddIcon />} onClick={onAddAfs} sx={{ mt: 1.5 }}>
          Lägg till AFS-rad
        </Button>
      </Grid>

      <SectionTitle helper="Härleds från risk AFS, åtgärd, ansvarig, klart datum.">
        Handlingsplan
      </SectionTitle>
      <Grid item xs={12}>
        <Box sx={{ overflowX: 'auto', border: 1, borderColor: 'divider', borderRadius: 1 }}>
          <Table size="small" sx={{ minWidth: 720 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ minWidth: 140 }}>Härleds från risk AFS</TableCell>
                <TableCell sx={{ minWidth: 220 }}>Åtgärd</TableCell>
                <TableCell sx={{ minWidth: 140 }}>Ansvarig</TableCell>
                <TableCell sx={{ minWidth: 140 }}>Klart datum</TableCell>
                <TableCell align="right" sx={{ width: 48 }} />
              </TableRow>
            </TableHead>
            <TableBody>
              {form.handlingsplan.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
                      Ingen handlingsplan ännu. Lägg till en rad.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                form.handlingsplan.map((rad) => (
                  <TableRow key={rad._key}>
                    <TableCell>
                      <TextField
                        value={rad.fran_afs}
                        onChange={onPlanChange(rad._key, 'fran_afs')}
                        size="small"
                        fullWidth
                        variant="standard"
                        placeholder="AFS-nr"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={rad.atgard}
                        onChange={onPlanChange(rad._key, 'atgard')}
                        size="small"
                        fullWidth
                        variant="standard"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={rad.ansvarig}
                        onChange={onPlanChange(rad._key, 'ansvarig')}
                        size="small"
                        fullWidth
                        variant="standard"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="date"
                        value={rad.klart_datum}
                        onChange={onPlanChange(rad._key, 'klart_datum')}
                        size="small"
                        fullWidth
                        variant="standard"
                        InputLabelProps={{ shrink: true }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        aria-label="Ta bort rad"
                        size="small"
                        color="error"
                        onClick={() => onRemovePlan(rad._key)}
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
        <Button startIcon={<AddIcon />} onClick={onAddPlan} sx={{ mt: 1.5 }}>
          Lägg till i handlingsplan
        </Button>
      </Grid>

      <SectionTitle>Signering</SectionTitle>
      <Grid item xs={12} md={4}>
        <TextField
          label="Upprättare"
          value={form.upprattare}
          onChange={onChange('upprattare')}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          label="VD"
          value={form.vd}
          onChange={onChange('vd')}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          label="Arbetstagarrepresentant"
          value={form.arbetstagarrepresentant}
          onChange={onChange('arbetstagarrepresentant')}
          fullWidth
        />
      </Grid>
    </Grid>
  )
}
