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
          <Link to="/cart">Cart{cartCount>0?` (${cartCount})`:''}</Link>
          <Link to="/wishlist" style={{marginLeft:12}}>Wishlist</Link>
          {token ? (
            <button onClick={handleLogout} className="link-like">Logout</button>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
          {user && user.role === 'seller' && (
            <Link to="/seller" style={{marginLeft:12}}>Seller</Link>
          )}
        </nav>
      </div>

      {/* Mobile Sidebar */}
      <div className={`mobile-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <nav className="sidebar-nav">
          <Link to="/cart" onClick={closeSidebar}>
            Cart{cartCount>0?` (${cartCount})`:''} 
          </Link>
          <Link to="/wishlist" onClick={closeSidebar}>Wishlist</Link>
          {token ? (
            <button onClick={handleLogout} className="link-like sidebar-logout">Logout</button>
          ) : (
            <>
              <Link to="/login" onClick={closeSidebar}>Login</Link>
              <Link to="/register" onClick={closeSidebar}>Register</Link>
            </>
          )}
          {user && user.role === 'seller' && (
            <Link to="/seller" onClick={closeSidebar}>Seller</Link>
          )}
        </nav>
      </div>

      {/* Overlay */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}
    </header>
  )
}
