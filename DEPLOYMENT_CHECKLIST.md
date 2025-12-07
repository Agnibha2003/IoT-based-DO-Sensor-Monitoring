# ☁️ CLOUD DEPLOYMENT CHECKLIST

Use this checklist as you follow the DEPLOY_NOW.md guide to ensure nothing is missed.

---

## 📋 PHASE 1: Prepare for Deployment

- [ ] Read **DEPLOY_NOW.md** completely
- [ ] Have GitHub credentials ready
- [ ] Have a backup of your project (already on GitHub ✓)
- [ ] Note your local Raspberry Pi's configuration

---

## 📋 PHASE 2: Deploy Backend to Render (5 min)

### Render Account & Service Setup
- [ ] Go to render.com
- [ ] Sign in with GitHub
- [ ] Authorize Render to access GitHub
- [ ] Click "New +" → "Web Service"
- [ ] Select IoT-based-DO-Sensor-Monitoring repository
- [ ] Connect repository

### Configure Backend Service
- [ ] Set Name: `do-sensor-backend`
- [ ] Set Root Directory: `backend/`
- [ ] Set Build Command: `npm install`
- [ ] Set Start Command: `npm start`
- [ ] Select Region: `Oregon` (or closest)
- [ ] Select Instance: `Free`
- [ ] Click "Create Web Service"

### Backend Environment Variables
- [ ] Set NODE_ENV = `production`
- [ ] Set JWT_EXPIRY = `24h`
- [ ] Set CORS_ORIGIN = `https://[YOUR-VERCEL-DOMAIN].vercel.app` (update after Step 3)
- [ ] Set BACKEND_PORT = `5000`
- [ ] Set DEVICE_ID = `sensor-001`
- [ ] Set DEVICE_API_KEY = `your-device-api-key`
- [ ] Leave JWT_SECRET blank (Render auto-generates)

### Create PostgreSQL Database
- [ ] Click "New +" → "PostgreSQL"
- [ ] Set Name: `do-sensor-db`
- [ ] Set Region: `Oregon` (same as backend)
- [ ] Set Plan: `Free`
- [ ] Set Datastore Name: `do_sensor_db`
- [ ] Click "Create Database"

### Connect Database to Backend
- [ ] Get Database Connection String from PostgreSQL instance
- [ ] Copy the **Internal Connection String**
- [ ] Go back to Backend service
- [ ] Add environment variable DATABASE_URL
- [ ] Paste connection string
- [ ] Click Save

### Verify Backend Deployment
- [ ] Wait for build to complete (5-10 min)
- [ ] See "✓ Your service is live" message
- [ ] Copy your backend URL: `https://do-sensor-backend.onrender.com`
- [ ] Test health endpoint: `/api/health`
- [ ] Receive JSON response with `{"ok": true}`

**Backend URL:** `_________________________________`

---

## 📋 PHASE 3: Deploy Frontend to Vercel (3 min)

### Vercel Account & Project Setup
- [ ] Go to vercel.com
- [ ] Sign in with GitHub
- [ ] Authorize Vercel to access GitHub
- [ ] Click "Add New" → "Project"
- [ ] Search and select IoT-based-DO-Sensor-Monitoring
- [ ] Import repository

### Configure Frontend Project
- [ ] Project Name: `do-sensor-dashboard`
- [ ] Framework: `Vite`
- [ ] Root Directory: `frontend/`

### Frontend Environment Variables
- [ ] Add VITE_API_BASE = `https://do-sensor-backend.onrender.com/api`
- [ ] (Replace with your actual backend URL from Phase 2)

### Deploy Frontend
- [ ] Click "Deploy"
- [ ] Wait for deployment to complete (2-3 min)
- [ ] See "✓ Deployment complete" message
- [ ] Copy your frontend URL: `https://do-sensor-dashboard.vercel.app`

**Frontend URL:** `_________________________________`

### Update Backend CORS
- [ ] Go back to Render dashboard
- [ ] Open do-sensor-backend service
- [ ] Go to Environment tab
- [ ] Update CORS_ORIGIN = `https://do-sensor-dashboard.vercel.app`
- [ ] Click Save
- [ ] Wait for auto-redeploy (1-2 min)

---

## 📋 PHASE 4: Verify Deployment (2 min)

### Backend Verification
- [ ] Test health endpoint: `https://do-sensor-backend.onrender.com/api/health`
- [ ] Receive `{"ok": true, "time": ...}` response
- [ ] Check browser console for no errors

### Frontend Verification
- [ ] Open: `https://do-sensor-dashboard.vercel.app`
- [ ] See login/register page
- [ ] Open browser console (F12)
- [ ] No CORS errors
- [ ] No network errors

