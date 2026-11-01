import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import {
  AMP_RELATED_FLIKS,
  EGENKONTROLL_FLIKS,
  EXPORT_FLIKS,
} from '../../lib/exportFliks'

export default function FlikSelector({ selected, onChange }) {
  const selectedSet = new Set(selected)

  const toggle = (flikNr) => {
    const next = new Set(selectedSet)
    if (next.has(flikNr)) next.delete(flikNr)
    else next.add(flikNr)
    onChange([...next].sort((a, b) => a - b))
  }

  const setGroup = (nrs) => onChange([...new Set(nrs)].sort((a, b) => a - b))

  return (
    <Stack spacing={2}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} flexWrap="wrap">
        <Button size="small" variant="outlined" onClick={() => setGroup(EXPORT_FLIKS.map((f) => f.flik_nr))}>
          Välj alla
        </Button>
        <Button size="small" variant="outlined" onClick={() => setGroup(AMP_RELATED_FLIKS)}>
          Välj AMP-relaterade
        </Button>
        <Button size="small" variant="outlined" onClick={() => setGroup(EGENKONTROLL_FLIKS)}>
          Välj egenkontroller
        </Button>
        <Button size="small" color="inherit" onClick={() => onChange([])}>
          Rensa
        </Button>
      </Stack>

      <Typography variant="body2" color="text.secondary">
        {selected.length} av {EXPORT_FLIKS.length} flikar valda. Tooltip visar kort beskrivning från
        kunskapsunderlaget.
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
          gap: 0.5,
        }}
      >
        {EXPORT_FLIKS.map((flik) => (
          <FormControlLabel
            key={flik.flik_nr}
            control={
              <Checkbox
                size="small"
                checked={selectedSet.has(flik.flik_nr)}
                onChange={() => toggle(flik.flik_nr)}
              />
            }
            label={
              <Stack direction="row" spacing={0.75} alignItems="center">
                <Typography variant="body2">
                  Flik {flik.flik_nr} – {flik.label}
                </Typography>
                {flik.helper ? (
                  <Tooltip title={flik.helper} arrow>
                    <InfoOutlinedIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                  </Tooltip>
                ) : null}
              </Stack>
            }
          />
        ))}
      </Box>
    </Stack>
  )
}
