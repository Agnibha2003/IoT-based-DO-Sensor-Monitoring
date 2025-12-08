# 🔧 FIX: DATABASE_URL is not configured

You're seeing this error:
```
❌ Bootstrap failed: Error: DATABASE_URL is not configured
```

**This means:** You created the Web Service but haven't connected a PostgreSQL database yet.

---

## ✅ FIX (5 minutes)

### Step 1: Create PostgreSQL Database

1. Go to **Render Dashboard** (https://render.com/dashboard)
2. Click **"+ New"** button (top right)
3. Select **"PostgreSQL"**

Fill in these values:
```
Name:                 do-sensor-db
Database:             do_sensor_db
PostgreSQL Version:   Leave as default (Latest)
Region:               Oregon (same as your backend)
Plan:                 Free
```

4. Click **"Create Database"**
5. **Wait 1-2 minutes** for database to initialize

---

### Step 2: Copy Connection String

Once database is created:

1. On the PostgreSQL page, look for **"Connections"** section
2. Find **"Internal Connection String"** (this is important!)
3. It looks like:
   ```
   postgresql://username:password@host:5432/do_sensor_db
   ```
4. **Copy the entire string** (click the copy button or select all and copy)

---

### Step 3: Add DATABASE_URL to Backend

1. Go back to your **"do-sensor-backend"** service
2. Click **"Environment"** (in left sidebar)
3. Click **"Add"** button
4. Fill in:
   ```
   Name:  DATABASE_URL
   Value: [PASTE the connection string from Step 2]
   ```
5. Click **"Save"**

The service will **automatically redeploy** with the database connection.

---

### Step 4: Wait & Verify

1. Watch the **"Deploy Log"** tab
2. Wait for: **"Build successful"** ✓
3. Then look for: **"✓ Your service is live"**

Once you see that, test the health endpoint:

```
https://do-sensor-backend.onrender.com/api/health
```

You should see:
```json
{"ok": true, "time": 1702000000000}
```

---

## ❌ If It Still Fails

**Check the Logs:**
1. Click **"Logs"** tab
2. Look for error messages
3. Common issues:

| Error | Fix |
|-------|-----|
| `Connection refused` | Database might not be ready yet, wait 2 more minutes |
| `Invalid connection string` | Make sure you copied the FULL string, not partial |
| `Authentication failed` | Connection string is wrong, re-copy from PostgreSQL page |

---

## 🎯 Summary

You're missing the **DATABASE_URL** environment variable!

**Do this:**
1. Create PostgreSQL database in Render
2. Copy the connection string
3. Add it as DATABASE_URL to backend service
4. Service will auto-redeploy
5. Done!

---

**Once you do this, the error will be gone and your backend will start!** ✅
