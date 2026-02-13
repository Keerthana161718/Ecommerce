import React, { useState, useEffect } from 'react'
import { api } from '../api'
import { useNavigate, Link } from 'react-router-dom'
import './Seller.css'

export default function Seller(){
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [brand, setBrand] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [stock, setStock] = useState('')
  const [images, setImages] = useState('')
  const [files, setFiles] = useState(null)
  const [status, setStatus] = useState(null)
  const [allowed, setAllowed] = useState(false)
  const [sellerProducts, setSellerProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [activeTab, setActiveTab] = useState('add-product')

  useEffect(()=>{
    const token = localStorage.getItem('token')
    const raw = localStorage.getItem('user')
    const user = raw ? JSON.parse(raw) : null
    if(!token){
      setAllowed(false)
      setStatus({ message: 'Please login to access seller dashboard', auth: true })
      return
    }
    if(!user || user.role !== 'seller'){
      setAllowed(false)
      setStatus({ message: 'Only sellers can access this page. Register as a seller.', auth: false })
      return
    }
    setAllowed(true)
    setStatus(null)
    fetchSellerProducts()
  },[])

  const submit = async (e)=>{
    e.preventDefault()
    setStatus('saving')
    try{
      // build FormData to include image files if provided
      const form = new FormData()
      form.append('name', name)
      form.append('brand', brand)
      form.append('price', price)  // do NOT parseFloat; let backend handle casting
      form.append('description', description)
      form.append('category', category)
      form.append('countInStock', stock)
      
      if(files && files.length){
        // files were selected — upload to cloudinary
        for(let i=0;i<files.length;i++) form.append('images', files[i])
      } else if(images.trim()){
        // fallback: user provided URLs instead
        const urls = images.split(',').map(s=>s.trim()).filter(Boolean).map(u=>({ url: u }))
        form.append('images', JSON.stringify(urls))
      }

      await api.createProduct(form)
      setStatus('saved')
      setName('')
      setBrand('')
      setPrice('')
      setDescription('')
      setCategory('')
      setStock('')
      setImages('')
      setFiles(null)
      // Refresh products list
      fetchSellerProducts()
    }catch(err){
      setStatus(err.message || 'Failed')
    }
  }

  const fetchSellerProducts = async () => {
    setLoadingProducts(true)
    try {
      const data = await api.getSellerProducts()
      setSellerProducts(data || [])
    } catch (err) {
      console.error('Error fetching seller products:', err)
    } finally {
      setLoadingProducts(false)
    }
  }

  const handleUpdateStock = async (productId, newStock, inStock) => {
    // Optimistic update - update UI immediately
    const updatedProducts = sellerProducts.map(p => 
      p._id === productId 
        ? { ...p, countInStock: newStock, inStock: inStock }
        : p
    )
    setSellerProducts(updatedProducts)

    // Send update in background without waiting
    try {
      await api.updateProductStock(productId, { 
        countInStock: newStock,
        inStock: inStock 
      })
    } catch (err) {
      // If error, refresh products to get correct data
      alert(err.message || 'Failed to update stock')
      fetchSellerProducts()
    }
  }

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    try {
      await api.deleteProduct(productId)
      // Refresh products
      fetchSellerProducts()
    } catch (err) {
      alert(err.message || 'Failed to delete product')
    }
  }
  if(!allowed){
    return (
      <div className="seller-page access-denied">
        <div className="seller-card">
          <h2>Access Denied</h2>
          <p>{status && status.message}</p>
          {status && status.auth ? (
            <button className="btn primary" onClick={()=>navigate('/login')}>Login</button>
          ) : (
            <Link to="/register"><button className="btn primary">Register as Seller</button></Link>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="seller-page">

      {/* TABS */}
      <div className="seller-tabs">
        <button 
          className={`tab-btn ${activeTab === 'add-product' ? 'active' : ''}`}
          onClick={() => setActiveTab('add-product')}
        >
          ➕ Add New Product
        </button>
        <button 
          className={`tab-btn ${activeTab === 'manage-products' ? 'active' : ''}`}
          onClick={() => setActiveTab('manage-products')}
        >
          📋 Manage My Products
        </button>
      </div>

      {/* ADD PRODUCT TAB */}
      {activeTab === 'add-product' && (
      <div className="seller-card">
        <h2>Add New Product</h2>
        <form className="seller-form" onSubmit={submit}>
          <div className="form-group">
            <label>Product Name</label>
            <input 
              placeholder="e.g., Blue Dress" 
              value={name} 
              onChange={e=>setName(e.target.value)} 
              required
            />
          </div>

          <div className="form-group">
            <label>Brand</label>
            <input 
              placeholder="e.g., Nike" 
              value={brand} 
              onChange={e=>setBrand(e.target.value)} 
            />
          </div>

          <div className="form-group">
            <label>Price</label>
            <input 
              type="number" 
              placeholder="e.g., 2500" 
              value={price} 
              onChange={e=>setPrice(e.target.value)} 
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <input 
              placeholder="e.g., Electronics, Clothing, Books" 
              value={category} 
              onChange={e=>setCategory(e.target.value)} 
              required
            />
          </div>

          <div className="form-group">
            <label>Stock/Quantity Available</label>
            <input 
              type="number" 
              placeholder="e.g., 50" 
              value={stock} 
              onChange={e=>setStock(e.target.value)} 
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea 
              placeholder="Describe your product..." 
              value={description} 
              onChange={e=>setDescription(e.target.value)}
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>Upload Images (jpg/png/jpeg)</label>
            <input 
              type="file" 
              accept="image/png,image/jpeg,image/jpg" 
              multiple 
              onChange={e=>setFiles(e.target.files)} 
            />
          </div>

          <div className="form-group">
            <label>Or Paste Image URLs (optional)</label>
            <textarea 
              placeholder="https://example.com/image.jpg, https://example.com/image2.jpg" 
              value={images} 
              onChange={e=>setImages(e.target.value)} 
              rows="2"
            />
          </div>

          <button type="submit" className="btn primary" disabled={status === 'saving'}>
            {status === 'saving' ? 'Creating...' : 'Add Product'}
          </button>

          {status === 'saved' && <p className="success">Product created successfully!</p>}
          {status && status !== 'saving' && status !== 'saved' && <p className="error">{status}</p>}
        </form>
      </div>
      )}

      {/* MANAGE PRODUCTS TAB */}
      {activeTab === 'manage-products' && (
      <div className="seller-card">
        <h2>My Products</h2>
        {loadingProducts ? (
          <p className="center">Loading products...</p>
        ) : sellerProducts.length === 0 ? (
          <p className="center">No products yet. Add your first product!</p>
        ) : (
          <div className="products-management">
            {sellerProducts.map(product => (
              <div key={product._id} className="product-mgmt-card">
                <div className="product-header">
                  {product.images && product.images[0] && (
                    <img 
                      src={product.images[0]?.url || product.images[0]} 
                      alt={product.name}
                      className="product-thumb"
                    />
                  )}
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p className="product-details">
                      {product.category} • ₹{product.price} • {product.brand}
                    </p>
                  </div>
                </div>

                <div className="stock-section">
                  <div className="stock-info">
                    <label>Stock Status:</label>
                    <select 
                      value={product.countInStock > 0 ? 'in-stock' : 'out-of-stock'}
                      onChange={(e) => {
                        const inStock = e.target.value === 'in-stock'
                        handleUpdateStock(product._id, inStock ? product.countInStock || 1 : 0, inStock)
                      }}
                      className="stock-select"
                    >
                      <option value="in-stock">In Stock</option>
                      <option value="out-of-stock">Out of Stock</option>
                    </select>
                  </div>

                  <div className="quantity-section">
                    <label>Quantity:</label>
                    <div className="quantity-input">
                      <input 
                        type="number" 
                        min="0"
                        value={product.countInStock || 0}
                        onChange={(e) => {
                          const newQty = parseInt(e.target.value) || 0
                          handleUpdateStock(product._id, newQty, newQty > 0)
                        }}
                        className="qty-input"
                      />
                      <span className="qty-label">items available</span>
                    </div>
                  </div>
                </div>

                <div className="product-actions">
                  <button 
                    className="btn btn-delete"
                    onClick={() => handleDeleteProduct(product._id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      )}

    </div>
  )
}
