import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Chip, Button, Box 
} from '@mui/material';
import { loanAPI } from '../services/api';

interface LoanListProps {
  userRole: string;
}

const LoanList: React.FC<LoanListProps> = ({ userRole }) => {
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const response = await loanAPI.getLoans();
      setLoans(response.data.results || response.data);
    } catch (error) {
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await loanAPI.approveLoan(id);
      fetchLoans();
    } catch (error) {
    }
  };

  const handleDisburse = async (id: number) => {
    try {
      await loanAPI.disburseLoan(id);
      fetchLoans();
    } catch (error) {
    }
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      pending: 'warning',
      approved: 'info',
      disbursed: 'success',
      active: 'primary',
      completed: 'success',
      defaulted: 'error'
    };
    return colors[status] || 'default';
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Loan ID</TableCell>
            <TableCell>Client</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Product</TableCell>
            {userRole !== 'client' && <TableCell>Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {loans.map((loan: any) => (
            <TableRow key={loan.id}>
              <TableCell>{loan.loan_id}</TableCell>
              <TableCell>{loan.client_name}</TableCell>
              <TableCell>${loan.amount}</TableCell>
              <TableCell>
                <Chip label={loan.status} color={getStatusColor(loan.status)} />
              </TableCell>
              <TableCell>{loan.product_name}</TableCell>
              {userRole !== 'client' && (
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {loan.status === 'pending' && (
                      <Button size="small" onClick={() => handleApprove(loan.id)}>
                        Approve
                      </Button>
                    )}
                    {loan.status === 'approved' && (
                      <Button size="small" onClick={() => handleDisburse(loan.id)}>
                        Disburse
                      </Button>
                    )}
                  </Box>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LoanList;