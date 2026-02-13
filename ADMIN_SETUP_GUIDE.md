# Admin Dashboard Setup Guide

This guide will help you create an admin user and access the admin dashboard.

## What is the Admin Dashboard?

The admin dashboard is a powerful management interface that allows admins to:
- 📊 View key business metrics (total orders, revenue, users, products)
- 📦 Manage all orders across the platform
- 👥 View and manage all users
- 🛍️ View all products in the system
- 📈 Track platform analytics

## Step 1: Create an Admin User in MongoDB

You can create an admin user either through the registration API or directly in MongoDB.

### Option A: Direct MongoDB (Recommended for first admin)

1. Open MongoDB Atlas (https://www.mongodb.com/cloud/atlas)
2. Go to your cluster and click "Collections"
3. Find the `users` collection
4. Click "Insert Document" and paste:

```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "$2a$10$somehash", // Use a bcrypt hashed password
  "role": "admin",
  "createdAt": {
    "$date": "2026-02-12T00:00:00Z"
  },
  "updatedAt": {
    "$date": "2026-02-12T00:00:00Z"
  }
}
```

⚠️ **Important:** You need to hash the password using bcrypt. 

### Option B: Create Admin via Terminal (Easier)

Run this Node.js script to create an admin user:

```bash
cd backend
node -e "
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    try {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      const admin = await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin'
      });
      
      console.log('✅ Admin user created:', admin.email);
      process.exit(0);
    } catch (err) {
      console.error('❌ Error creating admin:', err.message);
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
"
```

**Admin credentials created:**
- Email: `admin@example.com`
- Password: `admin123`

### Option C: Using a MongoDB Admin Script

Create a file `backend/scripts/createAdmin.js`:

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const adminExists = await User.findOne({ email: 'admin@example.com' });
    
    if (adminExists) {
      console.log('❌ Admin already exists');
      process.exit(1);
    }
    
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin'
    });
    
    console.log('✅ Admin user created successfully');
    console.log('Email:', admin.email);
    console.log('Password: admin123');
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

createAdmin();
```

Then run:
```bash
cd backend
node scripts/createAdmin.js
```

## Step 2: Access the Admin Dashboard

### Login as Admin

1. Go to your application's login page (`/login`)
2. Enter the admin credentials:
   - Email: `admin@example.com`
   - Password: `admin123` (or whatever password you set)
3. Click Login

### Navigate to Admin Dashboard

After login, you'll see a pink **Admin** link in the header (if you're logged in as admin).
- On **Desktop**: The Admin link appears in the top navigation bar
- On **Mobile**: The Admin link appears in the sidebar menu

Click the **Admin** link to access the dashboard.

## Admin Dashboard Features

### 📊 Dashboard Overview Tab
- **Total Orders**: Number of all orders placed
- **Total Revenue**: Sum of all order amounts
- **Total Users**: Number of registered users
- **Total Products**: Number of products in catalog
- **Recent Orders**: Shows last 5 orders with details

### 📦 Orders Tab
View all orders in a table with:
- Order ID (first 8 characters)
- Customer name
- Number of items
- Total amount
- Payment status
- Order date

### 👥 Users Tab
View all registered users with:
- Name
- Email
- Role (user/admin/seller)
- Account creation date

### 🛍️ Products Tab
View all products with:
- Product name
- Category
- Price
- Stock quantity
- Seller information

## API Endpoints for Admin

All admin endpoints require authentication and admin role.

```
GET    /api/admin/orders        - Get all orders
GET    /api/admin/users         - Get all users
GET    /api/admin/products      - Get all products
GET    /api/admin/stats         - Get dashboard statistics
PUT    /api/admin/orders/:id    - Update order status
DELETE /api/admin/users/:id     - Delete a user
DELETE /api/admin/products/:id  - Delete a product
```

**Headers required:**
```
Authorization: Bearer <token>
```

## Creating More Admin Users

To create additional admin users:

1. Navigate to login page
2. Click "Register" (if registration is open)
3. Register with desired credentials
4. Go to MongoDB and update the new user's role to `admin`:

```javascript
db.users.updateOne(
  { email: "newadmin@example.com" },
  { $set: { role: "admin" } }
)
```

## Security Best Practices

⚠️ **Important:**

1. **Change Default Password**: Change the admin password immediately after first login
2. **Secure Credentials**: Never commit `.env` files with passwords to Git
3. **Environment Variables**: Store admin credentials securely in environment variables
4. **Limit Admin Access**: Only create admin users for trusted personnel
5. **Use HTTPS**: Always use HTTPS in production
6. **Database Whitelist**: In MongoDB Atlas, whitelist only your server IP addresses

## Troubleshooting

### Admin button not showing after login
- Verify user role is set to `admin` in MongoDB
- Try logging out and logging back in
- Clear browser cache

### Cannot access admin dashboard (403 Forbidden)
- Ensure you're logged in
- Verify your user role is `admin` in the database
- Check your authentication token is valid

### Admin dashboard shows no data
- Ensure backend server is running
- Check browser console for API errors
- Verify admin routes are properly configured in server.js
- Check that `process.env.MONGO_URI` is correct

### "Admin access required" error
- Your user account doesn't have admin role
- Update your user's role in MongoDB to `admin`

## Example: Create Admin via MongoDB UI

1. Log in to MongoDB Atlas
2. Go to Database → Collections
3. Find `users` collection
4. Click "Insert Document"
5. Paste this JSON (update the date):

```json
{
  "_id": {
    "$oid": "507f1f77bcf86cd799439011"
  },
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "$2a$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "role": "admin",
  "createdAt": {
    "$date": {
      "$numberLong": "1707724800000"
    }
  },
  "updatedAt": {
    "$date": {
      "$numberLong": "1707724800000"
    }
  },
  "__v": 0
}
```

6. Click "Insert"

## Support

If you encounter issues:
1. Check the browser console (F12) for errors
2. Check backend server logs for API errors
3. Verify MongoDB connection is working
4. Ensure all environment variables are set correctly

For more help, check the deployment guide or contact support.

---

🎉 You're all set! Your admin dashboard is ready to use.
