const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5000, // limit each IP to 5000 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skip: (req) => {
    // Skip rate limiting for admin, auth, user profile, cart, wishlist, and products routes
    return req.path.startsWith('/api/admin') || 
           req.path.startsWith('/api/auth') ||
           req.path.startsWith('/api/users/profile') ||
           req.path.startsWith('/api/cart') ||
           req.path.startsWith('/api/wishlist') ||
           req.path.startsWith('/api/products');
  },
});

module.exports = limiter;
