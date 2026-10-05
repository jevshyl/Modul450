import type {} from '@mui/x-data-grid/themeAugmentation'
import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#6ee7ff' },
    secondary: { main: '#b78cff' },
    success: { main: '#4ade80' },
    error: { main: '#ff6b6b' },
    warning: { main: '#fbbf24' },
    background: {
      default: '#05060f',
      paper: '#0d1122',
    },
    text: {
      primary: '#e8ecff',
      secondary: '#9aa3c7',
    },
    divider: 'rgba(110, 231, 255, 0.16)',
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: '"Segoe UI", system-ui, -apple-system, sans-serif',
    h1: { fontSize: '2.6rem', fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.01em' },
    h3: { fontSize: '1.5rem', fontWeight: 600 },
    h4: { fontSize: '1.25rem', fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage:
            'radial-gradient(1100px 620px at 12% -8%, rgba(110,231,255,0.16), transparent 62%),' +
            'radial-gradient(900px 560px at 92% 4%, rgba(183,140,255,0.16), transparent 58%),' +
            'radial-gradient(760px 620px at 50% 110%, rgba(74,222,128,0.08), transparent 60%)',
          backgroundAttachment: 'fixed',
        },
        '::selection': { background: 'rgba(110,231,255,0.3)' },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(110,231,255,0.14)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(110,231,255,0.16)',
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 999,
          '&.MuiButton-containedPrimary': {
            backgroundImage: 'linear-gradient(120deg, #6ee7ff, #b78cff)',
            color: '#05060f',
            '&:hover': { backgroundImage: 'linear-gradient(120deg, #8ceeff, #c9a8ff)' },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: { root: { borderRadius: 999, fontWeight: 600 } },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundImage: 'none',
          backgroundColor: '#1b2140',
          border: '1px solid rgba(110,231,255,0.24)',
          fontSize: '0.78rem',
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: 'none',
          backgroundImage: 'none',
          '& .MuiDataGrid-row:hover': { backgroundColor: 'rgba(110,231,255,0.06)' },
        },
        columnHeaders: {
          backgroundColor: 'rgba(110,231,255,0.07)',
          borderBottom: '1px solid rgba(110,231,255,0.22)',
          fontWeight: 700,
        },
        cell: { borderColor: 'rgba(110,231,255,0.08)' },
        footerContainer: { borderColor: 'rgba(110,231,255,0.14)' },
      },
    },
  },
})