import React, { useState, useEffect } from 'react';
import { Box, AppBar, Toolbar, Typography, Button, Grid, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LoanList from './LoanList';
import LoanApplication from './LoanApplication';
import Reports from './Reports';
import CompanyAdminDashboard from './CompanyAdminDashboard';
import LoanOfficerDashboard from './LoanOfficerDashboard';

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('loans');
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Loan Management System - {user.role}
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      
      <Box sx={{ p: 3 }}>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item>
            <Button 
              variant={activeTab === 'loans' ? 'contained' : 'outlined'}
              onClick={() => setActiveTab('loans')}
            >
              My Loans
            </Button>
          </Grid>
          {user.role === 'client' && (
            <Grid item>
              <Button 
                variant={activeTab === 'apply' ? 'contained' : 'outlined'}
                onClick={() => setActiveTab('apply')}
              >
                Apply for Loan
              </Button>
            </Grid>
          )}
          {user.role !== 'client' && (
            <Grid item>
              <Button 
                variant={activeTab === 'reports' ? 'contained' : 'outlined'}
                onClick={() => setActiveTab('reports')}
              >
                Reports
              </Button>
            </Grid>
          )}
          {user.role === 'company_admin' && (
            <Grid item>
              <Button 
                variant={activeTab === 'officers' ? 'contained' : 'outlined'}
                onClick={() => setActiveTab('officers')}
              >
                Loan Officers
              </Button>
            </Grid>
          )}
          {user.role === 'loan_officer' && (
            <Grid item>
              <Button 
                variant={activeTab === 'portfolio' ? 'contained' : 'outlined'}
                onClick={() => setActiveTab('portfolio')}
              >
                My Portfolio
              </Button>
            </Grid>
          )}
        </Grid>

        {activeTab === 'loans' && <LoanList userRole={user.role} />}
        {activeTab === 'apply' && <LoanApplication />}
        {activeTab === 'reports' && <Reports />}
        {activeTab === 'officers' && <CompanyAdminDashboard />}
        {activeTab === 'portfolio' && <LoanOfficerDashboard />}
      </Box>
    </Box>
  );
};

export default Dashboard;