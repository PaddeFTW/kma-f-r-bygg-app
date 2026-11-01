import { Alert, Box, Divider, Stack, Typography } from '@mui/material'
import { snapshotToPlainLines } from '../../lib/exportSnapshot'

/** Visar snapshot (endast valda flikar) för mottagare eller förhandsgranskning. */
export default function SnapshotReader({ snapshot }) {
  if (!snapshot?.sections?.length) {
    return <Alert severity="info">Ingen data i denna delning.</Alert>
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          {snapshot.project_label || 'KMA-pärm'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Flikar: {(snapshot.flik_nrs || []).join(', ')}
          {snapshot.generated_at
            ? ` · Snapshot ${new Date(snapshot.generated_at).toLocaleString('sv-SE')}`
            : ''}
        </Typography>
      </Box>

      {snapshot.sections.map((section) => (
        <Box key={section.flik_nr}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {section.title}
          </Typography>
          {section.helper ? (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {section.helper}
            </Typography>
          ) : null}
          <Divider sx={{ mb: 1.5 }} />
          {section.note ? (
            <Typography color="text.secondary">{section.note}</Typography>
          ) : (
            <Box
              component="pre"
              sx={{
                m: 0,
                p: 2,
                borderRadius: 1,
                bgcolor: 'action.hover',
                fontSize: 13,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
              }}
            >
              {snapshotToPlainLines({
                generated_at: snapshot.generated_at,
                project_label: snapshot.project_label,
                flik_nrs: [section.flik_nr],
                sections: [section],
              })
                .filter(
                  (l) =>
                    l &&
                    !l.startsWith('=') &&
                    !l.startsWith('KMA-pärm') &&
                    !l.startsWith('Exporterad') &&
                    !l.startsWith('Flikar:'),
                )
                .join('\n')}
            </Box>
          )}
        </Box>
      ))}
    </Stack>
  )
}
