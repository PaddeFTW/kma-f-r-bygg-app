import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  contactsToNameSuggestions,
  loadCompanyContacts,
} from '../lib/companyContacts'

const ContactListContext = createContext({
  contacts: [],
  nameSuggestions: [],
  loading: false,
  refresh: async () => {},
  companyId: null,
})

export function ContactListProvider({ companyId, children }) {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(false)

  const refresh = useCallback(async () => {
    if (!companyId) {
      setContacts([])
      return
    }
    setLoading(true)
    try {
      const rows = await loadCompanyContacts(companyId)
      setContacts(rows)
    } catch {
      setContacts([])
    } finally {
      setLoading(false)
    }
  }, [companyId])

  useEffect(() => {
    refresh()
  }, [refresh])

  const value = useMemo(
    () => ({
      contacts,
      nameSuggestions: contactsToNameSuggestions(contacts),
      loading,
      refresh,
      companyId,
    }),
    [contacts, loading, refresh, companyId],
  )

  return <ContactListContext.Provider value={value}>{children}</ContactListContext.Provider>
}

export function useContactList() {
  return useContext(ContactListContext)
}
