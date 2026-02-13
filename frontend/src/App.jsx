import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Register from './pages/Register'
import Seller from './pages/Seller'
import SellerOrders from './pages/SellerOrders'
import Notifications from './pages/Notifications'
import Wishlist from './pages/Wishlist'
import OrderSuccess from './pages/OrderSuccess'
import Payment from './pages/Payment'
import Admin from './pages/Admin'
import Profile from './pages/Profile'
import MyOrders from './pages/MyOrders'
import OrderDetails from './pages/OrderDetails'

export default function App() {
  return (
    <div>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/order-details/:orderId" element={<OrderDetails />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/seller" element={<Seller />} />
          <Route path="/seller-orders" element={<SellerOrders />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </div>
  )
}
