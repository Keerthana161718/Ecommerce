const BASE = import.meta.env.VITE_API_URL || '/api' // default to /api so Vite proxy forwards to backend

async function request(path, options = {}) {
  const headers = options.headers || {}
  const token = localStorage.getItem('token')
  if (token) headers['Authorization'] = `Bearer ${token}`
  
  // If body is NOT FormData, set Content-Type to JSON
  // If body IS FormData, do NOT set Content-Type; browser will set it with boundary
  if(!(options.body instanceof FormData)){
    headers['Content-Type'] = headers['Content-Type'] || 'application/json'
  }

  // ensure path is joined with BASE. If path already starts with BASE, use it as-is
  const url = path.startsWith(BASE) ? path : path.startsWith('/') ? `${BASE}${path}` : `${BASE}/${path}`

  try {
    const res = await fetch(url, { ...options, headers })
    const text = await res.text()
    let data = {}
    try { data = text ? JSON.parse(text) : {} } catch(e) { data = {} }
    
    if (!res.ok) {
      throw data && data.message ? data : { message: data.message || 'Request failed' }
    }
    return res.status === 204 ? {} : data
  } catch (e) {
    // Network errors are TypeError; others are from server
    if (e instanceof TypeError) throw { message: 'Network error or server unreachable' }
    throw e
  }
}

export const api = {
  getProducts: (query = '') => request(`/products${query}`),
  getProduct: (id) => request(`/products/${id}`),
  // createProduct: accept FormData or JSON
  createProduct: (data) => {
    const options = { method: 'POST' }
    // If data is FormData, pass it directly (don't stringify)
    if(data instanceof FormData){
      options.body = data
    } else {
      // If data is JSON, stringify it
      options.body = JSON.stringify(data)
    }
    return request('/products', options)
  },
  login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  getCart: () => request('/cart'),
  addToCart: (data) => request('/cart', { method: 'POST', body: JSON.stringify(data) }),
  removeFromCart: (productId) => request(`/cart/${productId}`, { method: 'DELETE' }),
  // wishlist
  getWishlist: () => request('/wishlist'),
  addToWishlist: (data) => request('/wishlist', { method: 'POST', body: JSON.stringify(data) }),
  removeFromWishlist: (productId) => request(`/wishlist/${productId}`, { method: 'DELETE' }),
  // payment & orders
  processPayment: (data) => request('/orders', { method: 'POST', body: JSON.stringify(data) }),
  getOrders: () => request('/orders/myorders'),
  getOrderDetails: (id) => request(`/orders/${id}`),
  // seller orders
  getSellerOrders: () => request('/orders/seller/orders'),
  confirmOrderItem: (orderId, itemIndex) => request(`/orders/${orderId}/items/${itemIndex}/confirm`, { method: 'PUT' }),
  shipOrderItem: (orderId, itemIndex) => request(`/orders/${orderId}/items/${itemIndex}/ship`, { method: 'PUT' }),
  // seller products
  getSellerProducts: () => request('/products/seller/my-products'),
  updateProductStock: (productId, data) => request(`/products/${productId}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProduct: (productId) => request(`/products/${productId}`, { method: 'DELETE' }),
  // notifications
  getNotifications: () => request('/notifications'),
  getUnreadCount: () => request('/notifications/unread/count'),
  markNotificationAsRead: (id) => request(`/notifications/${id}/read`, { method: 'PUT' }),
  markAllAsRead: () => request('/notifications/all/read', { method: 'PUT' }),
  // user profile
  getUserProfile: () => request('/users/profile'),
  updateUserProfile: (data) => request('/users/profile', { method: 'PUT', body: JSON.stringify(data) }),
  // admin
  getAllOrders: () => request('/admin/orders'),
  getAllUsers: () => request('/admin/users'),
  getAllProducts: () => request('/admin/products'),
  getDashboardStats: () => request('/admin/stats'),
}
