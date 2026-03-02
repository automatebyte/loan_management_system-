import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Card, CardContent } from '@mui/material';
import { AttachMoney, Warning, TrendingDown } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import ResponsiveNavbar from './common/ResponsiveNavbar';

const ClerkDashboardNew: React.FC = () => {
  const [reports, setReports] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await api.get('/api/loans/reports/clerk/');
      setReports(response.data);
    } catch (error) {}
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (!reports) return null;

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <ResponsiveNavbar title="Eagle Trend" userRole="Clerk" onLogout={handleLogout} />
      
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>Daily Reports</Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>Daily Expenses</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AttachMoney color="primary" />
                  <Typography variant="h4" sx={{ ml: 1 }}>${reports.daily_expenses.total.toLocaleString()}</Typography>
                </Box>
                <Typography variant="caption">{reports.daily_expenses.count} transactions</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>Dues Today</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AttachMoney color="success" />
                  <Typography variant="h4" sx={{ ml: 1 }}>${reports.dues.today.amount.toLocaleString()}</Typography>
                </Box>
                <Typography variant="caption">{reports.dues.today.count} payments</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>Overdue</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Warning color="error" />
                  <Typography variant="h4" sx={{ ml: 1 }}>${reports.dues.overdue.amount.toLocaleString()}</Typography>
                </Box>
                <Typography variant="caption">{reports.dues.overdue.count} payments</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>Pending Debts</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingDown color="warning" />
                  <Typography variant="h4" sx={{ ml: 1 }}>${reports.pending_debts.total.toLocaleString()}</Typography>
                </Box>
                <Typography variant="caption">{reports.pending_debts.count} active loans</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ClerkDashboardNew;
