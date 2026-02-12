import React, {useState} from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../api'
import './Login.css'

export default function Login(){
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState(null)

  const submit = async (e)=>{
    e.preventDefault()
    try{
      const res = await api.login({ email, password })
      localStorage.setItem('token', res.token)
      localStorage.setItem('user', JSON.stringify({ _id: res._id, name: res.name, email: res.email, role: res.role }))
      const params = new URLSearchParams(window.location.search)
      const redirect = params.get('redirect') || '/'
      navigate(redirect)
    }catch(err){
      setError(err.message || 'Login failed')
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Log In</h2>
        <form onSubmit={submit} className="login-form">
          <label>Email</label>
          <input placeholder="example@gmail.com" value={email} onChange={e=>setEmail(e.target.value)} />

          <div className="row-between">
            <label>Password</label>
            <Link to="/forgot" className="forgot">Forgot password?</Link>
          </div>
          <input type="password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} />

          <div className="form-footer">
            <label className="remember">
              <input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)} /> Remember me
            </label>
            <button className="btn primary" type="submit">Log In</button>
          </div>

          {error && <p className="error">{error}</p>}
        </form>

        <p className="signup">Don't have an account? <Link to="/register">Sign up</Link></p>
      </div>
    </div>
  )
}
