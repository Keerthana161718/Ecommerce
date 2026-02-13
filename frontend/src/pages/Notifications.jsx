import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'
import './Notifications.css'

export default function Notifications() {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (!user._id || user.role !== 'seller') {
      setError('Only sellers can access notifications')
      setLoading(false)
      return
    }
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.getNotifications()
      setNotifications(data || [])
    } catch (err) {
      console.error('Error fetching notifications:', err)
      setError(err.message || 'Failed to fetch notifications')
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (notificationId) => {
    try {
      await api.markNotificationAsRead(notificationId)
      setNotifications(prev =>
        prev.map(n =>
          n._id === notificationId ? { ...n, isRead: true } : n
        )
      )
    } catch (err) {
      console.error('Error marking as read:', err)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await api.markAllAsRead()
      setNotifications(prev =>
        prev.map(n => ({ ...n, isRead: true }))
      )
    } catch (err) {
      console.error('Error marking all as read:', err)
    }
  }

  const handleNavigateToOrder = (orderId) => {
    navigate(`/order-details/${orderId}`)
  }

  if (loading) {
    return <div className="notifications-page"><p className="center">Loading...</p></div>
  }

  if (error) {
    return (
      <div className="notifications-page error-container">
        <div className="error-card">
          <h2>Error</h2>
          <p>{error}</p>
          <button className="btn primary" onClick={() => navigate('/seller')}>
            Go to Seller Dashboard
          </button>
        </div>
      </div>
    )
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <div className="notifications-page">
      <div className="container">
        <div className="notifications-wrapper">
          <div className="notifications-header">
            <h1>🔔 Notifications</h1>
            <p>You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>
            {unreadCount > 0 && (
              <button className="btn btn-mark-all" onClick={handleMarkAllAsRead}>
                Mark all as read
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="empty-state">
              <h3>No notifications yet</h3>
              <p>When customers place orders, you'll see notifications here</p>
            </div>
          ) : (
            <div className="notifications-list">
              {notifications.map(notification => (
                <div
                  key={notification._id}
                  className={`notification-card ${!notification.isRead ? 'unread' : 'read'}`}
                >
                  <div className="notification-content">
                    <div className="notification-header">
                      <div className="notification-info">
                        <h3 className="notification-title">
                          {notification.type === 'order_placed' ? '📦 New Order Placed' : '📝 Order Update'}
                        </h3>
                        <p className="notification-message">{notification.message}</p>
                      </div>
                      {!notification.isRead && (
                        <span className="unread-badge">New</span>
                      )}
                    </div>

                    <div className="notification-details">
                      <div className="detail-item">
                        <span className="label">Customer:</span>
                        <span className="value">{notification.customerName}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Email:</span>
                        <span className="value">{notification.customerEmail}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Products:</span>
                        <span className="value">{notification.productNames.join(', ')}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Time:</span>
                        <span className="value">
                          {new Date(notification.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="notification-actions">
                      <button
                        className="btn btn-view"
                        onClick={() => handleNavigateToOrder(notification.orderId._id)}
                      >
                        View Order
                      </button>
                      {!notification.isRead && (
                        <button
                          className="btn btn-mark"
                          onClick={() => handleMarkAsRead(notification._id)}
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
