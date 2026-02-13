# Admin Dashboard - Testing Guide

## ✅ Complete Testing Checklist

### 1️⃣ Pre-Flight Checks

- [ ] Backend server running: `npm start` in `/backend`
- [ ] Frontend server running: `npm run dev` in `/frontend`
- [ ] MongoDB connected (check backend logs for "Connected to MongoDB")
- [ ] Admin user created with `node scripts/createAdmin.js`

---

### 2️⃣ Login & Navigation

- [ ] Navigate to http://localhost:5173
- [ ] Click "Login"
- [ ] Enter credentials:
  - Email: `admin@example.com`
  - Password: `admin123`
- [ ] Click "Login"
- [ ] See "Admin" link in header (pink button)
- [ ] Click "Admin" link
- [ ] Admin dashboard loads without errors

---

### 3️⃣ Dashboard Overview Tab

**Check Loading State:**
- [ ] Page shows "🔄 Loading... " initially
- [ ] Loading indicator disappears after data loads
- [ ] Stats show "⏳ Loading statistics..." if stats are slow

**Verify Stats Display:**
- [ ] ✅ "Total Orders" shows a number (0 or more)
- [ ] ✅ "Total Revenue" shows amount (₹0.00 or more)
- [ ] ✅ "Total Users" shows a number
- [ ] ✅ "Total Products" shows a number

**Check Recent Orders:**
- [ ] If orders exist:
  - [ ] Table displays with columns: Order ID, Customer, Items, Amount, Status, Date
  - [ ] Shows up to 5 most recent orders
  - [ ] All data populated correctly
- [ ] If no orders exist:
  - [ ] Shows "No orders found" message (OK to be empty initially)

**Formatting Check:**
- [ ] Numbers format correctly (₹1,000.00)
- [ ] Dates display as MM/DD/YYYY
- [ ] Status badges show with colors

---

### 4️⃣ Orders Tab

**Navigation:**
- [ ] Click "📦 Orders" in sidebar
- [ ] Page shows "⏳ Loading orders..." briefly
- [ ] Orders table appears

**Data Display:**
- [ ] If orders exist:
  - [ ] All orders shown in table
  - [ ] Columns: Order ID, Customer, Items, Amount, Status, Date
  - [ ] Each row has complete data
  - [ ] Status shows as badge with color
- [ ] If no orders:
  - [ ] Shows "📭 No orders found" message

**Interactions:**
- [ ] Scroll table horizontally (if needed on small screens)
- [ ] No console errors

---

### 5️⃣ Users Tab

**Navigation:**
- [ ] Click "👥 Users" in sidebar
- [ ] Page shows "⏳ Loading users..." briefly
- [ ] Users table appears

**Data Display:**
- [ ] If users exist:
  - [ ] All users shown in table
  - [ ] Columns: Name, Email, Role, Joined Date
  - [ ] Shows different roles (admin, user, seller) with colors
  - [ ] Admin user (you) appears in list
  - [ ] All emails are valid
- [ ] If no users:
  - [ ] Shows "👥 No users found"

**Role Badges:**
- [ ] Admin role shows in red/pink
- [ ] User role shows in blue
- [ ] Seller role shows in purple

---

### 6️⃣ Products Tab

**Navigation:**
- [ ] Click "🛍️ Products" in sidebar
- [ ] Page shows "⏳ Loading products..." briefly
- [ ] Products table appears

**Data Display:**
- [ ] If products exist:
  - [ ] All products shown in table
  - [ ] Columns: Product Name, Category, Price, Stock, Seller
  - [ ] Prices format correctly (₹1,500.00)
  - [ ] Stock shows numeric value
  - [ ] Seller name displayed (from populated data)
- [ ] If no products:
  - [ ] Shows "🛍️ No products found"

**Formatting:**
- [ ] Product names complete
- [ ] Categories recognized
- [ ] All prices numeric

---

### 7️⃣ Responsive Design

