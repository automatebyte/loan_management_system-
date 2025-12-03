import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, IconButton, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, Typography, Grid, Box, TextField
} from '@mui/material';
import { CheckCircle, Block, Visibility, Email } from '@mui/icons-material';

interface Company {
  id: number;
  name: string;
  admin_name: string;
  admin_email: string;
  subscription_plan: string;
  subscription_status: string;
  monthly_fee: number;
  business_registration: string;
  industry: string;
  estimated_loan_volume: string;
  created_at: string;
}

interface Props {
  companies: Company[];
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
}

const CompanyApprovalTable: React.FC<Props> = ({ companies, onApprove, onReject }) => {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const pendingCompanies = companies.filter(c => c.subscription_status === 'pending_approval');

  const handleViewDetails = (company: Company) => {
    setSelectedCompany(company);
    setOpenDialog(true);
  };

  const handleApprove = (id: number) => {
    onApprove(id);
    setOpenDialog(false);
  };

  const handleReject = (id: number) => {
    onReject(id);
    setOpenDialog(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_approval': return 'warning';
      case 'active': return 'success';
      case 'trial': return 'info';
      case 'suspended': return 'error';
      default: return 'default';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'basic': return 'default';
      case 'professional': return 'primary';
      case 'enterprise': return 'secondary';
      default: return 'default';
    }
  };

  if (pendingCompanies.length === 0) {
    return (
      <Box textAlign="center" py={4}>
        <Typography variant="h6" color="textSecondary">
          No pending approvals
        </Typography>
        <Typography variant="body2" color="textSecondary">
          All companies have been processed
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Company</TableCell>
              <TableCell>Admin</TableCell>
              <TableCell>Plan</TableCell>
              <TableCell>Monthly Fee</TableCell>
              <TableCell>Industry</TableCell>
              <TableCell>Submitted</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pendingCompanies.map((company) => (
              <TableRow key={company.id}>
                <TableCell>
                  <Typography variant="subtitle2">{company.name}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {company.business_registration}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{company.admin_name}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {company.admin_email}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={company.subscription_plan.toUpperCase()} 
                    color={getPlanColor(company.subscription_plan) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>${company.monthly_fee}/mo</TableCell>
                <TableCell>
                  <Chip 
                    label={company.industry} 
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {new Date(company.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <IconButton 
                    size="small" 
                    onClick={() => handleViewDetails(company)}
                    title="View Details"
                  >
                    <Visibility />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    color="success"
                    onClick={() => handleApprove(company.id)}
                    title="Approve"
                  >
                    <CheckCircle />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    color="error"
                    onClick={() => handleReject(company.id)}
                    title="Reject"
                  >
                    <Block />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Company Details Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Company Registration Details
        </DialogTitle>
        <DialogContent>
          {selectedCompany && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>Company Information</Typography>
                <TextField
                  fullWidth
                  label="Company Name"
                  value={selectedCompany.name}
                  InputProps={{ readOnly: true }}
                  margin="dense"
                />
                <TextField
                  fullWidth
                  label="Business Registration"
                  value={selectedCompany.business_registration}
                  InputProps={{ readOnly: true }}
                  margin="dense"
                />
                <TextField
                  fullWidth
                  label="Industry"
                  value={selectedCompany.industry}
                  InputProps={{ readOnly: true }}
                  margin="dense"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>Administrator</Typography>
                <TextField
                  fullWidth
                  label="Admin Name"
                  value={selectedCompany.admin_name}
                  InputProps={{ readOnly: true }}
                  margin="dense"
                />
                <TextField
                  fullWidth
                  label="Admin Email"
                  value={selectedCompany.admin_email}
                  InputProps={{ readOnly: true }}
                  margin="dense"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>Subscription</Typography>
                <TextField
                  fullWidth
                  label="Plan"
                  value={selectedCompany.subscription_plan.toUpperCase()}
                  InputProps={{ readOnly: true }}
                  margin="dense"
                />
                <TextField
                  fullWidth
                  label="Monthly Fee"
                  value={`$${selectedCompany.monthly_fee}/month`}
                  InputProps={{ readOnly: true }}
                  margin="dense"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>Business Details</Typography>
                <TextField
                  fullWidth
                  label="Estimated Loan Volume"
                  value={selectedCompany.estimated_loan_volume}
                  InputProps={{ readOnly: true }}
                  margin="dense"
                />
                <TextField
                  fullWidth
                  label="Submitted Date"
                  value={new Date(selectedCompany.created_at).toLocaleDateString()}
                  InputProps={{ readOnly: true }}
                  margin="dense"
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            Close
          </Button>
          <Button
            variant="outlined"
            startIcon={<Email />}
            onClick={() => {
              // TODO: Implement email functionality
              console.log('Send email to:', selectedCompany?.admin_email);
            }}
          >
            Contact
          </Button>
          {selectedCompany && (
            <>
              <Button
                variant="contained"
                color="error"
                startIcon={<Block />}
                onClick={() => handleReject(selectedCompany.id)}
              >
                Reject
              </Button>
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckCircle />}
                onClick={() => handleApprove(selectedCompany.id)}
              >
                Approve & Activate
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CompanyApprovalTable;