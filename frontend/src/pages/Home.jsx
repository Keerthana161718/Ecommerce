import React, {useEffect, useState} from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { api } from '../api'
import './Home.css'

export default function Home(){
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [wishlistIds, setWishlistIds] = useState(new Set())

  const { search } = useLocation()
  const navigate = useNavigate()

  useEffect(()=>{
    api.getProducts()
      .then(data=> setProducts(data))
      .catch(e=> setError(e.message || 'Failed'))
      .finally(()=> setLoading(false))
  },[])

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

  if(loading) return <p className="center">Loading...</p>
  if(error) return <p className="center">Error: {error}</p>

  // apply client-side search filter using ?q= in URL
  const params = new URLSearchParams(search)
  const q = (params.get('q') || '').toLowerCase().trim()
  const visible = q ? products.filter(p=> (p.name||'').toLowerCase().includes(q) || (p.description||'').toLowerCase().includes(q)) : products

  const addToCart = async (productId)=>{
    const token = localStorage.getItem('token')
    if(!token){
      navigate(`/login?redirect=/cart`)
      return
    }
    try{
      await api.addToCart({ productId, quantity: 1 })
      navigate('/cart')
    }catch(err){
      alert(err.message || 'Could not add to cart')
    }
  }

  const toggleWishlist = async (productId)=>{
    const token = localStorage.getItem('token')
    if(!token){
      navigate(`/login?redirect=/product/${productId}`)
      return
    }

    if(wishlistIds.has(productId)){
      // remove
      try{
        await api.removeFromWishlist(productId)
        const next = new Set(wishlistIds)
        next.delete(productId)
        setWishlistIds(next)
      }catch(err){ alert(err.message || 'Could not remove') }
    } else {
      try{
        await api.addToWishlist({ productId })
        const next = new Set(wishlistIds)
        next.add(productId)
        setWishlistIds(next)
      }catch(err){ alert(err.message || 'Could not add') }
    }
  }

  return (
    <div className="container">
      <div className="hero-banner">
        <h2>Big Savings on Electronics</h2>
        <p>Up to 50% off | Free delivery</p>
      </div>

      {/* category chips removed per design update */}

      <h1>All Products</h1>
      <div className="products-grid">
        {visible.map(p=> (
          <div key={p._id} className="prod-card">
            <div className="img-wrap">
              <Link to={`/product/${p._id}`} className="img-link">
                <img src={p.images && p.images[0]?.url} alt={p.name} />
              </Link>
              <button className="fav" onClick={()=>toggleWishlist(p._id)}>{wishlistIds.has(p._id) ? '❤' : '♡'}</button>
            </div>
            <div className="card-body">
              <div className="title-row">
                <div style={{display:'flex',flexDirection:'column'}}>
                  <h3 className="prod-title">{p.name}</h3>
                  {p.brand && <div className="prod-brand">{p.brand}</div>}
                </div>
                <span className="rating">4.5★</span>
              </div>
              <div className="price-row">
                <div className="price">₹{p.price}</div>
                <button className="btn add" onClick={()=>addToCart(p._id)}>Add</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
