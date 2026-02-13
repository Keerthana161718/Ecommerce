const express = require('express');
const router = express.Router();
const { adminOnly } = require('../middleware/adminMiddleware');
const {
  getAllOrders,
  getAllUsers,
  getAllProducts,
  getDashboardStats,
  updateOrderStatus,
  deleteUser,
  deleteProduct,
} = require('../controllers/adminController');

// All routes are protected by adminOnly middleware
router.get('/orders', adminOnly, getAllOrders);
router.get('/users', adminOnly, getAllUsers);
router.get('/products', adminOnly, getAllProducts);
router.get('/stats', adminOnly, getDashboardStats);
router.put('/orders/:id', adminOnly, updateOrderStatus);
router.delete('/users/:id', adminOnly, deleteUser);
router.delete('/products/:id', adminOnly, deleteProduct);

module.exports = router;
