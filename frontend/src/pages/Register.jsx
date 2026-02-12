import React, {useState} from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../api'
import './Register.css'

export default function Register(){
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('user')
  const [error, setError] = useState(null)

  const submit = async (e)=>{
    e.preventDefault()
    try{
      const res = await api.register({ name, email, password, role })
      localStorage.setItem('token', res.token)
      localStorage.setItem('user', JSON.stringify({ _id: res._id, name: res.name, email: res.email, role: res.role }))
      navigate('/')
    }catch(err){
      setError(err.message || 'Register failed')
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Create Account</h2>
        <form onSubmit={submit} className="login-form">
          <label>Name</label>
          <input placeholder="Your name" value={name} onChange={e=>setName(e.target.value)} />

          <label>Role</label>
          <select value={role} onChange={e=>setRole(e.target.value)}>
            <option value="user">Buyer</option>
            <option value="seller">Seller</option>
          </select>

          <label>Email</label>
          <input placeholder="example@gmail.com" value={email} onChange={e=>setEmail(e.target.value)} />

          <label>Password</label>
          <input type="password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} />

          <div className="form-footer">
            <div />
            <button className="btn primary" type="submit">Create Account</button>
          </div>

          {error && <p className="error">{error}</p>}
        </form>

        <p className="signup">Already have an account? <Link to="/login">Log in</Link></p>
      </div>
    </div>
  )
}
