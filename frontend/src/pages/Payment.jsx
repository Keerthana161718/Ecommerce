import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { api } from '../api'
import './Payment.css'

export default function Payment(){
  const location = useLocation()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: ''
  })

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const state = location.state
    
    if (!state || !state.products) {
      navigate('/cart')
      return
    }

    setFormData(prev => ({
      ...prev,
      fullName: user.name || '',
      email: user.email || ''
    }))
    
    setProducts(state.products)
    setTotal(state.total || 0)
  }, [location.state, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePayment = async (e) => {
    e.preventDefault()
    
    // Validate form
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.pincode) {
      alert('Please fill all fields')
      return
    }

    setLoading(true)
    try {
      // Call backend to process payment
      const response = await api.processPayment({
        products,
        total,
        paymentMethod,
        deliveryAddress: formData
      })

      if (response) {
        // Navigate to order success page with order details
        navigate('/order-success', {
          state: {
            cart: { items: products.map(p => ({ product: p.product, quantity: p.quantity })) },
            orderData: {
              paymentMethod,
              deliveryAddress: formData,
              orderId: response.orderId
            }
          }
        })
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert(error.message || 'Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="payment-container">
      <div className="payment-header">
        <h1>Checkout</h1>
      </div>

      <div className="payment-content">
        <div className="payment-form-section">
          <form onSubmit={handlePayment} className="payment-form">
            <div className="form-section">
              <h2>Delivery Details</h2>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10-digit number"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Street address, building name, etc."
                  rows="3"
                ></textarea>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                  />
                </div>
                <div className="form-group">
                  <label>Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="6-digit pincode"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2>Payment Method</h2>
              <div className="payment-methods">
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Cash on Delivery</span>
                </label>
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Credit/Debit Card</span>
                </label>
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>UPI</span>
                </label>
              </div>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </form>
        </div>

        <div className="payment-summary">
          <h2>Order Summary</h2>
          <div className="summary-items">
            {products.map((item, idx) => (
              <div key={idx} className="summary-item">
                <img
                  src={item.product.images?.[0]?.url || item.product.images?.[0]}
                  alt={item.product.name}
                />
                <div className="item-details">
                  <p className="item-name">{item.product.name}</p>
                  <p className="item-qty">Qty: {item.quantity}</p>
                  <p className="item-price">₹{item.product.price}</p>
                </div>
                <div className="item-total">
                  ₹{(item.product.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="summary-breakdown">
            <div className="breakdown-row">
              <span>Subtotal</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <div className="breakdown-row">
              <span>Delivery</span>
              <span>Free</span>
            </div>
            <div className="breakdown-row">
              <span>Taxes</span>
              <span>₹0</span>
            </div>
            <div className="breakdown-row total">
              <span>Total Amount</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
