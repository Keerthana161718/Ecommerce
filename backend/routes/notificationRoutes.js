const express = require("express");
const router = express.Router();
const {
  getSellerNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} = require("../controllers/notificationController");

const { protect } = require("../middleware/authMiddleware");

// Get all notifications for seller
router.get("/", protect, getSellerNotifications);

// Get unread count
router.get("/unread/count", protect, getUnreadCount);

// Mark notification as read
router.put("/:notificationId/read", protect, markAsRead);

// Mark all as read
router.put("/all/read", protect, markAllAsRead);

module.exports = router;
