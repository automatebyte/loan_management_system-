# Eagle Trend - Loan Management System (Frontend)

![Eagle Trend](https://img.shields.io/badge/Eagle%20Trend-Professional%20Loan%20Management-1a365d)
![React](https://img.shields.io/badge/React-18.2.0-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-3178c6)
![Material-UI](https://img.shields.io/badge/Material--UI-5.14.18-007fff)

Professional loan management system built with React, TypeScript, and Material-UI.

## 🚀 Features

### Admin Dashboard
- Manage loan officers
- Create and activate/deactivate users
- View system statistics
- Monitor loan officer performance

### Loan Officer Dashboard
- Manage client portfolio
- Quick client registration
- Loan disbursement workflow
- Payment tracking
- Portfolio statistics

### Client Portal
- View active loans
- Track payment history
- View loan details
- Request payments

## 🎨 Design

- **Primary Color**: Navy Blue (#1a365d)
- **Accent Color**: Gold (#f59e0b)
- **Responsive Design**: Mobile-first approach
- **UI Framework**: Material-UI v5

## 📋 Prerequisites

- Node.js 16+ and npm
- Backend API running (default: http://localhost:8000)

## 🛠️ Installation

```bash
# Clone the repository
git clone <repository-url>
cd frontend

# Install dependencies
npm install

# Create environment file
echo "REACT_APP_API_URL=http://localhost:8000" > .env

# Start development server
npm run dev
```

## 🏃 Running the Application

### Development Mode
```bash
npm run dev
```
Runs on http://localhost:3000

### Production Build
```bash
# Build the application
npm run build

# Serve the production build
npm start
```
Serves on http://localhost:3000

## 📁 Project Structure

```
frontend/
├── public/
│   ├── index.html          # HTML template
│   └── _redirects          # Netlify redirects
├── src/
│   ├── components/
│   │   ├── common/         # Reusable components
│   │   │   ├── ResponsiveModal.tsx
│   │   │   ├── ResponsiveNavbar.tsx
│   │   │   ├── ResponsiveTable.tsx
│   │   │   └── StatCard.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── LoanOfficerDashboard.tsx
│   │   ├── ClientPortal.tsx
│   │   ├── Login.tsx
│   │   ├── QuickClientAdd.tsx
│   │   ├── LoanDisbursement.tsx
│   │   └── RepaymentTracking.tsx
│   ├── services/
│   │   └── api.ts          # API client
│   ├── App.tsx             # Main app component
│   ├── index.tsx           # Entry point
│   └── index.css           # Global styles
├── package.json
├── tsconfig.json
├── MIGRATION_SUMMARY.md    # Migration documentation
├── DEVELOPER_GUIDE.md      # Developer reference
└── README.md               # This file
```

## 🔐 User Roles

| Role | Access Level | Features |
|------|-------------|----------|
| **Admin** | Full system access | Manage loan officers, view all statistics |
| **Loan Officer** | Portfolio management | Manage clients, create loans, track payments |
| **Client** | Personal view | View loans, track payments, view history |

## 🔌 API Integration

The frontend communicates with the backend API using Axios. All API calls are centralized in `src/services/api.ts`.

### Authentication
```typescript
POST /api/auth/login/
GET  /api/auth/profile/
```

### Loan Management
```typescript
GET  /api/loans/loans/
POST /api/loans/loans/
POST /api/loans/loans/{id}/approve/
POST /api/loans/loans/{id}/disburse/
```

### User Management
```typescript
GET  /api/auth/loan-officers/
POST /api/auth/create-loan-officer/
GET  /api/auth/clients/my_clients/
POST /api/auth/clients/
```

## 🎯 Key Components

### AdminDashboard
- Loan officer management
- System statistics
- User activation/deactivation

### LoanOfficerDashboard
- Client portfolio view
- Quick client registration
- Loan disbursement
- Payment tracking

### ClientPortal
- Loan overview
- Payment history
- Transaction tracking

### Common Components
- **ResponsiveNavbar**: Adaptive navigation bar
- **ResponsiveModal**: Mobile-friendly modal dialogs
- **StatCard**: Statistics display cards
- **ResponsiveTable**: Adaptive data tables

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:8000
```

### Theme Customization

Edit `src/App.tsx` to customize the theme:

```typescript
const theme = createTheme({
  palette: {
    primary: {
      main: '#1a365d',  // Navy Blue
    },
    warning: {
      main: '#f59e0b',  // Gold
    },
  },
});
```

## 📱 Responsive Design

The application is fully responsive with breakpoints:

- **xs**: 0px (mobile)
- **sm**: 768px (tablet)
- **md**: 1024px (desktop)
- **lg**: 1440px (large desktop)
- **xl**: 1920px (extra large)

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## 📦 Building for Production

```bash
# Create optimized production build
npm run build

# The build folder will contain the production-ready files
```

## 🚢 Deployment

### Netlify
```bash
# Build command
npm run build

# Publish directory
build
```

### Docker
```bash
# Build Docker image
docker build -t eagletrend-frontend .

# Run container
docker run -p 3000:3000 eagletrend-frontend
```

## 🔄 Migration from Multi-Tenant

This application was migrated from a multi-tenant architecture to a single-tenant system. See [MIGRATION_SUMMARY.md](MIGRATION_SUMMARY.md) for details.

### Key Changes
- Removed company management features
- Simplified user roles (admin, loan_officer, client)
- Removed subscription/billing features
- Single organization focus

## 📚 Documentation

- [Migration Summary](MIGRATION_SUMMARY.md) - Details of the multi-tenant to single-tenant migration
- [Developer Guide](DEVELOPER_GUIDE.md) - Quick reference for developers

## 🛠️ Tech Stack

- **React** 18.2.0 - UI library
- **TypeScript** 4.9.5 - Type safety
- **Material-UI** 5.14.18 - Component library
- **React Router** 6.18.0 - Routing
- **Axios** 1.6.2 - HTTP client
- **Emotion** 11.11.1 - CSS-in-JS

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Code Style

- Use TypeScript for type safety
- Follow React best practices
- Use functional components with hooks
- Implement responsive design patterns
- Handle errors gracefully
- Write meaningful commit messages

## 🐛 Troubleshooting

### Common Issues

**Issue**: Cannot connect to backend
- **Solution**: Check `REACT_APP_API_URL` in `.env` file
- **Solution**: Ensure backend is running

**Issue**: Authentication fails
- **Solution**: Clear localStorage and try again
- **Solution**: Check token expiration

**Issue**: Build fails
- **Solution**: Delete `node_modules` and run `npm install`
- **Solution**: Clear npm cache: `npm cache clean --force`

## 📄 License

This project is proprietary software. All rights reserved.

## 👥 Team

- Development Team
- Product Management
- Quality Assurance

## 📞 Support

For support, please contact the development team or open an issue in the repository.

---

**Version**: 1.0.0 (Single-Tenant)  
**Last Updated**: 2024  
**Status**: Production Ready

Made with ❤️ by the Eagle Trend Team
