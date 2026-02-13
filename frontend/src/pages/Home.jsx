import React, {useEffect, useState} from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { api } from '../api'
import './Home.css'

export default function Home(){

  const [products,setProducts]=useState([])
  const [loading,setLoading]=useState(true)
  const [error,setError]=useState(null)
  const [wishlistIds,setWishlistIds]=useState(new Set())
  const [selectedCategory, setSelectedCategory] = useState(null)

  const { search } = useLocation()
  const navigate = useNavigate()

  /* LOAD PRODUCTS */

  useEffect(()=>{
    api.getProducts()
      .then(setProducts)
      .catch(e=>setError(e.message||'Failed to load'))
      .finally(()=>setLoading(false))
  },[])

  /* LOAD WISHLIST */

  useEffect(()=>{
    const token=localStorage.getItem('token')
    if(!token) return

    api.getWishlist()
      .then(w=>{
        if(!w?.products) return
        setWishlistIds(new Set(w.products.map(p=>p._id||p)))
      })
      .catch(()=>{})
  },[])

  if(loading) return <div className="center">Loading products...</div>
  if(error) return <div className="center">Error: {error}</div>

  /* SEARCH FILTER */

  const params=new URLSearchParams(search)
  const q=(params.get('q')||'').toLowerCase()

  // Extract unique categories
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))]

  const visible=products.filter(p=>{
    // Filter by search query
    const matchesSearch = !q || 
      p.name?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q)
    
    // Filter by category
    const matchesCategory = !selectedCategory || p.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  /* CART */

  const addToCart=async(id)=>{
    const token=localStorage.getItem('token')
    if(!token) return navigate('/login?redirect=/cart')

    try{
      await api.addToCart({productId:id,quantity:1})
      navigate('/cart')
    }catch(e){
      alert(e.message||'Failed')
    }
  }

  /* WISHLIST */

  const toggleWishlist=async(id)=>{
    const token=localStorage.getItem('token')
    if(!token) return navigate('/login')

    const next=new Set(wishlistIds)

    try{
      if(next.has(id)){
        await api.removeFromWishlist(id)
        next.delete(id)
      }else{
        await api.addToWishlist({productId:id})
        next.add(id)
      }
      setWishlistIds(next)
    }catch(e){
      alert('Wishlist update failed')
    }
  }

  return(
    <div className="home-container">

      {/* HERO */}
      <div className="hero-banner">
        <h2>Big Savings on Electronics</h2>
        <p>Up to 50% off • Free delivery</p>
      </div>

      {/* CATEGORY FILTER */}
      {categories.length > 0 && (
        <div className="category-filter">
          <h3>Filter by Category</h3>
          <div className="category-buttons">
            <button 
              className={`category-btn ${!selectedCategory ? 'active' : ''}`}
              onClick={() => setSelectedCategory(null)}
            >
              All Products
            </button>
            {categories.map(category => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* GRID */}
      <div className="products-grid">

        {visible.length > 0 ? (
          visible.map(p=>(
          <div key={p._id} className="prod-card">

            {/* IMAGE */}
            <div className="img-wrap">
              <Link to={`/product/${p._id}`}>
                <img
                  src={p.images?.[0]?.url || '/placeholder.png'}
                  alt={p.name}
                />
              </Link>

              <button className="fav" onClick={()=>toggleWishlist(p._id)}>{wishlistIds.has(p._id) ? '❤' : '♡'}</button>
            </div>

            {/* BODY */}
            <div className="card-body">

              <div className="title-row">
                <div>
                  <h3 className="prod-title">{p.name}</h3>
                  {p.brand && <div className="prod-brand">{p.brand}</div>}
                </div>
                <span className="rating">4.5★</span>
              </div>

              <div className="price-row">
                <div className="price">₹{p.price}</div>

                <button
                  className="btn add"
                  onClick={()=>addToCart(p._id)}
                >
                  Add to Cart
                </button>
              </div>

            </div>
          </div>
        ))
        ) : (
          <div className="no-products">
            <p>No products found {selectedCategory && `in "${selectedCategory}"`}</p>
            {selectedCategory && (
              <button 
                className="btn primary"
                onClick={() => setSelectedCategory(null)}
              >
                Clear Filter
              </button>
            )}
          </div>
        )}

      </div>

    </div>
  )
}
