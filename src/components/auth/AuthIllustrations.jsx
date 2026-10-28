import { Box, useMediaQuery, useTheme } from '@mui/material'
import { useThemeMode } from '../../context/ThemeModeContext'

/**
 * Materio auth V1 decorations: tree-1 (left), purple wave mask, tree-2 (right).
 * Rendered as absolute imgs matching free Materio Illustrations.
 */
export default function AuthIllustrations() {
  const theme = useTheme()
  const { mode } = useThemeMode()
  const hidden = useMediaQuery(theme.breakpoints.down('sm'))
  const mask =
    mode === 'dark' ? '/images/pages/auth-v1-mask-dark.png' : '/images/pages/auth-v1-mask-light.png'

  if (hidden) return null

  return (
    <Box
      aria-hidden
      sx={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      <Box
        component="img"
        alt=""
        src="/images/illustrations/objects/tree-1.png"
        sx={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          height: 200,
          width: 'auto',
          maxWidth: '35vw',
          display: 'block',
        }}
      />
      <Box
        component="img"
        alt=""
        src={mask}
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: 'auto',
          display: 'block',
        }}
      />
      <Box
        component="img"
        alt=""
        src="/images/illustrations/objects/tree-2.png"
        sx={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          height: 200,
          width: 'auto',
          maxWidth: '35vw',
          display: 'block',
        }}
      />
    </Box>
  )
}
