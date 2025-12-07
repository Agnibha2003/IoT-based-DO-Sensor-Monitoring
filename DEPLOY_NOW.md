# 🚀 DEPLOY NOW - Complete Step-by-Step Guide

This is your **complete deployment guide**. Follow these exact steps to deploy both backend and frontend.

---

## ⏱️ Expected Time: 15-20 minutes total

---

## 📋 STEP 1: Deploy Backend to Render (5 minutes)

### 1.1 Go to Render
```
https://render.com
```

### 1.2 Sign In/Sign Up
- Click **Sign In** (top right)
- Choose **Sign in with GitHub**
- Authorize Render to access your GitHub

### 1.3 Create Web Service
- Click **New +** button (top right)
- Select **Web Service**
- Click **Deploy from a Git repository**

### 1.4 Connect GitHub Repository
- Click **Connect account** (if not already connected)
- Search for: `IoT-based-DO-Sensor-Monitoring`
- Click on it to select
- Click **Connect**

### 1.5 Configure Backend Service
```
Name:                    do-sensor-backend
Environment:             Node
Branch:                  main
Root Directory:          backend/
Build Command:           npm install
Start Command:           npm start
Instance Type:           Free
Region:                  Oregon (or closest)
```

**Click: Create Web Service**

### 1.6 Set Environment Variables
While the service is building:

1. In the Render dashboard, go to your **do-sensor-backend** service
2. Click **Environment** tab (left sidebar)
3. Add these environment variables:

```
NODE_ENV = production
JWT_SECRET = (leave blank - Render will auto-generate)
JWT_EXPIRY = 24h
CORS_ORIGIN = https://[YOUR-VERCEL-DOMAIN].vercel.app
BACKEND_PORT = 5000
DEVICE_ID = sensor-001
DEVICE_API_KEY = your-device-api-key
```

**Note:** For CORS_ORIGIN, you'll update this after deploying frontend (Step 2.6)

### 1.7 Create PostgreSQL Database
1. Click **New +** button again
2. Select **PostgreSQL**
3. Fill in:
```
Name:                    do-sensor-db
PostgreSQL Version:      Latest
Region:                  Oregon
Datastore Name:          do_sensor_db
Plan:                    Free
```
4. Click **Create Database**

### 1.8 Connect Database to Backend
1. Go back to your **do-sensor-backend** service
2. Click **Environment** tab
3. Scroll down, find the PostgreSQL connection in the status
4. Copy the **Internal Connection String**
5. In Environment variables, add:
```
DATABASE_URL = [PASTE THE CONNECTION STRING HERE]
```
6. Click **Save changes**

### 1.9 Verify Deployment
Wait for the build to complete (5-10 minutes). You'll see:
```
✓ Your service is live
```

Copy your backend URL (looks like):
```
https://do-sensor-backend.onrender.com
```

### ✅ Test Backend
Open in browser:
```
https://do-sensor-backend.onrender.com/api/health
```

You should see:
```json
{"ok": true, "time": 1702000000000}
```

---

## 📋 STEP 2: Deploy Frontend to Vercel (3 minutes)

### 2.1 Go to Vercel
```
https://vercel.com
```

### 2.2 Sign In/Sign Up
- Click **Log in** (top right)
- Choose **Continue with GitHub**
- Authorize Vercel to access your GitHub

### 2.3 Import Project
- Click **Add New** (top right)
- Select **Project**
- Click **Import Git Repository**
- Search for: `IoT-based-DO-Sensor-Monitoring`
- Click it to select

### 2.4 Configure Frontend
```
Project Name:            do-sensor-dashboard
Framework:               Vite
Root Directory:          frontend/
```

**Click: Import**

### 2.5 Set Environment Variables
Before deploying, you'll see an Environment Variables section:

Add this variable:
```
VITE_API_BASE = https://do-sensor-backend.onrender.com/api
```

Replace `do-sensor-backend` with your actual backend URL from Step 1.9

**Click: Deploy**

### 2.6 Wait for Deployment
- Deployment takes 2-3 minutes
- You'll see: **✓ Deployment complete**
- Copy your frontend URL (looks like):
```
https://do-sensor-dashboard.vercel.app
```

### 2.7 Update Backend CORS
Now go back to Render and update CORS:

1. Go to **Render Dashboard** → **do-sensor-backend** service
2. Click **Environment** tab
3. Update **CORS_ORIGIN** to:
```
https://do-sensor-dashboard.vercel.app
```
4. Click **Save changes**
5. Service will auto-redeploy

### ✅ Test Frontend
Open in browser:
```
https://do-sensor-dashboard.vercel.app
```

You should see the **Login/Register page** with NO errors in console.

---

## 📋 STEP 3: Verify Everything Works (2 minutes)

### 3.1 Test User Registration
1. Go to: `https://do-sensor-dashboard.vercel.app`
2. Click **Register**
3. Enter:
   - Email: `test@example.com`
   - Password: `Test123!`
4. Click **Register**
5. Should see: **Success message**

### 3.2 Test Login
1. Use same email/password
2. Click **Login**
3. Should see: **Dashboard page**
4. No CORS errors in browser console (open DevTools: F12)

### 3.3 Test API Directly
Open terminal and run:
```powershell
# Test backend health
curl https://do-sensor-backend.onrender.com/api/health

# Test user login
curl -X POST https://do-sensor-backend.onrender.com/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"test@example.com","password":"Test123!"}'
```

