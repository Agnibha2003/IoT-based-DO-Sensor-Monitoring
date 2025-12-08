# ⚡ VERCEL QUICK DEPLOY

**Backend is live! Deploy frontend in 5 minutes.**

---

## 📋 Quick Checklist

### 1. Go to Vercel
```
https://vercel.com
→ Log in with GitHub
```

### 2. Import Project
```
Click "Add New..." → "Project"
Search: IoT-based-DO-Sensor-Monitoring
Click "Import"
```

### 3. Configure (EXACT VALUES)
```
Framework:           Vite
Root Directory:      frontend/
Build Command:       npm run build
Output Directory:    dist
```

### 4. Add Environment Variable
```
VITE_API_BASE = https://do-sensor-backend.onrender.com/api
```
**(Don't forget /api at the end!)**

### 5. Click "Deploy"
```
Wait 2-3 minutes
```

### 6. Copy Your URL
```
You'll get: https://your-app.vercel.app
```

### 7. Update Backend CORS
```
Go to: Render → do-sensor-backend → Environment
Update: CORS_ORIGIN = https://your-app.vercel.app
Save (auto-redeploys)
```

### 8. Test It
```
Open: https://your-app.vercel.app
Should see: Login/Register page
No CORS errors in console (F12)
```

### 9. Register First User
```
Click Register
Email: test@example.com
Password: Test123!
```

### 10. Done! ✅
```
You should see the dashboard!
```

---

## 🔗 URLs After Deployment

```
Backend:   https://do-sensor-backend.onrender.com
Frontend:  https://your-app.vercel.app
Health:    https://do-sensor-backend.onrender.com/api/health
```

---

## ❌ Quick Fixes

**CORS Error?**
- Update CORS_ORIGIN in Render backend

**Can't Connect to API?**
- Check VITE_API_BASE has "/api"
- Verify backend is running

**Build Failed?**
- Root Directory must be: `frontend/`
- Check deployment logs

---

**Follow these steps and you're done!** 🚀

Full guide: VERCEL_DEPLOYMENT_GUIDE.md
