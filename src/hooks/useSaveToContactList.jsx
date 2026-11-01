import { useCallback, useMemo, useState } from 'react'
import SaveToContactListDialog from '../components/contacts/SaveToContactListDialog'
import { useAuth } from '../context/AuthContext'
import {
  buildContactCandidate,
  upsertCompanyContact,
} from '../lib/companyContacts'

/**
 * Efter lokal sparning: erbjuder att spara kontakten i företagets lista.
 * offerSave(raw) → Promise<{ saved, skipped?, updated? }>
 */
export default function useSaveToContactList(companyId, { onSaved } = {}) {
  const { user } = useAuth()
  const [pending, setPending] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const offerSave = useCallback(
    (raw) => {
      const candidate = buildContactCandidate(raw || {})
      if (!candidate || !companyId || !user?.id) {
        return Promise.resolve({ saved: false, skipped: true })
      }

      return new Promise((resolve) => {
        setError('')
        setPending({ candidate, resolve })
      })
    },
    [companyId, user?.id],
  )

  const finish = useCallback(
    (result) => {
      pending?.resolve(result)
      setPending(null)
      setBusy(false)
      setError('')
    },
    [pending],
  )

  const handleNo = useCallback(() => {
    if (busy) return
    finish({ saved: false })
  }, [busy, finish])

  const handleYes = useCallback(async () => {
    if (!pending?.candidate) return
    setBusy(true)
    setError('')
    try {
      const result = await upsertCompanyContact(user.id, companyId, pending.candidate)
      onSaved?.(result.contact)
      finish({ saved: true, created: result.created, updated: result.updated })
    } catch (err) {
      setError(
        err.message?.includes('company_contacts')
          ? 'Kontaktlistan saknas. Kör migration 033_company_contacts.sql.'
          : err.message || 'Kunde inte spara kontakten.',
      )
      setBusy(false)
    }
  }, [pending, user?.id, companyId, onSaved, finish])

  const dialog = useMemo(
    () => (
      <SaveToContactListDialog
        open={Boolean(pending)}
        contact={pending?.candidate}
        busy={busy}
        error={error}
        onYes={handleYes}
        onNo={handleNo}
      />
    ),
    [pending, busy, error, handleYes, handleNo],
  )

  return { offerSave, dialog }
}
