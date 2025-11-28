import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Button, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, Chip, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem
} from '@mui/material';
import { Edit, Add, Block, CheckCircle } from '@mui/icons-material';
import api from '../services/api';

interface DashboardStats {
  total_companies: number;
  active_companies: number;
  recent_companies: number;
  subscription_breakdown: Array<{ subscription_plan: string; count: number }>;
}

interface Company {
  id: number;
  name: string;
  email: string;
  admin_email: string;
  subscription_plan: string;
  subscription_expiry: string;
  is_active: boolean;
  user_count: number;
  loan_count: number;
  created_at: string;
}

const SuperAdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newCompany, setNewCompany] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    admin_email: '',
    subscription_plan: 'basic',
    max_users: 10,
    max_loans: 1000
  });

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

  const handleCreateCompany = async () => {
    try {
      await api.post('/api/companies/', newCompany);
      setOpenDialog(false);
      setNewCompany({
        name: '',
        email: '',
        phone: '',
        address: '',
        admin_email: '',
        subscription_plan: 'basic',
        max_users: 10,
        max_loans: 1000
      });
      fetchCompanies();
      fetchDashboardData();
    } catch (error) {
      console.error('Error creating company:', error);
    }
  };

  const toggleCompanyStatus = async (id: number, currentStatus: boolean) => {
    try {
      await api.patch(`/api/companies/${id}/`, { is_active: !currentStatus });
      fetchCompanies();
    } catch (error) {
      console.error('Error updating company status:', error);
    }
  };

  const StatCard = ({ title, value, color = 'primary' }: any) => (
    <Card>
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" component="div" color={color}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Super Admin Dashboard</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenDialog(true)}
        >
          Register New Company
        </Button>
      </Box>

      {/* Dashboard Stats */}
      {stats && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Total Companies" value={stats.total_companies} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Active Companies" value={stats.active_companies} color="success" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="New This Month" value={stats.recent_companies} color="info" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Premium Plans" 
              value={stats.subscription_breakdown.find(s => s.subscription_plan === 'premium')?.count || 0} 
              color="warning" 
            />
          </Grid>
        </Grid>
      )}

      {/* Companies Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Company Name</TableCell>
              <TableCell>Admin Email</TableCell>
              <TableCell>Plan</TableCell>
              <TableCell>Users</TableCell>
              <TableCell>Loans</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {companies.map((company) => (
              <TableRow key={company.id}>
                <TableCell>{company.name}</TableCell>
                <TableCell>{company.admin_email}</TableCell>
                <TableCell>
                  <Chip 
                    label={company.subscription_plan} 
                    color={company.subscription_plan === 'enterprise' ? 'primary' : 'default'}
                  />
                </TableCell>
                <TableCell>{company.user_count}</TableCell>
                <TableCell>{company.loan_count}</TableCell>
                <TableCell>
                  <Chip 
                    label={company.is_active ? 'Active' : 'Inactive'}
                    color={company.is_active ? 'success' : 'error'}
                  />
                </TableCell>
                <TableCell>
                  <IconButton size="small">
                    <Edit />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    onClick={() => toggleCompanyStatus(company.id, company.is_active)}
                  >
                    {company.is_active ? <Block /> : <CheckCircle />}
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create Company Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Register New Company</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company Name"
                value={newCompany.name}
                onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company Email"
                value={newCompany.email}
                onChange={(e) => setNewCompany({ ...newCompany, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Admin Email"
                value={newCompany.admin_email}
                onChange={(e) => setNewCompany({ ...newCompany, admin_email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                value={newCompany.phone}
                onChange={(e) => setNewCompany({ ...newCompany, phone: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                multiline
                rows={2}
                value={newCompany.address}
                onChange={(e) => setNewCompany({ ...newCompany, address: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                select
                fullWidth
                label="Subscription Plan"
                value={newCompany.subscription_plan}
                onChange={(e) => setNewCompany({ ...newCompany, subscription_plan: e.target.value })}
              >
                <MenuItem value="basic">Basic</MenuItem>
                <MenuItem value="premium">Premium</MenuItem>
                <MenuItem value="enterprise">Enterprise</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                label="Max Users"
                value={newCompany.max_users}
                onChange={(e) => setNewCompany({ ...newCompany, max_users: parseInt(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                label="Max Loans"
                value={newCompany.max_loans}
                onChange={(e) => setNewCompany({ ...newCompany, max_loans: parseInt(e.target.value) })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateCompany} variant="contained">
            Create Company
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SuperAdminDashboard;