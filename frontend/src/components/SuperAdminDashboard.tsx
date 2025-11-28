import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Button, Alert
} from '@mui/material';
import { Add, Business, TrendingUp, Warning, AttachMoney } from '@mui/icons-material';
import api from '../services/api';
import AddCompanyModal from './AddCompanyModal';
import CompanyManagementTable from './CompanyManagementTable';

interface DashboardStats {
  total_companies: number;
  active_subscriptions: number;
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
  loan_count: number;
  active_loans: number;
  total_disbursed: number;
  last_login: string;
  is_active: boolean;
  created_at: string;
}

const SuperAdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchDashboardData();
    fetchCompanies();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/api/companies/dashboard_stats/');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await api.get('/api/companies/');
      setCompanies(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const handleCreateCompany = async (companyData: any) => {
    try {
      await api.post('/api/companies/', companyData);
      setOpenModal(false);
      fetchCompanies();
      fetchDashboardData();
      setAlert({ type: 'success', message: 'Company registered successfully!' });
      setTimeout(() => setAlert(null), 3000);
    } catch (error) {
      console.error('Error creating company:', error);
      setAlert({ type: 'error', message: 'Failed to register company. Please try again.' });
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const handleUpdatePayment = async (id: number) => {
    try {
      await api.post(`/api/companies/${id}/update_payment_status/`);
      fetchCompanies();
      fetchDashboardData();
      setAlert({ type: 'success', message: 'Payment status updated successfully!' });
      setTimeout(() => setAlert(null), 3000);
    } catch (error) {
      console.error('Error updating payment:', error);
    }
  };

  const handleSuspendService = async (id: number) => {
    try {
      await api.post(`/api/companies/${id}/suspend_service/`);
      fetchCompanies();
      fetchDashboardData();
      setAlert({ type: 'success', message: 'Service suspended successfully!' });
      setTimeout(() => setAlert(null), 3000);
    } catch (error) {
      console.error('Error suspending service:', error);
    }
  };

  const handleActivateService = async (id: number) => {
    try {
      await api.post(`/api/companies/${id}/activate_service/`);
      fetchCompanies();
      fetchDashboardData();
      setAlert({ type: 'success', message: 'Service activated successfully!' });
      setTimeout(() => setAlert(null), 3000);
    } catch (error) {
      console.error('Error activating service:', error);
    }
  };

  const StatCard = ({ title, value, icon, color = 'primary', prefix = '' }: any) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent>
        <Box className="flex items-center justify-between">
          <Box>
            <Typography color="textSecondary" gutterBottom className="text-sm">
              {title}
            </Typography>
            <Typography variant="h4" component="div" color={color} className="font-bold">
              {prefix}{typeof value === 'number' ? value.toLocaleString() : value}
            </Typography>
          </Box>
          <Box className="text-gray-400">
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box className="p-6 bg-gray-50 min-h-screen">
      {alert && (
        <Alert severity={alert.type} className="mb-4">
          {alert.message}
        </Alert>
      )}
      
      <Box className="flex justify-between items-center mb-6">
        <Typography variant="h4" className="font-bold text-gray-800">
          Super Admin Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenModal(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Register New Company
        </Button>
      </Box>

      {/* Dashboard Stats */}
      {stats && (
        <Grid container spacing={3} className="mb-6">
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Total Companies" 
              value={stats.total_companies} 
              icon={<Business fontSize="large" />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Active Subscriptions" 
              value={stats.active_subscriptions} 
              color="success"
              icon={<TrendingUp fontSize="large" />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Pending Renewals" 
              value={stats.pending_renewals} 
              color="warning"
              icon={<Warning fontSize="large" />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Monthly Revenue" 
              value={stats.monthly_revenue} 
              color="info"
              prefix="$"
              icon={<AttachMoney fontSize="large" />}
            />
          </Grid>
        </Grid>
      )}

      {/* Additional Stats Row */}
      {stats && (
        <Grid container spacing={3} className="mb-6">
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Overdue Payments" 
              value={stats.overdue_payments} 
              color="error"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="New This Month" 
              value={stats.recent_companies} 
              color="info"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Enterprise Plans" 
              value={stats.subscription_breakdown.find(s => s.subscription_plan === 'enterprise')?.count || 0} 
              color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Trial Accounts" 
              value={stats.status_breakdown.find(s => s.subscription_status === 'trial')?.count || 0} 
              color="warning"
            />
          </Grid>
        </Grid>
      )}

      {/* Companies Management Table */}
      <Box className="bg-white rounded-lg shadow">
        <Box className="p-4 border-b">
          <Typography variant="h6" className="font-semibold">
            Client Companies Management
          </Typography>
        </Box>
        <CompanyManagementTable
          companies={companies}
          onUpdatePayment={handleUpdatePayment}
          onSuspendService={handleSuspendService}
          onActivateService={handleActivateService}
        />
      </Box>

      {/* Add Company Modal */}
      <AddCompanyModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleCreateCompany}
      />
    </Box>
  );
};

export default SuperAdminDashboard;