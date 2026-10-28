import { useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from '@mui/material'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { useAuth } from '../../context/AuthContext'
import AuthLayout from '../../components/auth/AuthLayout'
import MaterioLogo from '../../components/auth/MaterioLogo'

export default function ResetPassword() {
  const { isConfigured, updatePassword } = useAuth()
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setInfo('')

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }

    setSubmitting(true)
    const { error: authError } = await updatePassword(password)
    setSubmitting(false)

    if (authError) {
      setError(authError.message)
      return
    }

    setInfo('Password updated. Redirecting to login…')
    setTimeout(() => navigate('/login', { replace: true }), 1200)
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
              Reset Password 🔒
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your new password must be different from previously used passwords
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
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              inputProps={{ minLength: 6 }}
              sx={{ mb: 4 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={() => setShowPassword((s) => !s)}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      {showPassword ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Confirm Password"
              type={showConfirm ? 'text' : 'password'}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              autoComplete="new-password"
              sx={{ mb: 4 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={() => setShowConfirm((s) => !s)}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      {showConfirm ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={submitting || !isConfigured}
              sx={{ mb: 4 }}
            >
              {submitting ? <CircularProgress size={22} color="inherit" /> : 'Set New Password'}
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
