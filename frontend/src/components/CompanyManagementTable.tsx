import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Menu, MenuItem, Chip, Box, Typography
} from '@mui/material';
import { MoreVert, Payment, Block, CheckCircle, Visibility } from '@mui/icons-material';
import SubscriptionStatusBadge from './SubscriptionStatusBadge';

interface Company {
  id: number;
  name: string;
  email: string;
  admin_email: string;
  admin_name: string;
  subscription_plan: string;
  subscription_status: string;
  monthly_fee: number;
  last_payment_date: string;
  next_payment_date: string;
  payment_status: string;
  user_count: number;
  max_users: number;
  days_until_expiry: number;
  last_login: string;
  is_active: boolean;
  created_at: string;
}

interface CompanyManagementTableProps {
  companies: Company[];
  onUpdatePayment: (id: number) => void;
  onSuspendService: (id: number) => void;
  onActivateService: (id: number) => void;
}

const CompanyManagementTable: React.FC<CompanyManagementTableProps> = ({
  companies,
  onUpdatePayment,
  onSuspendService,
  onActivateService
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, company: Company) => {
    setAnchorEl(event.currentTarget);
    setSelectedCompany(company);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCompany(null);
  };

  const handleAction = (action: string) => {
    if (!selectedCompany) return;
    
    switch (action) {
      case 'payment':
        onUpdatePayment(selectedCompany.id);
        break;
      case 'suspend':
        onSuspendService(selectedCompany.id);
        break;
      case 'activate':
        onActivateService(selectedCompany.id);
        break;
    }
    handleMenuClose();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <>
      <TableContainer component={Paper} className="shadow-lg">
        <Table>
          <TableHead className="bg-gray-50">
            <TableRow>
              <TableCell><strong>Company</strong></TableCell>
              <TableCell><strong>Contact</strong></TableCell>
              <TableCell><strong>Subscription</strong></TableCell>
              <TableCell><strong>Monthly Fee</strong></TableCell>
              <TableCell><strong>Payment Status</strong></TableCell>
              <TableCell><strong>Users</strong></TableCell>
              <TableCell><strong>Last Login</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {companies.map((company) => (
              <TableRow key={company.id} className="hover:bg-gray-50">
                <TableCell>
                  <Box>
                    <Typography variant="subtitle2" className="font-semibold">
                      {company.name}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {company.email}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2">{company.admin_name}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {company.admin_email}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box className="space-y-1">
                    <Chip 
                      label={company.subscription_plan.charAt(0).toUpperCase() + company.subscription_plan.slice(1)}
                      size="small"
                      variant="outlined"
                    />
                    <SubscriptionStatusBadge 
                      status={company.subscription_status}
                      paymentStatus={company.payment_status}
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" className="font-semibold">
                    {formatCurrency(company.monthly_fee)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Last: {formatDate(company.last_payment_date)}
                    </Typography>
                    <br />
                    <Typography variant="caption" color="textSecondary">
                      Next: {formatDate(company.next_payment_date)}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" className="font-semibold">
                      {company.user_count} users
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Max: {company.max_users || 'Unlimited'}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="caption">
                    {company.last_login ? formatDate(company.last_login) : 'Never'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuClick(e, company)}
                  >
                    <MoreVert />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleAction('payment')}>
          <Payment className="mr-2" fontSize="small" />
          Mark Payment Received
        </MenuItem>
        {selectedCompany?.subscription_status !== 'suspended' ? (
          <MenuItem onClick={() => handleAction('suspend')}>
            <Block className="mr-2" fontSize="small" />
            Suspend Service
          </MenuItem>
        ) : (
          <MenuItem onClick={() => handleAction('activate')}>
            <CheckCircle className="mr-2" fontSize="small" />
            Activate Service
          </MenuItem>
        )}
        <MenuItem onClick={handleMenuClose}>
          <Visibility className="mr-2" fontSize="small" />
          View Details
        </MenuItem>
      </Menu>
    </>
  );
};

export default CompanyManagementTable;