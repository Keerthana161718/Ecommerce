const Cart = require("../models/Cart");

// Get cart
exports.getCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
  res.json(cart);
};

// Add to cart
exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  const itemIndex = cart.items.findIndex(
    i => i.product.toString() === productId
  );

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity });
  }

  await cart.save();
  res.json(cart);
};

// Remove item
exports.removeFromCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });

  cart.items = cart.items.filter(
    i => i.product.toString() !== req.params.productId
  );

  await cart.save();
  res.json(cart);
};