import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './OrderSuccess.css'

export default function OrderSuccess(){
  const location = useLocation()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const cart = location.state?.cart
    const orderData = location.state?.orderData

    if (!cart) {
      navigate('/cart')
      return
    }

    // Generate order number
    const orderNumber = `${Date.now().toString().slice(-6)}`
    
    const order = {
      customerName: user.name || 'Customer',
      orderNumber: orderNumber,
      items: cart.items || [],
      subtotal: (cart.items || []).reduce((sum, it) => sum + (it.product.price * it.quantity), 0),
      delivery: 0,
      taxes: 0,
      paymentMethod: orderData?.paymentMethod || 'cod',
      deliveryAddress: orderData?.deliveryAddress || {}
    }

    setOrder(order)
  }, [location.state, navigate])

  if (!order) return <div className="center">Loading...</div>

  const total = order.subtotal + order.delivery + order.taxes

  return (
    <div className="order-success-container">
      <div className="success-header">
        <h1>Thank you, {order.customerName}</h1>
        <p>You'll receive a confirmation email soon</p>
        <p className="order-num">Order number: {order.orderNumber}</p>
      </div>

      <div className="order-content">
        <div className="order-main">
          <div className="items-section">
            <h3>Order Items</h3>
            {order.items.map((it, idx) => (
              <div key={idx} className="order-item">
                <img 
                  src={it.product.images?.[0]?.url || it.product.images?.[0]} 
                  alt={it.product.name}
                />
                <div className="item-info">
                  <h3>{it.product.name}</h3>
                  <p className="price">₹{it.product.price}</p>
                  <p className="qty">Quantity: {it.quantity}</p>
                  <p className="description">{it.product.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="delivery-section">
            <h3>Delivery Address</h3>
            <div className="address-card">
              <p><strong>{order.deliveryAddress.fullName}</strong></p>
              <p>{order.deliveryAddress.address}</p>
              <p>{order.deliveryAddress.city} - {order.deliveryAddress.pincode}</p>
              <p>Phone: {order.deliveryAddress.phone}</p>
              <p>Email: {order.deliveryAddress.email}</p>
            </div>
          </div>
        </div>

        <div className="bill-section">
          <h3>Order Summary</h3>
          <div className="bill-row">
            <span>Subtotal</span>
            <span>₹{order.subtotal.toFixed(2)}</span>
          </div>
          <div className="bill-row">
            <span>Delivery</span>
            <span>{order.delivery === 0 ? 'Free' : '₹' + order.delivery.toFixed(2)}</span>
          </div>
          <div className="bill-row">
            <span>Taxes</span>
            <span>₹{order.taxes.toFixed(2)}</span>
          </div>
          <div className="bill-row total">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
          
          <div className="payment-info">
            <h3>Payment Method</h3>
            <p>{order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod === 'card' ? 'Credit/Debit Card' : 'UPI'}</p>
          </div>
        </div>
      </div>

      <div className="action-buttons">
        <button className="continue-btn" onClick={() => navigate('/')}>
          Continue Shopping
        </button>
      </div>
    </div>
  )
}
