import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Button, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, Chip, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Switch
} from '@mui/material';
import { Edit, Add } from '@mui/icons-material';
import api from '../services/api';

interface LoanProduct {
  id: number;
  name: string;
  description: string;
  interest_rate: number;
  penalty_rate: number;
  min_amount: number;
  max_amount: number;
  min_term_months: number;
  max_term_months: number;
  is_active: boolean;
  created_at: string;
}

const LoanProductManagement: React.FC = () => {
  const [products, setProducts] = useState<LoanProduct[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<LoanProduct | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    interest_rate: '',
    penalty_rate: '5.0',
    min_amount: '',
    max_amount: '',
    min_term_months: '',
    max_term_months: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/api/loans/products/');
      setProducts(response.data.results || response.data);
    } catch (error) {
    }
  };

  const handleCreateProduct = async () => {
    try {
      if (editingProduct) {
        await api.patch(`/api/loans/products/${editingProduct.id}/`, newProduct);
      } else {
        await api.post('/api/loans/products/', newProduct);
      }
      
      setOpenDialog(false);
      setEditingProduct(null);
      setNewProduct({
        name: '',
        description: '',
        interest_rate: '',
        penalty_rate: '5.0',
        min_amount: '',
        max_amount: '',
        min_term_months: '',
        max_term_months: ''
      });
      fetchProducts();
    } catch (error) {
    }
  };

  const handleEditProduct = (product: LoanProduct) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description,
      interest_rate: product.interest_rate.toString(),
      penalty_rate: product.penalty_rate.toString(),
      min_amount: product.min_amount.toString(),
      max_amount: product.max_amount.toString(),
      min_term_months: product.min_term_months.toString(),
      max_term_months: product.max_term_months.toString()
    });
    setOpenDialog(true);
  };

  const toggleProductStatus = async (id: number, currentStatus: boolean) => {
    try {
      await api.patch(`/api/loans/products/${id}/`, { is_active: !currentStatus });
      fetchProducts();
    } catch (error) {
    }
  };

  const StatCard = ({ title, value, color = 'primary' }: any) => (
    <Card>
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" component="div" color={color}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  const activeProducts = products.filter(p => p.is_active).length;
  const inactiveProducts = products.filter(p => !p.is_active).length;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Loan Product Management</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenDialog(true)}
        >
          Create New Product
        </Button>
      </Box>

      {/* Product Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Products" value={products.length} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Active Products" value={activeProducts} color="success" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Inactive Products" value={inactiveProducts} color="error" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Avg Interest Rate" 
            value={products.length > 0 ? 
              `${(products.reduce((sum, p) => sum + p.interest_rate, 0) / products.length).toFixed(1)}%` : 
              '0%'
            } 
            color="info" 
          />
        </Grid>
      </Grid>

      {/* Products Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product Name</TableCell>
              <TableCell>Interest Rate</TableCell>
              <TableCell>Amount Range</TableCell>
              <TableCell>Term Range</TableCell>
              <TableCell>Penalty Rate</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <Box>
                    <Typography variant="subtitle2">{product.name}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {product.description}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{product.interest_rate}%</TableCell>
                <TableCell>
                  ${product.min_amount.toLocaleString()} - ${product.max_amount.toLocaleString()}
                </TableCell>
                <TableCell>
                  {product.min_term_months} - {product.max_term_months} months
                </TableCell>
                <TableCell>{product.penalty_rate}%</TableCell>
                <TableCell>
                  <Chip 
                    label={product.is_active ? 'Active' : 'Inactive'}
                    color={product.is_active ? 'success' : 'error'}
                  />
                </TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleEditProduct(product)}>
                    <Edit />
                  </IconButton>
                  <Switch
                    checked={product.is_active}
                    onChange={() => toggleProductStatus(product.id, product.is_active)}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create/Edit Product Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingProduct ? 'Edit Loan Product' : 'Create New Loan Product'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Product Name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Interest Rate (%)"
                type="number"
                value={newProduct.interest_rate}
                onChange={(e) => setNewProduct({ ...newProduct, interest_rate: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={2}
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Minimum Amount"
                type="number"
                value={newProduct.min_amount}
                onChange={(e) => setNewProduct({ ...newProduct, min_amount: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Maximum Amount"
                type="number"
                value={newProduct.max_amount}
                onChange={(e) => setNewProduct({ ...newProduct, max_amount: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Min Term (Months)"
                type="number"
                value={newProduct.min_term_months}
                onChange={(e) => setNewProduct({ ...newProduct, min_term_months: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Max Term (Months)"
                type="number"
                value={newProduct.max_term_months}
                onChange={(e) => setNewProduct({ ...newProduct, max_term_months: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Penalty Rate (%)"
                type="number"
                value={newProduct.penalty_rate}
                onChange={(e) => setNewProduct({ ...newProduct, penalty_rate: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateProduct} variant="contained">
            {editingProduct ? 'Update Product' : 'Create Product'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LoanProductManagement;