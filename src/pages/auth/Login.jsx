import { useState } from 'react'
import { Link as RouterLink, Navigate, useLocation, useNavigate } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from '@mui/material'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import { useAuth } from '../../context/AuthContext'
import AuthLayout from '../../components/auth/AuthLayout'
import MaterioLogo from '../../components/auth/MaterioLogo'
import SocialLogins from '../../components/auth/SocialLogins'

const REMEMBER_KEY = 'materio-remember-email'

export default function Login() {
  const { user, loading, isConfigured, signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const [email, setEmail] = useState(() => localStorage.getItem(REMEMBER_KEY) || '')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(() => Boolean(localStorage.getItem(REMEMBER_KEY)))
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!loading && user) {
    return <Navigate to={from} replace />
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    const { error: authError } = await signIn(email.trim(), password)
    setSubmitting(false)

    if (authError) {
      setError(authError.message)
      return
    }

    if (remember) localStorage.setItem(REMEMBER_KEY, email.trim())
    else localStorage.removeItem(REMEMBER_KEY)

    navigate(from, { replace: true })
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
              Welcome to Materio! 👋🏻
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please sign-in to your account and start the adventure
            </Typography>
          </Box>

          {!isConfigured && (
            <Alert severity="warning" sx={{ mb: 4 }}>
              Saknar miljövariabler. Kopiera <code>.env.example</code> till <code>.env.local</code> och fyll i
              Supabase-nycklar.
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 4 }}>
              {error}
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

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              inputProps={{ minLength: 6 }}
              sx={{ mb: 1.5 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={() => setShowPassword((s) => !s)}
                      onMouseDown={(e) => e.preventDefault()}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                mb: 4,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    size="small"
                  />
                }
                label={<Typography variant="body2">Remember Me</Typography>}
              />
              <Link
                component={RouterLink}
                to="/forgot-password"
                variant="body2"
                underline="none"
                color="primary"
              >
                Forgot Password?
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={submitting || !isConfigured}
              sx={{ mb: 4 }}
            >
              {submitting ? <CircularProgress size={22} color="inherit" /> : 'Login'}
            </Button>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                New on our platform?
              </Typography>
              <Link component={RouterLink} to="/register" variant="body2" underline="none" color="primary">
                Create an account
              </Link>
            </Box>

            <Divider sx={{ my: 4 }}>
              <Typography variant="body2" color="text.disabled">
                or
              </Typography>
            </Divider>

            <SocialLogins />
          </Box>
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
