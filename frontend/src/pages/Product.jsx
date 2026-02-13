import React, {useEffect, useState} from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../api'
import './Product.css'

export default function Product(){
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [qty, setQty] = useState(1)
  const [wishlistIds, setWishlistIds] = useState(new Set())

  useEffect(()=>{
    api.getProduct(id)
      .then(setProduct)
      .catch(e=> setError(e.message || 'Failed'))
      .finally(()=> setLoading(false))
  },[id])

  // load wishlist ids to show filled hearts
  useEffect(()=>{
    const token = localStorage.getItem('token')
    if(!token) return
    api.getWishlist()
      .then(w => {
        if(!w || !w.products) return
        const ids = new Set(w.products.map(p=> p._id || p))
        setWishlistIds(ids)
      })
      .catch(()=>{})
  },[])

  const addToCart = async (quantity = qty)=>{
    const token = localStorage.getItem('token')
    if(!token){
      navigate(`/login?redirect=/product/${id}`)
      return
    }
    try{
      await api.addToCart({ productId: id, quantity })
      navigate('/cart')
    }catch(e){
      alert(e.message || 'Could not add')
    }
  }

  const buyNow = async ()=>{
    const token = localStorage.getItem('token')
    if(!token){
      navigate(`/login?redirect=/product/${id}`)
      return
    }
    // Navigate to payment page with product details
    navigate('/payment', { 
      state: { 
        products: [{ product, quantity: qty }],
        total: product.price * qty
      } 
    })
  }

  const toggleWishlist = async ()=>{
    const token = localStorage.getItem('token')
    if(!token){
      navigate(`/login?redirect=/product/${id}`)
      return
    }

    if(wishlistIds.has(id)){
      // remove
      try{
        await api.removeFromWishlist(id)
        const next = new Set(wishlistIds)
        next.delete(id)
        setWishlistIds(next)
      }catch(err){ alert(err.message || 'Could not remove') }
    } else {
      try{
        await api.addToWishlist({ productId: id })
        const next = new Set(wishlistIds)
        next.add(id)
        setWishlistIds(next)
      }catch(err){ alert(err.message || 'Could not add') }
    }
  }

  if(loading) return <p className="center">Loading...</p>
  if(error) return <p className="center">Error: {error}</p>
  if(!product) return <p className="center">No product</p>

  const images = product.images || []
  const getImgSrc = (img) => (img && (img.url || img)) || '/placeholder.png'

  return (
    <div style={{ minHeight: 'calc(100vh - 60px)', background: 'linear-gradient(135deg, #667eea 0%, #1d4ed8 100%)', padding: '40px 20px' }}>
      <div className="container">
        {/* Breadcrumbs removed per design - only product details shown */}
        <div className="product-page" style={{background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)'}}>
          <div className="left-col">
            <div className="thumbs">
              {images.map((img, i)=> (
                <button key={i} className={`thumb ${i===selectedImage? 'active':''}`} onClick={()=> setSelectedImage(i)}>
                  <img src={getImgSrc(img)} alt={`thumb-${i}`} />
                </button>
              ))}
            </div>
            <div className="main-image">
              <img src={getImgSrc(images[selectedImage])} alt={product.name} />
              <button className="fav" onClick={toggleWishlist}>{wishlistIds.has(id) ? '❤' : '♡'}</button>
            </div>
          </div>

          <aside className="right-col">
            <div className="detail-card">
              <h1 className="prod-name">{product.name}</h1>
              {product.brand && <div className="prod-brand">{product.brand}</div>}
              <div className="prod-price">₹{product.price}</div>
              <p className="prod-desc">{product.description}</p>

              <div className="qty-row">
                <label>Quantity</label>
                <div className="qty-control">
                  <button onClick={()=> setQty(Math.max(1, qty-1))}>-</button>
                  <span>{qty}</span>
                  <button onClick={()=> setQty(qty+1)}>+</button>
                </div>
              </div>

              <div className="actions">
                <button className="btn add-cart" onClick={()=> addToCart()}>Add to Cart</button>
                <button className="btn buy-now" onClick={buyNow}>Buy Now</button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
