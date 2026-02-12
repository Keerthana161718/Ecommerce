const Wishlist = require("../models/wishlist");

// Get wishlist
exports.getWishlist = async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id })
    .populate("products");

  res.json(wishlist);
};

// Add to wishlist
exports.addToWishlist = async (req, res) => {
  const { productId } = req.body;

  let wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: req.user._id,
      products: [productId],
    });
  } else {
    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
    }
    await wishlist.save();
  }

  res.json(wishlist);
};

// Remove from wishlist
exports.removeFromWishlist = async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id });

  wishlist.products = wishlist.products.filter(
    p => p.toString() !== req.params.productId
  );

  await wishlist.save();
  res.json(wishlist);
};