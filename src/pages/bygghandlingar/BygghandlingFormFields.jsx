import {
  Alert,
  Box,
  Button,
  InputAdornment,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import LinkIcon from '@mui/icons-material/Link'
import { BYGGHANDLING_TYP_OPTIONS } from '../../lib/types'
import { SectionHeader, GuidedTextField } from '../../components/forms'

function SectionTitle({ children, helper, why }) {
  return <SectionHeader helper={helper} why={why} asGridItem={false}>{children}</SectionHeader>
}

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
        <SectionTitle
          helper="Placeholder för ritningar, relationsritningar och övriga bygghandlingar."
          why="Tydliga handlingar gör det enklare att hitta rätt underlag vid produktion, kontroll och överlämning."
        >
          Handling
        </SectionTitle>
        <Stack spacing={2}>
          <GuidedTextField
            helpKey="bygghandling_namn"
            label="Namn"
            value={form.namn}
            onChange={onChange('namn')}
            required
            fullWidth
          />
          <GuidedTextField
            select
            helpKey="bygghandling_typ"
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
          </GuidedTextField>
          <GuidedTextField
            label="Beskrivning"
            value={form.beskrivning}
            onChange={onChange('beskrivning')}
            fullWidth
            multiline
            minRows={3}
            tooltip="Kort beskrivning av vad handlingen innehåller eller när den ska användas."
            why="Beskrivningen hjälper andra att förstå handlingens syfte utan att öppna filen."
          />
        </Stack>
      </Box>

      <Box>
        <SectionTitle
          helper="Ladda upp en fil till arkivet eller ange en extern länk."
          why="Fil eller länk gör att rätt version av handlingen kan följas upp och delas."
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
            tooltip="Ange en webblänk om handlingen ligger i ett externt system."
            why="Externa länkar gör det möjligt att samla referenser även när filen inte laddas upp i pärmen."
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
