import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Typography, Button, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, Chip, IconButton,
  TextField, useMediaQuery, useTheme
} from '@mui/material';
import { Edit, Add, Person, Block, CheckCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import StatCard from './common/StatCard';
import ResponsiveNavbar from './common/ResponsiveNavbar';
import ResponsiveModal from './common/ResponsiveModal';

interface LoanOfficer {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  full_name: string;
  is_active: boolean;
  date_joined: string;
}

const CompanyAdminDashboard: React.FC = () => {
  const [officers, setOfficers] = useState<LoanOfficer[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newOfficer, setNewOfficer] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    password: 'defaultpass123'
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  useEffect(() => {
    fetchLoanOfficers();
  }, []);

  const fetchLoanOfficers = async () => {
    try {
      const response = await api.get('/api/auth/loan-officers/');
      setOfficers(response.data);
    } catch (error) {
      console.error('Error fetching loan officers:', error);
    }
  };

  const handleCreateOfficer = async () => {
    try {
      const response = await api.post('/api/auth/create-loan-officer/', {
        first_name: newOfficer.first_name,
        last_name: newOfficer.last_name,
        email: newOfficer.email
      });
      
      setOpenDialog(false);
      setNewOfficer({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        phone: '',
        password: 'defaultpass123'
      });
      fetchLoanOfficers();
      
      // Show credentials
      if (response.data.success && response.data.credentials) {
        const { username, password, email } = response.data.credentials;
        alert(`Loan Officer Created!\n\nUsername: ${username}\nPassword: ${password}\nEmail: ${email}\n\nPlease save these credentials.`);
        
        console.log('Loan Officer Created:');
        console.log('Username:', username);
        console.log('Password:', password);
        console.log('Email:', email);
      }
    } catch (error: any) {
      console.error('Error creating loan officer:', error);
      alert(`Error: ${error.response?.data?.error || 'Failed to create loan officer'}`);
    }
  };

  const toggleOfficerStatus = async (id: number, currentStatus: boolean) => {
    try {
      const action = currentStatus ? 'deactivate' : 'activate';
      await api.post(`/api/auth/loan-officers/${id}/${action}/`);
      fetchLoanOfficers();
    } catch (error) {
      console.error('Error updating officer status:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const activeOfficers = officers.filter(o => o.is_active).length;
  const inactiveOfficers = officers.filter(o => o.is_active === false).length;

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <ResponsiveNavbar
        title="KreditAI"
        userRole="Company Admin"
        onLogout={handleLogout}
      />
      
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'stretch', sm: 'center' }, 
          gap: { xs: 2, sm: 0 },
          mb: { xs: 3, md: 4 }
        }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
            {isMobile ? 'Officers' : 'Loan Officer Management'}
          </Typography>
          <Button
            variant="contained"
            startIcon={!isMobile ? <Add /> : undefined}
            onClick={() => setOpenDialog(true)}
            fullWidth={isMobile}
            sx={{ px: 3, py: 1.5 }}
          >
            {isMobile ? 'Create Officer' : 'Create New Loan Officer'}
          </Button>
        </Box>

        {/* Dashboard Stats */}
        <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: { xs: 3, md: 4 } }}>
          <Grid item xs={6} sm={6} md={3}>
            <StatCard 
              title="Total Officers" 
              value={officers.length} 
              icon={<Person color="primary" />}
            />
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <StatCard 
              title="Active Officers" 
              value={activeOfficers} 
              color="success"
              icon={<CheckCircle color="success" />}
            />
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <StatCard 
              title="Inactive Officers" 
              value={inactiveOfficers} 
              color="error"
              icon={<Block color="error" />}
            />
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <StatCard 
              title="This Month" 
              value={officers.filter(o => {
                const joinDate = new Date(o.date_joined);
                const thisMonth = new Date();
                return joinDate.getMonth() === thisMonth.getMonth() && 
                       joinDate.getFullYear() === thisMonth.getFullYear();
              }).length}
              color="info"
              icon={<Add color="info" />}
            />
          </Grid>
        </Grid>

        {/* Loan Officers Table */}
        <Box sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: { xs: 300, md: 650 } }}>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                {!isMobile && <TableCell>Username</TableCell>}
                <TableCell>Email</TableCell>
                {!isMobile && <TableCell>Phone</TableCell>}
                <TableCell>Status</TableCell>
                {!isMobile && <TableCell>Joined</TableCell>}
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {officers.map((officer) => (
                <TableRow key={officer.id}>
                  <TableCell sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                    {officer.full_name}
                  </TableCell>
                  {!isMobile && (
                    <TableCell sx={{ fontSize: '0.875rem' }}>
                      {officer.username}
                    </TableCell>
                  )}
                  <TableCell sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                    {officer.email}
                  </TableCell>
                  {!isMobile && (
                    <TableCell sx={{ fontSize: '0.875rem' }}>
                      {officer.phone || 'N/A'}
                    </TableCell>
                  )}
                  <TableCell>
                    <Chip 
                      label={officer.is_active ? 'Active' : 'Inactive'}
                      color={officer.is_active ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  {!isMobile && (
                    <TableCell sx={{ fontSize: '0.875rem' }}>
                      {new Date(officer.date_joined).toLocaleDateString()}
                    </TableCell>
                  )}
                  <TableCell>
                    <IconButton size="small" sx={{ minWidth: '40px', minHeight: '40px' }}>
                      <Edit />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={() => toggleOfficerStatus(officer.id, officer.is_active)}
                      sx={{ minWidth: '40px', minHeight: '40px' }}
                    >
                      {officer.is_active ? <Block /> : <CheckCircle />}
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>

        {/* Create Officer Modal */}
        <ResponsiveModal
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          title="Create New Loan Officer"
          maxWidth="md"
          actions={
            <>
              <Button 
                onClick={() => setOpenDialog(false)}
                fullWidth={isMobile}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateOfficer} 
                variant="contained"
                fullWidth={isMobile}
              >
                Create Officer
              </Button>
            </>
          }
        >
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Username"
                value={newOfficer.username}
                onChange={(e) => setNewOfficer({ ...newOfficer, username: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={newOfficer.email}
                onChange={(e) => setNewOfficer({ ...newOfficer, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                value={newOfficer.first_name}
                onChange={(e) => setNewOfficer({ ...newOfficer, first_name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={newOfficer.last_name}
                onChange={(e) => setNewOfficer({ ...newOfficer, last_name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                value={newOfficer.phone}
                onChange={(e) => setNewOfficer({ ...newOfficer, phone: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Default Password"
                value={newOfficer.password}
                onChange={(e) => setNewOfficer({ ...newOfficer, password: e.target.value })}
                helperText="Officer can change this after first login"
              />
            </Grid>
          </Grid>
        </ResponsiveModal>
      </Box>
    </Box>
  );
};

export default CompanyAdminDashboard;