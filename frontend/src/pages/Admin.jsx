import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './Admin.css'
import { api } from '../api'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const rawUser = localStorage.getItem('user')
  const user = rawUser ? JSON.parse(rawUser) : null
  const [activeTab, setActiveTab] = useState('overview')
  
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalProducts: 0,
  })
  
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  const [products, setProducts] = useState([])
  
  const [loading, setLoading] = useState(true)
  const [statsLoading, setStatsLoading] = useState(false)
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [usersLoading, setUsersLoading] = useState(false)
  const [productsLoading, setProductsLoading] = useState(false)
  
  const [error, setError] = useState(null)
  const [statsError, setStatsError] = useState(null)
  
  // Track if data has been fetched to prevent redundant requests
  const hasFetched = useRef(false)

  // Check if user is admin
  useEffect(() => {
    if (!token || !user || user.role !== 'admin') {
      navigate('/login')
    } else {
      setLoading(false)
      // Only fetch once on mount
      if (!hasFetched.current) {
        hasFetched.current = true
        fetchDashboardData()
      }
    }
  }, [])

  // Fetch stats on mount
  const fetchDashboardStats = async () => {
    setStatsLoading(true)
    setStatsError(null)
    try {
      const data = await api.getDashboardStats()
      setStats(data)
    } catch (err) {
      console.error('Error fetching stats:', err)
      setStatsError(err.message || 'Failed to fetch statistics')
    } finally {
      setStatsLoading(false)
    }
  }

  // Fetch all orders
  const fetchAllOrders = async () => {
    setOrdersLoading(true)
    setError(null)
    try {
      const data = await api.getAllOrders()
      setOrders(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Error fetching orders:', err)
      setError(err.message || 'Failed to fetch orders')
      setOrders([])
    } finally {
      setOrdersLoading(false)
    }
  }

  // Fetch all users
  const fetchAllUsers = async () => {
    setUsersLoading(true)
    setError(null)
    try {
      const data = await api.getAllUsers()
      setUsers(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Error fetching users:', err)
      setError(err.message || 'Failed to fetch users')
      setUsers([])
    } finally {
      setUsersLoading(false)
    }
  }

  // Fetch all products
  const fetchAllProducts = async () => {
    setProductsLoading(true)
    setError(null)
    try {
      const data = await api.getAllProducts()
      setProducts(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Error fetching products:', err)
      setError(err.message || 'Failed to fetch products')
      setProducts([])
    } finally {
      setProductsLoading(false)
    }
  }

  // Main data fetch function - fetch all concurrently for better performance
  const fetchDashboardData = async () => {
    try {
      const [statsData, ordersData, usersData, productsData] = await Promise.allSettled([
        (async () => {
          setStatsLoading(true)
          const data = await api.getDashboardStats()
          setStats(data)
          return data
        })(),
        (async () => {
          setOrdersLoading(true)
          const data = await api.getAllOrders()
          setOrders(Array.isArray(data) ? data : [])
          return data
        })(),
        (async () => {
          setUsersLoading(true)
          const data = await api.getAllUsers()
          setUsers(Array.isArray(data) ? data : [])
          return data
        })(),
        (async () => {
          setProductsLoading(true)
          const data = await api.getAllProducts()
          setProducts(Array.isArray(data) ? data : [])
          return data
        })(),
      ])
      setStatsLoading(false)
      setOrdersLoading(false)
      setUsersLoading(false)
      setProductsLoading(false)
      
      if (statsData.status === 'rejected') {
        console.error('Error fetching stats:', statsData.reason)
        setStatsError(statsData.reason?.message || 'Failed to fetch statistics')
      }
      if (ordersData.status === 'rejected') {
        console.error('Error fetching orders:', ordersData.reason)
        setError(ordersData.reason?.message || 'Failed to fetch orders')
      }
      if (usersData.status === 'rejected') {
        console.error('Error fetching users:', usersData.reason)
        setError(usersData.reason?.message || 'Failed to fetch users')
      }
      if (productsData.status === 'rejected') {
        console.error('Error fetching products:', productsData.reason)
        setError(productsData.reason?.message || 'Failed to fetch products')
      }
    } catch (err) {
      console.error('Error in fetchDashboardData:', err)
      setError('Failed to load dashboard data')
    }
  }

  // Fetch data when tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab)
    if (tab === 'overview' && orders.length === 0) {
      fetchAllOrders()
    } else if (tab === 'orders' && orders.length === 0) {
      fetchAllOrders()
    } else if (tab === 'users' && users.length === 0) {
      fetchAllUsers()
    } else if (tab === 'products' && products.length === 0) {
      fetchAllProducts()
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  if (loading) {
    return <div className="loading">🔄 Loading Admin Dashboard...</div>
  }

  return (
    <div className="admin-container">
      {/* Admin Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
          <p className="welcome-text">Welcome, {user?.name}</p>
        </div>

        <nav className="admin-nav">
          <button
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => handleTabChange('overview')}
          >
            📊 Dashboard
          </button>
          <button
            className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => handleTabChange('orders')}
          >
            📦 Orders
          </button>
          <button
            className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => handleTabChange('users')}
          >
            👥 Users
          </button>
          <button
            className={`nav-item ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => handleTabChange('products')}
          >
            🛍️ Products
          </button>
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </aside>

      {/* Admin Content */}
      <main className="admin-content">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="tab-content">
            <h1>Dashboard Overview</h1>
            
            {/* Stats Grid */}
            {statsLoading ? (
              <div className="loading-section">⏳ Loading statistics...</div>
            ) : statsError ? (
              <div className="error-message">❌ {statsError}</div>
            ) : (
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>Total Orders</h3>
                  <p className="stat-value">{stats.totalOrders || 0}</p>
                </div>
                <div className="stat-card">
                  <h3>Total Revenue</h3>
                  <p className="stat-value">₹{(stats.totalRevenue || 0).toFixed(2)}</p>
                </div>
                <div className="stat-card">
                  <h3>Total Users</h3>
                  <p className="stat-value">{stats.totalUsers || 0}</p>
                </div>
                <div className="stat-card">
                  <h3>Total Products</h3>
                  <p className="stat-value">{stats.totalProducts || 0}</p>
                </div>
              </div>
            )}

            {/* Recent Orders */}
            {orders.length > 0 && (
              <div className="recent-section">
                <h2>Recent Orders</h2>
                {ordersLoading ? (
                  <div className="loading-section">⏳ Loading orders...</div>
                ) : (
                  <div className="table-responsive">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Customer</th>
                          <th>Items</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.slice(0, 5).map((order) => (
                          <tr key={order._id}>
                            <td>{order._id?.substring(0, 8) || 'N/A'}</td>
                            <td>{order.user?.name || 'Unknown'}</td>
                            <td>{order.orderItems?.length || 0}</td>
                            <td>₹{(order.totalPrice || 0).toFixed(2)}</td>
                            <td>
                              <span className={`status-badge status-${order.paymentStatus || 'pending'}`}>
                                {order.paymentStatus || 'Pending'}
                              </span>
                            </td>
                            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="tab-content">
            <h1>All Orders</h1>
            {ordersLoading ? (
              <div className="loading-section">⏳ Loading orders...</div>
            ) : error ? (
              <div className="error-message">❌ {error}</div>
            ) : orders.length > 0 ? (
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Items</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id}>
                        <td>{order._id?.substring(0, 8) || 'N/A'}</td>
                        <td>{order.user?.name || 'Unknown'}</td>
                        <td>{order.orderItems?.length || 0}</td>
                        <td>₹{(order.totalPrice || 0).toFixed(2)}</td>
                        <td>
                          <span className={`status-badge status-${order.paymentStatus || 'pending'}`}>
                            {order.paymentStatus || 'Pending'}
                          </span>
                        </td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="no-data">📭 No orders found</p>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="tab-content">
            <h1>All Users</h1>
            {usersLoading ? (
              <div className="loading-section">⏳ Loading users...</div>
            ) : error ? (
              <div className="error-message">❌ {error}</div>
            ) : users.length > 0 ? (
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Joined Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id}>
                        <td>{u.name || 'N/A'}</td>
                        <td>{u.email || 'N/A'}</td>
                        <td>
                          <span className={`role-badge role-${u.role}`}>
                            {u.role || 'user'}
                          </span>
                        </td>
                        <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="no-data">👥 No users found</p>
            )}
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="tab-content">
            <h1>All Products</h1>
            {productsLoading ? (
              <div className="loading-section">⏳ Loading products...</div>
            ) : error ? (
              <div className="error-message">❌ {error}</div>
            ) : products.length > 0 ? (
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Seller</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product._id}>
                        <td>{product.name || 'N/A'}</td>
                        <td>{product.category || 'N/A'}</td>
                        <td>₹{(product.price || 0).toFixed(2)}</td>
                        <td>{product.countInStock || 0}</td>
                        <td>{product.seller?.name || 'Unknown'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="no-data">🛍️ No products found</p>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
