import { Box, Grid, Link, Typography } from '@mui/material'
import { KB_URL } from '../../lib/formHelp'

/**
 * Gemensam sektionsrubrik med hjälptext och “Varför fyller jag i detta?”.
 */
export default function SectionHeader({ children, helper, why, showKbLink = false, asGridItem = true }) {
  const content = (
    <Box sx={{ mt: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        {children}
      </Typography>
      {helper ? (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {helper}
          {showKbLink ? (
            <>
              {' '}
              <Link href={KB_URL} target="_blank" rel="noopener noreferrer">
                Knowledge base
              </Link>
            </>
          ) : null}
        </Typography>
      ) : null}
      {why ? (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', mt: 0.75, fontStyle: 'italic' }}
        >
          Varför fyller jag i detta? {why}
        </Typography>
      ) : null}
    </Box>
  )

  if (!asGridItem) return content
  return <Grid item xs={12}>{content}</Grid>
}
