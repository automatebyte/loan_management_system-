import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Card, CardContent, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { TrendingUp, AttachMoney, People, Assessment } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import ResponsiveNavbar from './common/ResponsiveNavbar';

const AdminDashboard: React.FC = () => {
  const [reports, setReports] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await api.get('/api/loans/reports/admin/');
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
      <ResponsiveNavbar title="Eagle Trend" userRole="Admin" onLogout={handleLogout} />
      
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>Performance Dashboard</Typography>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <People color="primary" />
                  <Typography variant="caption" sx={{ ml: 1 }}>Officers</Typography>
                </Box>
                <Typography variant="h4">{reports.summary.total_officers}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Assessment color="success" />
                  <Typography variant="caption" sx={{ ml: 1 }}>Month Loans</Typography>
                </Box>
                <Typography variant="h4">{reports.summary.month_loans}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TrendingUp color="info" />
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
                  <AttachMoney color="warning" />
                  <Typography variant="caption" sx={{ ml: 1 }}>Disbursed</Typography>
                </Box>
                <Typography variant="h4">${(reports.summary.total_disbursed / 1000).toFixed(0)}K</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Officer Performance</Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Officer</TableCell>
                  <TableCell align="right">Month Loans</TableCell>
                  <TableCell align="right">Month Disbursed</TableCell>
                  <TableCell align="right">Active Loans</TableCell>
                  <TableCell align="right">Clients</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reports.officer_performance.map((officer: any) => (
                  <TableRow key={officer.officer_id}>
                    <TableCell>{officer.officer_name}</TableCell>
                    <TableCell align="right">{officer.month_loans}</TableCell>
                    <TableCell align="right">${officer.month_disbursed.toLocaleString()}</TableCell>
                    <TableCell align="right">{officer.active_loans}</TableCell>
                    <TableCell align="right">{officer.clients_count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
