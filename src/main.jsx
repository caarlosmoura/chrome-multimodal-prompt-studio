import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import App from './App';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#8f3d1f',
    },
    secondary: {
      main: '#215c73',
    },
    background: {
      default: '#f3ece2',
      paper: '#fff9f3',
    },
    success: {
      main: '#2e7d32',
    },
    warning: {
      main: '#a86400',
    },
    error: {
      main: '#b3261e',
    },
  },
  shape: {
    borderRadius: 22,
  },
  typography: {
    fontSize: 13,
    fontFamily: '"Segoe UI", "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontFamily: 'Georgia, "Times New Roman", serif',
      fontWeight: 700,
      letterSpacing: '-0.04em',
      lineHeight: 0.95,
    },
    h2: {
      fontWeight: 700,
    },
    h5: {
      fontSize: '1.18rem',
      lineHeight: 1.2,
    },
    body1: {
      fontSize: '0.96rem',
      lineHeight: 1.7,
    },
    body2: {
      fontSize: '0.84rem',
      lineHeight: 1.6,
    },
    overline: {
      fontSize: '0.68rem',
      letterSpacing: '0.14em',
      fontWeight: 700,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(10px)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 700,
          borderRadius: 999,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiFormControl: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 700,
        },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
