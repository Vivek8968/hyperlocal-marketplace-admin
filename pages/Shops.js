import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  IconButton,
  Tooltip,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import api from '../services/api';

function Shops() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalShops, setTotalShops] = useState(0);
  const [selectedShop, setSelectedShop] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchShops = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/shops', {
        params: {
          page: page + 1, // API uses 1-based indexing
          limit: rowsPerPage,
          search: searchTerm,
          status: statusFilter !== 'all' ? statusFilter : undefined,
        },
      });
      
      setShops(response.data.shops);
      setTotalShops(response.data.total);
    } catch (error) {
      console.error('Failed to fetch shops:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, [page, rowsPerPage, searchTerm, statusFilter]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewShop = (shop) => {
    setSelectedShop(shop);
    setViewDialogOpen(true);
  };

  const handleDeleteShop = (shop) => {
    setSelectedShop(shop);
    setDeleteDialogOpen(true);
  };

  const handleApproveShop = (shop) => {
    setSelectedShop(shop);
    setApproveDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/admin/shops/${selectedShop.id}`);
      fetchShops();
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Failed to delete shop:', error);
    }
  };

  const confirmApproval = async (approved) => {
    try {
      await api.put(`/admin/shops/${selectedShop.id}/approve`, {
        approved,
      });
      fetchShops();
      setApproveDialogOpen(false);
    } catch (error) {
      console.error('Failed to update shop status:', error);
    }
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'approved':
        return <Chip label="Approved" color="success" size="small" />;
      case 'pending':
        return <Chip label="Pending" color="warning" size="small" />;
      case 'rejected':
        return <Chip label="Rejected" color="error" size="small" />;
      default:
        return <Chip label="Unknown" size="small" />;
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Shop Management
      </Typography>
      
      {/* Filters */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          label="Search Shops"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            endAdornment: <SearchIcon color="action" />,
          }}
          sx={{ width: 300 }}
        />
        
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Filter Status</InputLabel>
          <Select
            value={statusFilter}
            label="Filter Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">All Shops</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      {/* Shop Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Shop Name</TableCell>
                <TableCell>Owner</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>WhatsApp</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : shops.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No shops found
                  </TableCell>
                </TableRow>
              ) : (
                shops.map((shop) => (
                  <TableRow key={shop.id}>
                    <TableCell>{shop.id}</TableCell>
                    <TableCell>{shop.name}</TableCell>
                    <TableCell>{shop.owner?.name || 'Unknown'}</TableCell>
                    <TableCell>{shop.address}</TableCell>
                    <TableCell>{shop.whatsapp}</TableCell>
                    <TableCell>{getStatusChip(shop.status)}</TableCell>
                    <TableCell>
                      {new Date(shop.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center'
