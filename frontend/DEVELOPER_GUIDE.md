# Eagle Trend - Developer Quick Reference

## System Overview
**Eagle Trend** is a single-tenant loan management system for professional lending operations.

## Branding
- **Name**: Eagle Trend
- **Tagline**: Professional Loan Management System
- **Primary Color**: Navy Blue (#1a365d)
- **Accent Color**: Gold (#f59e0b)

## User Roles

| Role | Route | Description |
|------|-------|-------------|
| `admin` | `/admin` | System administrator - manages loan officers |
| `loan_officer` | `/loan-officer` | Manages clients and loans |
| `client` | `/client-portal` | Views loans and makes payments |

## API Endpoints

### Authentication
```javascript
POST /api/auth/login/
POST /api/auth/register/
GET  /api/auth/profile/
```

### Loan Officers (Admin Only)
```javascript
GET  /api/auth/loan-officers/
POST /api/auth/create-loan-officer/
POST /api/auth/loan-officers/{id}/activate/
POST /api/auth/loan-officers/{id}/deactivate/
```

### Clients
```javascript
GET  /api/auth/clients/my_clients/
POST /api/auth/clients/
```

### Loans
```javascript
GET  /api/loans/loans/
POST /api/loans/loans/
POST /api/loans/loans/{id}/approve/
POST /api/loans/loans/{id}/disburse/
GET  /api/loans/products/
GET  /api/loans/transactions/
```

## Component Structure

```
src/
├── components/
│   ├── common/
│   │   ├── ResponsiveModal.tsx
│   │   ├── ResponsiveNavbar.tsx
│   │   ├── ResponsiveTable.tsx
│   │   └── StatCard.tsx
│   ├── AdminDashboard.tsx          # Admin interface
│   ├── LoanOfficerDashboard.tsx    # Loan officer interface
│   ├── ClientPortal.tsx            # Client interface
│   ├── Login.tsx                   # Login page
│   ├── QuickClientAdd.tsx          # Client registration
│   ├── LoanDisbursement.tsx        # Loan creation
│   ├── RepaymentTracking.tsx       # Payment recording
│   └── ...
├── services/
│   └── api.ts                      # API client
├── App.tsx                         # Main app & routing
└── index.tsx                       # Entry point
```

## Common Tasks

### Adding a New Feature

1. **Create Component**
   ```typescript
   import React from 'react';
   import { Box, Typography } from '@mui/material';
   import ResponsiveNavbar from './common/ResponsiveNavbar';
   
   const MyComponent: React.FC = () => {
     return (
       <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
         <ResponsiveNavbar
           title="Eagle Trend"
           userRole="Admin"
           onLogout={() => {}}
         />
         {/* Your content */}
       </Box>
     );
   };
   ```

2. **Add API Endpoint**
   ```typescript
   // In src/services/api.ts
   export const myAPI = {
     getData: () => api.get('/api/my-endpoint/'),
     postData: (data: any) => api.post('/api/my-endpoint/', data),
   };
   ```

3. **Add Route**
   ```typescript
   // In src/App.tsx
   <Route path="/my-route" element={<MyComponent />} />
   ```

### Using Theme Colors

```typescript
import { useTheme } from '@mui/material';

const theme = useTheme();

// Primary (Navy Blue)
sx={{ bgcolor: 'primary.main' }}      // #1a365d
sx={{ bgcolor: 'primary.light' }}     // #2c5282
sx={{ bgcolor: 'primary.dark' }}      // #0f2942

// Accent (Gold)
sx={{ bgcolor: 'warning.main' }}      // #f59e0b
sx={{ bgcolor: 'warning.light' }}     // #fbbf24
sx={{ bgcolor: 'warning.dark' }}      // #d97706
```

### Role-Based Access

```typescript
const user = JSON.parse(localStorage.getItem('user') || '{}');

if (user.role === 'admin') {
  // Admin-only features
}

if (user.role === 'loan_officer') {
  // Loan officer features
}

if (user.role === 'client') {
  // Client features
}
```

### Making API Calls

```typescript
import api from '../services/api';

// GET request
const fetchData = async () => {
  try {
    const response = await api.get('/api/endpoint/');
    console.log(response.data);
  } catch (error) {
    console.error('Error:', error);
  }
};

// POST request
const postData = async (data: any) => {
  try {
    const response = await api.post('/api/endpoint/', data);
    console.log(response.data);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### Responsive Design

```typescript
import { useMediaQuery, useTheme } from '@mui/material';

const theme = useTheme();
const isMobile = useMediaQuery(theme.breakpoints.down('md'));

// Conditional rendering
{isMobile ? <MobileView /> : <DesktopView />}

// Responsive styling
sx={{ 
  p: { xs: 2, sm: 3, md: 4 },           // Padding
  fontSize: { xs: '0.75rem', md: '1rem' } // Font size
}}
```

## Environment Variables

```bash
# .env
REACT_APP_API_URL=http://localhost:8000
```

## Build & Deploy

```bash
# Development
npm run dev

# Production build
npm run build

# Serve production build
npm start
```

## Common Patterns

### StatCard Component
```typescript
<StatCard 
  title="Total Loans" 
  value={100} 
  color="success"
  icon={<AccountBalance />}
/>
```

### ResponsiveModal Component
```typescript
<ResponsiveModal
  open={open}
  onClose={() => setOpen(false)}
  title="Modal Title"
  maxWidth="md"
  actions={
    <>
      <Button onClick={() => setOpen(false)}>Cancel</Button>
      <Button variant="contained">Submit</Button>
    </>
  }
>
  {/* Modal content */}
</ResponsiveModal>
```

### ResponsiveNavbar Component
```typescript
<ResponsiveNavbar
  title="Eagle Trend"
  userRole="Admin"
  onLogout={handleLogout}
  navItems={[
    { label: 'Dashboard', onClick: () => navigate('/dashboard') },
    { label: 'Reports', onClick: () => navigate('/reports') }
  ]}
/>
```

## Troubleshooting

### Authentication Issues
- Check token in localStorage: `localStorage.getItem('token')`
- Verify API URL: `process.env.REACT_APP_API_URL`
- Check network tab for 401/403 errors

### Routing Issues
- Verify role-based routing in Login.tsx
- Check route definitions in App.tsx
- Ensure user role matches expected values

### API Issues
- Check backend is running
- Verify CORS settings
- Check request/response in browser DevTools

## Code Style

- Use TypeScript for type safety
- Use functional components with hooks
- Use Material-UI components
- Follow responsive design patterns
- Use async/await for API calls
- Handle errors gracefully

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## Resources

- [Material-UI Documentation](https://mui.com/)
- [React Router Documentation](https://reactrouter.com/)
- [Axios Documentation](https://axios-http.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

---

**Last Updated**: [Date]
**Version**: 1.0.0
