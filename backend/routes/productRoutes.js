const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const { protect, admin, seller } = require("../middleware/authMiddleware");
const multer = require('multer')

// use memory storage so we can upload buffers to cloudinary
const storage = multer.memoryStorage()
const upload = multer({ storage })

// DEBUG: log request details before route handler
router.post("/", (req, res, next) => {
  console.log('POST /api/products - Headers:', req.headers['content-type'])
  console.log('POST /api/products - req.body before multer:', req.body)
  console.log('POST /api/products - req.files before multer:', req.files)
  next()
})

router.route("/")
  .get(getProducts)
  .post(protect, seller, (req, res, next) => {
    console.log('After protect/seller middleware - req.body:', req.body, 'files:', req.files)
    next()
  }, upload.array('images'), (req, res, next) => {
    console.log('After multer - req.body:', req.body, 'files count:', req.files?.length)
    next()
  }, createProduct);

router.route("/:id")
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

module.exports = router;