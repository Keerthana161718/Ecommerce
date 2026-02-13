# Admin Dashboard - Quick Start Guide

## 🚀 Quick Setup (3 Steps)

### Step 1: Create Admin User

Run this command in your backend folder:

```bash
cd backend
node scripts/createAdmin.js
```

✅ This creates an admin account:
- **Email**: admin@example.com
- **Password**: admin123

### Step 2: Start Your Servers

Terminal 1 - Backend:
```bash
cd backend
npm start
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

### Step 3: Login & Access Admin Dashboard

1. Go to your app (e.g., http://localhost:5173)
2. Click **Login**
3. Enter:
   - Email: `admin@example.com`
   - Password: `admin123`
4. Click **Admin** link in header (pink button)

---

## 📊 Admin Dashboard Features

### Dashboard Overview
- **Total Orders**: See all orders placed
- **Total Revenue**: Track total money earned
- **Total Users**: Count of all registered users
- **Total Products**: Count of products in inventory
- **Recent Orders**: Last 5 orders at a glance

### Orders Management
- View all orders in a table
- See order IDs, customers, amounts, status
- Filter and sort orders
- Update order status

### User Management
- View all registered users
- See user roles (admin, user, seller)
- Delete users if needed
- Track user signup dates

### Product Management
- View all products in catalog
- See categories, prices, stock levels
- View seller information
- Delete products if needed

---

## 🔐 Security Features

The admin dashboard includes:
- ✅ Role-based access control (only admins can access)
- ✅ JWT token authentication
- ✅ Protected API endpoints
- ✅ Automatic logout on invalid token
- ✅ Redirect to login if not authenticated

---

## 📱 Responsive Design

The admin dashboard works on:
- 💻 **Desktop**: Full horizontal navigation + content
- 📱 **Tablet**: Responsive grid layout (768px)
- 📱 **Mobile**: Optimized vertical layout (480px)

---

## 🎨 Admin Dashboard Layout

```
┌─────────────────────────────────────────┐
│           Header (with Admin link)      │
├──────────┬──────────────────────────────┤
│          │                              │
│ Sidebar  │      Admin Content           │
│          │     (Tables & Charts)        │
│          │                              │
│          │                              │
└──────────┴──────────────────────────────┘
```

**Sidebar Navigation:**
- 📊 Dashboard (Overview & stats)
- 📦 Orders
- 👥 Users
- 🛍️ Products

---

## 🔧 Creating More Admins

To make another user an admin:

### Method 1: MongoDB UI
1. Open MongoDB Atlas → Collections
2. Find the user in `users` collection
3. Update their `role` field to `"admin"`
4. User will be admin after next login

### Method 2: MongoDB Shell
```bash
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { role: "admin" } }
)
```

### Method 3: Edit Script
Modify `backend/scripts/createAdmin.js`:
- Change email address
- Change password if desired
- Run: `node scripts/createAdmin.js`

---

## 🛠️ API Endpoints

All endpoints require `Authorization: Bearer <token>` header with admin role.

```
GET  /api/admin/orders       → Get all orders
GET  /api/admin/users        → Get all users
GET  /api/admin/products     → Get all products
GET  /api/admin/stats        → Get dashboard stats
PUT  /api/admin/orders/:id   → Update order status
DELETE /api/admin/users/:id  → Delete user
DELETE /api/admin/products/:id → Delete product
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| No Admin button showing | Make sure user role is `admin` in DB, then logout/login |
| 403 Forbidden error | User must have `role: "admin"` in database |
| No data showing | Check backend is running, verify API calls in browser console |
| Can't login | Verify email/password, check user exists in DB |
| Dashboard blank | Clear browser cache, check network tab for API errors |

---

## 📂 Project Structure

```
backend/
├── controllers/
│   └── adminController.js       (Admin logic)
├── middleware/
│   └── adminMiddleware.js       (Auth & role checking)
├── routes/
│   └── adminRoutes.js           (Admin endpoints)
└── scripts/
    └── createAdmin.js           (Create admin user script)

frontend/
└── src/
    └── pages/
        ├── Admin.jsx            (Admin dashboard page)
        └── Admin.css            (Admin styles)
```

---

## 🌐 Environment Variables

Make sure these are set in `backend/.env`:
```
PORT=8080
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

For frontend, `frontend/.env` (optional):
```
VITE_API_URL=your_backend_url
```

---

## 🚀 Deployment Tips

When deploying to Render/Netlify:

1. **Create admin before deploying**:
   ```bash
   node scripts/createAdmin.js
   ```

2. **Set environment variables** on hosting platform:
   - MONGO_URI
   - JWT_SECRET
   - EMAIL credentials (if using)

3. **Test admin access** after deployment

4. **Change default password** immediately:
   - Login as admin@example.com
   - Change password in your DB or via API

---

## 📚 More Information

- [Full Admin Setup Guide](./ADMIN_SETUP_GUIDE.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- Backend documentation in `backend/`
- Frontend components in `frontend/src/pages/`

---

## ❓ Need Help?

1. Check browser console for errors (F12)
2. Check backend server logs
3. Verify MongoDB connection
4. Read the full guides above
5. Check that all dependencies are installed

---

## 🎉 You're Ready!

Your admin dashboard is now set up and ready to use. Start managing your e-commerce platform! 🚀
