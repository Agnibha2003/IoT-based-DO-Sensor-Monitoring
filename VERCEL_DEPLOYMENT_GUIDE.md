# 🚀 VERCEL DEPLOYMENT - Step-by-Step Guide

**Your backend is live! Now let's deploy the frontend to Vercel.**

Backend URL: `https://do-sensor-backend.onrender.com` ✅

---

## ⏱️ Expected Time: 5 minutes

---

## STEP 1️⃣: Go to Vercel

Open your browser:
```
https://vercel.com
```

---

## STEP 2️⃣: Sign In with GitHub

1. Click **"Log in"** or **"Sign Up"** (top right)
2. Click **"Continue with GitHub"**
3. Authorize Vercel to access your GitHub account
4. You'll be taken to the Vercel dashboard

---

## STEP 3️⃣: Import Your Project

1. Click **"Add New..."** button (top right)
2. Select **"Project"** from dropdown
3. You'll see "Import Git Repository"

### Find Your Repository:

1. Look for the search box under "Import Git Repository"
2. Type: `IoT-based-DO-Sensor-Monitoring`
3. Your repository should appear in the list
4. Click **"Import"** button next to it

---

## STEP 4️⃣: Configure Project Settings

You'll see a configuration page. Fill in these EXACT values:

### Project Name:
```
do-sensor-dashboard
(or leave default, Vercel will auto-generate)
```

### Framework Preset:
```
Should auto-detect: Vite
If not, select: Vite
```

### Root Directory:
```
IMPORTANT! Click "Edit" and change to:
frontend/
(exactly "frontend/" with trailing slash)
```

### Build and Output Settings:
```
Build Command:         npm run build
Output Directory:      dist
Install Command:       npm install

(These should be auto-filled, but verify them)
```

---

## STEP 5️⃣: Add Environment Variable

**This is CRITICAL!** Before deploying:

1. Scroll down to **"Environment Variables"** section
2. Click to expand it
3. Add a new variable:

```
Name:    VITE_API_BASE
Value:   https://do-sensor-backend.onrender.com/api
```

**Make sure you include "/api" at the end!**

4. Click **"Add"**

You should see:
```
✓ VITE_API_BASE = https://do-sensor-backend.onrender.com/api
```

---

## STEP 6️⃣: Deploy!

1. Click the big **"Deploy"** button at the bottom
2. You'll see the build process start
3. Watch the logs (it's automatic, just wait)

Build process shows:
```
Running Build Command...
npm run build
Building...
Collecting files...
✓ Build Completed
```

**Wait 2-3 minutes** for deployment to complete.

---

## STEP 7️⃣: Get Your Frontend URL

Once deployed, you'll see:
```
🎉 Congratulations!
Your project has been deployed
```

Your frontend URL will be shown (something like):
```
https://do-sensor-dashboard.vercel.app
or
https://do-sensor-dashboard-xyz123.vercel.app
```

**Copy this URL!** You need it for the next step.

---

## STEP 8️⃣: Update Backend CORS

Now you need to tell the backend to accept requests from your frontend:

1. Go back to **Render Dashboard** (https://dashboard.render.com)
2. Click on **"do-sensor-backend"** service
3. Click **"Environment"** (left sidebar)
4. Find **"CORS_ORIGIN"** variable
5. Click **"Edit"** or add new if not exists:
   ```
   Name:  CORS_ORIGIN
   Value: https://your-vercel-url.vercel.app
   ```
   (Replace with YOUR actual Vercel URL from Step 7)
6. Click **"Save Changes"**

The backend will **auto-redeploy** (takes 1-2 minutes).

---

## STEP 9️⃣: Test Your Dashboard

1. Open your Vercel URL in browser:
   ```
   https://your-vercel-url.vercel.app
   ```

2. You should see the **Login/Register page** 

3. Open browser console (Press F12)
   - Should see **NO CORS errors**
   - Should see **NO API connection errors**

---

## STEP 🔟: Create Your First User

1. Click **"Register"** tab
2. Fill in:
   ```
   Email:    test@example.com
   Password: Test123!
   ```
3. Click **"Register"**
4. Should redirect to dashboard after successful registration

---

## ✅ SUCCESS CHECKLIST

Verify these:

- [ ] Frontend loads at your Vercel URL
- [ ] No CORS errors in browser console (F12)
- [ ] Can see Login/Register page
- [ ] Can register a new user
- [ ] Can login with registered user
- [ ] Dashboard loads after login
- [ ] No connection errors

**If all checked ✓, your full stack app is LIVE!** 🎉

---

## 🐛 Troubleshooting

### Dashboard shows blank page
- Check browser console (F12) for errors
- Verify VITE_API_BASE is set correctly in Vercel
- Try hard refresh: Ctrl+Shift+R

### CORS errors in console
```
Access to fetch at 'https://do-sensor-backend.onrender.com/api/...' has been blocked by CORS policy
```
**Fix:**
- Go to Render → do-sensor-backend → Environment
- Update CORS_ORIGIN to match your Vercel URL EXACTLY
- Save and wait for redeploy

### Can't login/register
- Check if backend is running: https://do-sensor-backend.onrender.com/api/health
- Verify VITE_API_BASE has "/api" at the end
- Check browser console for specific error

### Build fails on Vercel
- Check "Root Directory" is set to: `frontend/`
- Verify Build Command is: `npm run build`
- Check deployment logs for specific error

---

## 📋 Quick Reference

| Service | URL | Purpose |
|---------|-----|---------|
| **Backend** | https://do-sensor-backend.onrender.com | API Server |
| **Frontend** | https://your-url.vercel.app | Dashboard |
| **Health Check** | https://do-sensor-backend.onrender.com/api/health | Test backend |

---

## 🎯 After Deployment

### Configure Your Raspberry Pi

Update your Pi script with these values:

```python
API_BASE = "https://do-sensor-backend.onrender.com/api"
EMAIL = "your-email@example.com"  # From registration
PASSWORD = "your-password"
```

Run your sensor script, and data will appear in the dashboard!

---

## 🔄 Future Updates

**To update frontend:**
1. Make changes to code
2. Push to GitHub
3. Vercel auto-deploys (no manual action needed!)

**To update backend:**
1. Make changes to code
2. Push to GitHub
3. Render auto-deploys (no manual action needed!)

---

## 🎉 CONGRATULATIONS!

You now have a **fully deployed IoT Dashboard**:
- ✅ Backend API on Render
- ✅ PostgreSQL database
- ✅ Frontend on Vercel
- ✅ Ready for real-time sensor data
- ✅ Accessible from anywhere
- ✅ Free hosting!

---

**Start deploying now! Follow each step carefully and you'll be done in 5 minutes!** 🚀
