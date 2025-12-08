# ⚡ QUICK FIX - DO THIS NOW

**You're having trouble with Render deployment. Here's what to do:**

---

## THE PROBLEM

When you click "Create Web Service" with:
```
Root Directory: backend/
Build Command: npm install
Start Command: npm start
```

It's not working.

---

## THE SOLUTION (Choose One)

### Option 1: Delete & Start Fresh (Recommended) ⭐

1. Go to Render Dashboard
2. Find "do-sensor-backend" service
3. Click the service name
4. Scroll to bottom → "Delete Service"
5. Confirm deletion
6. Follow RENDER_VISUAL_GUIDE.md from scratch

**Key differences this time:**
- Use `npm ci` instead of `npm install`
- Use `node src/index.js` instead of `npm start`
- Make sure `backend/` is in Root Directory

### Option 2: Fix Existing Service

If you don't want to delete:

1. Go to your service settings
2. Click **Environment**
3. Check all environment variables are set:
   - NODE_ENV = production
   - DATABASE_URL = set correctly
   - JWT_SECRET = (can be empty)
4. Look in **Logs** tab for errors
5. If errors, try **Redeploy** button

---

## EXACT CORRECT VALUES

When you see the form, use EXACTLY these:

```
Name:                do-sensor-backend
Environment:         Node
Branch:              main
Root Directory:      backend/
Build Command:       npm ci
Start Command:       node src/index.js
Instance Type:       Free
Region:              Oregon
```

**Do not change anything else.**

---

## AFTER CLICKING "DEPLOY WEB SERVICE"

Wait for build. You'll see logs like:
```
Building docker image...
npm notice
npm notice `npm ci` is recommended instead of `npm install`
npm notice
```

This is GOOD. Keep waiting.

Eventually you'll see:
```
✓ Your service is live
```

---

## THEN ADD ENVIRONMENT VARIABLES

Once you see "✓ Your service is live":

Click **Environment** (left sidebar)

Add these ONE BY ONE:

```
NODE_ENV = production
JWT_SECRET = (leave blank)
JWT_EXPIRY = 24h
CORS_ORIGIN = https://do-sensor-dashboard.vercel.app
DEVICE_ID = sensor-001
DEVICE_API_KEY = your-key
DATABASE_URL = (from PostgreSQL)
```

---

## TEST IT

Open: `https://your-backend-url/api/health`

Should see: `{"ok": true}`

---

## Still Stuck?

Read: **RENDER_DEPLOYMENT_FIX.md** for detailed troubleshooting

Or read: **RENDER_VISUAL_GUIDE.md** for step-by-step with screenshots

---

**Do this now and let me know when you reach "✓ Your service is live"**