Should return a JWT token.

---

## 📋 STEP 4: Configure Raspberry Pi (5 minutes)

### 4.1 Update Your Pi Script

Replace your Pi's data endpoint with:

```python
import requests
import json
import time
from datetime import datetime

# Configuration
API_BASE = "https://do-sensor-backend.onrender.com/api"
EMAIL = "test@example.com"  # Create account via dashboard first
PASSWORD = "Test123!"
DEVICE_ID = "sensor-001"

class SensorClient:
    def __init__(self):
        self.token = None
        self.login()
    
    def login(self):
        """Login and get JWT token"""
        response = requests.post(
            f"{API_BASE}/auth/login",
            json={"email": EMAIL, "password": PASSWORD}
        )
        if response.status_code == 200:
            self.token = response.json()["token"]
            print("✓ Logged in successfully")
        else:
            print("✗ Login failed:", response.text)
    
    def send_reading(self, do_level, temperature, pressure):
        """Send sensor reading to cloud"""
        if not self.token:
            self.login()
        
        headers = {"Authorization": f"Bearer {self.token}"}
        data = {
            "sensor_id": DEVICE_ID,
            "do_level": do_level,
            "temperature": temperature,
            "pressure": pressure
        }
        
        response = requests.post(
            f"{API_BASE}/readings",
            json=data,
            headers=headers
        )
        
        if response.status_code == 201:
            print(f"✓ Reading sent at {datetime.now()}")
            return True
        else:
            print(f"✗ Failed to send: {response.text}")
            # Try re-login
            self.login()
            return False

# Main loop
client = SensorClient()

while True:
    try:
        # Read your sensors here (example values)
        do_level = 8.5
        temperature = 25.3
        pressure = 1013.25
        
        # Send to cloud
        client.send_reading(do_level, temperature, pressure)
        
        # Wait before next reading (e.g., every 5 minutes)
        time.sleep(300)
        
    except Exception as e:
        print(f"Error: {e}")
        time.sleep(10)
```

### 4.2 Run on Raspberry Pi

```bash
cd ~/your-sensor-project
python3 sensor_client.py
```

You should see:
```
✓ Logged in successfully
✓ Reading sent at 2025-12-08 10:30:45
✓ Reading sent at 2025-12-08 10:35:45
```

### 4.3 View Data on Dashboard

1. Go to: `https://do-sensor-dashboard.vercel.app`
2. Login with your account
3. You should see **real-time data** and **charts updating**

---

## ✅ DEPLOYMENT COMPLETE!

If you've reached here and everything works, **CONGRATULATIONS!** 🎉

Your IoT Dashboard is now:
- ✅ Deployed to the cloud
- ✅ Accessible from anywhere
- ✅ Receiving real-time sensor data
- ✅ Displaying live charts
- ✅ Storing data in PostgreSQL

---

## 🔍 Troubleshooting

### Dashboard shows "Cannot connect to API"
**Solution:**
1. Check VITE_API_BASE in Vercel Environment Variables
2. Verify backend URL is correct
3. Ensure CORS_ORIGIN matches frontend URL
4. Clear browser cache and reload

### Backend deployment stuck
**Solution:**
1. Check build logs in Render dashboard
2. Verify npm packages are correct
3. Try redeploying the service
4. Check for syntax errors in code

### Cannot login to dashboard
**Solution:**
1. Verify database connection in Render
2. Check DATABASE_URL is set correctly
3. Ensure user was created via registration
4. Check browser console for error details

### Raspberry Pi can't connect to backend
**Solution:**
1. Test with: `curl https://do-sensor-backend.onrender.com/api/health`
2. Verify API_BASE URL in Pi script
3. Check firewall/network on Pi
4. Ensure JWT token is being used

### "Service spins down" message
**This is normal on free tier!**
- Render spins down after 15 min inactivity
- First request takes 30-60 seconds
- Keep dashboard open to prevent spin-down
- Consider upgrading to paid plan for production

---

## 📞 Quick Reference URLs

| Service | URL |
|---------|-----|
| Backend API | https://do-sensor-backend.onrender.com |
| Frontend Dashboard | https://do-sensor-dashboard.vercel.app |
| Render Dashboard | https://dashboard.render.com |
| Vercel Dashboard | https://vercel.com/dashboard |
| GitHub Repo | https://github.com/Agnibha2003/IoT-based-DO-Sensor-Monitoring |

---

## 🎓 What You Now Have

✅ **Live Dashboard** - View sensor data in real-time
✅ **Secure Backend** - JWT-protected API
✅ **Cloud Database** - PostgreSQL with automatic backups
✅ **Mobile Friendly** - Works on all devices
✅ **Data Export** - Download readings as CSV/Excel/PDF
✅ **Multi-User** - Share with team members
✅ **24/7 Monitoring** - Access from anywhere

---

## 🚀 Next Steps

1. **Monitor dashboard** for incoming sensor data
2. **Configure alerts** if DO levels are critical
3. **Set up automated Pi startup** (cron job)
4. **Plan data retention** policy
5. **Upgrade services** if free tier becomes limiting

---

**Your IoT Dashboard is now LIVE! 🎉**

Send your Raspberry Pi data and watch it appear in real-time on your dashboard!
