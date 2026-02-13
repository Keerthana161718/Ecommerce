import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Profile.css'
import { api } from '../api'

export default function Profile() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const rawUser = localStorage.getItem('user')
  const user = rawUser ? JSON.parse(rawUser) : null

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    role: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  })

  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  })

  // Check authentication and fetch profile
  useEffect(() => {
    if (!token || !user) {
      navigate('/login')
    } else {
      fetchProfile()
    }
  }, [])

  // Fetch user profile from database
  const fetchProfile = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.getUserProfile()
      setProfile({
        name: data.name || '',
        email: data.email || '',
        role: data.role || 'user',
        phone: data.addresses?.[0]?.phone || '',
        address: data.addresses?.[0]?.address || '',
        city: data.addresses?.[0]?.city || '',
        postalCode: data.addresses?.[0]?.postalCode || '',
        country: data.addresses?.[0]?.country || '',
      })
    } catch (err) {
      console.error('Error fetching profile:', err)
      setError(err.message || 'Failed to fetch profile')
    } finally {
      setLoading(false)
    }
  }

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle password changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Update profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    // Validate
    if (!profile.name || !profile.email) {
      setError('Name and email are required')
      return
    }

    try {
      const updateData = {
        name: profile.name,
        email: profile.email,
        addresses: [
          {
            fullName: profile.name,
            phone: profile.phone,
            address: profile.address,
            city: profile.city,
            postalCode: profile.postalCode,
            country: profile.country,
          },
        ],
      }

      // Add password if provided
      if (passwordData.newPassword) {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
          setError('Passwords do not match')
          return
        }
        updateData.password = passwordData.newPassword
      }

      const response = await api.updateUserProfile(updateData)
      setSuccess('Profile updated successfully!')
      setIsEditing(false)
      setPasswordData({ newPassword: '', confirmPassword: '' })

      // Update localStorage
      const updatedUser = { ...user, name: profile.name, email: profile.email }
      localStorage.setItem('user', JSON.stringify(updatedUser))

      // Refresh profile
      setTimeout(fetchProfile, 1000)
    } catch (err) {
      console.error('Error updating profile:', err)
      setError(err.message || 'Failed to update profile')
    }
  }

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  if (loading) {
    return <div className="profile-container"><div className="loading">🔄 Loading profile...</div></div>
  }

  return (
    <div className="profile-container">
      <div className="profile-wrapper">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            <span className="avatar-icon">👤</span>
          </div>
          <div className="profile-info">
            <h1 className="profile-name">{profile.name}</h1>
            <p className="profile-email">{profile.email}</p>
            <span className={`role-badge role-${profile.role}`}>
              {profile.role.toUpperCase()}
            </span>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>

        {/* Alert Messages */}
        {error && <div className="alert alert-error">❌ {error}</div>}
        {success && <div className="alert alert-success">✅ {success}</div>}

        {/* Edit Form */}
        {isEditing ? (
          <div className="profile-form-section">
            <h2>Edit Profile</h2>
            <form onSubmit={handleUpdateProfile} className="profile-form">
              {/* Name and Email Row */}
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Phone and Address Row */}
              <div className="form-row">
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                  />
                </div>
                <div className="form-group">
                  <label>Street Address</label>
                  <input
                    type="text"
                    name="address"
                    value={profile.address}
                    onChange={handleInputChange}
                    placeholder="Enter your address"
                  />
                </div>
              </div>

              {/* City and Postal Code Row */}
              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={profile.city}
                    onChange={handleInputChange}
                    placeholder="Enter your city"
                  />
                </div>
                <div className="form-group">
                  <label>Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={profile.postalCode}
                    onChange={handleInputChange}
                    placeholder="Enter your postal code"
                  />
                </div>
              </div>

              {/* Country Row */}
              <div className="form-row">
                <div className="form-group">
                  <label>Country</label>
                  <input
                    type="text"
                    name="country"
                    value={profile.country}
                    onChange={handleInputChange}
                    placeholder="Enter your country"
                  />
                </div>
              </div>

              {/* Password Section */}
              <div className="password-section">
                <h3>Change Password (Optional)</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Leave blank if you don't want to change"
                    />
                  </div>
                  <div className="form-group">
                    <label>Confirm Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Confirm your new password"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  💾 Save Changes
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setIsEditing(false)
                    fetchProfile()
                    setPasswordData({ newPassword: '', confirmPassword: '' })
                  }}
                >
                  ❌ Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          // Profile Display
          <div className="profile-details-section">
            <h2>Profile Information</h2>
            <div className="profile-grid">
              {/* Basic Info */}
              <div className="profile-card">
                <h3>📋 Basic Information</h3>
                <div className="info-item">
                  <span className="label">Full Name:</span>
                  <span className="value">{profile.name}</span>
                </div>
                <div className="info-item">
                  <span className="label">Email:</span>
                  <span className="value">{profile.email}</span>
                </div>
                <div className="info-item">
                  <span className="label">Account Type:</span>
                  <span className={`value role-badge role-${profile.role}`}>
                    {profile.role.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="profile-card">
                <h3>📞 Contact Information</h3>
                <div className="info-item">
                  <span className="label">Phone:</span>
                  <span className="value">{profile.phone || 'Not provided'}</span>
                </div>
                <div className="info-item">
                  <span className="label">City:</span>
                  <span className="value">{profile.city || 'Not provided'}</span>
                </div>
                <div className="info-item">
                  <span className="label">Country:</span>
                  <span className="value">{profile.country || 'Not provided'}</span>
                </div>
              </div>

              {/* Address Info */}
              <div className="profile-card">
                <h3>📍 Address</h3>
                <div className="info-item">
                  <span className="label">Street:</span>
                  <span className="value">{profile.address || 'Not provided'}</span>
                </div>
                <div className="info-item">
                  <span className="label">Postal Code:</span>
                  <span className="value">{profile.postalCode || 'Not provided'}</span>
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <div className="profile-actions">
              <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                ✏️ Edit Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
