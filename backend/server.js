require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const cors = require("./config/cors");

const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// Optional middlewares
const limiter = require("./middleware/rateLimiter"); // if created
const { logger } = require("./middleware/loggerMiddleware"); // if created

const app = express();

//
// ✅ Connect Database
//
connectDB();

//
// ✅ Global Middlewares
//
app.use(express.json()); // body parser
app.use(cors); // CORS config
app.use(express.static('uploads')); // serve uploaded images as static files (e.g., /uploads/filename.jpg)

// Optional
app.use(limiter); // rate limit
app.use(logger); // request logger

//
// ✅ Routes
//
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/wishlist", require("./routes/wishlistRoutes"));

//
// ✅ Default Route
//
app.get("/", (req, res) => {
  res.send("API is running...");
});

//
// ❌ Error Handling (MUST BE LAST)
//
app.use(notFound);
app.use(errorHandler);

//
// ✅ Start Server
//
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});