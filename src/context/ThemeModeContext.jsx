import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { createAppTheme } from '../theme/theme'

const ThemeModeContext = createContext({
  mode: 'light',
  toggleMode: () => {},
  setMode: () => {},
})

const STORAGE_KEY = 'materio-theme-mode'

export function ThemeModeProvider({ children }) {
  const [mode, setModeState] = useState(() => {
    if (typeof window === 'undefined') return 'light'
    return localStorage.getItem(STORAGE_KEY) === 'dark' ? 'dark' : 'light'
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, mode)
  }, [mode])

  const value = useMemo(
    () => ({
      mode,
      setMode: setModeState,
      toggleMode: () => setModeState((prev) => (prev === 'light' ? 'dark' : 'light')),
    }),
    [mode],
  )

  const theme = useMemo(() => createAppTheme(mode), [mode])

  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  )
}

export function useThemeMode() {
  return useContext(ThemeModeContext)
}