### User Registration Test
- [ ] Click "Register"
- [ ] Enter email: `test@example.com`
- [ ] Enter password: `Test123!`
- [ ] Click Register
- [ ] See success message
- [ ] Account created

### User Login Test
- [ ] Click "Login"
- [ ] Use same credentials
- [ ] Click Login
- [ ] See dashboard page
- [ ] No errors in console

### Database Verification
- [ ] Check that login worked (database query successful)
- [ ] Test data submission (next step)

---

## 📋 PHASE 5: Raspberry Pi Configuration (5 min)

### Update Pi Script
- [ ] Update API_BASE = `https://do-sensor-backend.onrender.com/api`
- [ ] Update EMAIL = `test@example.com`
- [ ] Update PASSWORD = `Test123!`
- [ ] Update DEVICE_ID = `sensor-001`

### Test Pi Connection
- [ ] Run script on Raspberry Pi
- [ ] See "✓ Logged in successfully" message
- [ ] See "✓ Reading sent" messages
- [ ] No connection errors
- [ ] Data sending every 5 minutes

### Verify Data in Dashboard
- [ ] Go back to frontend dashboard
- [ ] Login if needed
- [ ] Check for new data points
- [ ] See charts updating
- [ ] Data appears in real-time

---

## 📋 PHASE 6: Production Readiness

### Performance Testing
- [ ] First page load time (2-3 seconds normal)
- [ ] Chart rendering (smooth)
- [ ] Real-time updates (every 5 seconds)
- [ ] No console errors

### Functionality Testing
- [ ] [ ] User registration works
- [ ] [ ] User login works
- [ ] [ ] Sensor data submission works
- [ ] [ ] Data retrieval works
- [ ] [ ] Charts display correctly
- [ ] [ ] Multiple parameters visible
- [ ] [ ] Responsive design (resize window)
- [ ] [ ] Mobile view works

### Data Persistence
- [ ] [ ] Data persists after page refresh
- [ ] [ ] Data persists after logout/login
- [ ] [ ] Multiple readings accumulate
- [ ] [ ] Historical data is accessible

### Security Verification
- [ ] [ ] Unauthorized requests are blocked
- [ ] [ ] CORS is properly configured
- [ ] [ ] JWT tokens are working
- [ ] [ ] Passwords are hashed

---

## 🎉 PHASE 7: Launch Complete!

- [ ] All tests passing
- [ ] Dashboard is live
- [ ] Real-time data is flowing
- [ ] Raspberry Pi is sending data
- [ ] Team can access dashboard
- [ ] Documentation is complete

### Post-Launch Tasks
- [ ] [ ] Share dashboard URL with team
- [ ] [ ] Set up email notifications (optional)
- [ ] [ ] Configure data retention policy
- [ ] [ ] Plan monitoring strategy
- [ ] [ ] Document API endpoints
- [ ] [ ] Create backup strategy
- [ ] [ ] Monitor free tier usage

---

## 📞 Critical URLs to Save

```
GitHub: https://github.com/Agnibha2003/IoT-based-DO-Sensor-Monitoring
Backend API: https://do-sensor-backend.onrender.com
Frontend Dashboard: https://do-sensor-dashboard.vercel.app
Render Dashboard: https://dashboard.render.com
Vercel Dashboard: https://vercel.com/dashboard
```

---

## ⚠️ Important Reminders

- **Free Tier Spin Down**: Render spins down after 15 min inactivity
  - First request will be slow (30-60 sec)
  - Solution: Keep dashboard open or upgrade

- **Database Size**: PostgreSQL free tier = 256 MB
  - Plan for data archival after ~1 year
  - Monitor database size in Render dashboard

- **Environment Variables**: Keep DEVICE_API_KEY secure
  - Don't share in messages
  - Rotate periodically

- **JWT_SECRET**: Auto-generated by Render
  - Don't change it manually
  - It's unique to your deployment

---

## ✅ Final Verification Command

Run this Python script to verify everything:

```powershell
python verify_deployment.py
```

It will:
- ✓ Check backend health
- ✓ Test user registration
- ✓ Test user login
- ✓ Verify database connection
- ✓ Check CORS configuration
- ✓ Validate frontend access

---

## 🎯 Success Indicators

You'll know deployment is successful when:

✅ Backend responds to `/api/health`
✅ Frontend loads without CORS errors
✅ Can register and login
✅ Sensor data appears in dashboard
✅ Charts update in real-time
✅ Data persists in database
✅ Raspberry Pi can connect

---

## 📝 Notes & Observations

Use this space to note any issues or customizations:

```
_________________________________________________________________

_________________________________________________________________

_________________________________________________________________

_________________________________________________________________
```

---

**Once all checkboxes are checked, your IoT Dashboard is fully deployed! 🚀**

Visit your dashboard: `https://do-sensor-dashboard.vercel.app`
