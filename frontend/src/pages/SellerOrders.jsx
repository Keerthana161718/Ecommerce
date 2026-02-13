import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'
import './SellerOrders.css'

export default function SellerOrders() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionLoading, setActionLoading] = useState({})

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (!user._id || user.role !== 'seller') {
      setError('Only sellers can access this page')
      setLoading(false)
      return
    }
    fetchSellerOrders()
  }, [])

  const fetchSellerOrders = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.getSellerOrders()
      setOrders(data || [])
    } catch (err) {
      console.error('Error fetching seller orders:', err)
      setError(err.message || 'Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmItem = async (orderId, itemIndex) => {
    const key = `confirm-${orderId}-${itemIndex}`
    setActionLoading(prev => ({ ...prev, [key]: true }))
    try {
      const response = await api.confirmOrderItem(orderId, itemIndex)
      // Update local state with new order data
      setOrders(prevOrders =>
        prevOrders.map(o => (o._id === orderId ? response.order : o))
      )
    } catch (err) {
      alert(err.message || 'Failed to confirm item')
    } finally {
      setActionLoading(prev => ({ ...prev, [key]: false }))
    }
  }

  const handleShipItem = async (orderId, itemIndex) => {
    const key = `ship-${orderId}-${itemIndex}`
    setActionLoading(prev => ({ ...prev, [key]: true }))
    try {
      const response = await api.shipOrderItem(orderId, itemIndex)
      // Update local state with new order data
      setOrders(prevOrders =>
        prevOrders.map(o => (o._id === orderId ? response.order : o))
      )
    } catch (err) {
      alert(err.message || 'Failed to ship item')
    } finally {
      setActionLoading(prev => ({ ...prev, [key]: false }))
    }
  }

  if (loading) {
    return <div className="seller-orders-page"><p className="center">Loading...</p></div>
  }

  if (error) {
    return (
      <div className="seller-orders-page error-container">
        <div className="error-card">
          <h2>Error</h2>
          <p>{error}</p>
          <button className="btn primary" onClick={() => navigate('/')}>
            Go to Home
          </button>
        </div>
      </div>
    )
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="seller-orders-page">
        <div className="empty-state">
          <h2>📦 No Orders Yet</h2>
          <p>Your products haven't been ordered yet</p>
        </div>
      </div>
    )
  }

  return (
    <div className="seller-orders-page">
      <button className="back-btn" onClick={() => navigate('/seller')}>
        ← Back to Seller Dashboard
      </button>

      <div className="container">
        <div className="orders-wrapper">
          <div className="orders-header">
            <h1>🛍️ Orders Management</h1>
            <p>Confirm and ship orders for your products</p>
          </div>

          <div className="orders-list">
            {orders.map(order => (
              <div key={order._id} className="order-card">
                <div className="order-header-info">
                  <div>
                    <h3>Order #{order._id.slice(-8).toUpperCase()}</h3>
                    <p className="customer-info">
                      👤 {order.user?.name} ({order.user?.email})
                    </p>
                    <p className="order-date">
                      📅 {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`order-status status-${order.status}`}>
                    {order.status?.toUpperCase() || 'PENDING'}
                  </span>
                </div>

                {/* Your Items in this Order */}
                <div className="seller-items">
                  <h4>Your Items</h4>
                  {order.orderItems
                    .filter(item => item.seller?._id === JSON.parse(localStorage.getItem('user') || '{}')._id)
                    .map((item, idx) => (
                      <div key={idx} className="item-card">
                        <div className="item-header">
                          <div className="item-info">
                            {item.product?.images && (
                              <img
                                src={item.product.images[0]?.url || item.product.images[0]}
                                alt={item.product?.name}
                                className="item-image"
                              />
                            )}
                            <div className="item-details">
                              <p className="item-name">{item.product?.name}</p>
                              <p className="item-qty">Qty: {item.qty}</p>
                              <p className="item-price">₹{item.price}</p>
                            </div>
                          </div>
                          <span className={`item-status status-${item.status}`}>
                            {item.status?.toUpperCase()}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="item-actions">
                          {item.status === 'pending' && (
                            <button
                              className="btn btn-confirm"
                              onClick={() => handleConfirmItem(order._id, order.orderItems.indexOf(item))}
                              disabled={actionLoading[`confirm-${order._id}-${order.orderItems.indexOf(item)}`]}
                            >
                              ✓ {actionLoading[`confirm-${order._id}-${order.orderItems.indexOf(item)}`] ? 'Confirming...' : 'Confirm Order'}
                            </button>
                          )}

                          {item.status === 'confirmed' && (
                            <button
                              className="btn btn-ship"
                              onClick={() => handleShipItem(order._id, order.orderItems.indexOf(item))}
                              disabled={actionLoading[`ship-${order._id}-${order.orderItems.indexOf(item)}`]}
                            >
                              📦 {actionLoading[`ship-${order._id}-${order.orderItems.indexOf(item)}`] ? 'Shipping...' : 'Mark as Shipped'}
                            </button>
                          )}

                          {item.status === 'shipped' && (
                            <div className="status-message shipped">
                              ✓ Shipped on {item.shippedAt ? new Date(item.shippedAt).toLocaleDateString() : ''}
                            </div>
                          )}

                          {item.status === 'delivered' && (
                            <div className="status-message delivered">
                              ✓ Delivered
                            </div>
                          )}
                        </div>

                        {/* Delivery Address */}
                        {(item.status === 'confirmed' || item.status === 'shipped') && (
                          <div className="delivery-address">
                            <p className="label">📍 Delivery Address:</p>
                            <p>{order.shippingAddress?.address}</p>
                            <p>{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
