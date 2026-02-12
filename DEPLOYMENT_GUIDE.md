# E-Commerce App Deployment Guide

This guide will help you deploy the frontend to **Netlify** and the backend to **Render**.

## Prerequisites

- GitHub account (create one at https://github.com if you don't have it)
- Netlify account (sign up at https://netlify.com)
- Render account (sign up at https://render.com)
- Git installed on your machine

## Step 1: Initialize Git & Push to GitHub

### 1.1 Initialize Git Repository

```bash
cd c:\Users\keert\OneDrive\Desktop\demo
git init
git config user.name "Your Name"
git config user.email "your.email@gmail.com"
```

### 1.2 Stage and Commit

```bash
git add .
git commit -m "Initial commit: Full-stack e-commerce application"
```

### 1.3 Create Repository on GitHub

1. Go to https://github.com/new
2. Create a new repository (e.g., "ecommerce-app")
3. Do NOT initialize with README or .gitignore (we already have them)
4. Click "Create repository"

### 1.4 Push to GitHub

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ecommerce-app.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

---

## Step 2: Deploy Backend to Render

### 2.1 Connect GitHub to Render

1. Go to https://render.com (create account if needed)
2. Click "New +" → "Web Service"
3. Select "Deploy an existing Git repository"
4. Click "Connect GitHub" and authorize Render
5. Find your repository and connect it

### 2.2 Configure Render Deployment

Set these values:

- **Name**: `ecommerce-api` (or your preferred name)
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Root Directory**: `backend` (important!)

### 2.3 Add Environment Variables

In the Render dashboard, add these environment variables:

```
PORT = 8080
NODE_ENV = production
MONGO_URI = your_mongodb_connection_string
JWT_SECRET = your_jwt_secret
CLOUDINARY_NAME = your_cloudinary_name
CLOUDINARY_KEY = your_cloudinary_api_key
CLOUDINARY_SECRET = your_cloudinary_api_secret
EMAIL_USER = your_email@gmail.com
EMAIL_PASS = your_gmail_app_password
```

**⚠️ Important:** Get these values from your `.env` file in the backend folder.

### 2.4 Complete the Deployment

- Click "Create Web Service"
- Render will automatically deploy and give you a URL like `https://ecommerce-api.onrender.com`
- Save this URL (you'll need it for frontend)

---

## Step 3: Deploy Frontend to Netlify

### 3.1 Connect GitHub to Netlify

1. Go to https://netlify.com (create account if needed)
2. Click "Add new site" → "Import an existing project"
3. Select "GitHub"
4. Authorize Netlify to access your GitHub account
5. Select your repository

### 3.2 Configure Netlify Deployment

Set these values:

- **Base directory**: `frontend`
- **Build command**: `npm run build`
- **Publish directory**: `dist`

### 3.3 Add Environment Variables

Before deploying, add your backend API URL:

1. Go to Site settings → Environment
2. Add variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://ecommerce-api.onrender.com/api` (use your Render URL)

### 3.4 Deploy

- Click "Deploy site"
- Netlify will build and deploy your frontend
- You'll get a URL like `https://your-site-name.netlify.app`

---

## Step 4: Update API Calls (Important!)

Make sure your frontend API calls use the environment variable:

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const api = axios.create({
  baseURL: API_URL,
});
```

Check your `frontend/src/api.js` file.

---

## Step 5: Update Netlify Redirect (Optional)

In `netlify.toml`, update this line:

```toml
to = "https://ecommerce-api.onrender.com/api/:splat"
```

Replace with your actual Render URL.

---

## Troubleshooting

### Backend not starting on Render
- Check the logs in Render dashboard
- Ensure `backend/server.js` is configured correctly
- Verify all environment variables are set

### Frontend shows blank page
- Check browser console for API errors
- Verify `VITE_API_URL` is set correctly
- Clear Netlify cache: Site settings → Build & deploy → Clear cache and redeploy

### CORS errors
- Ensure backend's CORS is configured to accept your Netlify domain
- Update `backend/config/cors.js` with your Netlify URL

### MongoDB connection fails
- Ensure `MONGO_URI` is correct
- Whitelist Render's IP in MongoDB Atlas (IP Whitelist)
  - Or allow all IPs (0.0.0.0/0) for testing

---

## Future Deployments

After pushing new code to GitHub:

1. **Backend** (Render): Automatically deploys on push to main
2. **Frontend** (Netlify): Automatically deploys on push to main

Just commit and push to GitHub, and both will update automatically!

```bash
git add .
git commit -m "Your commit message"
git push
```

---

## Useful Commands

```bash
# Check git status
git status

# View remote URL
git remote -v

# Change remote URL (if needed)
git remote set-url origin https://github.com/YOUR_USERNAME/repo.git
```

Good luck with your deployment! 🚀
