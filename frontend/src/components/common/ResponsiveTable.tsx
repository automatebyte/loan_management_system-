import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Card, CardContent, Typography, Box, useMediaQuery, useTheme
} from '@mui/material';

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
  hideOnMobile?: boolean;
}

interface ResponsiveTableProps {
  columns: Column[];
  data: any[];
  mobileCardRender?: (row: any, index: number) => React.ReactNode;
}

const ResponsiveTable: React.FC<ResponsiveTableProps> = ({
  columns,
  data,
  mobileCardRender
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (isMobile && mobileCardRender) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {data.map((row, index) => mobileCardRender(row, index))}
      </Box>
    );
  }

  const visibleColumns = isMobile 
    ? columns.filter(col => !col.hideOnMobile)
    : columns;

  return (
    <TableContainer 
      component={Paper} 
      sx={{ 
        borderRadius: 2, 
        boxShadow: 1, 
        border: '1px solid #e5e7eb',
        overflowX: 'auto'
      }}
    >
      <Table sx={{ minWidth: isMobile ? 300 : 650 }}>
        <TableHead>
          <TableRow>
            {visibleColumns.map((column) => (
              <TableCell key={column.key}>
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              {visibleColumns.map((column) => (
                <TableCell key={column.key}>
                  {column.render 
                    ? column.render(row[column.key], row)
                    : row[column.key]
                  }
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ResponsiveTable;