const express = require("express");
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getSellerOrders,
  confirmOrderItem,
  shipOrderItem,
  getOrders,
} = require("../controllers/orderController");

const { protect, admin } = require("../middleware/authMiddleware");

router.post("/", protect, createOrder);
router.get("/myorders", protect, getMyOrders);
// Seller routes (must come before /:id)
router.get("/seller/orders", protect, getSellerOrders);
router.put("/:orderId/items/:itemIndex/confirm", protect, confirmOrderItem);
router.put("/:orderId/items/:itemIndex/ship", protect, shipOrderItem);
// Single order route
router.get("/:id", protect, getOrderById);
// Admin route
router.get("/", protect, admin, getOrders);

module.exports = router;