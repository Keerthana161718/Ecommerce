# QUICK START - Admin Dashboard Setup

## 🏃 Get Started in 5 Minutes

### Step 1️⃣: Create Admin User (30 seconds)
```bash
cd backend
node scripts/createAdmin.js
```
✅ Credentials created: `admin@example.com` / `admin123`

### Step 2️⃣: Start Backend (Open Terminal 1)
```bash
cd backend
npm start
```
✅ Backend running on port 8080

### Step 3️⃣: Start Frontend (Open Terminal 2)
```bash
cd frontend
npm run dev
```
✅ Frontend running on http://localhost:5173

### Step 4️⃣: Login
1. Open http://localhost:5173
2. Click **Login**
3. Enter:
   - Email: `admin@example.com`
   - Password: `admin123`
4. Click **Login**

### Step 5️⃣: Access Admin Dashboard
- Click the pink **Admin** button in the header
- You're in! 🎉

---

## 📊 What You Can Do

- **Dashboard Tab**: View stats (orders, revenue, users, products)
- **Orders Tab**: See all orders in a table
- **Users Tab**: See all registered users
- **Products Tab**: See all products in catalog

---

## 🆘 Having Issues?

| Issue | Fix |
|-------|-----|
| Admin button not showing | Logout/login again |
| Cannot login | Check email/password, verify user in MongoDB |
| Dashboard blank | Check backend is running, look at browser console (F12) |
| Can't find `createAdmin.js` | Make sure you're in `backend` folder: `cd backend` |

---

## 📚 Need More Help?

Read these guides:
- **Quick answers**: `ADMIN_README.md`
- **Detailed setup**: `ADMIN_SETUP_GUIDE.md`
- **Full summary**: `ADMIN_IMPLEMENTATION_SUMMARY.md`

---

## ✨ Features

✅ View all orders
✅ View all users  
✅ View all products
✅ Track revenue
✅ See recent orders
✅ Responsive design (mobile friendly)
✅ Secure (JWT authentication)

---

**That's it! You now have a working admin dashboard! 🚀**

Next: Create more admins, customize the dashboard, or deploy to production.
