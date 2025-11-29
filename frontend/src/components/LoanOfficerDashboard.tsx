import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Typography, Button, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, Chip,
  useMediaQuery, useTheme
} from '@mui/material';
import { Edit, Add, Person, AccountBalance, TrendingUp, Payment } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import StatCard from './common/StatCard';
import ResponsiveNavbar from './common/ResponsiveNavbar';
import QuickClientAdd from './QuickClientAdd';
import LoanDisbursement from './LoanDisbursement';
import RepaymentTracking from './RepaymentTracking';

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
  const [loans, setLoans] = useState([]);
  const [stats, setStats] = useState<PortfolioStats>({
    total_clients: 0,
    active_loans: 0,
    total_disbursed: 0,
    pending_applications: 0
  });
  const [openClientDialog, setOpenClientDialog] = useState(false);
  const [openLoanDialog, setOpenLoanDialog] = useState(false);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [selectedClient, setSelectedClient] = useState<number | undefined>();
  const [selectedLoan, setSelectedLoan] = useState<any>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  useEffect(() => {
    fetchClients();
    fetchLoans();
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

  const fetchLoans = async () => {
    try {
      const response = await api.get('/api/loans/loans/');
      setLoans(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching loans:', error);
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

  const handleClientSuccess = () => {
    fetchClients();
    fetchPortfolioStats();
  };

  const handleLoanSuccess = () => {
    fetchLoans();
    fetchPortfolioStats();
  };

  const handlePaymentSuccess = () => {
    fetchLoans();
    fetchPortfolioStats();
  };

  const handleNewLoan = (clientId: number) => {
    setSelectedClient(clientId);
    setOpenLoanDialog(true);
  };

  const handleRecordPayment = (loan: any) => {
    setSelectedLoan(loan);
    setOpenPaymentDialog(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };



  const getEmploymentColor = (status: string) => {
    const colors: any = {
      employed: 'success',
      self_employed: 'warning',
      unemployed: 'error'
    };
    return colors[status] || 'default';
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <ResponsiveNavbar
        title="KreditAI"
        userRole="Loan Officer"
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
            {isMobile ? 'Portfolio' : 'My Portfolio'}
          </Typography>
          <Button
            variant="contained"
            startIcon={!isMobile ? <Add /> : undefined}
            onClick={() => setOpenClientDialog(true)}
            fullWidth={isMobile}
            sx={{ px: 3, py: 1.5 }}
          >
            {isMobile ? 'Add Client' : 'Add New Client'}
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
        <Box sx={{ mb: { xs: 3, md: 4 } }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>My Clients</Typography>
          <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 1, border: '1px solid #e5e7eb' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Client ID</TableCell>
                  <TableCell>Name</TableCell>
                  {!isMobile && <TableCell>Email</TableCell>}
                  <TableCell>Income</TableCell>
                  {!isMobile && <TableCell>Employment</TableCell>}
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>{client.client_id}</TableCell>
                    <TableCell sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>{client.full_name}</TableCell>
                    {!isMobile && <TableCell sx={{ fontSize: '0.875rem' }}>{client.email}</TableCell>}
                    <TableCell sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>${client.monthly_income?.toLocaleString()}</TableCell>
                    {!isMobile && (
                      <TableCell>
                        <Chip 
                          label={client.employment_status.replace('_', ' ')} 
                          color={getEmploymentColor(client.employment_status)}
                          size="small"
                        />
                      </TableCell>
                    )}
                    <TableCell>
                      <Button 
                        size="small" 
                        variant="contained"
                        onClick={() => handleNewLoan(client.id)}
                        sx={{ mr: 1 }}
                      >
                        {isMobile ? 'Loan' : 'New Loan'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Active Loans Table */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Active Loans</Typography>
          <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 1, border: '1px solid #e5e7eb' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Loan ID</TableCell>
                  <TableCell>Client</TableCell>
                  <TableCell>Amount</TableCell>
                  {!isMobile && <TableCell>Balance</TableCell>}
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loans.filter((loan: any) => ['active', 'disbursed'].includes(loan.status)).map((loan: any) => (
                  <TableRow key={loan.id}>
                    <TableCell sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>{loan.loan_id}</TableCell>
                    <TableCell sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                      {loan.client?.user?.first_name} {loan.client?.user?.last_name}
                    </TableCell>
                    <TableCell sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>${loan.amount}</TableCell>
                    {!isMobile && <TableCell sx={{ fontSize: '0.875rem' }}>${loan.outstanding_balance}</TableCell>}
                    <TableCell>
                      <Chip 
                        label={loan.status.toUpperCase()} 
                        color={loan.status === 'active' ? 'success' : 'info'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Button 
                        size="small" 
                        variant="outlined"
                        startIcon={<Payment />}
                        onClick={() => handleRecordPayment(loan)}
                      >
                        {isMobile ? 'Pay' : 'Payment'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Dialogs */}
        <QuickClientAdd
          open={openClientDialog}
          onClose={() => setOpenClientDialog(false)}
          onSuccess={handleClientSuccess}
        />

        <LoanDisbursement
          open={openLoanDialog}
          onClose={() => setOpenLoanDialog(false)}
          clientId={selectedClient}
          onSuccess={handleLoanSuccess}
        />

        <RepaymentTracking
          open={openPaymentDialog}
          onClose={() => setOpenPaymentDialog(false)}
          loan={selectedLoan}
          onSuccess={handlePaymentSuccess}
        />
      </Box>
    </Box>
  );
};

export default LoanOfficerDashboard;