**Desktop (1024px+):**
- [ ] Sidebar on left (260px fixed width)
- [ ] Content on right (full width)
- [ ] Two-column layout maintained
- [ ] Tables scroll horizontally if needed

**Tablet (768px-1024px):**
- [ ] Layout adapts smoothly
- [ ] Sidebar still visible
- [ ] Tables still readable

**Mobile (480px-768px):**
- [ ] Sidebar converts to tabs
- [ ] Hamburger menu works
- [ ] Tables remain accessible
- [ ] Content readable without horizontal scroll

**Mobile (< 480px):**
- [ ] Everything stacks vertically
- [ ] Text sizes appropriate
- [ ] Touch targets are large enough

---

### 8️⃣ Error Handling

**Test Error Scenarios:**
- [ ] Stop backend server
- [ ] Go to a tab → See error message
- [ ] Error shows: "❌ Failed to fetch [data type]"
- [ ] Can switch tabs without crashing
- [ ] Start backend again and refresh
- [ ] Data loads again successfully

**Null/Missing Data:**
- [ ] If seller name missing → Shows "Unknown"
- [ ] If customer name missing → Shows "Unknown"
- [ ] If price missing → Shows "₹0.00"
- [ ] All N/A fallbacks work

---

### 9️⃣ Logout

- [ ] Click "🚪 Logout" button
- [ ] Redirects to login page
- [ ] Token cleared from localStorage
- [ ] Visiting `/admin` redirects to login

---

### 🔟 Security

**Authentication:**
- [ ] Non-admin users cannot access `/admin`
  - Step: Login as regular user → Click Admin → Redirects to login
- [ ] Without token → Redirects to login
- [ ] Expired token → Shows error, redirects to login

**Data Safety:**
- [ ] User passwords never shown in user table
- [ ] No sensitive data exposed
- [ ] API calls include auth headers

---

## 🧪 Sample Test Data

To fully test with real data, create test data:

### Create Test Order (in MongoDB):
```json
{
  "user": "admin_user_id",
  "items": [{ "product": "product_id", "quantity": 2 }],
  "totalPrice": 2500,
  "paymentStatus": "completed",
  "createdAt": "2024-02-12"
}
```

### Create Test Product:
```json
{
  "name": "Test Product",
  "category": "Electronics",
  "price": 1500,
  "stock": 10,
  "seller": "seller_user_id"
}
```

---

## ✅ Final Verification

When all tests pass:
- ✅ Dashboard loads real data from MongoDB
- ✅ All 4 tabs work correctly
- ✅ Data displays properly formatted
- ✅ Loading states appear
- ✅ Error handling works
- ✅ Mobile responsive
- ✅ Secure (auth required)
- ✅ No console errors
- ✅ Logout works

---

## 🆘 Troubleshooting During Testing

| Issue | Check |
|-------|-------|
| No data showing | Verify MongoDB has data; check backend logs |
| 403 Forbidden | Verify user `role: "admin"` in DB |
| Tables blank | Check Network tab in DevTools for API responses |
| Styles broken | Clear browser cache (Ctrl+Shift+Del) |
| Can't login | Check backend server is running |
| Page doesn't load | Check both servers running, no port conflicts |

---

## 📊 Expected Results

### With Test Data:
- Dashboard shows positive numbers
- Tables show 1+ rows
- All fields populated
- No N/A values except where expected

### Without Test Data:
- Dashboard shows all zeros
- Tables show empty state messages
- No errors in console
- Page still fully functional

---

## 🎯 Success Criteria

✅ You've successfully implemented database integration when:
1. Dashboard loads without errors
2. All stats are real numbers from MongoDB
3. Tables display actual database records
4. Loading states appear during fetches
5. Errors handled gracefully
6. Mobile view works perfectly
7. Logout works
8. Re-login allows access again

---

**You're ready to test!** 🚀 Run through the checklist and verify everything works! 🎉
