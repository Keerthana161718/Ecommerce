const Order = require("../models/Order");
const Product = require("../models/Product");
const { createNotification } = require("./notificationController");

// Create order
exports.createOrder = async (req, res) => {
  try {
    const { products, total, paymentMethod, deliveryAddress } = req.body;

    console.log('Creating order with:', { products, total, paymentMethod, deliveryAddress, userId: req.user._id });

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
        console.log(`Product ${product._id} seller:`, product.seller);
        return {
          name: product.name,
          qty: item.quantity,
          image: product.images?.[0]?.url || product.images?.[0] || "",
          price: product.price,
          product: product._id,
          seller: product.seller ? product.seller.toString() : null,
          status: "pending",
        };
      })
    );
    
    console.log('Order items prepared:', orderItems);

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
    
    console.log('Order saved:', created._id);
    
    // Populate user data for notifications
    const populatedOrder = await created.populate("user", "name email");

    // Send notifications to all sellers in this order
    const sellerIds = new Set();
    orderItems.forEach(item => {
      if (item.seller) {
        sellerIds.add(item.seller.toString());
      }
    });
    
    console.log('Seller IDs for notifications:', Array.from(sellerIds));

    for (const sellerId of sellerIds) {
      console.log(`Creating notification for seller: ${sellerId}`);
      await createNotification(sellerId, populatedOrder, orderItems, "order_placed");
    }

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
    const orders = await Order.find({ user: req.user._id })
      .populate({
        path: "orderItems.product",
        select: "name images description price category stock"
      })
      .populate({
        path: "orderItems.seller",
        select: "name email"
      })
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email addresses")
      .populate({
        path: "orderItems.product",
        select: "name images description price category"
      })
      .populate({
        path: "orderItems.seller",
        select: "name email"
      });
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if user owns this order or is admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }

    res.json(order);
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

// Seller: get orders with their items
exports.getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.user._id;
    
    console.log('Fetching orders for seller:', sellerId);
    
    // Find all orders that contain items from this seller
    const orders = await Order.find({
      "orderItems.seller": sellerId,
    })
      .populate("user", "name email addresses")
      .populate({
        path: "orderItems.product",
        select: "name images price",
      })
      .populate({
        path: "orderItems.seller",
        select: "name email",
      })
      .sort({ createdAt: -1 });

    console.log(`Found ${orders.length} orders for seller ${sellerId}`);
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching seller orders:', error);
    res.status(500).json({ message: error.message });
  }
};

// Seller: confirm order item
exports.confirmOrderItem = async (req, res) => {
  try {
    const { orderId, itemIndex } = req.params;
    const sellerId = req.user._id;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const item = order.orderItems[itemIndex];
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Check if seller owns this item
    if (item.seller.toString() !== sellerId.toString()) {
      return res.status(403).json({ message: "Not authorized to update this item" });
    }

    // Update item status
    item.status = "confirmed";
    item.confirmedAt = new Date();
    
    await order.save();

    res.json({
      success: true,
      message: "Item confirmed successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Seller: ship order item
exports.shipOrderItem = async (req, res) => {
  try {
    const { orderId, itemIndex } = req.params;
    const sellerId = req.user._id;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const item = order.orderItems[itemIndex];
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Check if seller owns this item
    if (item.seller.toString() !== sellerId.toString()) {
      return res.status(403).json({ message: "Not authorized to update this item" });
    }

    // Item must be confirmed before shipping
    if (item.status !== "confirmed") {
      return res.status(400).json({ message: "Item must be confirmed before shipping" });
    }

    // Update item status
    item.status = "shipped";
    item.shippedAt = new Date();

    // Check if all items are shipped
    const allShipped = order.orderItems.every(i => i.status === "shipped" || i.status === "delivered");
    if (allShipped) {
      order.status = "shipped";
    }
    
    await order.save();

    res.json({
      success: true,
      message: "Item shipped successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};