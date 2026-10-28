import { useState } from 'react'
import { Link as RouterLink, Navigate } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Link,
  TextField,
  Typography,
} from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { useAuth } from '../../context/AuthContext'
import AuthLayout from '../../components/auth/AuthLayout'
import MaterioLogo from '../../components/auth/MaterioLogo'

export default function ForgotPassword() {
  const { user, loading, isConfigured, resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!loading && user) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setInfo('')
    setSubmitting(true)

    const redirectTo = `${window.location.origin}/reset-password`
    const { error: authError } = await resetPassword(email.trim(), redirectTo)
    setSubmitting(false)

    if (authError) {
      setError(authError.message)
      return
    }

    setInfo('If an account exists for that email, we sent password reset instructions.')
  }

  return (
    <AuthLayout>
      <Card sx={{ boxShadow: (t) => (t.palette.mode === 'dark' ? 6 : 3) }}>
        <CardContent sx={{ p: { xs: 6, sm: 8 }, '&:last-child': { pb: { xs: 6, sm: 8 } } }}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <MaterioLogo to="/login" />
          </Box>

          <Box sx={{ mb: 5 }}>
            <Typography variant="h4" sx={{ mb: 1.5, fontWeight: 500 }}>
              Forgot Password? 🔒
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enter your email and we&apos;ll send you instructions to reset your password
            </Typography>
          </Box>

          {!isConfigured && (
            <Alert severity="warning" sx={{ mb: 4 }}>
              Saknar miljövariabler. Kopiera <code>.env.example</code> till <code>.env.local</code>.
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ mb: 4 }}>
              {error}
            </Alert>
          )}
          {info && (
            <Alert severity="success" sx={{ mb: 4 }}>
              {info}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              autoFocus
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              sx={{ mb: 4 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={submitting || !isConfigured}
              sx={{ mb: 4 }}
            >
              {submitting ? <CircularProgress size={22} color="inherit" /> : 'Send reset link'}
            </Button>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Link
                component={RouterLink}
                to="/login"
                variant="body2"
                underline="none"
                color="primary"
                sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
              >
                <ChevronLeftIcon fontSize="small" />
                Back to login
              </Link>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
