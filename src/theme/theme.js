import { createTheme } from '@mui/material/styles'

/** Materio V3 color tokens (Figma / free template palette) */
const primary = {
  main: '#8C57FF',
  light: '#A379FF',
  dark: '#7E4EE6',
  contrastText: '#FFF',
}

const sharedPalette = {
  primary,
  secondary: {
    main: '#8A8D93',
    light: '#A1A4A9',
    dark: '#7C7F84',
    contrastText: '#FFF',
  },
  error: {
    main: '#FF4C51',
    light: '#FF7074',
    dark: '#E64449',
    contrastText: '#FFF',
  },
  warning: {
    main: '#FFB400',
    light: '#FFC333',
    dark: '#E6A200',
    contrastText: '#FFF',
  },
  info: {
    main: '#16B1FF',
    light: '#45C1FF',
    dark: '#149FE6',
    contrastText: '#FFF',
  },
  success: {
    main: '#56CA00',
    light: '#78D533',
    dark: '#4DB600',
    contrastText: '#FFF',
  },
}

const typography = {
  fontFamily: '"Public Sans", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  h1: { fontWeight: 500, fontSize: '2.875rem', lineHeight: 1.375 },
  h2: { fontWeight: 500, fontSize: '2.375rem', lineHeight: 1.375 },
  h3: { fontWeight: 500, fontSize: '1.75rem', lineHeight: 1.375 },
  h4: { fontWeight: 500, fontSize: '1.5rem', lineHeight: 1.375 },
  h5: { fontWeight: 500, fontSize: '1.125rem', lineHeight: 1.375 },
  h6: { fontWeight: 500, fontSize: '0.9375rem', lineHeight: 1.375 },
  body1: { fontSize: '0.9375rem', lineHeight: 1.467 },
  body2: { fontSize: '0.8125rem', lineHeight: 1.538 },
  button: { textTransform: 'none', fontWeight: 500 },
}

const shape = { borderRadius: 6 }

const components = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 6,
        boxShadow: 'none',
        textTransform: 'none',
        fontWeight: 500,
        '&:hover': { boxShadow: 'none' },
      },
      contained: {
        boxShadow: 'none',
        '&:hover': { boxShadow: 'none' },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 6,
        boxShadow: '0px 3px 12px rgba(47, 43, 61, 0.14)',
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
      },
      elevation1: {
        boxShadow: '0px 3px 12px rgba(47, 43, 61, 0.14)',
      },
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: {
        borderRight: 'none',
        boxShadow: '0px 3px 12px rgba(47, 43, 61, 0.14)',
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        boxShadow: 'none',
      },
    },
  },
}

export function createAppTheme(mode = 'light') {
  const isLight = mode === 'light'

  return createTheme({
    palette: {
      mode,
      ...sharedPalette,
      text: isLight
        ? {
            primary: 'rgba(47, 43, 61, 0.9)',
            secondary: 'rgba(47, 43, 61, 0.7)',
            disabled: 'rgba(47, 43, 61, 0.4)',
          }
        : {
            primary: 'rgba(225, 222, 245, 0.9)',
            secondary: 'rgba(225, 222, 245, 0.7)',
            disabled: 'rgba(225, 222, 245, 0.4)',
          },
      divider: isLight ? 'rgba(47, 43, 61, 0.12)' : 'rgba(225, 222, 245, 0.12)',
      background: isLight
        ? { default: '#F4F5FA', paper: '#FFFFFF' }
        : { default: '#28243D', paper: '#312D4B' },
      action: isLight
        ? {
            active: 'rgba(47, 43, 61, 0.6)',
            hover: 'rgba(47, 43, 61, 0.04)',
            selected: 'rgba(47, 43, 61, 0.08)',
            disabled: 'rgba(47, 43, 61, 0.3)',
            disabledBackground: 'rgba(47, 43, 61, 0.12)',
          }
        : {
            active: 'rgba(225, 222, 245, 0.6)',
            hover: 'rgba(225, 222, 245, 0.04)',
            selected: 'rgba(225, 222, 245, 0.08)',
            disabled: 'rgba(225, 222, 245, 0.3)',
            disabledBackground: 'rgba(225, 222, 245, 0.12)',
          },
    },
    typography,
    shape,
    components: {
      ...components,
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            boxShadow: isLight
              ? '0px 3px 12px rgba(47, 43, 61, 0.14)'
              : '0px 3px 12px rgba(19, 17, 32, 0.4)',
          },
        },
      },
    },
  })
}

export default createAppTheme('light')
