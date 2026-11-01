import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material'
import {
  emptyProjectClientForm,
  isOrgContactFormValid,
  orgContactFormToPayload,
  projectClientToForm,
} from '../../lib/types'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { useContactList } from '../../context/ContactListContext'
import OrgContactFormFields from './OrgContactFormFields'
import useSaveToContactList from '../../hooks/useSaveToContactList'

/**
 * Flik 3 – Beställarens organisation.
 * En post per projekt. Obligatoriska kontaktfält enligt underlaget.
 */
export default function ProjectClientSection({ projectId, companyId }) {
  const { user } = useAuth()
  const { refresh: refreshContacts } = useContactList()
  const { offerSave, dialog: contactDialog } = useSaveToContactList(companyId, {
    onSaved: () => refreshContacts(),
  })
  const [recordId, setRecordId] = useState(null)
  const [form, setForm] = useState(emptyProjectClientForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    let mounted = true

    const load = async () => {
      setLoading(true)
      setError('')
      const { data, error: fetchError } = await supabase
        .from('project_clients')
        .select('*')
        .eq('project_id', projectId)
        .maybeSingle()

      if (!mounted) return

      if (fetchError) {
        setError(fetchError.message)
        setRecordId(null)
        setForm({ ...emptyProjectClientForm })
      } else {
        setRecordId(data?.id || null)
        setForm(projectClientToForm(data))
      }
      setLoading(false)
    }

    if (projectId) load()
    return () => {
      mounted = false
    }
  }, [projectId])

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
    setSaved(false)
  }

  const handleSave = async (event) => {
    event.preventDefault()
    if (!isOrgContactFormValid(form)) return

    setSaving(true)
    setError('')
    setSaved(false)

    const payload = {
      ...orgContactFormToPayload(form),
      updated_at: new Date().toISOString(),
    }

    let result
    if (recordId) {
      result = await supabase
        .from('project_clients')
        .update(payload)
        .eq('id', recordId)
        .select()
        .single()
    } else {
      result = await supabase
        .from('project_clients')
        .insert({
          ...payload,
          user_id: user.id,
          company_id: companyId,
          project_id: projectId,
        })
        .select()
        .single()
    }

    setSaving(false)

    if (result.error) {
      setError(result.error.message)
      return
    }

    setRecordId(result.data.id)
    setForm(projectClientToForm(result.data))
    setSaved(true)

    await offerSave({
      name: form.contact_name,
      email: form.email,
      phone: form.phone,
      company_name: form.ceo_name ? `Beställare (VD: ${form.ceo_name})` : 'Beställare',
      role: 'Beställare',
    })
  }

  return (
    <Card>
      <CardContent sx={{ p: 5, '&:last-child': { pb: 5 } }}>
        {loading ? (
          <Box sx={{ py: 4, display: 'grid', placeItems: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <Stack component="form" spacing={3} onSubmit={handleSave}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Beställarens organisation
              </Typography>
              <Typography color="text.secondary">
                Flik 3 – kontakt och ansvariga hos beställaren. Kontaktfält är obligatoriska.
              </Typography>
            </Box>

            {error && <Alert severity="error">{error}</Alert>}
            {saved && <Alert severity="success">Sparat.</Alert>}

            <OrgContactFormFields form={form} onChange={handleChange} requireContact />

            <Stack direction="row" justifyContent="flex-end">
              <Button
                type="submit"
                variant="contained"
                disabled={saving || !isOrgContactFormValid(form)}
              >
                {saving ? <CircularProgress size={20} color="inherit" /> : 'Spara beställare'}
              </Button>
            </Stack>
          </Stack>
        )}
      </CardContent>
      {contactDialog}
    </Card>
  )
}
