import {
  Chip,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import LinkOffIcon from '@mui/icons-material/LinkOff'
import { formatExpiresLabel, flikLabel } from '../../lib/exportFliks'

const STATUS_COLOR = {
  pending: 'default',
  sent: 'info',
  opened: 'warning',
  signed: 'success',
  approved: 'success',
  revoked: 'error',
}

function shareUrl(token) {
  return `${window.location.origin}/dela/${token}`
}

export default function ShareLog({ shares, invites, onRevoke, onCopy }) {
  if (!shares?.length) {
    return (
      <Typography color="text.secondary">Inga delningslänkar eller inbjudningar ännu.</Typography>
    )
  }

  return (
    <Stack spacing={3}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Länk</TableCell>
            <TableCell>Flikar</TableCell>
            <TableCell>Behörighet</TableCell>
            <TableCell>Gäller till</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Åtgärd</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {shares.map((share) => {
            const revoked = Boolean(share.revoked_at)
            const expired = new Date(share.expires_at) < new Date()
            const status = revoked ? 'Återkallad' : expired ? 'Utgången' : 'Aktiv'
            return (
              <TableRow key={share.id}>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {share.title || 'Delningslänk'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {share.created_at ? new Date(share.created_at).toLocaleString('sv-SE') : ''}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="caption">
                    {(share.flik_nrs || []).map((n) => flikLabel(n).replace('Flik ', '')).join('; ') ||
                      '—'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                    {share.can_read ? <Chip size="small" label="Läs" /> : null}
                    {share.can_sign ? <Chip size="small" label="Signera" color="primary" /> : null}
                    {share.can_approve ? (
                      <Chip size="small" label="Godkänna" color="secondary" />
                    ) : null}
                    {share.password_hash ? <Chip size="small" label="Lösenord" variant="outlined" /> : null}
                  </Stack>
                </TableCell>
                <TableCell>{formatExpiresLabel(share.expires_at)}</TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={status}
                    color={revoked || expired ? 'default' : 'success'}
                  />
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Kopiera länk">
                    <IconButton size="small" onClick={() => onCopy?.(shareUrl(share.token))}>
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  {!revoked ? (
                    <Tooltip title="Återkalla">
                      <IconButton size="small" color="error" onClick={() => onRevoke?.(share.id)}>
                        <LinkOffIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  ) : null}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      {invites?.length ? (
        <>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Inbjudningar
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Mottagare</TableCell>
                <TableCell>Behörighet</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Skickad</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invites.map((invite) => (
                <TableRow key={invite.id}>
                  <TableCell>
                    <Typography variant="body2">{invite.recipient_name || '—'}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {invite.recipient_email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip size="small" label={invite.permission} />
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={invite.status}
                      color={STATUS_COLOR[invite.status] || 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    {invite.sent_at ? new Date(invite.sent_at).toLocaleString('sv-SE') : '—'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      ) : null}
    </Stack>
  )
}
