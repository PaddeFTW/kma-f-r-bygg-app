import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link as RouterLink, useParams } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined'
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import VerticalLayout from '../../layouts/VerticalLayout'
import FlikSelector from '../../components/export/FlikSelector'
import ShareLog from '../../components/export/ShareLog'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { buildExportSnapshot, loadProjectContacts } from '../../lib/exportSnapshot'
import { downloadSnapshotPdf, downloadSnapshotWord } from '../../lib/exportDocuments'
import { PERMISSION_OPTIONS } from '../../lib/exportFliks'

function createShareToken() {
  const bytes = new Uint8Array(24)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

function daysFromNow(days) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString()
}

function permissionFlags(permission) {
  return {
    can_read: true,
    can_sign: permission === 'sign' || permission === 'approve',
    can_approve: permission === 'approve',
  }
}

export default function ProjectExportPage() {
  const { id: projectId } = useParams()
  const { user } = useAuth()

  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  const [selectedFliks, setSelectedFliks] = useState([1, 5, 7])
  const [expiresDays, setExpiresDays] = useState(7)
  const [password, setPassword] = useState('')
  const [linkPermission, setLinkPermission] = useState('read')
  const [shareTitle, setShareTitle] = useState('Delning av KMA-pärm')

  const [contacts, setContacts] = useState([])
  const [selectedContactIds, setSelectedContactIds] = useState([])
  const [manualEmail, setManualEmail] = useState('')
  const [manualName, setManualName] = useState('')
  const [invitePermission, setInvitePermission] = useState('read')
  const [inviteMessage, setInviteMessage] = useState(
    'Du har fått tillgång till utvalda delar av vår KMA-pärm. Öppna länken för att läsa.',
  )

  const [shares, setShares] = useState([])
  const [invites, setInvites] = useState([])

  const projectLabel = useMemo(() => {
    if (!project) return ''
    return (
      project.property_designation ||
      [project.address, project.city].filter(Boolean).join(', ') ||
      'Projekt'
    )
  }, [project])

  const loadLog = useCallback(async () => {
    const [{ data: shareRows, error: shareError }, { data: inviteRows, error: inviteError }] =
      await Promise.all([
        supabase
          .from('project_shares')
          .select('*')
          .eq('project_id', projectId)
          .order('created_at', { ascending: false }),
        supabase
          .from('project_share_invites')
          .select('*')
          .eq('project_id', projectId)
          .order('created_at', { ascending: false }),
      ])

    if (shareError) throw new Error(shareError.message)
    if (inviteError) throw new Error(inviteError.message)
    setShares(shareRows || [])
    setInvites(inviteRows || [])
  }, [projectId])

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const { data, error: projectError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .single()
        if (projectError) throw new Error(projectError.message)
        const contactRows = await loadProjectContacts(projectId)
        if (!mounted) return
        setProject(data)
        setContacts(contactRows)
        await loadLog()
      } catch (err) {
        if (mounted) setError(err.message || 'Kunde inte ladda projektet.')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    if (projectId) load()
    return () => {
      mounted = false
    }
  }, [projectId, loadLog])

  const ensureSelection = () => {
    if (!selectedFliks.length) {
      setError('Välj minst en flik.')
      return false
    }
    return true
  }

  const handleDownload = async (format) => {
    if (!ensureSelection()) return
    setBusy(true)
    setError('')
    setInfo('')
    try {
      const snapshot = await buildExportSnapshot(projectId, selectedFliks)
      if (format === 'pdf') downloadSnapshotPdf(snapshot)
      else await downloadSnapshotWord(snapshot)
      setInfo(format === 'pdf' ? 'PDF nedladdad.' : 'Word-fil nedladdad.')
    } catch (err) {
      setError(err.message || 'Kunde inte skapa dokument.')
    } finally {
      setBusy(false)
    }
  }

  const createShareRecord = async ({ permission, title }) => {
    const snapshot = await buildExportSnapshot(projectId, selectedFliks)
    const token = createShareToken()
    const flags = permissionFlags(permission)

    let password_hash = null
    if (password.trim()) {
      const { data: hash, error: hashError } = await supabase.rpc('hash_share_password', {
        p_password: password.trim(),
      })
      if (hashError) throw new Error(hashError.message)
      password_hash = hash
    }

    const { data, error: insertError } = await supabase
      .from('project_shares')
      .insert({
        user_id: user.id,
        company_id: project.company_id,
        project_id: projectId,
        token,
        title: title || shareTitle,
        flik_nrs: selectedFliks,
        ...flags,
        password_hash,
        expires_at: daysFromNow(expiresDays),
        snapshot,
        project_label: snapshot.project_label,
      })
      .select()
      .single()

    if (insertError) throw new Error(insertError.message)
    return data
  }

  const handleCreateLink = async () => {
    if (!ensureSelection()) return
    setBusy(true)
    setError('')
    setInfo('')
    try {
      const share = await createShareRecord({ permission: linkPermission, title: shareTitle })
      const url = `${window.location.origin}/dela/${share.token}`
      await navigator.clipboard?.writeText(url).catch(() => {})
      setInfo(`Delningslänk skapad och kopierad: ${url}`)
      setPassword('')
      await loadLog()
    } catch (err) {
      setError(
        err.message?.includes('project_shares') || err.message?.includes('schema cache')
          ? 'Tabellen project_shares saknas. Kör migration 031_export_sharing.sql i Supabase.'
          : err.message || 'Kunde inte skapa länk.',
      )
    } finally {
      setBusy(false)
    }
  }

  const handleSendInvites = async () => {
    if (!ensureSelection()) return

    const recipients = contacts.filter((c) => selectedContactIds.includes(c.id))
    if (manualEmail.trim()) {
      recipients.push({
        id: 'manual',
        name: manualName.trim() || manualEmail.trim(),
        email: manualEmail.trim(),
        source: 'Manuell',
      })
    }
    if (!recipients.length) {
      setError('Välj minst en kontakt eller ange e-post.')
      return
    }

    setBusy(true)
    setError('')
    setInfo('')
    try {
      const share = await createShareRecord({
        permission: invitePermission,
        title: `Inbjudan – ${projectLabel}`,
      })
      const url = `${window.location.origin}/dela/${share.token}`

      for (const recipient of recipients) {
        const { data: invite, error: inviteError } = await supabase
          .from('project_share_invites')
          .insert({
            share_id: share.id,
            user_id: user.id,
            project_id: projectId,
            recipient_name: recipient.name,
            recipient_email: recipient.email,
            permission: invitePermission,
            status: 'sent',
            message: inviteMessage,
            sent_at: new Date().toISOString(),
          })
          .select()
          .single()
        if (inviteError) throw new Error(inviteError.message)

        const subject = encodeURIComponent(`KMA-pärm: ${projectLabel}`)
        const body = encodeURIComponent(
          `${inviteMessage}\n\nÖppna länken: ${url}\n\nBehörighet: ${invitePermission}\nGäller till: ${new Date(
            share.expires_at,
          ).toLocaleString('sv-SE')}`,
        )
        // Öppnar användarens mejlklient (ingen extern mejlstack i projektet).
        window.open(`mailto:${recipient.email}?subject=${subject}&body=${body}`, '_blank')
        void invite
      }

      setInfo(`Inbjudan skapad för ${recipients.length} mottagare. Mejlklient öppnad.`)
      setSelectedContactIds([])
      setManualEmail('')
      setManualName('')
      setPassword('')
      await loadLog()
    } catch (err) {
      setError(err.message || 'Kunde inte skicka inbjudan.')
    } finally {
      setBusy(false)
    }
  }

  const handleRevoke = async (shareId) => {
    setBusy(true)
    setError('')
    try {
      const { error: updateError } = await supabase
        .from('project_shares')
        .update({ revoked_at: new Date().toISOString(), updated_at: new Date().toISOString() })
        .eq('id', shareId)
      if (updateError) throw new Error(updateError.message)
      await supabase
        .from('project_share_invites')
        .update({ status: 'revoked', updated_at: new Date().toISOString() })
        .eq('share_id', shareId)
      setInfo('Länken är återkallad.')
      await loadLog()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const handleCopy = async (url) => {
    try {
      await navigator.clipboard.writeText(url)
      setInfo('Länk kopierad.')
    } catch {
      setInfo(url)
    }
  }

  return (
    <VerticalLayout>
      <Stack spacing={3} sx={{ maxWidth: 1100 }}>
        <Button
          component={RouterLink}
          to={`/projects/${projectId}`}
          startIcon={<ArrowBackIcon />}
          sx={{ alignSelf: 'flex-start' }}
        >
          Tillbaka till projektet
        </Button>

        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Export & delning
          </Typography>
          <Typography color="text.secondary">
            Välj flikar i KMA-pärmen, ladda ner PDF/Word eller skapa tidsbegränsad delningslänk.
            {projectLabel ? ` · ${projectLabel}` : ''}
          </Typography>
        </Box>

        {error && <Alert severity="error">{error}</Alert>}
        {info && <Alert severity="success">{info}</Alert>}

        {loading ? (
          <Box sx={{ py: 6, display: 'grid', placeItems: 'center' }}>
            <CircularProgress />
          </Box>
        ) : !project ? (
          <Alert severity="error">Projektet hittades inte.</Alert>
        ) : (
          <>
            <Card>
              <CardContent sx={{ p: 5, '&:last-child': { pb: 5 } }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  1. Välj flikar
                </Typography>
                <FlikSelector selected={selectedFliks} onChange={setSelectedFliks} />
              </CardContent>
            </Card>

            <Card>
              <CardContent sx={{ p: 5, '&:last-child': { pb: 5 } }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  2. Ladda ner
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Genererar dokument från vald data i projektet (inga flikar utanför urvalet).
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                  <Button
                    variant="contained"
                    startIcon={<DownloadOutlinedIcon />}
                    disabled={busy || !selectedFliks.length}
                    onClick={() => handleDownload('pdf')}
                  >
                    Ladda ner PDF
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<DownloadOutlinedIcon />}
                    disabled={busy || !selectedFliks.length}
                    onClick={() => handleDownload('word')}
                  >
                    Ladda ner Word
                  </Button>
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardContent sx={{ p: 5, '&:last-child': { pb: 5 } }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  3. Skapa delningslänk
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Länken är tidsbegränsad, ger läsbehörighet till en låst snapshot och kan skyddas med
                  lösenord. RLS öppnar inte övriga tabeller för mottagaren.
                </Typography>

                <Stack spacing={2.5} sx={{ maxWidth: 560 }}>
                  <TextField
                    label="Titel"
                    value={shareTitle}
                    onChange={(e) => setShareTitle(e.target.value)}
                    fullWidth
                  />
                  <FormControl fullWidth>
                    <InputLabel id="link-perm-label">Behörighet</InputLabel>
                    <Select
                      labelId="link-perm-label"
                      label="Behörighet"
                      value={linkPermission}
                      onChange={(e) => setLinkPermission(e.target.value)}
                    >
                      {PERMISSION_OPTIONS.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel id="expires-label">Giltighetstid</InputLabel>
                    <Select
                      labelId="expires-label"
                      label="Giltighetstid"
                      value={expiresDays}
                      onChange={(e) => setExpiresDays(Number(e.target.value))}
                    >
                      <MenuItem value={1}>1 dag</MenuItem>
                      <MenuItem value={7}>7 dagar</MenuItem>
                      <MenuItem value={30}>30 dagar</MenuItem>
                      <MenuItem value={90}>90 dagar</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    label="Lösenord (valfritt)"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    helperText="Om du sätter lösenord måste mottagaren ange det för att öppna länken."
                  />
                  <Box>
                    <Button
                      variant="contained"
                      startIcon={<LinkOutlinedIcon />}
                      disabled={busy || !selectedFliks.length}
                      onClick={handleCreateLink}
                    >
                      Skapa delningslänk
                    </Button>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardContent sx={{ p: 5, '&:last-child': { pb: 5 } }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  4. Skicka inbjudan
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Välj mottagare från kontaktlistan (Flik 2–4 / projekt) eller ange e-post. Behörighet
                  per inbjudan: Läs / Signera / Godkänna.
                </Typography>

                <Stack spacing={2.5}>
                  <FormGroup>
                    {contacts.length === 0 ? (
                      <Typography color="text.secondary">
                        Inga e-postadresser i projektets kontaktuppgifter ännu.
                      </Typography>
                    ) : (
                      contacts.map((contact) => (
                        <FormControlLabel
                          key={contact.id}
                          control={
                            <Checkbox
                              checked={selectedContactIds.includes(contact.id)}
                              onChange={(e) => {
                                setSelectedContactIds((prev) =>
                                  e.target.checked
                                    ? [...prev, contact.id]
                                    : prev.filter((id) => id !== contact.id),
                                )
                              }}
                            />
                          }
                          label={`${contact.name} <${contact.email}> · ${contact.source}`}
                        />
                      ))
                    )}
                  </FormGroup>

                  <Divider />

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                      label="Namn"
                      value={manualName}
                      onChange={(e) => setManualName(e.target.value)}
                      fullWidth
                    />
                    <TextField
                      label="E-post"
                      type="email"
                      value={manualEmail}
                      onChange={(e) => setManualEmail(e.target.value)}
                      fullWidth
                    />
                  </Stack>

                  <FormControl sx={{ maxWidth: 280 }}>
                    <InputLabel id="invite-perm-label">Behörighet</InputLabel>
                    <Select
                      labelId="invite-perm-label"
                      label="Behörighet"
                      value={invitePermission}
                      onChange={(e) => setInvitePermission(e.target.value)}
                    >
                      {PERMISSION_OPTIONS.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    label="Meddelande"
                    value={inviteMessage}
                    onChange={(e) => setInviteMessage(e.target.value)}
                    fullWidth
                    multiline
                    minRows={3}
                  />

                  <Box>
                    <Button
                      variant="contained"
                      startIcon={<MailOutlineIcon />}
                      disabled={busy || !selectedFliks.length}
                      onClick={handleSendInvites}
                    >
                      Skicka inbjudan
                    </Button>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardContent sx={{ p: 5, '&:last-child': { pb: 5 } }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  5. Logg
                </Typography>
                <ShareLog
                  shares={shares}
                  invites={invites}
                  onRevoke={handleRevoke}
                  onCopy={handleCopy}
                />
              </CardContent>
            </Card>
          </>
        )}
      </Stack>
    </VerticalLayout>
  )
}
