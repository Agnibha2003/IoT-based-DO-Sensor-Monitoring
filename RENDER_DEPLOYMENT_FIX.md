# 🔧 RENDER DEPLOYMENT TROUBLESHOOTING & FIX

**If "Create Web Service" is failing or not working, follow this guide.**

---

## ❌ Common Issues & Solutions

### Issue 1: "Build failed" or Service won't start

**Symptoms:**
- Build shows red "Failed" status
- Logs show build errors
- Service crashes immediately after deploy

**Solutions:**

1. **Try Manual Deployment Instead:**
   - Don't use render.yaml yet
   - Create Web Service manually (see below)
   - Get it working first, then use render.yaml

2. **Check Build Command:**
   - Change from: `npm install`
   - Change to: `npm ci`
   - npm ci is better for production

3. **Check Port Configuration:**
   - Render assigns a dynamic PORT
   - Don't hardcode port 5000
   - Use: `process.env.PORT || 10000`

---

## ✅ MANUAL DEPLOYMENT (Recommended First)

If the "Create Web Service" button isn't working, follow this step-by-step manual process:

### Step 1: Connect GitHub to Render
1. Go to https://render.com
2. Click **Dashboard** (top right)
3. Click **New +** → **Web Service**
4. Click **Connect account** under GitHub
5. Authorize Render to access your GitHub
6. Select: `IoT-based-DO-Sensor-Monitoring` repository
7. Click **Connect**

### Step 2: Configure Service Settings

**These are the EXACT settings that work:**

```
Name:                    do-sensor-backend
Environment:             Node
Branch:                  main
Root Directory:          backend/
Build Command:           npm ci
Start Command:           node src/index.js
Runtime:                 Node
Instance Type:           Free
Region:                  Oregon
```

### Step 3: Create the Service
- Click **Create Web Service** button
- Wait for deployment to start (you'll see logs)

### Step 4: Add Environment Variables
Once the build is running:

1. Go to your service dashboard
2. Click **Environment** (in left sidebar)
3. Add these variables one by one:

```
Name: NODE_ENV
Value: production
[Click Add]

Name: JWT_SECRET
Value: (leave empty - Render auto-generates)
[Click Add]

Name: JWT_EXPIRY
Value: 24h
[Click Add]

Name: CORS_ORIGIN
Value: https://do-sensor-dashboard.vercel.app
[Click Add]

Name: DEVICE_ID
Value: sensor-001
[Click Add]

Name: DEVICE_API_KEY
Value: your-pi-api-key
[Click Add]

Name: NODE_OPTIONS
Value: --max-old-space-size=512
[Click Add]
```

### Step 5: Create PostgreSQL Database

1. In Render Dashboard, click **New +** → **PostgreSQL**
2. Fill in:
   ```
   Name:                 do-sensor-db
   Database:             do_sensor_db
   Username:             (auto-generated)
   Password:             (auto-generated)
   Region:               Oregon
   PostgreSQL Version:   Latest Available
   Plan:                 Free
   ```
3. Click **Create Database**

### Step 6: Connect Database to Backend

1. Go to the PostgreSQL database page
2. Copy the **Internal Connection String** (it shows on the database page)
3. Go back to **do-sensor-backend** service
4. Click **Environment**
5. Add new variable:
   ```
   Name: DATABASE_URL
   Value: [PASTE the connection string]
   [Click Add]
   ```
6. Click **Save**
7. Service will redeploy automatically

### Step 7: Wait & Test

- Wait for deployment to complete (shows "✓ Your service is live")
- Copy your service URL (e.g., https://do-sensor-backend.onrender.com)
- Test it:
  ```
  https://do-sensor-backend.onrender.com/api/health
  ```
  Should show: `{"ok": true, "time": ...}`

---

## 🐛 If Deployment Still Fails

### Check the Build Logs
1. In Render dashboard, click your service
2. Click **Logs** tab
3. Look for error messages
4. Common errors:

**Error: "Cannot find module"**
- Solution: Run `npm install` locally first to check for errors
- Check if all dependencies are in package.json

**Error: "Port already in use"**
- Solution: Don't hardcode port 5000, use PORT env var
- Our code already supports this ✓

**Error: "Database connection failed"**
- Solution: DATABASE_URL not set
- Ensure you added the connection string

**Error: "Out of memory"**
- Solution: Added `NODE_OPTIONS: --max-old-space-size=512`
- Our updated render.yaml includes this ✓

### Check Backend Code
Run locally first to verify it works:

```powershell
# In backend directory
npm install
$env:NODE_ENV = "development"
$env:DATABASE_URL = "postgresql://localhost/test"
npm start
```

Should see:
```
✅ PostgreSQL connection pool initialized
✅ DO Sensor backend ready on http://localhost:5000
```

---

## 📝 Updated render.yaml (Now Fixed)

Your render.yaml has been updated with:

✅ `npm ci` instead of `npm install` (better for production)
✅ `node src/index.js` instead of `npm start` (more direct)
✅ Correct PORT handling (Render uses dynamic PORT)
✅ Health check configuration
✅ Memory optimization flag
✅ All required environment variables

---

## 🎯 What to Do Now

### Option A: Use Render Dashboard UI (Easier First Time)
1. Follow the manual deployment steps above
2. Get everything working first
3. Then you can use render.yaml for future deployments

### Option B: Use render.yaml (If manual worked)
1. Once service is working, you can redeploy with render.yaml
2. Just push the updated render.yaml to GitHub
3. Render will auto-detect and redeploy

### Option C: Start Fresh (Cleanest)
1. Delete the failed service in Render
2. Follow manual deployment steps
3. Create a completely new service

---

## ✅ Verification Checklist

After deployment completes:

- [ ] Service shows "✓ Your service is live" in green
- [ ] Can access: https://do-sensor-backend.onrender.com/api/health
- [ ] Returns JSON with `"ok": true`
- [ ] Environment variables are all set
- [ ] DATABASE_URL is configured
- [ ] No errors in logs when accessing /api/health

---

## 📞 Quick Help

| Problem | Solution |
|---------|----------|
| **Can't find repo in GitHub** | Make sure GitHub is connected to Render account |
| **Build keeps failing** | Check logs, look for error messages, try Step 1 again |
| **Service won't start** | Check PORT configuration, verify env vars |
| **No database connection** | Ensure DATABASE_URL is set correctly |
| **Still stuck** | Try delete & create fresh service, follow manual steps |

---

## 🚀 Next Steps After Backend Works

1. **Test the API:**
   ```powershell
   curl https://[your-backend-url]/api/health
   ```

2. **Deploy Frontend** to Vercel (separate process)

3. **Configure Raspberry Pi** to send data to backend

4. **Monitor** logs in Render dashboard

---

**Once backend is deployed and /api/health works, you're ready for the frontend!**
