const Product = require("../models/Product");
const cloudinary = require('../config/cloudinary')
const fs = require('fs')
const path = require('path')

// check if cloudinary is configured
function isCloudinaryConfigured(){
  return process.env.CLOUDINARY_NAME && 
         process.env.CLOUDINARY_KEY && 
         process.env.CLOUDINARY_SECRET &&
         !process.env.CLOUDINARY_NAME.includes('your_') && // skip placeholder values
         !process.env.CLOUDINARY_KEY.includes('your_')
}

// helper to upload a buffer to cloudinary
function uploadBufferToCloudinary(buffer, filename){
  return new Promise((resolve, reject)=>{
    const stream = cloudinary.uploader.upload_stream({ folder: 'products' }, (error, result)=>{
      if(error) return reject(error)
      resolve(result)
    })
    stream.end(buffer)
  })
}

// helper to upload file locally
function uploadBufferLocally(buffer, filename){
  return new Promise((resolve, reject)=>{
    try{
      const uploadsDir = path.join(__dirname, '../uploads')
      if(!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })
      
      // use timestamp + filename to avoid collisions
      const safeName = Date.now() + '-' + filename.replace(/[^a-z0-9.-]/gi, '_')
      const filePath = path.join(uploadsDir, safeName)
      fs.writeFileSync(filePath, buffer)
      
      // return URL relative to uploads
      resolve({ url: `/uploads/${safeName}` })
    } catch(err){
      reject(err)
    }
  })
}

// Get all products
exports.getProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

// Get single product
exports.getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.json(product);
};

// Create product (Seller/Admin)
exports.createProduct = async (req, res) => {
  try{
    const body = { ...req.body }
    
    // FormData sends price as string; convert to number
    if(body.price) body.price = parseFloat(body.price)

    console.log('createProduct req.body:', body)
    console.log('createProduct files:', req.files && req.files.length)

    // Assign the authenticated user as the seller
    if (req.user) {
      body.seller = req.user._id || req.user.id
    }

    // if files uploaded via multer (memoryStorage), upload to Cloudinary or local
    if(req.files && req.files.length){
      const uploads = []
      for(const file of req.files){
        let result
        if(isCloudinaryConfigured()){
          // Try Cloudinary first, but fall back to local if upload fails
          try{
            result = await uploadBufferToCloudinary(file.buffer, file.originalname)
            uploads.push({ url: result.secure_url })
            continue
          }catch(err){
            console.warn('Cloudinary upload failed, falling back to local storage:', err.message || err)
          }
        }
        // Either not configured or Cloudinary failed — save locally
        result = await uploadBufferLocally(file.buffer, file.originalname)
        uploads.push(result)
      }
      body.images = uploads
    } else if(body.images && typeof body.images === 'string'){
      // if frontend sent images as JSON string or urls
      try{ body.images = JSON.parse(body.images) }catch(e){ /* leave as-is */ }
    }

    const product = new Product(body);
    const saved = await product.save();
    res.status(201).json(saved);
  } catch(err){
    console.error('createProduct error:', err.stack || err.message)
    res.status(500).json({ message: err.message })
  }
};

// Update
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if user owns this product (for sellers)
    if (req.user.role === 'seller' && product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this product" });
    }

    Object.assign(product, req.body);
    const updated = await product.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if user owns this product (for sellers)
    if (req.user.role === 'seller' && product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this product" });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get seller's products
exports.getSellerProducts = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const products = await Product.find({ seller: sellerId })
      .populate('seller', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};