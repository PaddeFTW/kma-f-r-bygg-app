import {
  Alert,
  Box,
  Button,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import LinkIcon from '@mui/icons-material/Link'
import { BYGGHANDLING_TYP_OPTIONS } from '../../lib/types'

export default function BygghandlingFormFields({
  form,
  onChange,
  onFileChange,
  selectedFile,
  onClearFile,
  fileLink,
}) {
  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
          Handling
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Placeholder för ritningar, relationsritningar och övriga bygghandlingar.
        </Typography>
        <Stack spacing={2}>
          <TextField
            label="Namn"
            value={form.namn}
            onChange={onChange('namn')}
            required
            fullWidth
          />
          <TextField
            select
            label="Typ"
            value={form.typ}
            onChange={onChange('typ')}
            fullWidth
          >
            <MenuItem value="">Ingen typ vald</MenuItem>
            {BYGGHANDLING_TYP_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Beskrivning"
            value={form.beskrivning}
            onChange={onChange('beskrivning')}
            fullWidth
            multiline
            minRows={3}
          />
        </Stack>
      </Box>

      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
          Fil eller länk
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Ladda upp en fil till arkivet eller ange en extern länk.
        </Typography>
        <Stack spacing={2}>
          <TextField
            label="Extern länk"
            value={form.file_url}
            onChange={onChange('file_url')}
            fullWidth
            placeholder="https://…"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LinkIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />

          <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
            <Button component="label" variant="outlined" startIcon={<AttachFileIcon />}>
              Välj fil
              <input type="file" hidden onChange={onFileChange} />
            </Button>
            {selectedFile ? (
              <>
                <Typography variant="body2">{selectedFile.name}</Typography>
                <Button size="small" onClick={onClearFile}>
                  Rensa
                </Button>
              </>
            ) : form.file_name ? (
              <Typography variant="body2" color="text.secondary">
                Sparad fil: {form.file_name}
              </Typography>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Ingen fil vald
              </Typography>
            )}
          </Stack>

          {(fileLink || form.file_url) && (
            <Alert severity="info" sx={{ alignItems: 'center' }}>
              {fileLink ? (
                <Button href={fileLink} target="_blank" rel="noopener noreferrer" size="small">
                  Öppna uppladdad fil
                </Button>
              ) : null}
              {form.file_url ? (
                <Button
                  href={form.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                  sx={{ ml: fileLink ? 1 : 0 }}
                >
                  Öppna extern länk
                </Button>
              ) : null}
            </Alert>
          )}
        </Stack>
      </Box>
    </Stack>
  )
}
