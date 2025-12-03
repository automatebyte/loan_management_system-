import React from 'react';
import { Chip } from '@mui/material';

interface SubscriptionStatusBadgeProps {
  status: string;
  paymentStatus?: string;
}

const SubscriptionStatusBadge: React.FC<SubscriptionStatusBadgeProps> = ({ status, paymentStatus }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'trial':
        return 'info';
      case 'suspended':
        return 'error';
      case 'expired':
        return 'error';
      default:
        return 'default';
    }
  };

  const getPaymentColor = (paymentStatus: string) => {
    switch (paymentStatus) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'overdue':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <div className="flex gap-1">
      <Chip 
        label={status.charAt(0).toUpperCase() + status.slice(1)}
        color={getStatusColor(status)}
        size="small"
      />
      {paymentStatus && (
        <Chip 
          label={paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
          color={getPaymentColor(paymentStatus)}
          size="small"
          variant="outlined"
        />
      )}
    </div>
  );
};

export default SubscriptionStatusBadge;