import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Header.css'
import { api } from '../api'

export default function Header(){
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [cartCount, setCartCount] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const token = localStorage.getItem('token')
  const rawUser = localStorage.getItem('user')
  const user = rawUser ? JSON.parse(rawUser) : null

  useEffect(()=>{
    // try to fetch cart count if logged in
    if(token){
      api.getCart().then(c=>{
        if(c && c.items) setCartCount(c.items.length)
      }).catch(()=>{})
    }
  },[token])

  const handleLogout = ()=>{
    localStorage.removeItem('token')
    setSidebarOpen(false)
    navigate('/')
  }

  const onSearch = (e)=>{
    e.preventDefault()
    navigate(`/?q=${encodeURIComponent(query)}`)
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  return (
    <header className="site-header">
      <div className="container" style={{display:'flex',alignItems:'center',gap:'1rem'}}>
        <div style={{display:'flex',alignItems:'center',gap:'.6rem',flex:1}}>
          <button className="hamburger-btn" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle menu">
            <span className={`hamburger ${sidebarOpen ? 'active' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
          <Link to="/" className="brand">
            <span className="logo-badge">K</span>
            Demo Shop
          </Link>
        </div>

        <form onSubmit={onSearch} className="search-form">
          <input aria-label="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search for products, brands and more" style={{padding:'.6rem 1rem',width:'100%',borderRadius:6,border:'1px solid #e6eefb'}} />
        </form>

        <nav className="desktop-nav">
          {/* Only show cart/wishlist/profile and other protected links when authenticated */}
          {token ? (
            <>
              <Link to="/cart" className="nav-icon"> 
                <span className="icon">🛒</span>
                <span className="nav-text">Cart{cartCount>0?` (${cartCount})`:''}</span>
              </Link>
              <Link to="/wishlist" className="nav-icon" style={{marginLeft:12}}>
                <span className="icon">♡</span>
                <span className="nav-text">Wishlist</span>
              </Link>
              <Link to="/profile" className="nav-icon" style={{marginLeft:12}}>
                <span className="icon">👤</span>
                <span className="nav-text">Profile</span>
              </Link>
              <Link to="/my-orders" className="nav-icon" style={{marginLeft:12}}>
                <span className="icon">📦</span>
                <span className="nav-text">My Orders</span>
              </Link>
              {user && user.role === 'seller' && (
                <>
                  <Link to="/notifications" className="nav-icon" style={{marginLeft:12, color:'#667eea'}}>
                    <span className="icon">🔔</span>
                    <span className="nav-text">Notifications</span>
                  </Link>
                  <Link to="/seller" className="nav-icon" style={{marginLeft:12}}>
                    <span className="icon">🏬</span>
                    <span className="nav-text">Seller</span>
                  </Link>
                </>
              )}
              {user && user.role === 'admin' && (
                <Link to="/admin" className="nav-link" style={{marginLeft:12, color:'#667eea', fontWeight:600}}>
                  Admin
                </Link>
              )}
              <button onClick={handleLogout} className="link-like nav-icon" style={{marginLeft:12}}>
                <span className="icon">↩️</span>
                <span className="nav-text">Logout</span>
              </button>
            </>
          ) : (
            /* Not logged in: only show Login/Register */
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="nav-link">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>

      {/* Mobile Sidebar */}
      <div className={`mobile-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <nav className="sidebar-nav">
          {token ? (
            <>
              <Link to="/cart" onClick={closeSidebar} className="nav-icon">
                <span className="icon">🛒</span>
                <span className="nav-text">Cart{cartCount>0?` (${cartCount})`:''}</span>
              </Link>
              <Link to="/wishlist" onClick={closeSidebar} className="nav-icon">
                <span className="icon">♡</span>
                <span className="nav-text">Wishlist</span>
              </Link>
              <Link to="/profile" onClick={closeSidebar} className="nav-icon">
                <span className="icon">👤</span>
                <span className="nav-text">Profile</span>
              </Link>
              <Link to="/my-orders" onClick={closeSidebar} className="nav-icon">
                <span className="icon">📦</span>
                <span className="nav-text">My Orders</span>
              </Link>
              {user && user.role === 'seller' && (
                <>
                  <Link to="/notifications" onClick={closeSidebar} className="nav-icon" style={{color:'#667eea'}}>
                    <span className="icon">🔔</span>
                    <span className="nav-text">Notifications</span>
                  </Link>
                  <Link to="/seller" onClick={closeSidebar} className="nav-icon">
                    <span className="icon">🏬</span>
                    <span className="nav-text">Seller</span>
                  </Link>
                </>
              )}
              {user && user.role === 'admin' && (
                <Link to="/admin" onClick={closeSidebar} className="nav-icon" style={{color:'#667eea', fontWeight:600}}>
                  <span className="icon">⚙️</span>
                  <span className="nav-text">Admin</span>
                </Link>
              )}
              <button onClick={handleLogout} className="link-like sidebar-logout nav-icon"> 
                <span className="icon">↩️</span>
                <span className="nav-text">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={closeSidebar} className="nav-icon">
                <span className="nav-text">Login</span>
              </Link>
              <Link to="/register" onClick={closeSidebar} className="nav-icon">
                <span className="nav-text">Register</span>
              </Link>
            </>
          )}
        </nav>
      </div>

      {/* Overlay */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}
    </header>
  )
}
