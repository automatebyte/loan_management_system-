import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Button, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, Chip, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Switch
} from '@mui/material';
import { Edit, Add, Person, Block, CheckCircle } from '@mui/icons-material';
import api from '../services/api';

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

  useEffect(() => {
    fetchLoanOfficers();
  }, []);

  const fetchLoanOfficers = async () => {
    try {
      const response = await api.get('/api/auth/loan-officers/');
      setOfficers(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching loan officers:', error);
    }
  };

  const handleCreateOfficer = async () => {
    try {
      await api.post('/api/auth/loan-officers/', newOfficer);
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
    } catch (error) {
      console.error('Error creating loan officer:', error);
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

  const StatCard = ({ title, value, icon, color = 'primary' }: any) => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="textSecondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div" color={color}>
              {value}
            </Typography>
          </Box>
          {icon}
        </Box>
      </CardContent>
    </Card>
  );

  const activeOfficers = officers.filter(o => o.is_active).length;
  const inactiveOfficers = officers.filter(o => o.is_active === false).length;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Loan Officer Management</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenDialog(true)}
        >
          Create New Loan Officer
        </Button>
      </Box>

      {/* Dashboard Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Officers" 
            value={officers.length} 
            icon={<Person color="primary" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Active Officers" 
            value={activeOfficers} 
            color="success"
            icon={<CheckCircle color="success" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Inactive Officers" 
            value={inactiveOfficers} 
            color="error"
            icon={<Block color="error" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
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
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Joined</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {officers.map((officer) => (
              <TableRow key={officer.id}>
                <TableCell>{officer.full_name}</TableCell>
                <TableCell>{officer.username}</TableCell>
                <TableCell>{officer.email}</TableCell>
                <TableCell>{officer.phone || 'N/A'}</TableCell>
                <TableCell>
                  <Chip 
                    label={officer.is_active ? 'Active' : 'Inactive'}
                    color={officer.is_active ? 'success' : 'error'}
                  />
                </TableCell>
                <TableCell>
                  {new Date(officer.date_joined).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <IconButton size="small">
                    <Edit />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    onClick={() => toggleOfficerStatus(officer.id, officer.is_active)}
                  >
                    {officer.is_active ? <Block /> : <CheckCircle />}
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create Officer Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Loan Officer</DialogTitle>
        <DialogContent>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateOfficer} variant="contained">
            Create Officer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CompanyAdminDashboard;