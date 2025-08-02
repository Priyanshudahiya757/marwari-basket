const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  getCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
  bulkAction,
  addNote,
  exportCustomers
} = require('../controllers/adminCustomerController');

// All routes require authentication and admin role
router.use(protect);
router.use(admin);

// Get all customers with search, filter, and pagination
router.get('/', getCustomers);

// Get single customer with detailed information
router.get('/:id', getCustomer);

// Update customer
router.put('/:id', updateCustomer);

// Delete customer (soft delete)
router.delete('/:id', deleteCustomer);

// Bulk actions
router.post('/bulk-action', bulkAction);

// Add customer note
router.post('/:id/notes', addNote);

// Export customers
router.get('/export/customers', exportCustomers);

module.exports = router; 