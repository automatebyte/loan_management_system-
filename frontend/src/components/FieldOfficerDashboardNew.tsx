import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Card, CardContent } from '@mui/material';
import { TrendingUp, AttachMoney, People, AccountBalance } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import ResponsiveNavbar from './common/ResponsiveNavbar';

const FieldOfficerDashboardNew: React.FC = () => {
  const [reports, setReports] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await api.get('/api/loans/reports/field-officer/');
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
      <ResponsiveNavbar title="Eagle Trend" userRole="Field Officer" onLogout={handleLogout} />
      
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>My Performance</Typography>

        <Grid container spacing={3}>
          <Grid item xs={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TrendingUp color="primary" />
                  <Typography variant="caption" sx={{ ml: 1 }}>Total Loans</Typography>
                </Box>
                <Typography variant="h4">{reports.summary.total_loans}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Assessment color="success" />
                  <Typography variant="caption" sx={{ ml: 1 }}>Active Loans</Typography>
                </Box>
                <Typography variant="h4">{reports.summary.active_loans}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AttachMoney color="info" />
                  <Typography variant="caption" sx={{ ml: 1 }}>Disbursed</Typography>
                </Box>
                <Typography variant="h4">${(reports.summary.total_disbursed / 1000).toFixed(0)}K</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AccountBalance color="warning" />
                  <Typography variant="caption" sx={{ ml: 1 }}>Outstanding</Typography>
                </Box>
                <Typography variant="h4">${(reports.summary.outstanding_balance / 1000).toFixed(0)}K</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <People color="secondary" />
                  <Typography variant="caption" sx={{ ml: 1 }}>Clients</Typography>
                </Box>
                <Typography variant="h4">{reports.summary.clients_count}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AttachMoney color="success" />
                  <Typography variant="caption" sx={{ ml: 1 }}>Today Disbursed</Typography>
                </Box>
                <Typography variant="h4">${reports.daily_disbursement.toLocaleString()}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default FieldOfficerDashboardNew;
