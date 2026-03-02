import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Card, CardContent, Table, TableBody, TableCell, TableHead, TableRow, Button, TextField, IconButton, Chip } from '@mui/material';
import { TrendingUp, AttachMoney, People, Assessment, Add, Delete, Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import ResponsiveNavbar from './common/ResponsiveNavbar';

const AdminDashboard: React.FC = () => {
  const [reports, setReports] = useState<any>(null);
  const [officers, setOfficers] = useState<any[]>([]);
  const [clerks, setClerks] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [showAddOfficer, setShowAddOfficer] = useState(false);
  const [newStaff, setNewStaff] = useState({ first_name: '', last_name: '', email: '', phone: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [reportsRes, officersRes, clerksRes] = await Promise.all([
        api.get('/api/loans/reports/admin/'),
        api.get('/api/auth/field-officers/'),
        api.get('/api/auth/clerks/')
      ]);
      setReports(reportsRes.data);
      setOfficers(officersRes.data);
      setClerks(clerksRes.data);
    } catch (error) {}
  };

  const handleAddOfficer = async () => {
    try {
      const res = await api.post('/api/auth/field-officers/', newStaff);
      alert(`Officer Created!\nUsername: ${res.data.credentials.username}\nPassword: ${res.data.credentials.password}`);
      setShowAddOfficer(false);
      setNewStaff({ first_name: '', last_name: '', email: '', phone: '' });
      fetchData();
    } catch (error) {}
  };

  const handleDeleteStaff = async (id: number, type: string) => {
    try {
      await api.delete(`/api/auth/${type}/${id}/`);
      fetchData();
    } catch (error) {}
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (!reports) return null;

  const filteredOfficers = officers.filter(o => 
    o.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    o.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <ResponsiveNavbar title="Eagle Trend" userRole="Admin" onLogout={handleLogout} />
      
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>Admin Dashboard</Typography>

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

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Field Officers</Typography>
              <Button startIcon={<Add />} onClick={() => setShowAddOfficer(!showAddOfficer)}>Add Officer</Button>
            </Box>
            
            {showAddOfficer && (
              <Box sx={{ mb: 2, p: 2, bgcolor: '#f9f9f9', borderRadius: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField fullWidth size="small" label="First Name" value={newStaff.first_name} onChange={(e) => setNewStaff({...newStaff, first_name: e.target.value})} />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField fullWidth size="small" label="Last Name" value={newStaff.last_name} onChange={(e) => setNewStaff({...newStaff, last_name: e.target.value})} />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField fullWidth size="small" label="Email" value={newStaff.email} onChange={(e) => setNewStaff({...newStaff, email: e.target.value})} />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField fullWidth size="small" label="Phone" value={newStaff.phone} onChange={(e) => setNewStaff({...newStaff, phone: e.target.value})} />
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant="contained" onClick={handleAddOfficer}>Create</Button>
                  </Grid>
                </Grid>
              </Box>
            )}

            <TextField
              size="small"
              placeholder="Search officers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{ startAdornment: <Search /> }}
              sx={{ mb: 2 }}
            />
            
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOfficers.map((officer: any) => (
                  <TableRow key={officer.id}>
                    <TableCell>{officer.full_name}</TableCell>
                    <TableCell>{officer.email}</TableCell>
                    <TableCell>
                      <Chip label={officer.is_active ? 'Active' : 'Inactive'} color={officer.is_active ? 'success' : 'error'} size="small" />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => handleDeleteStaff(officer.id, 'field-officers')}>
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
    </Box>
  );
};

export default AdminDashboard;
