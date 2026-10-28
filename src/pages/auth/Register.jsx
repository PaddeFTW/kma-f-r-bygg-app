import { useState } from 'react'
import { Link as RouterLink, Navigate, useNavigate } from 'react-router-dom'
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

export default function Register() {
  const { user, loading, isConfigured, signUp } = useAuth()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [agree, setAgree] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
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

    if (!agree) {
      setError('Please agree to privacy policy & terms')
      return
    }

    setSubmitting(true)
    const { error: authError } = await signUp(email.trim(), password, {
      data: { username: username.trim() || undefined },
    })
    setSubmitting(false)

    if (authError) {
      setError(authError.message)
      return
    }

    setInfo('Account created. If email confirmation is enabled, check your inbox. Otherwise you can sign in.')
    setTimeout(() => navigate('/login'), 1500)
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
              Adventure starts here 🚀
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Make your app management easy and fun!
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
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{ mb: 4 }}
            />
            <TextField
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
              autoComplete="new-password"
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

            <FormControlLabel
              sx={{ mb: 4, mt: 1, alignItems: 'flex-start' }}
              control={
                <Checkbox
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  size="small"
                  sx={{ pt: 0.5 }}
                />
              }
              label={
                <Typography variant="body2" color="text.secondary">
                  I agree to{' '}
                  <Link href="#" underline="none" color="primary" onClick={(e) => e.preventDefault()}>
                    privacy policy & terms
                  </Link>
                </Typography>
              }
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={submitting || !isConfigured}
              sx={{ mb: 4 }}
            >
              {submitting ? <CircularProgress size={22} color="inherit" /> : 'Sign Up'}
            </Button>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?
              </Typography>
              <Link component={RouterLink} to="/login" variant="body2" underline="none" color="primary">
                Sign in instead
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
