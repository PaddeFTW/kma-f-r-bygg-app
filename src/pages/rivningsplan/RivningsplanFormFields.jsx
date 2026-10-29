import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
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

const HANTERING_NR = [
  { value: '1', label: '1. Material som kan återanvändas' },
  { value: '2', label: '2. Avfall för materialåtervinning' },
  { value: '3', label: '3. Brännbart avfall' },
  { value: '4', label: '4. Blandat avfall – för eftersortering' },
  { value: '5', label: '5. Fyllnadsmassor' },
  { value: '6', label: '6. Avfall för deponi' },
]

/**
 * Flik 9 – Rivningsplan.
 * Avsnitt enligt docs/kma-underlag/flikar-08-12-analys-kontroll.md
 * och originalmall i docs/KMA-wordfilerna/Flik 9 Rivningsplan/.
 */
export default function RivningsplanFormFields({
  form,
  onChange,
  onCheckboxChange,
  onFarligtChange,
  onOvrigtChange,
  onAddFarligt,
  onRemoveFarligt,
  onAddOvrigt,
  onRemoveOvrigt,
}) {
  return (
    <Grid container spacing={2}>
      <SectionTitle>Administrativa uppgifter</SectionTitle>
      <Grid item xs={12}>
        <TextField
          label="Fastighetsbeteckning alt. adress"
          value={form.fastighetsbeteckning_adress}
          onChange={onChange('fastighetsbeteckning_adress')}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Beräknat start och stoppdatum för rivning"
          value={form.start_stoppdatum_rivning}
          onChange={onChange('start_stoppdatum_rivning')}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Kvalitetsansvarig / telefon"
          value={form.kvalitetsansvarig}
          onChange={onChange('kvalitetsansvarig')}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Byggherre"
          value={form.byggherre}
          onChange={onChange('byggherre')}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Byggherre – kontaktperson/telefon"
          value={form.byggherre_kontakt}
          onChange={onChange('byggherre_kontakt')}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Entreprenör"
          value={form.entreprenor}
          onChange={onChange('entreprenor')}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Entreprenör – kontaktperson/telefon"
          value={form.entreprenor_kontakt}
          onChange={onChange('entreprenor_kontakt')}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Rivare/telefon"
          value={form.rivare}
          onChange={onChange('rivare')}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Rivningsplan lämnas till (bygganmälan/rivningsanmälan)"
          value={form.bygganmalan_lamnas_till}
          onChange={onChange('bygganmalan_lamnas_till')}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Checkbox
              checked={Boolean(form.bygganmalan_kravs_inte)}
              onChange={onCheckboxChange('bygganmalan_kravs_inte')}
            />
          }
          label="Bygganmälan/rivningsanmälan krävs inte för denna åtgärd"
        />
      </Grid>

      <SectionTitle helper="Materialinventering krävs som underlag till rivningsplanen.">
        Materialinventering
      </SectionTitle>
      <Grid item xs={12}>
        <Alert severity="info" sx={{ mb: 1 }}>
          Materialinventering ska redovisas som bilaga. Egen mall får användas om den innehåller
          samma uppgifter som blanketten Materialinventering – sammanställning.
        </Alert>
        <FormControlLabel
          control={
            <Checkbox
              checked={Boolean(form.materialinventering_utford)}
              onChange={onCheckboxChange('materialinventering_utford')}
            />
          }
          label="Materialinventering har utförts och redovisas som bilaga"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={Boolean(form.materialinventering_ej_utford)}
              onChange={onCheckboxChange('materialinventering_ej_utford')}
            />
          }
          label="Materialinventering har inte utförts"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Anteckningar till materialinventering"
          value={form.materialinventering_anteckningar}
          onChange={onChange('materialinventering_anteckningar')}
          fullWidth
          multiline
          minRows={2}
        />
      </Grid>

      <SectionTitle>Byggnadsbeskrivning</SectionTitle>
      <Grid item xs={12} md={6}>
        <TextField
          label="Byggnadstyp"
          value={form.byggnadstyp}
          onChange={onChange('byggnadstyp')}
          fullWidth
          helperText="T.ex. flerfamiljshus, villa, industri, kontor"
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <TextField label="Byggår" value={form.byggar} onChange={onChange('byggar')} fullWidth />
      </Grid>
      <Grid item xs={12} md={3}>
        <TextField
          label="Ombyggnad, år"
          value={form.ombyggnad_ar}
          onChange={onChange('ombyggnad_ar')}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Byggnadsyta"
          value={form.byggnadsyta}
          onChange={onChange('byggnadsyta')}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Antal våningar"
          value={form.antal_vaningar}
          onChange={onChange('antal_vaningar')}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          label="Grund"
          value={form.material_grund}
          onChange={onChange('material_grund')}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          label="Stomme"
          value={form.material_stomme}
          onChange={onChange('material_stomme')}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          label="Tak"
          value={form.material_tak}
          onChange={onChange('material_tak')}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={8}>
        <TextField
          label="Nuvarande användning/verksamhet"
          value={form.nuvarande_anvandning}
          onChange={onChange('nuvarande_anvandning')}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          label="Från och med, år"
          value={form.nuvarande_anvandning_fran_ar}
          onChange={onChange('nuvarande_anvandning_fran_ar')}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={8}>
        <TextField
          label="Tidigare användning/verksamhet"
          value={form.tidigare_anvandning}
          onChange={onChange('tidigare_anvandning')}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          label="Från och med, år"
          value={form.tidigare_anvandning_fran_ar}
          onChange={onChange('tidigare_anvandning_fran_ar')}
          fullWidth
        />
      </Grid>

      <SectionTitle>Rivningens omfattning</SectionTitle>
      <Grid item xs={12}>
        <TextField
          label="Beskrivning av rivningens omfattning"
          value={form.rivning_omfattning}
          onChange={onChange('rivning_omfattning')}
          fullWidth
          multiline
          minRows={3}
          helperText="T.ex. hel eller del av byggnad, vatten/avlopp, ventilation, konstruktioner, sanering"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Byggnadsyta som berörs av rivningen, m²"
          value={form.rivning_byggnadsyta_m2}
          onChange={onChange('rivning_byggnadsyta_m2')}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Bilagor och handlingar"
          value={form.bilagor}
          onChange={onChange('bilagor')}
          fullWidth
          multiline
          minRows={1}
        />
      </Grid>

      <SectionTitle helper="Farligt avfall ska alltid sorteras vid källan. Markera FA vid farligt avfall.">
        Farligt avfall
      </SectionTitle>
      <Grid item xs={12}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Avfallsslag</TableCell>
              <TableCell padding="checkbox">FA</TableCell>
              <TableCell>Mängd</TableCell>
              <TableCell>Hantering</TableCell>
              <TableCell>Transportör/mottagare</TableCell>
              <TableCell align="right" width={56} />
            </TableRow>
          </TableHead>
          <TableBody>
            {(form.farligt_avfall || []).length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <Typography variant="body2" color="text.secondary">
                    Inga rader ännu. Lägg till avfallsslag.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              form.farligt_avfall.map((row, index) => (
                <TableRow key={`fa-${index}`} hover>
                  <TableCell>
                    <TextField
                      value={row.avfallsslag}
                      onChange={onFarligtChange(index, 'avfallsslag')}
                      fullWidth
                      size="small"
                      placeholder="Avfallsslag"
                    />
                  </TableCell>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={Boolean(row.fa)}
                      onChange={onFarligtChange(index, 'fa', true)}
                      inputProps={{ 'aria-label': 'Farligt avfall' }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={row.mangd}
                      onChange={onFarligtChange(index, 'mangd')}
                      fullWidth
                      size="small"
                      placeholder="antal/kg/m²/m³"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={row.hantering}
                      onChange={onFarligtChange(index, 'hantering')}
                      fullWidth
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={row.transportor_mottagare}
                      onChange={onFarligtChange(index, 'transportor_mottagare')}
                      fullWidth
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      aria-label="Ta bort rad"
                      size="small"
                      color="error"
                      onClick={() => onRemoveFarligt(index)}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <Box sx={{ mt: 1 }}>
          <Button startIcon={<AddIcon />} onClick={onAddFarligt} size="small">
            Lägg till rad
          </Button>
        </Box>
      </Grid>

      <SectionTitle helper="Ska vara fritt från farligt avfall. Ange fraktioner och hantering enligt lista 1–6.">
        Övrigt avfall (fraktioner)
      </SectionTitle>
      <Grid item xs={12}>
        <Alert severity="info" sx={{ mb: 1 }}>
          Hantering: 1 återanvändning, 2 materialåtervinning, 3 brännbart, 4 blandat/eftersortering,
          5 fyllnadsmassor, 6 deponi.
        </Alert>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Fraktioner</TableCell>
              <TableCell>Mängd</TableCell>
              <TableCell>Transportör / mottagning</TableCell>
              <TableCell>Hantering nr</TableCell>
              <TableCell>Analys, bilaga</TableCell>
              <TableCell align="right" width={56} />
            </TableRow>
          </TableHead>
          <TableBody>
            {(form.ovrigt_avfall || []).length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <Typography variant="body2" color="text.secondary">
                    Inga fraktioner ännu. Lägg till rad.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              form.ovrigt_avfall.map((row, index) => (
                <TableRow key={`oa-${index}`} hover>
                  <TableCell>
                    <TextField
                      value={row.fraktioner}
                      onChange={onOvrigtChange(index, 'fraktioner')}
                      fullWidth
                      size="small"
                      multiline
                      minRows={1}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={row.mangd}
                      onChange={onOvrigtChange(index, 'mangd')}
                      fullWidth
                      size="small"
                      placeholder="antal/kg/m²/m³"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={row.transportor}
                      onChange={onOvrigtChange(index, 'transportor')}
                      fullWidth
                      size="small"
                    />
                  </TableCell>
                  <TableCell sx={{ minWidth: 180 }}>
                    <TextField
                      select
                      value={row.hantering_nr}
                      onChange={onOvrigtChange(index, 'hantering_nr')}
                      fullWidth
                      size="small"
                    >
                      <MenuItem value="">
                        <em>Välj</em>
                      </MenuItem>
                      {HANTERING_NR.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={row.analys_bilaga}
                      onChange={onOvrigtChange(index, 'analys_bilaga')}
                      fullWidth
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      aria-label="Ta bort rad"
                      size="small"
                      color="error"
                      onClick={() => onRemoveOvrigt(index)}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <Box sx={{ mt: 1 }}>
          <Button startIcon={<AddIcon />} onClick={onAddOvrigt} size="small">
            Lägg till rad
          </Button>
        </Box>
      </Grid>
    </Grid>
  )
}
