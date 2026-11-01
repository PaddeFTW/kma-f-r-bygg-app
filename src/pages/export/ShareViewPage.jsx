import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import DrawOutlinedIcon from '@mui/icons-material/DrawOutlined'
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined'
import SnapshotReader from '../../components/export/SnapshotReader'
import { supabase } from '../../lib/supabase'
import { formatExpiresLabel } from '../../lib/exportFliks'

/** Publik mottagarvy – ingen VerticalLayout, ingen live-RLS mot projektdata. */
export default function ShareViewPage() {
  const { token } = useParams()
  const [password, setPassword] = useState('')
  const [needsPassword, setNeedsPassword] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [share, setShare] = useState(null)
  const [actorName, setActorName] = useState('')
  const [actorEmail, setActorEmail] = useState('')
  const [note, setNote] = useState('')
  const [actionInfo, setActionInfo] = useState('')

  const openShare = async (pwd = password) => {
    setLoading(true)
    setError('')
    setActionInfo('')
    try {
      const { data, error: rpcError } = await supabase.rpc('open_project_share', {
        p_token: token,
        p_password: pwd || null,
      })
      if (rpcError) throw new Error(rpcError.message)

      if (!data?.ok) {
        setShare(null)
        setNeedsPassword(Boolean(data?.needs_password))
        setError(data?.error === 'password_required' ? 'Ange lösenord för att öppna.' : data?.error || 'Kunde inte öppna')
        return
      }

      setNeedsPassword(false)
      setShare(data.share)
    } catch (err) {
      setError(
        err.message?.includes('open_project_share') || err.message?.includes('schema cache')
          ? 'Delningsfunktionen saknas i databasen. Kör migration 031_export_sharing.sql.'
          : err.message || 'Kunde inte öppna länken.',
      )
      setShare(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) openShare('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const submitAction = async (action) => {
    if (!actorName.trim()) {
      setError('Ange ditt namn.')
      return
    }
    setSubmitting(true)
    setError('')
    setActionInfo('')
    try {
      const { data, error: rpcError } = await supabase.rpc('submit_project_share_action', {
        p_token: token,
        p_password: password || null,
        p_action: action,
        p_actor_name: actorName.trim(),
        p_actor_email: actorEmail.trim() || null,
        p_note: note.trim() || null,
      })
      if (rpcError) throw new Error(rpcError.message)
      if (!data?.ok) throw new Error(data?.error || 'Åtgärden misslyckades')
      setActionInfo(action === 'sign' ? 'Signering registrerad.' : 'Godkännande registrerat.')
      setNote('')
      await openShare(password)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        py: { xs: 4, md: 6 },
        px: { xs: 2, sm: 3 },
      }}
    >
      <Stack spacing={3} sx={{ maxWidth: 920, mx: 'auto' }}>
        <Box>
          <Typography variant="overline" color="text.secondary">
            KMA för bygg · Delad pärm
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            {share?.title || share?.project_label || 'Delningslänk'}
          </Typography>
          {share?.expires_at ? (
            <Typography variant="body2" color="text.secondary">
              Gäller till {formatExpiresLabel(share.expires_at)}
            </Typography>
          ) : null}
        </Box>

        {error && <Alert severity="error">{error}</Alert>}
        {actionInfo && <Alert severity="success">{actionInfo}</Alert>}

        {loading ? (
          <Box sx={{ py: 8, display: 'grid', placeItems: 'center' }}>
            <CircularProgress />
          </Box>
        ) : needsPassword && !share ? (
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Stack spacing={2} sx={{ maxWidth: 420 }}>
                <Typography>Denna länk är lösenordsskyddad.</Typography>
                <TextField
                  label="Lösenord"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  autoFocus
                />
                <Button variant="contained" onClick={() => openShare(password)} disabled={loading}>
                  Öppna
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ) : share ? (
          <>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {share.can_read ? <Chip label="Läs" color="default" /> : null}
              {share.can_sign ? <Chip label="Signera" color="primary" /> : null}
              {share.can_approve ? <Chip label="Godkänna" color="secondary" /> : null}
            </Stack>

            <Card>
              <CardContent sx={{ p: { xs: 3, md: 5 }, '&:last-child': { pb: { xs: 3, md: 5 } } }}>
                <SnapshotReader snapshot={share.snapshot} />
              </CardContent>
            </Card>

            {(share.can_sign || share.can_approve) && (
              <Card>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Signera / godkänn
                  </Typography>
                  <Stack spacing={2} sx={{ maxWidth: 480 }}>
                    <TextField
                      label="Ditt namn"
                      value={actorName}
                      onChange={(e) => setActorName(e.target.value)}
                      required
                      fullWidth
                    />
                    <TextField
                      label="E-post (valfritt)"
                      type="email"
                      value={actorEmail}
                      onChange={(e) => setActorEmail(e.target.value)}
                      fullWidth
                    />
                    <TextField
                      label="Anteckning (valfritt)"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      fullWidth
                      multiline
                      minRows={2}
                    />
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                      {share.can_sign ? (
                        <Button
                          variant="contained"
                          startIcon={<DrawOutlinedIcon />}
                          disabled={submitting}
                          onClick={() => submitAction('sign')}
                        >
                          Signera
                        </Button>
                      ) : null}
                      {share.can_approve ? (
                        <Button
                          variant="outlined"
                          startIcon={<VerifiedOutlinedIcon />}
                          disabled={submitting}
                          onClick={() => submitAction('approve')}
                        >
                          Godkänn
                        </Button>
                      ) : null}
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            )}

            {share.actions?.length ? (
              <Card>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Registrerade åtgärder
                  </Typography>
                  <Stack spacing={1.5}>
                    {share.actions.map((a, idx) => (
                      <Box key={`${a.created_at}-${idx}`}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {a.action === 'sign' ? 'Signering' : 'Godkännande'} · {a.actor_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {a.created_at ? new Date(a.created_at).toLocaleString('sv-SE') : ''}
                          {a.note ? ` · ${a.note}` : ''}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            ) : null}
          </>
        ) : null}
      </Stack>
    </Box>
  )
}
