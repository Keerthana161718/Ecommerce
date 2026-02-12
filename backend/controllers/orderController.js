const Order = require("../models/Order");
const Product = require("../models/Product");

// Create order
exports.createOrder = async (req, res) => {
  try {
    const { products, total, paymentMethod, deliveryAddress } = req.body;

    // Validate request
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Invalid products" });
    }

    // Prepare order items
    const orderItems = await Promise.all(
      products.map(async (item) => {
        const product = await Product.findById(item.product._id);
        if (!product) {
          throw new Error(`Product ${item.product._id} not found`);
        }
        return {
          name: product.name,
          qty: item.quantity,
          image: product.images?.[0]?.url || product.images?.[0] || "",
          price: product.price,
          product: product._id,
        };
      })
    );

    // Create order object
    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress: {
        address: deliveryAddress.address,
        city: deliveryAddress.city,
        postalCode: deliveryAddress.pincode,
        country: "India",
      },
      paymentMethod,
      itemsPrice: total,
      taxPrice: 0,
      shippingPrice: 0,
      totalPrice: total,
      isPaid: paymentMethod === "cod" ? false : true, // Mock: assume card/upi are paid
      paidAt: paymentMethod === "cod" ? undefined : new Date(),
    });

    const created = await order.save();

    res.status(201).json({
      success: true,
      orderId: created._id,
      message: "Order placed successfully",
      order: created,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to create order" });
  }
};

// Get user orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate(
      "orderItems.product"
    );
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: get all orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};