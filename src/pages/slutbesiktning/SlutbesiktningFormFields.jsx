import {
  Alert,
  Box,
  Button,
  InputAdornment,
  Stack,
  Typography,
} from '@mui/material'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import LinkIcon from '@mui/icons-material/Link'
import { SectionHeader, GuidedTextField } from '../../components/forms'

function SectionTitle({ children, helper, why }) {
  return (
    <SectionHeader helper={helper} why={why} asGridItem={false}>
      {children}
    </SectionHeader>
  )
}

/**
 * Flik 24 – Slutbesiktningsprotokoll.
 * Dokumentarkiv enligt docs/kma-underlag/flikar-22-31-uppfoljning-avslut.md.
 */
export default function SlutbesiktningFormFields({
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
        <SectionTitle
          helper="Placeholder för besiktningsprotokoll."
          why="Slutbesiktningen visar godkännande, anmärkningar och vad som återstår inför överlämning."
        >
          Dokument
        </SectionTitle>
        <Stack spacing={2}>
          <GuidedTextField
            label="Namn"
            value={form.namn}
            onChange={onChange('namn')}
            required
            fullWidth
            helpKey="slutbesiktning_dokument"
          />
          <GuidedTextField
            label="Beskrivning"
            value={form.beskrivning}
            onChange={onChange('beskrivning')}
            fullWidth
            multiline
            minRows={3}
            helpKey="slutbesiktning_beskrivning"
          />
        </Stack>
      </Box>

      <Box>
        <SectionTitle
          helper="Ladda upp en fil till arkivet eller ange en extern länk."
          why="Fil eller länk gör protokollet spårbart och enkelt att öppna vid avslut."
        >
          Fil eller länk
        </SectionTitle>
        <Stack spacing={2}>
          <GuidedTextField
            label="Extern länk"
            value={form.file_url}
            onChange={onChange('file_url')}
            fullWidth
            placeholder="https://…"
            tooltip="Länk till slutbesiktningsprotokollet om det sparas externt."
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
