import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material'

export default function SaveToContactListDialog({
  open,
  contact,
  busy,
  error,
  onYes,
  onNo,
}) {
  if (!contact) return null

  const titleName = contact.name || contact.email || 'kontakten'

  return (
    <Dialog open={open} onClose={busy ? undefined : onNo} fullWidth maxWidth="xs">
      <DialogTitle>Spara i kontaktlistan?</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          Vill du spara <strong>{titleName}</strong> i företagets kontaktlista? Då kan du
          återanvända kontakten i andra projekt, autocomplete och vid export/inbjudan.
        </DialogContentText>
        <Stack spacing={0.5}>
          {contact.role ? (
            <Typography variant="body2" color="text.secondary">
              Roll: {contact.role}
            </Typography>
          ) : null}
          {contact.company_name ? (
            <Typography variant="body2" color="text.secondary">
              Företag: {contact.company_name}
            </Typography>
          ) : null}
          {contact.email ? (
            <Typography variant="body2" color="text.secondary">
              E-post: {contact.email}
            </Typography>
          ) : null}
          {contact.phone ? (
            <Typography variant="body2" color="text.secondary">
              Telefon: {contact.phone}
            </Typography>
          ) : null}
        </Stack>
        {error ? (
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        ) : null}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onNo} disabled={busy}>
          Nej, bara här
        </Button>
        <Button variant="contained" onClick={onYes} disabled={busy}>
          Ja, spara i kontaktlistan
        </Button>
      </DialogActions>
    </Dialog>
  )
}
