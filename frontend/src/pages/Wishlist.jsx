import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api'
import './Wishlist.css'

export default function Wishlist(){
  const [wishlist, setWishlist] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(()=>{
    const token = localStorage.getItem('token')
    if(!token){
      setError({ message: 'Please login to view your wishlist', auth: true })
      setLoading(false)
      return
    }

    api.getWishlist()
      .then(setWishlist)
      .catch(e=> setError(e.message || 'Failed'))
      .finally(()=> setLoading(false))
  },[])

  const remove = async (id)=>{
    try{
      const w = await api.removeFromWishlist(id)
      setWishlist(w)
    }catch(err){ alert(err.message || 'Could not remove') }
  }

  if(loading) return <p className="center">Loading...</p>
  if(error) return (
    <div className="wish-page access-denied">
      <div className="wish-card">
        <h2>{error.auth ? 'Access Denied' : 'Error'}</h2>
        <p>{error.auth ? 'Please login to view your wishlist' : (error.message || error)}</p>
        {error.auth ? (
          <button className="btn primary" onClick={()=> navigate('/login')}>Login</button>
        ) : null}
      </div>
    </div>
  )

  if(!wishlist || !wishlist.products || wishlist.products.length===0) return <p className="center">Wishlist is empty</p>

  return (
    <div className="container">
      <h1>Your Wishlist</h1>
      <div className="wish-grid">
        {wishlist.products.map(p=> (
          <div className="wish-card" key={p._id}>
            <Link to={`/product/${p._id}`} className="wish-img">
              <img src={p.images?.[0]?.url || p.images?.[0]} alt={p.name} />
            </Link>
            <div className="wish-body">
              <div className="wish-title">{p.name}</div>
              <div className="wish-price">₹{p.price}</div>
              <div className="wish-actions">
                <button className="btn btn-remove" onClick={()=> remove(p._id)}>Remove</button>
                <button className="btn btn-add" onClick={()=> { /* optionally add to cart */ }}>Add to Cart</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
