import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Button, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, Chip, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem
} from '@mui/material';
import { Edit, Add, Person, AccountBalance, TrendingUp } from '@mui/icons-material';
import api from '../services/api';

interface Client {
  id: number;
  client_id: string;
  full_name: string;
  email: string;
  monthly_income: number;
  employment_status: string;
  loan_count: number;
  is_active: boolean;
  created_at: string;
}

interface PortfolioStats {
  total_clients: number;
  active_loans: number;
  total_disbursed: number;
  pending_applications: number;
}

const LoanOfficerDashboard: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [stats, setStats] = useState<PortfolioStats>({
    total_clients: 0,
    active_loans: 0,
    total_disbursed: 0,
    pending_applications: 0
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [newClient, setNewClient] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    date_of_birth: '',
    national_id: '',
    address: '',
    monthly_income: '',
    employment_status: 'employed'
  });

  useEffect(() => {
    fetchClients();
    fetchPortfolioStats();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await api.get('/api/auth/clients/my_clients/');
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const fetchPortfolioStats = async () => {
    try {
      // This would be a custom endpoint for loan officer stats
      const response = await api.get('/api/loans/reports/officer_summary/');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching portfolio stats:', error);
    }
  };

  const handleCreateClient = async () => {
    try {
      await api.post('/api/auth/clients/', newClient);
      setOpenDialog(false);
      setNewClient({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        date_of_birth: '',
        national_id: '',
        address: '',
        monthly_income: '',
        employment_status: 'employed'
      });
      fetchClients();
      fetchPortfolioStats();
    } catch (error) {
      console.error('Error creating client:', error);
    }
  };

  const StatCard = ({ title, value, icon, color = 'primary' }: any) => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="textSecondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div" color={color}>
              {typeof value === 'number' && title.includes('$') 
                ? `$${value.toLocaleString()}` 
                : value}
            </Typography>
          </Box>
          {icon}
        </Box>
      </CardContent>
    </Card>
  );

  const getEmploymentColor = (status: string) => {
    const colors: any = {
      employed: 'success',
      self_employed: 'warning',
      unemployed: 'error'
    };
    return colors[status] || 'default';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">My Portfolio</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenDialog(true)}
        >
          Add New Client
        </Button>
      </Box>

      {/* Portfolio Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Clients" 
            value={stats.total_clients} 
            icon={<Person color="primary" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Active Loans" 
            value={stats.active_loans} 
            color="success"
            icon={<AccountBalance color="success" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Disbursed" 
            value={stats.total_disbursed} 
            color="info"
            icon={<TrendingUp color="info" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Pending Applications" 
            value={stats.pending_applications} 
            color="warning"
            icon={<Edit color="warning" />}
          />
        </Grid>
      </Grid>

      {/* Clients Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Client ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Monthly Income</TableCell>
              <TableCell>Employment</TableCell>
              <TableCell>Loans</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>{client.client_id}</TableCell>
                <TableCell>{client.full_name}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>${client.monthly_income?.toLocaleString()}</TableCell>
                <TableCell>
                  <Chip 
                    label={client.employment_status.replace('_', ' ')} 
                    color={getEmploymentColor(client.employment_status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{client.loan_count}</TableCell>
                <TableCell>
                  <Chip 
                    label={client.is_active ? 'Active' : 'Inactive'}
                    color={client.is_active ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton size="small">
                    <Edit />
                  </IconButton>
                  <Button size="small" variant="outlined">
                    New Loan
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create Client Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Client</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Username"
                value={newClient.username}
                onChange={(e) => setNewClient({ ...newClient, username: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={newClient.email}
                onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                value={newClient.first_name}
                onChange={(e) => setNewClient({ ...newClient, first_name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={newClient.last_name}
                onChange={(e) => setNewClient({ ...newClient, last_name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date of Birth"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={newClient.date_of_birth}
                onChange={(e) => setNewClient({ ...newClient, date_of_birth: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="National ID"
                value={newClient.national_id}
                onChange={(e) => setNewClient({ ...newClient, national_id: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                multiline
                rows={2}
                value={newClient.address}
                onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Monthly Income"
                type="number"
                value={newClient.monthly_income}
                onChange={(e) => setNewClient({ ...newClient, monthly_income: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Employment Status"
                value={newClient.employment_status}
                onChange={(e) => setNewClient({ ...newClient, employment_status: e.target.value })}
              >
                <MenuItem value="employed">Employed</MenuItem>
                <MenuItem value="self_employed">Self Employed</MenuItem>
                <MenuItem value="unemployed">Unemployed</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateClient} variant="contained">
            Add Client
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LoanOfficerDashboard;