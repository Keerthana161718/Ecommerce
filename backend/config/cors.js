const cors = require("cors");

const corsOptions = {
  origin: "*", // change to frontend URL in production
  credentials: true,
};

module.exports = cors(corsOptions);