import React, {useEffect, useState} from 'react'
import { api } from '../api'
import { useNavigate } from 'react-router-dom'
import './Cart.css'

export default function Cart(){

  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const navigate = useNavigate()

  useEffect(()=>{
    const token = localStorage.getItem('token')

    if(!token){
      setError({ message:'Please login to view your cart', auth:true })
      setLoading(false)
      return
    }

    api.getCart()
      .then(setCart)
      .catch(e => setError(e.message || 'Failed'))
      .finally(()=> setLoading(false))

  },[])

  const removeFromCart = (productId)=>{
    api.removeFromCart(productId)
      .then(()=>{
        setCart(prev=>({
          ...prev,
          items: prev.items.filter(
            it=> it.product._id !== productId
          )
        }))
      })
  }

  const handleBuy = ()=>{
    const total = cart.items.reduce(
      (sum,it)=> sum + (it.product.price * it.quantity),
      0
    )

    navigate('/payment',{ state:{ 
      total,
      products: cart.items.map(it => ({
        product: it.product,
        quantity: it.quantity
      }))
    }})
  }

  if(loading) return <p className="center">Loading...</p>

  if(error){
    return (
      <div className="cart-page center">
        <h2>Please login to view cart</h2>
        <button onClick={()=>navigate('/login')} className="primary-btn">
          Login
        </button>
      </div>
    )
  }

  if(!cart?.items?.length){
    return (
      <div className="cart-page center">
        <h2>Your Cart is Empty</h2>
        <button onClick={()=>navigate('/')} className="primary-btn">
          Continue Shopping
        </button>
      </div>
    )
  }

  const total = cart.items.reduce(
    (sum,it)=> sum + (it.product.price * it.quantity),
    0
  )

  return (
    <div className="cart-page">

      <div className="cart-container">

        {/* LEFT SIDE */}
        <div>

          {cart.items.map(it=>(
            <div className="cart-row" key={it.product._id}>

              <img
                src={it.product.images?.[0]?.url || it.product.images?.[0]}
                alt=""
                onClick={()=>navigate(`/product/${it.product._id}`)}
              />

              <div className="cart-info">
                <h3>{it.product.name}</h3>

                <p className="stock">In Stock</p>

                <p>Qty: {it.quantity}</p>

                <p className="price">
                  ₹{(it.product.price * it.quantity).toFixed(2)}
                </p>

                <button
                  className="remove-btn"
                  onClick={()=>removeFromCart(it.product._id)}
                >
                  Remove
                </button>
              </div>

            </div>
          ))}

        </div>

        {/* RIGHT SIDE SUMMARY */}
        <div className="cart-summary">

          <h3>PRICE DETAILS</h3>

          <div className="row">
            <span>Price</span>
            <span>₹{total.toFixed(2)}</span>
          </div>

          <div className="row">
            <span>Delivery</span>
            <span className="green">FREE</span>
          </div>

          <div className="row total">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>

          <button onClick={handleBuy} className="place-btn">
            PLACE ORDER
          </button>

        </div>

      </div>
    </div>
  )
}
