import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const AuthContext = createContext({
  user: null,
  session: null,
  loading: true,
  isConfigured: false,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => ({ error: null }),
  resetPassword: async () => ({ error: null }),
  updatePassword: async () => ({ error: null }),
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }

    let mounted = true

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      setSession(data.session)
      setUser(data.session?.user ?? null)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setUser(nextSession?.user ?? null)
      setLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const value = useMemo(
    () => ({
      user,
      session,
      loading,
      isConfigured: isSupabaseConfigured,
      signIn: async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        return { error }
      },
      signUp: async (email, password, options = {}) => {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options,
        })
        return { error }
      },
      signOut: async () => {
        const { error } = await supabase.auth.signOut()
        return { error }
      },
      resetPassword: async (email, redirectTo) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo,
        })
        return { error }
      },
      updatePassword: async (password) => {
        const { error } = await supabase.auth.updateUser({ password })
        return { error }
      },
    }),
    [user, session, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
