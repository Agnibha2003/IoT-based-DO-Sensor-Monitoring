# Quick Deploy Reference Card

## 🚀 Your Project is Ready to Deploy!

**GitHub Repository**: https://github.com/Agnibha2003/IoT-based-DO-Sensor-Monitoring

---

## 📦 What You Have

| Component | Tech Stack | Status |
|-----------|-----------|--------|
| **Backend** | Node.js + Express + PostgreSQL | ✅ Ready |
| **Frontend** | Vite + React + Recharts | ✅ Ready |
| **Database** | PostgreSQL (Render free tier) | ✅ Ready |
| **Authentication** | JWT + bcrypt | ✅ Ready |
| **API Documentation** | REST endpoints with Bearer auth | ✅ Ready |

---

## 🎯 Deployment in 3 Steps

### Step 1: Backend (5 minutes)
```
1. Go to render.com → Sign in with GitHub
2. Click "New +" → "Web Service"
3. Select: IoT-based-DO-Sensor-Monitoring
4. Root Directory: backend/
5. Environment: Add DATABASE_URL (from PostgreSQL)
6. Deploy
→ You'll get: https://do-sensor-backend.onrender.com
```

### Step 2: Frontend (3 minutes)
```
1. Go to vercel.com → Sign in with GitHub
2. Click "Add New" → "Project"
3. Import: IoT-based-DO-Sensor-Monitoring
4. Root Directory: frontend/
5. Environment: Add VITE_API_BASE = https://do-sensor-backend.onrender.com/api
6. Deploy
→ You'll get: https://do-sensor-dashboard.vercel.app
```

### Step 3: Raspberry Pi (Configure API endpoint)
```
Update your Pi code to send data to:
POST https://do-sensor-backend.onrender.com/api/readings
```

---

## 🔑 Critical Environment Variables

### Backend (Render)
```
NODE_ENV = production
JWT_SECRET = (auto-generated)
DATABASE_URL = (from PostgreSQL service)
CORS_ORIGIN = https://do-sensor-dashboard.vercel.app
```

### Frontend (Vercel)
```
VITE_API_BASE = https://do-sensor-backend.onrender.com/api
```

---

## 📊 Expected URLs After Deployment

| Service | URL | Purpose |
|---------|-----|---------|
| **Dashboard** | https://do-sensor-dashboard.vercel.app | Main UI |
| **API Health** | https://do-sensor-backend.onrender.com/api/health | Backend status |
| **Auth** | https://do-sensor-backend.onrender.com/api/auth/register | User registration |
| **Readings** | https://do-sensor-backend.onrender.com/api/readings | POST sensor data |

---

## ✅ Verification After Deploy

1. **Open Dashboard**: https://do-sensor-dashboard.vercel.app
   - [ ] Page loads without CORS errors
   - [ ] Login/Register page visible

2. **Test Backend**:
   ```bash
   curl https://do-sensor-backend.onrender.com/api/health
   ```
   Expected: `{"ok": true, "time": ...}`

3. **Test API**:
   ```bash
   curl -X POST https://do-sensor-backend.onrender.com/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email": "test@example.com", "password": "test123"}'
   ```

4. **Send Test Data**:
   - Log in to dashboard
   - Verify database connection works
   - Submit test sensor reading

---

## 🆓 Free Tier Limitations

| Service | Limit | Impact |
|---------|-------|--------|
| **Render** | Spins down after 15 min inactivity | First request takes 30-60 seconds |
| **Vercel** | 100 GB bandwidth/month | Plenty for small projects |
| **PostgreSQL** | 256 MB database | Enough for ~1 year of hourly readings |

---

## 🚨 Troubleshooting

| Issue | Solution |
|-------|----------|
| **Can't connect to backend from frontend** | Check VITE_API_BASE is correct in Vercel |
| **CORS errors** | Verify CORS_ORIGIN in Render matches Vercel URL |
| **Database connection failed** | Ensure DATABASE_URL is copied correctly to Render |
| **Slow first load** | Normal on free tier! Render spins down after inactivity |
| **401 Unauthorized** | Check JWT token is being sent in Authorization header |

---

## 💾 Project Structure

```
├── backend/
│   ├── src/
│   │   ├── index.js (main server)
│   │   ├── config.js (env variables)
│   │   ├── db-postgres.js (database)
│   │   ├── routes/ (API endpoints)
│   │   ├── middleware/ (auth, error handling)
│   │   └── services/ (business logic)
│   ├── package.json
│   ├── .env.example
│   └── render.yaml ⭐ (Render deployment config)
│
├── frontend/
│   ├── src/
│   │   ├── components/ (React components)
│   │   ├── pages/ (Dashboard pages)
│   │   ├── utils/ (API client)
│   │   └── App.tsx (main app)
│   ├── package.json
│   ├── .env (production API URL)
│   ├── vite.config.ts
│   └── vercel.json ⭐ (Vercel deployment config)
│
├── DEPLOYMENT_GUIDE.md ⭐ (Full deployment steps)
├── PRE_DEPLOYMENT_CHECKLIST.md (Configuration checklist)
└── README.md
```

---

## 📝 API Endpoints Cheat Sheet

### Auth
```
POST /api/auth/register
  body: { email, password }

POST /api/auth/login
  body: { email, password }
  returns: { token, user }
```

### Readings
```
POST /api/readings
  headers: { Authorization: "Bearer TOKEN" }
  body: { sensor_id, do_level, temperature, pressure }

GET /api/readings
  headers: { Authorization: "Bearer TOKEN" }
  returns: array of readings
```

### Sensors
```
POST /api/sensors
  headers: { Authorization: "Bearer TOKEN" }
  body: { name, device_id }

GET /api/sensors
  headers: { Authorization: "Bearer TOKEN" }
  returns: array of sensors
```

---

## 🎉 You're All Set!

Your IoT Dashboard is fully configured and ready to deploy.

**Next Step**: Follow DEPLOYMENT_GUIDE.md for step-by-step instructions.

**Questions?** Check PRE_DEPLOYMENT_CHECKLIST.md for detailed info.

---

**Happy Monitoring!** 📊✨
