# ✅ RENDER DEPLOYMENT - ONE PAGE CHECKLIST

## Right Now - What You Need to Do

### ✓ Configuration Form Fields (Fill these in Render):

```
Name:                 do-sensor-backend
Environment:          Node
Branch:               main
Root Directory:       backend/
Build Command:        npm ci
Start Command:        node src/index.js
Instance Type:        Free
Region:               Oregon
```

### ✓ The Button to Click:

**"Deploy Web Service"** ← This creates and deploys your service

### ✓ What Happens Next:

1. Logs will show: `Building...`
2. Wait 3-5 minutes
3. Look for: `✓ Your service is live`
4. Copy your URL: `https://do-sensor-backend.onrender.com`

### ✓ After Service is Live - Add Environment Variables:

Click **Environment** (left sidebar) and add:

```
NODE_ENV              = production
JWT_SECRET            = (leave empty)
JWT_EXPIRY            = 24h
CORS_ORIGIN           = https://do-sensor-dashboard.vercel.app
DEVICE_ID             = sensor-001
DEVICE_API_KEY        = your-pi-key
```

### ✓ Create PostgreSQL Database:

1. Click "+ New" → "PostgreSQL"
2. Name: `do-sensor-db`
3. Database: `do_sensor_db`
4. Plan: `Free`
5. Create → Copy connection string

### ✓ Add DATABASE_URL to Backend:

Environment → Add:
```
DATABASE_URL = [paste PostgreSQL connection string]
```

### ✓ Test It Works:

Open: `https://your-url/api/health`

Should show: `{"ok": true, "time": ...}`

---

## If Something Goes Wrong

### Build Failed
- Delete service, try again with exact values above
- Check logs for specific error

### Service Won't Start
- Verify all environment variables are set
- Ensure DATABASE_URL is correct
- Check Logs tab

### Can't Access /api/health
- Wait 1-2 minutes (might be cold starting)
- Verify service shows "✓ Your service is live"
- Check environment variables

---

## Next Step

Once backend works (can access /api/health), deploy frontend to Vercel.

---

**You've got this! Just follow the values above exactly.** 💪
