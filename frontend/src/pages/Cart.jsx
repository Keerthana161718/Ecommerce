import React, {useEffect, useState} from 'react'
import { api } from '../api'
import { Link, useNavigate } from 'react-router-dom'
import './Cart.css'

export default function Cart(){
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(()=>{
    const token = localStorage.getItem('token')
    if(!token){
      setError({ message: 'Please login to view your cart', auth: true })
      setLoading(false)
      return
    }

    api.getCart()
      .then(setCart)
      .catch(e=> setError(e.message || 'Failed'))
      .finally(()=> setLoading(false))
  },[])

  const removeFromCart = (productId) => {
    api.removeFromCart(productId)
      .then(() => {
        setCart(prev => ({
          ...prev,
          items: prev.items.filter(it => it.product._id !== productId)
        }))
      })
      .catch(e => setError(e.message || 'Failed to remove item'))
  }

  const handleBuy = () => {
    const products = cart.items.map(it => ({ product: it.product, quantity: it.quantity }))
    navigate('/payment', { 
      state: { 
        products,
        total: cart.items.reduce((sum, it) => sum + (it.product.price * it.quantity), 0)
      } 
    })
  }

  if(loading) return <p className="center">Loading...</p>
  if(error) {
    return (
      <div className="cart-page access-denied">
        <div className="cart-card">
          <h2>{error.auth ? 'Access Denied' : 'Error'}</h2>
          <p>{error.auth ? 'Please login to view your cart' : (error.message || error)}</p>
          {error.auth ? (
            <button className="btn primary" onClick={()=> navigate('/login')}>Login</button>
          ) : null}
        </div>
      </div>
    )
  }

  if(!cart || !cart.items || cart.items.length===0) return <p className="center">Cart is empty</p>

  const total = cart.items.reduce((sum, it) => sum + (it.product.price * it.quantity), 0)

  return (
    <div className="container">
      <h1>Your Cart</h1>
      <ul className="cart-list">
        {cart.items.map(it=> (
          <li key={it.product._id} className="cart-item">
            <img 
              src={it.product.images?.[0]?.url || it.product.images?.[0]} 
              alt={it.product.name}
              onClick={() => navigate(`/product/${it.product._id}`)}
              style={{cursor:'pointer'}}
            />
            <div className="item-details" onClick={() => navigate(`/product/${it.product._id}`)} style={{cursor:'pointer'}}>
              <strong>{it.product.name}</strong>
              <p>Qty: {it.quantity}</p>
              <p className="price">₹{(it.product.price * it.quantity).toFixed(2)}</p>
            </div>
            <button 
              className="remove-btn"
              onClick={() => removeFromCart(it.product._id)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <div className="cart-summary">
        <div className="summary-row">
          <span>Subtotal</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Delivery</span>
          <span>Free</span>
        </div>
        <div className="summary-row">
          <span>Taxes</span>
          <span>₹0</span>
        </div>
        <div className="summary-row total">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
        <button className="buy-btn" onClick={handleBuy}>Proceed to Buy</button>
      </div>
    </div>
  )
}
