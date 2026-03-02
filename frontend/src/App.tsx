import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Login from './components/Login';
import AdminDashboardNew from './components/AdminDashboardNew';
import FieldOfficerDashboardNew from './components/FieldOfficerDashboardNew';
import ClerkDashboardNew from './components/ClerkDashboardNew';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1a365d',
      light: '#2c5282',
      dark: '#0f2942',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ffffff',
      light: '#f8fafc',
      dark: '#e2e8f0',
      contrastText: '#1f2937',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1f2937',
      secondary: '#6b7280',
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 768,
      md: 1024,
      lg: 1440,
      xl: 1920,
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      color: '#1f2937',
      fontSize: '1.5rem',
      '@media (min-width:768px)': {
        fontSize: '2rem',
      },
      '@media (min-width:1024px)': {
        fontSize: '2.25rem',
      },
    },
    h6: {
      fontWeight: 600,
      color: '#1f2937',
      fontSize: '1rem',
      '@media (min-width:768px)': {
        fontSize: '1.125rem',
      },
    },
    body1: {
      fontSize: '0.875rem',
      '@media (min-width:768px)': {
        fontSize: '1rem',
      },
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
          fontWeight: 500,
          minHeight: '44px',
          padding: '12px 16px',
          '@media (min-width:768px)': {
            padding: '8px 16px',
            minHeight: 'auto',
          },
        },
        contained: {
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          border: '1px solid #e5e7eb',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#1a365d',
          '& .MuiTableCell-head': {
            color: '#ffffff',
            fontWeight: 600,
            fontSize: '0.75rem',
            '@media (min-width:768px)': {
              fontSize: '0.875rem',
            },
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: '0.75rem',
          padding: '8px',
          '@media (min-width:768px)': {
            fontSize: '0.875rem',
            padding: '16px',
          },
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminDashboardNew />} />
          <Route path="/field-officer" element={<FieldOfficerDashboardNew />} />
          <Route path="/loan-officer" element={<FieldOfficerDashboardNew />} />
          <Route path="/clerk" element={<ClerkDashboardNew />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;