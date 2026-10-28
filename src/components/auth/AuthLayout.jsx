import { Box } from '@mui/material'
import AuthIllustrations from './AuthIllustrations'

/** Full-viewport blank auth layout with Materio V1 decorations */
export default function AuthLayout({ children }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        isolation: 'isolate',
        p: { xs: 4, sm: 6 },
        bgcolor: 'background.default',
        overflow: 'hidden',
      }}
    >
      <AuthIllustrations />
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: 450,
        }}
      >
        {children}
      </Box>
    </Box>
  )
}
