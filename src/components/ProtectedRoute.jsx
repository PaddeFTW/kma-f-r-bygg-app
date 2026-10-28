import { Navigate, useLocation } from 'react-router-dom'
import { Box, CircularProgress, Typography } from '@mui/material'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, loading, isConfigured } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!isConfigured) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', p: 3, textAlign: 'center' }}>
        <Box>
          <Typography variant="h5" gutterBottom>
            Supabase saknas
          </Typography>
          <Typography color="text.secondary">
            Kopiera <code>.env.example</code> till <code>.env</code> och fyll i{' '}
            <code>VITE_SUPABASE_URL</code> samt <code>VITE_SUPABASE_ANON_KEY</code>.
          </Typography>
        </Box>
      </Box>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}
