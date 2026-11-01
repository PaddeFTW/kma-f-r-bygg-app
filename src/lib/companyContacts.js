import { supabase } from './supabase'

function normalizeEmail(email) {
  return (email || '').trim().toLowerCase()
}

function normalizeName(name) {
  return (name || '').trim().toLowerCase()
}

function normalizeCompany(companyName) {
  return (companyName || '').trim().toLowerCase()
}

export function contactDisplayLabel(contact) {
  const parts = [contact.name]
  if (contact.role) parts.push(contact.role)
  if (contact.company_name) parts.push(contact.company_name)
  return parts.filter(Boolean).join(' · ')
}

export function buildContactCandidate({
  name,
  email,
  phone,
  company_name,
  role,
  notes,
}) {
  const trimmedName = (name || '').trim()
  const trimmedEmail = (email || '').trim()
  if (!trimmedName && !trimmedEmail) return null
  return {
    name: trimmedName || trimmedEmail,
    email: trimmedEmail || null,
    phone: (phone || '').trim() || null,
    company_name: (company_name || '').trim() || null,
    role: (role || '').trim() || null,
    notes: (notes || '').trim() || null,
  }
}

export async function loadCompanyContacts(companyId) {
  if (!companyId) return []
  const { data, error } = await supabase
    .from('company_contacts')
    .select('*')
    .eq('company_id', companyId)
    .order('name', { ascending: true })
  if (error) throw new Error(error.message)
  return data || []
}

export function findDuplicateContact(existing, candidate) {
  const email = normalizeEmail(candidate.email)
  const name = normalizeName(candidate.name)
  const company = normalizeCompany(candidate.company_name)

  if (email) {
    const byEmail = existing.find((c) => normalizeEmail(c.email) === email)
    if (byEmail) return byEmail
  }

  return (
    existing.find(
      (c) =>
        normalizeName(c.name) === name &&
        normalizeCompany(c.company_name) === company &&
        name.length > 0,
    ) || null
  )
}

/**
 * Sparar kontakt utan dubblett: uppdaterar befintlig vid match på e-post
 * eller namn+företag, annars insert.
 */
export async function upsertCompanyContact(userId, companyId, candidate) {
  if (!userId || !companyId || !candidate) {
    throw new Error('Saknar användare, företag eller kontakt.')
  }

  const existing = await loadCompanyContacts(companyId)
  const duplicate = findDuplicateContact(existing, candidate)
  const now = new Date().toISOString()

  if (duplicate) {
    const { data, error } = await supabase
      .from('company_contacts')
      .update({
        name: candidate.name || duplicate.name,
        email: candidate.email || duplicate.email,
        phone: candidate.phone || duplicate.phone,
        company_name: candidate.company_name || duplicate.company_name,
        role: candidate.role || duplicate.role,
        notes: candidate.notes || duplicate.notes,
        updated_at: now,
      })
      .eq('id', duplicate.id)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return { contact: data, created: false, updated: true }
  }

  const { data, error } = await supabase
    .from('company_contacts')
    .insert({
      user_id: userId,
      company_id: companyId,
      name: candidate.name,
      email: candidate.email,
      phone: candidate.phone,
      company_name: candidate.company_name,
      role: candidate.role,
      notes: candidate.notes,
    })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return { contact: data, created: true, updated: false }
}

export function contactsToNameSuggestions(contacts) {
  return [...new Set((contacts || []).map((c) => c.name).filter(Boolean))]
}

export function contactsToInviteRows(contacts) {
  return (contacts || [])
    .filter((c) => (c.email || '').trim())
    .map((c) => ({
      id: `company-${c.id}`,
      name: c.name,
      email: c.email.trim(),
      source: c.role || c.company_name || 'Kontaktlista',
    }))
}
