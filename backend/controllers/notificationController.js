const Notification = require("../models/Notification");

// Get seller notifications
exports.getSellerNotifications = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const notifications = await Notification.find({ seller: sellerId })
      .populate("orderId", "_id status createdAt")
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get unread notification count
exports.getUnreadCount = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const count = await Notification.countDocuments({
      seller: sellerId,
      isRead: false,
    });

    res.json({ unreadCount: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const sellerId = req.user._id;

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    // Check if seller owns this notification
    if (notification.seller.toString() !== sellerId.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    notification.isRead = true;
    notification.readAt = new Date();
    await notification.save();

    res.json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    const sellerId = req.user._id;

    await Notification.updateMany(
      { seller: sellerId, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    res.json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create notification (called internally)
exports.createNotification = async (seller, order, orderItems, type = "order_placed") => {
  try {
    const productNames = orderItems
      .filter(item => item.seller.toString() === seller.toString())
      .map(item => item.name);

    const notification = new Notification({
      seller,
      orderId: order._id,
      type,
      message:
        type === "order_placed"
          ? `New order placed with ${productNames.length} product(s)`
          : `Order status updated to ${type.replace(/_/g, " ")}`,
      productNames,
      customerName: order.user.name || "Customer",
      customerEmail: order.user.email,
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};
