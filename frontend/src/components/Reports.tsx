import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import api from '../services/api';

const Reports: React.FC = () => {
  const [summary, setSummary] = useState({
    total_loans: 0,
    active_loans: 0,
    total_disbursed: 0,
    pending_approvals: 0
  });

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const response = await api.get('/api/loans/reports/summary/');
      setSummary(response.data);
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  const StatCard = ({ title, value, color = 'primary' }: any) => (
    <Card>
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" component="div" color={color}>
          {typeof value === 'number' && title.includes('$') 
            ? `$${value.toLocaleString()}` 
            : value.toLocaleString()}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h4" mb={3}>
        Loan Portfolio Summary
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Loans" value={summary.total_loans} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Active Loans" value={summary.active_loans} color="success" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Disbursed" value={summary.total_disbursed} color="info" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Pending Approvals" value={summary.pending_approvals} color="warning" />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports;