const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    type: {
      type: String,
      enum: ["order_placed", "order_confirmed", "order_shipped", "order_cancelled"],
      default: "order_placed",
    },
    message: String,
    productNames: [String],
    customerName: String,
    customerEmail: String,
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
