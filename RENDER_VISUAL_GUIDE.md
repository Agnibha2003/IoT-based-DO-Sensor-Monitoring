# 🎯 RENDER DEPLOYMENT - EXACT STEPS (Visual Guide)

**Follow these EXACT steps in order. Don't skip anything.**

---

## STEP 1️⃣: Go to Render Dashboard

```
1. Open browser → https://render.com
2. Log in (or create account with GitHub)
3. You should see a dashboard with a big "+ New" button
```

Screenshot: You'll see a page with "Dashboard" at top left

---

## STEP 2️⃣: Click "New +" Button

```
Location: Top right corner of the page
Look for: "+ New" or "New +" in purple
```

A dropdown menu will appear.

---

## STEP 3️⃣: Select "Web Service"

```
From the dropdown menu, click "Web Service"
This will take you to a new page
```

You'll see a page asking to connect a GitHub repository.

---

## STEP 4️⃣: Connect Your GitHub Repo

On this page you will see:

```
"GitHub"
[Search repositories...]

Click the search box and type:
    IoT-based-DO-Sensor-Monitoring
```

Select the repository that appears.

You'll see a button that says:
```
"Connect"
```

**Click it.**

A new page will load asking for configuration.

---

## STEP 5️⃣: Fill in Configuration (EXACT VALUES)

You'll see a form with these fields:

### Field 1: Name
```
Current value: (might be auto-filled)
REPLACE WITH: do-sensor-backend
```

### Field 2: Environment
```
Should already be: Node
If not, select: Node
```

### Field 3: Branch
```
Should be: main
```

### Field 4: Root Directory
```
IMPORTANT! This is the common mistake!
REPLACE WITH: backend/
(not empty, not "/backend", exactly "backend/")
```

### Field 5: Build Command
```
Current: npm install
REPLACE WITH: npm ci
```

### Field 6: Start Command
```
Current: npm start
REPLACE WITH: node src/index.js
```

### Field 7: Instance Type
```
Select: Free
```

### Field 8: Region
```
Select: Oregon (or closest to your location)
```

---

## STEP 6️⃣: Click "Deploy Web Service"

```
At the bottom of the page, look for a button:
"Deploy Web Service"
(it should be purple/blue)

CLICK IT.
```

**YES, this is the button you need to click.** It will create AND deploy the service in one step.

**The build will START.** You'll see:
```
Building...
[Some log messages]
```

**DO NOT CLOSE THIS PAGE.** Let it build for 3-5 minutes.

---

## STEP 7️⃣: Wait for Build to Complete

You'll see logs scrolling. Wait for one of these messages:

✅ **GOOD** (service is working):
```
✓ Your service is live
```

❌ **BAD** (service failed):
```
Build failed
Error: ...
```

If you see ✓, continue to STEP 8.
If you see ✗, check the logs for the error.

---

## STEP 8️⃣: Add Environment Variables

Once service shows "✓ Your service is live":

1. Look at the LEFT SIDEBAR
2. Click **Environment** (between Logs and Deploy Log)

You'll see a section like:
```
Environment Variables

[Add button]
```

3. Click "Add button" for each variable below:

### Variable 1:
```
Name:  NODE_ENV
Value: production
[Save]
```

### Variable 2:
```
Name:  JWT_SECRET
Value: (LEAVE EMPTY - Render will auto-generate)
[Save]
```

### Variable 3:
```
Name:  JWT_EXPIRY
Value: 24h
[Save]
```

### Variable 4:
```
Name:  CORS_ORIGIN
Value: https://do-sensor-dashboard.vercel.app
[Save]
```

### Variable 5:
```
Name:  DEVICE_ID
Value: sensor-001
[Save]
```

### Variable 6:
```
Name:  DEVICE_API_KEY
Value: your-pi-api-key
[Save]
```

---

## STEP 9️⃣: Create PostgreSQL Database

1. Go back to main Render dashboard (click "Dashboard" top left)
2. Click "+ New" again
3. Select **PostgreSQL**

Fill in:
```
Name:                 do-sensor-db
Database:             do_sensor_db
PostgreSQL Version:   Leave as default
Region:               Oregon
Plan:                 Free
```

Click "Create Database"

Wait for it to finish (1-2 minutes).

You'll see your database details. **Copy the connection string.**

---

## STEP 🔟: Connect Database to Backend

1. Go back to your "do-sensor-backend" service
2. Click **Environment**
3. Click "Add" for a new variable

```
Name:  DATABASE_URL
Value: [PASTE the PostgreSQL connection string from STEP 9]
[Save]
```

The service will auto-redeploy with the database connection.

---

## STEP 1️⃣1️⃣: Verify Backend is Working

Once everything is deployed:

1. Find your service URL at the top of the page:
```
https://do-sensor-backend.onrender.com
(your actual URL might be different)
```

2. Open in browser:
```
https://your-backend-url/api/health
```

3. You should see:
```json
{"ok": true, "time": 1702000000000}
```

**If you see this, your backend is working! ✅**

---

## ❌ If Something Goes Wrong

### Error: Build Failed
- Check the build logs
- Look for specific error messages
- Common: Missing dependencies
- Solution: Try deleting service and creating fresh

### Error: Service won't start
- Check Environment Variables
- Ensure DATABASE_URL is correct
- Look in Logs tab for error details

### Error: Can't access /api/health
- Wait 1-2 minutes (first access might be slow)
- Check if Database is connected
- Verify all environment variables are set

---

## ✅ Success Checklist

- [ ] Service shows "✓ Your service is live"
- [ ] All environment variables are set
- [ ] PostgreSQL database is created and connected
- [ ] Can access https://your-url/api/health
- [ ] /api/health returns JSON with "ok": true
- [ ] No errors in Logs tab

**If all are checked ✓, your backend deployment is complete!**

---

## 🚀 Next: Deploy Frontend to Vercel

Once backend is working, follow the separate Vercel deployment guide.

---

**You're doing great! The hardest part (backend) is almost done!** 💪
