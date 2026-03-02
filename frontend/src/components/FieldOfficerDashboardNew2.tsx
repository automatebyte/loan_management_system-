import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Card, CardContent, Table, TableBody, TableCell, TableHead, TableRow, Button, TextField, IconButton } from '@mui/material';
import { TrendingUp, AttachMoney, People, AccountBalance, Assessment, Add, Delete, Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import ResponsiveNavbar from './common/ResponsiveNavbar';
import QuickClientAdd from './QuickClientAdd';

const FieldOfficerDashboardNew: React.FC = () => {
  const [reports, setReports] = useState<any>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [showAddClient, setShowAddClient] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [reportsRes, clientsRes] = await Promise.all([
        api.get('/api/loans/reports/field-officer/'),
        api.get('/api/auth/clients/')
      ]);
      setReports(reportsRes.data);
      setClients(clientsRes.data);
    } catch (error) {}
  };

  const handleDeleteClient = async (id: number) => {
    try {
      await api.delete(`/api/auth/clients/${id}/`);
      fetchData();
    } catch (error) {}
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (!reports) return null;

  const filteredClients = clients.filter(c => 
    c.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search) ||
    c.client_id?.includes(search)
  );

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <ResponsiveNavbar title="Eagle Trend" userRole="Field Officer" onLogout={handleLogout} />
      
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>My Dashboard</Typography>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={6} md={2}>
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
          <Grid item xs={6} md={2}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Assessment color="success" />
                  <Typography variant="caption" sx={{ ml: 1 }}>Active</Typography>
                </Box>
                <Typography variant="h4">{reports.summary.active_loans}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={2}>
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
          <Grid item xs={6} md={2}>
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
          <Grid item xs={6} md={2}>
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
          <Grid item xs={6} md={2}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AttachMoney color="success" />
                  <Typography variant="caption" sx={{ ml: 1 }}>Today</Typography>
                </Box>
                <Typography variant="h4">${(reports.daily_disbursement / 1000).toFixed(1)}K</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">My Clients</Typography>
              <Button startIcon={<Add />} onClick={() => setShowAddClient(true)}>Add Client</Button>
            </Box>
            
            <TextField
              size="small"
              placeholder="Search by name, phone, or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{ startAdornment: <Search /> }}
              sx={{ mb: 2, width: 300 }}
            />
            
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Client ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Occupation</TableCell>
                  <TableCell>Loans</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredClients.map((client: any) => (
                  <TableRow key={client.id}>
                    <TableCell>{client.client_id}</TableCell>
                    <TableCell>{client.full_name}</TableCell>
                    <TableCell>{client.phone}</TableCell>
                    <TableCell>{client.occupation || 'N/A'}</TableCell>
                    <TableCell>{client.loan_count}</TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => handleDeleteClient(client.id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Box>

      <QuickClientAdd open={showAddClient} onClose={() => setShowAddClient(false)} onSuccess={fetchData} />
    </Box>
  );
};

export default FieldOfficerDashboardNew;
