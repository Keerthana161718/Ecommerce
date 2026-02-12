import React, { useState, useEffect } from 'react'
import { api } from '../api'
import { useNavigate, Link } from 'react-router-dom'
import './Seller.css'

export default function Seller(){
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [brand, setBrand] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [images, setImages] = useState('')
  const [files, setFiles] = useState(null)
  const [status, setStatus] = useState(null)
  const [allowed, setAllowed] = useState(false)

  useEffect(()=>{
    const token = localStorage.getItem('token')
    const raw = localStorage.getItem('user')
    const user = raw ? JSON.parse(raw) : null
    if(!token){
      setAllowed(false)
      setStatus({ message: 'Please login to access seller dashboard', auth: true })
      return
    }
    if(!user || user.role !== 'seller'){
      setAllowed(false)
      setStatus({ message: 'Only sellers can access this page. Register as a seller.', auth: false })
      return
    }
    setAllowed(true)
    setStatus(null)
  },[])

  const submit = async (e)=>{
    e.preventDefault()
    setStatus('saving')
    try{
      // build FormData to include image files if provided
      const form = new FormData()
      form.append('name', name)
      form.append('brand', brand)
      form.append('price', price)  // do NOT parseFloat; let backend handle casting
      form.append('description', description)
      
      if(files && files.length){
        // files were selected — upload to cloudinary
        for(let i=0;i<files.length;i++) form.append('images', files[i])
      } else if(images.trim()){
        // fallback: user provided URLs instead
        const urls = images.split(',').map(s=>s.trim()).filter(Boolean).map(u=>({ url: u }))
        form.append('images', JSON.stringify(urls))
      }

      await api.createProduct(form)
      setStatus('saved')
      setName('')
      setBrand('')
      setPrice('')
      setDescription('')
      setImages('')
      setFiles(null)
    }catch(err){
      setStatus(err.message || 'Failed')
    }
  }
  if(!allowed){
    return (
      <div className="seller-page access-denied">
        <div className="seller-card">
          <h2>Access Denied</h2>
          <p>{status && status.message}</p>
          {status && status.auth ? (
            <button className="btn primary" onClick={()=>navigate('/login')}>Login</button>
          ) : (
            <Link to="/register"><button className="btn primary">Register as Seller</button></Link>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="seller-page">
      <div className="seller-card">
        <h2>Add New Product</h2>
        <form className="seller-form" onSubmit={submit}>
          <div className="form-group">
            <label>Product Name</label>
            <input 
              placeholder="e.g., Blue Dress" 
              value={name} 
              onChange={e=>setName(e.target.value)} 
              required
            />
          </div>

          <div className="form-group">
            <label>Brand</label>
            <input 
              placeholder="e.g., Nike" 
              value={brand} 
              onChange={e=>setBrand(e.target.value)} 
            />
          </div>

          <div className="form-group">
            <label>Price</label>
            <input 
              type="number" 
              placeholder="e.g., 2500" 
              value={price} 
              onChange={e=>setPrice(e.target.value)} 
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea 
              placeholder="Describe your product..." 
              value={description} 
              onChange={e=>setDescription(e.target.value)}
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>Upload Images (jpg/png/jpeg)</label>
            <input 
              type="file" 
              accept="image/png,image/jpeg,image/jpg" 
              multiple 
              onChange={e=>setFiles(e.target.files)} 
            />
          </div>

          <div className="form-group">
            <label>Or Paste Image URLs (optional)</label>
            <textarea 
              placeholder="https://example.com/image.jpg, https://example.com/image2.jpg" 
              value={images} 
              onChange={e=>setImages(e.target.value)} 
              rows="2"
            />
          </div>

          <button type="submit" className="btn primary" disabled={status === 'saving'}>
            {status === 'saving' ? 'Creating...' : 'Add Product'}
          </button>

          {status === 'saved' && <p className="success">Product created successfully!</p>}
          {status && status !== 'saving' && status !== 'saved' && <p className="error">{status}</p>}
        </form>
      </div>
    </div>
  )
}
