import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Typography, Button, Alert, useMediaQuery, useTheme
} from '@mui/material';
import { Add, Business, TrendingUp, Warning, AttachMoney } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api, { companyAPI } from '../services/api';
import AddCompanyModal from './AddCompanyModal';
import CompanyManagementTable from './CompanyManagementTable';
import CompanyApprovalTable from './CompanyApprovalTable';
import CompanyCredentialsModal from './CompanyCredentialsModal';
import CredentialDisplay from './CredentialDisplay';
import StatCard from './common/StatCard';
import ResponsiveNavbar from './common/ResponsiveNavbar';

interface DashboardStats {
  total_companies: number;
  active_subscriptions: number;
  trial_companies: number;
  suspended_companies: number;
  pending_renewals: number;
  overdue_payments: number;
  monthly_revenue: number;
  recent_companies: number;
  subscription_breakdown: Array<{ subscription_plan: string; count: number }>;
  status_breakdown: Array<{ subscription_status: string; count: number }>;
}

interface Company {
  id: number;
  name: string;
  email: string;
  admin_email: string;
  admin_name: string;
  subscription_plan: string;
  subscription_status: string;
  monthly_fee: number;
  last_payment_date: string;
  next_payment_date: string;
  payment_status: string;
  user_count: number;
  max_users: number;
  days_until_expiry: number;
  last_login: string;
  is_active: boolean;
  created_at: string;
  business_registration: string;
  industry: string;
  estimated_loan_volume: string;
}

const SuperAdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [openCredentialsModal, setOpenCredentialsModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showCredentials, setShowCredentials] = useState<any>(null);
  const [showDebug, setShowDebug] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
    fetchCompanies();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await companyAPI.getDashboardStats();
      setStats(response.data);
    } catch (error: any) {
      console.error('Error fetching dashboard stats:', error);
      if (error.response?.status === 403) {
        setAlert({ type: 'error', message: 'Access denied. Please check your permissions.' });
        setTimeout(() => setAlert(null), 5000);
      }
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await companyAPI.getCompanies();
      setCompanies(response.data.results || response.data);
    } catch (error: any) {
      console.error('Error fetching companies:', error);
      if (error.response?.status === 403) {
        setAlert({ type: 'error', message: 'Access denied. Please check your permissions.' });
        setTimeout(() => setAlert(null), 5000);
      }
    }
  };

  const handleCreateCompany = async (companyData: any) => {
    try {
      await companyAPI.createCompany(companyData);
      setOpenModal(false);
      fetchCompanies();
      fetchDashboardData();
      setAlert({ type: 'success', message: 'Company registered successfully!' });
      setTimeout(() => setAlert(null), 3000);
    } catch (error: any) {
      console.error('Error creating company:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to register company';
      setAlert({ type: 'error', message: errorMessage });
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const handleUpdatePayment = async (id: number) => {
    try {
      await companyAPI.updatePaymentStatus(id);
      fetchCompanies();
      fetchDashboardData();
      setAlert({ type: 'success', message: 'Payment status updated successfully!' });
      setTimeout(() => setAlert(null), 3000);
    } catch (error: any) {
      console.error('Error updating payment:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to update payment';
      setAlert({ type: 'error', message: errorMessage });
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const handleSuspendService = async (id: number) => {
    try {
      await companyAPI.suspendService(id);
      fetchCompanies();
      fetchDashboardData();
      setAlert({ type: 'success', message: 'Service suspended successfully!' });
      setTimeout(() => setAlert(null), 3000);
    } catch (error: any) {
      console.error('Error suspending service:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to suspend service';
      setAlert({ type: 'error', message: errorMessage });
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const handleActivateService = async (id: number) => {
    try {
      await companyAPI.activateService(id);
      fetchCompanies();
      fetchDashboardData();
      setAlert({ type: 'success', message: 'Service activated successfully!' });
      setTimeout(() => setAlert(null), 3000);
    } catch (error: any) {
      console.error('Error activating service:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to activate service';
      setAlert({ type: 'error', message: errorMessage });
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const handleApproveCompany = async (id: number) => {
    try {
      console.log(`Attempting to approve company ID: ${id}`);
      const response = await companyAPI.approveCompany(id);
      
      console.log('Approval response:', response.data);
      
      fetchCompanies();
      fetchDashboardData();
      
      // Handle simplified response format
      if (response.data.success && response.data.credentials) {
        const company = companies.find(c => c.id === id);
        const { username, password, login_url } = response.data.credentials;
        
        setShowCredentials({
          username,
          password,
          email: company?.admin_email || '',
          loginUrl: login_url,
          companyName: company?.name || 'Company'
        });
        
        // Log credentials for easy copying
        console.log('Company Approved - Login Credentials:');
        console.log('Username:', username);
        console.log('Password:', password);
        console.log('Login URL:', login_url);
        
        // Hide credentials after 30 seconds
        setTimeout(() => setShowCredentials(null), 30000);
      } else {
        setAlert({ type: 'success', message: response.data.message || 'Company approved!' });
        setTimeout(() => setAlert(null), 3000);
      }
    } catch (error: any) {
      console.error('Error approving company:', {
        id,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          error.message || 
                          'Failed to approve company';
      
      setAlert({ type: 'error', message: `Approval failed: ${errorMessage}` });
      setTimeout(() => setAlert(null), 5000);
    }
  };

  const handleRejectCompany = async (id: number) => {
    try {
      await companyAPI.rejectCompany(id);
      fetchCompanies();
      fetchDashboardData();
      setAlert({ type: 'success', message: 'Company registration rejected' });
      setTimeout(() => setAlert(null), 3000);
    } catch (error: any) {
      console.error('Error rejecting company:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to reject company';
      setAlert({ type: 'error', message: errorMessage });
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const handleViewCredentials = (company: Company) => {
    setSelectedCompany(company);
    setOpenCredentialsModal(true);
  };



  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <ResponsiveNavbar
        title="KreditAI"
        userRole="Super Admin"
        onLogout={handleLogout}
      />
      
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      {alert && (
        <Alert severity={alert.type} className="mb-4">
          {alert.message}
        </Alert>
      )}
      
      {showCredentials && (
        <Box sx={{ mb: 3 }}>
          <CredentialDisplay
            username={showCredentials.username}
            password={showCredentials.password}
            email={showCredentials.email}
            loginUrl={showCredentials.loginUrl}
            companyName={showCredentials.companyName}
          />
        </Box>
      )}
      
      {/* Debug Section */}
      <Box sx={{ mb: 2 }}>
        <Button 
          variant="outlined" 
          size="small" 
          onClick={() => setShowDebug(!showDebug)}
          sx={{ mb: 1 }}
        >
          {showDebug ? 'Hide' : 'Show'} Debug Info
        </Button>
        {showDebug && (
          <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1, fontFamily: 'monospace', fontSize: '0.8rem' }}>
            <Typography variant="body2"><strong>Token:</strong> {localStorage.getItem('token') ? '✅ Present' : '❌ Missing'}</Typography>
            <Typography variant="body2"><strong>User:</strong> {localStorage.getItem('user') || '❌ Missing'}</Typography>
            <Typography variant="body2"><strong>API URL:</strong> {process.env.REACT_APP_API_URL || 'http://localhost:8000'}</Typography>
            <Typography variant="body2"><strong>Current URL:</strong> {window.location.href}</Typography>
          </Box>
        )}
      </Box>
      
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'stretch', sm: 'center' }, 
          gap: { xs: 2, sm: 0 },
          mb: { xs: 3, md: 4 }
        }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
            Dashboard
          </Typography>
          <Button
            variant="contained"
            startIcon={!isMobile ? <Add /> : undefined}
            onClick={() => setOpenModal(true)}
            fullWidth={isMobile}
            sx={{ 
              bgcolor: 'primary.main',
              '&:hover': { bgcolor: 'primary.dark' },
              px: 3,
              py: 1.5
            }}
          >
            {isMobile ? 'Register Company' : 'Register New Company'}
          </Button>
        </Box>

        {/* Company & Subscription Management Stats */}
        {stats && (
          <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: { xs: 3, md: 4 } }}>
            <Grid item xs={6} sm={6} md={3}>
            <StatCard 
              title="Total Companies" 
              value={stats.total_companies} 
              icon={<Business fontSize="large" />}
            />
          </Grid>
            <Grid item xs={6} sm={6} md={3}>
              <StatCard 
                title="Active Subscriptions" 
                value={stats.active_subscriptions} 
                color="success"
                icon={<TrendingUp fontSize="large" />}
              />
            </Grid>
            <Grid item xs={6} sm={6} md={3}>
              <StatCard 
                title="Monthly Revenue" 
                value={stats.monthly_revenue} 
                color="info"
                prefix="$"
                icon={<AttachMoney fontSize="large" />}
              />
            </Grid>
            <Grid item xs={6} sm={6} md={3}>
            <StatCard 
              title="Overdue Payments" 
              value={stats.overdue_payments} 
              color="error"
              icon={<Warning fontSize="large" />}
            />
          </Grid>
          </Grid>
        )}

        {/* Subscription Status Breakdown */}
        {stats && (
          <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: { xs: 3, md: 4 } }}>
            <Grid item xs={6} sm={6} md={3}>
            <StatCard 
              title="Trial Companies" 
              value={stats.trial_companies} 
              color="warning"
            />
          </Grid>
            <Grid item xs={6} sm={6} md={3}>
              <StatCard 
                title="Suspended Companies" 
                value={stats.suspended_companies} 
                color="error"
              />
            </Grid>
            <Grid item xs={6} sm={6} md={3}>
              <StatCard 
                title="Pending Renewals" 
                value={stats.pending_renewals} 
                color="warning"
              />
            </Grid>
            <Grid item xs={6} sm={6} md={3}>
            <StatCard 
              title="New This Month" 
              value={stats.recent_companies} 
              color="info"
            />
          </Grid>
          </Grid>
        )}

        {/* Pending Approvals Section */}
        {companies.filter(c => c.subscription_status === 'pending_approval').length > 0 && (
          <Box sx={{ 
            bgcolor: 'background.paper', 
            borderRadius: 2, 
            boxShadow: 1, 
            border: '1px solid #e5e7eb',
            overflow: 'hidden',
            mb: { xs: 3, md: 4 }
          }}>
            <Box sx={{ p: { xs: 2, md: 3 }, borderBottom: '1px solid #e5e7eb' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: 'warning.main' }}>
                🔔 Pending Approvals ({companies.filter(c => c.subscription_status === 'pending_approval').length})
              </Typography>
              <Typography variant="body2" color="textSecondary">
                New company registrations awaiting approval
              </Typography>
            </Box>
            <CompanyApprovalTable
              companies={companies}
              onApprove={handleApproveCompany}
              onReject={handleRejectCompany}
            />
          </Box>
        )}

        {/* Company & Subscription Management Table */}
        <Box sx={{ 
          bgcolor: 'background.paper', 
          borderRadius: 2, 
          boxShadow: 1, 
          border: '1px solid #e5e7eb',
          overflow: 'hidden'
        }}>
          <Box sx={{ p: { xs: 2, md: 3 }, borderBottom: '1px solid #e5e7eb' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              Company Management
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {isMobile ? 'Manage companies & billing' : 'Manage client companies, subscriptions, and billing'}
            </Typography>
          </Box>
        <CompanyManagementTable
          companies={companies.filter(c => c.subscription_status !== 'pending_approval')}
          onUpdatePayment={handleUpdatePayment}
          onSuspendService={handleSuspendService}
          onActivateService={handleActivateService}
          onViewCredentials={handleViewCredentials}
        />
        </Box>

        {/* Add Company Modal */}
      <AddCompanyModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleCreateCompany}
      />

      {/* Company Credentials Modal */}
      <CompanyCredentialsModal
        open={openCredentialsModal}
        onClose={() => setOpenCredentialsModal(false)}
        company={selectedCompany}
      />
      </Box>
    </Box>
  );
};

export default SuperAdminDashboard;