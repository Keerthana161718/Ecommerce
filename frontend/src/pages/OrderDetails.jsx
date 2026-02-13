import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../api'
import './OrderDetails.css'

export default function OrderDetails(){
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setError('Please login to view order details')
      setLoading(false)
      return
    }

    fetchOrderDetails()
  }, [orderId])

  const fetchOrderDetails = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.getOrderDetails(orderId)
      setOrder(data)
    } catch (err) {
      console.error('Error fetching order details:', err)
      setError(err.message || 'Failed to fetch order details')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="order-details-page"><p className="center">Loading...</p></div>
  }

  if (error) {
    return (
      <div className="order-details-page error-container">
        <div className="error-card">
          <h2>Error</h2>
          <p>{error}</p>
          <button className="btn primary" onClick={() => navigate('/my-orders')}>
            Back to My Orders
          </button>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="order-details-page not-found-container">
        <div className="not-found-card">
          <h2>Order Not Found</h2>
          <p>The order you're looking for doesn't exist.</p>
          <button className="btn primary" onClick={() => navigate('/my-orders')}>
            Back to My Orders
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="order-details-page">
      <button className="back-btn" onClick={() => navigate('/my-orders')}>
        ← Back to Orders
      </button>

      <div className="container">
        <div className="details-wrapper">
          {/* Order Header Section */}
          <div className="details-header">
            <div className="header-content">
              <h1>Order #{order._id.slice(-8).toUpperCase()}</h1>
              <p className="order-date">
                Ordered on {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div className="status-section">
              <span className={`status-badge status-${order.status || 'pending'}`}>
                {(order.status || 'pending').charAt(0).toUpperCase() + (order.status || 'pending').slice(1)}
              </span>
            </div>
          </div>

          <div className="details-grid">
            {/* Left Column - Order Items */}
            <div className="details-left">
              <div className="section order-items-section">
                <h2>📦 Order Items</h2>
                <div className="items-list">
                  {order.orderItems && order.orderItems.map((item, idx) => (
                    <div key={idx} className="order-item">
                      {item.product?.images && (
                        <div className="item-image-container">
                          <img
                            src={item.product.images[0]?.url || item.product.images[0]}
                            alt={item.product?.name}
                            className="item-image"
                          />
                        </div>
                      )}
                      <div className="item-info">
                        <h3>{item.product?.name}</h3>
                        <p className="item-description">
                          {item.product?.description?.substring(0, 60)}...
                        </p>
                        <div className="item-meta">
                          <span className="qty">Qty: {item.qty}</span>
                          <span className="price">₹{item.price.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="item-total">
                        ₹{(item.price * item.qty).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="section shipping-section">
                <h2>📍 Shipping Address</h2>
                <div className="address-card">
                  <p className="address">
                    {order.shippingAddress?.address}
                  </p>
                  <p className="city-postal">
                    {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}
                  </p>
                  <p className="country">{order.shippingAddress?.country}</p>
                </div>
              </div>

              {/* Customer/Ordered Person */}
              <div className="section customer-section">
                <h2>👤 Ordered By</h2>
                <div className="person-card">
                  <div className="person-header">
                    <h4>{order.user?.name}</h4>
                    <p className="email">{order.user?.email}</p>
                  </div>
                  {order.user?.addresses && order.user.addresses.length > 0 && (
                    <div className="person-address">
                      <p className="label">Registered Address:</p>
                      <p className="address-text">
                        {order.user.addresses[0].address}
                      </p>
                      <p className="city-postal">
                        {order.user.addresses[0].city}, {order.user.addresses[0].postalCode}
                      </p>
                      <p className="country">{order.user.addresses[0].country}</p>
                    </div>
                  )}
                </div>
              </div>

              
            </div>

            {/* Right Column - Order Summary & Info */}
            <div className="details-right">
              {/* Price Summary */}
              <div className="section price-summary">
                <h2>💰 Order Summary</h2>
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>₹{order.itemsPrice?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping:</span>
                  <span className="shipping-free">FREE</span>
                </div>
                <div className="summary-row">
                  <span>Tax:</span>
                  <span>₹{order.taxPrice?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="summary-row total">
                  <span>Total Amount:</span>
                  <span>₹{order.totalPrice?.toFixed(2) || '0.00'}</span>
                </div>
              </div>

              {/* Payment Info */}
              <div className="section payment-info">
                <h2>💳 Payment Information</h2>
                <div className="info-row">
                  <span className="label">Payment Method:</span>
                  <span className="value">
                    {order.paymentMethod === 'cod' ? 'Cash on Delivery' :
                     order.paymentMethod === 'card' ? 'Credit/Debit Card' :
                     order.paymentMethod === 'upi' ? 'UPI' :
                     order.paymentMethod}
                  </span>
                </div>
                <div className="info-row">
                  <span className="label">Payment Status:</span>
                  <span className={`value paid-status ${order.isPaid ? 'paid' : 'unpaid'}`}>
                    {order.isPaid ? '✓ Paid' : '⏳ Pending'}
                  </span>
                </div>
                {order.paidAt && (
                  <div className="info-row">
                    <span className="label">Paid on:</span>
                    <span className="value">
                      {new Date(order.paidAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Order Status Timeline */}
              <div className="section status-timeline">
                <h2>📋 Order Status</h2>
                <div className="timeline">
                  <div className={`timeline-item ${['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].indexOf(order.status || 'pending') >= 0 ? 'active' : ''}`}>
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <h4>Order Placed</h4>
                      <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className={`timeline-item ${['confirmed', 'shipped', 'delivered'].indexOf(order.status || 'pending') >= 0 ? 'active' : ''}`}>
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <h4>Confirmed</h4>
                      <p>Processing your order</p>
                    </div>
                  </div>
                  <div className={`timeline-item ${['shipped', 'delivered'].indexOf(order.status || 'pending') >= 0 ? 'active' : ''}`}>
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <h4>Shipped</h4>
                      <p>On the way to you</p>
                    </div>
                  </div>
                  <div className={`timeline-item ${order.status === 'delivered' ? 'active' : ''}`}>
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <h4>Delivered</h4>
                      <p>Order completed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
