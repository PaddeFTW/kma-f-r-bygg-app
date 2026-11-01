import { Link as RouterLink } from 'react-router-dom'
import { Box, Button, Card, CardContent, Stack, Typography } from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import { buildFlowPath, findFlowStep, getNextFlowStep } from '../lib/flowSteps'

/**
 * Visas efter sparning – val mellan nästa modul och dashboard.
 */
export default function NextStep({
  currentPath,
  projectId,
  title = 'Nästa steg',
  description,
}) {
  const current = findFlowStep(currentPath)
  const next = getNextFlowStep(currentPath)
  const nextTo = next ? buildFlowPath(next.path, projectId) : null
  const cta = current?.nextCta || (next ? `Fortsätt till ${next.label}` : null)

  const resolvedDescription =
    description ||
    (next
      ? 'Välj om du vill gå vidare i pärmen eller tillbaka till översikten.'
      : 'Du har nått sista steget i flödet. Du kan gå tillbaka till dashboard.')

  return (
    <Card variant="outlined" sx={{ borderColor: 'primary.main', bgcolor: 'action.hover' }}>
      <CardContent sx={{ p: 4, '&:last-child': { pb: 4 } }}>
        <Stack spacing={2.5}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {resolvedDescription}
            </Typography>
          </Box>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} flexWrap="wrap">
            {nextTo && cta ? (
              <Button
                component={RouterLink}
                to={nextTo}
                variant="contained"
                endIcon={<ArrowForwardIcon />}
              >
                {cta}
              </Button>
            ) : null}
            <Button
              component={RouterLink}
              to="/"
              variant={nextTo ? 'outlined' : 'contained'}
              startIcon={<HomeOutlinedIcon />}
            >
              Tillbaka till dashboard
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}
