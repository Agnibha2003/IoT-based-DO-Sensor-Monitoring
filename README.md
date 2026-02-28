# 🚀 IoT-based DO Sensor Monitoring Dashboard

**Remote Monitoring Solution | Raspberry Pi Integration | Cloud-Based**

---

## 📍 Project Status

✅ **READY FOR DEPLOYMENT** - All configuration complete

- GitHub Repository: https://github.com/Agnibha2003/IoT-based-DO-Sensor-Monitoring
- Backend Target: Render (Free Tier)
- Frontend Target: Vercel (Free Tier)
- Database: PostgreSQL (Render Free)

---

## 🎯 What This Project Does

A professional IoT dashboard for monitoring Dissolved Oxygen (DO) levels in water bodies with remote monitoring capabilities. Your Raspberry Pi sends sensor data to a cloud backend, which displays real-time data in a beautiful web dashboard accessible from anywhere.

### Key Features:
- **Real-time Monitoring**: Live sensor data visualization with charts
- **Multi-parameter Support**: DO level, temperature, pressure tracking
- **User Authentication**: Secure login with JWT tokens
- **Data Export**: Download readings as CSV, Excel, or PDF
- **Device Management**: Register and manage multiple sensors
- **Sensor Calibration**: Calibrate sensors through the dashboard
- **Responsive Design**: Works on desktop, tablet, and mobile

---

## 📦 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  CLOUD DEPLOYMENT READY                                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Raspberry Pi (Sensor)                                       │
│         │                                                    │
│         └─→ HTTPS/REST API                                  │
│              │                                               │
│              ├─→ Render Backend (Node.js + Express)         │
│              │   ├─ PostgreSQL Database                     │
│              │   ├─ JWT Authentication                      │
│              │   └─ Data Management APIs                    │
│              │                                               │
│              └─→ Vercel Frontend (React + Vite)             │
│                  ├─ User Dashboard                          │
│                  ├─ Real-time Charts                        │
│                  └─ Data Download                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗂️ Project Structure

```
IoT-based-DO-Sensor-Monitoring/
├── backend/                    (Node.js + Express)
│   ├── src/
│   │   ├── index.js           (Main server)
│   │   ├── config.js          (Environment config)
│   │   ├── db-postgres.js     (Database)
│   │   ├── routes/            (API endpoints)
│   │   ├── middleware/        (Auth, error handling)
│   │   └── services/          (Business logic)
│   ├── package.json
│   ├── .env.example           ✅ UPDATED
│   └── render.yaml            ✅ UPDATED
│
├── frontend/                   (React + Vite)
│   ├── src/
│   │   ├── components/        (React components)
│   │   ├── pages/             (Dashboard pages)
│   │   ├── utils/             (API client)
│   │   └── App.tsx
│   ├── package.json
│   ├── .env                   ✅ UPDATED
│   ├── vite.config.ts         ✅ UPDATED
│   └── vercel.json            ✅ UPDATED
│
├── 📄 DEPLOYMENT_COMPLETE.md    ← Start here for overview
├── 📄 QUICK_START.md            ← Quick reference
├── 📄 QUICK_DEPLOY.md           ← Simplified deploy steps
├── 📄 README.md                 ← This file
├── 📄 .gitignore
└── .git/                        ✅ GitHub synced

```

---

## 🚀 Quick Start (Choose One)

### Option 1: Quick Deploy (5-10 minutes)
```
1. Read: QUICK_START.md
2. Deploy backend to Render (5 min)
3. Deploy frontend to Vercel (3 min)
4. Configure Raspberry Pi
5. Done!
```

### Option 2: Detailed Guide (15-20 minutes)
```
1. Read: DEPLOYMENT_COMPLETE.md
2. Follow step-by-step instructions
3. Verify each deployment
4. Test endpoints
5. Configure Pi
```

### Option 3: Simple Deploy (2 clicks)
```
See QUICK_DEPLOY.md for simplified version
```

---

## 📋 Pre-Deployment Checklist

All items below are ✅ COMPLETE:

- [x] Backend configured for production
- [x] Frontend configured for production
- [x] Database setup configured (PostgreSQL)
- [x] API endpoints secured with JWT
- [x] CORS properly configured
- [x] Environment variables prepared
- [x] Build configurations set
- [x] Code committed to GitHub
- [x] Ready for cloud deployment

---

## 🔧 Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 4.19
- **Database**: PostgreSQL 15+
- **Authentication**: JWT + bcryptjs
- **Key Libraries**:
  - cors: CORS middleware
  - dotenv: Environment variables
  - pg: PostgreSQL client
  - jsonwebtoken: JWT tokens
  - exceljs, pdfkit: Data export

### Frontend
- **Framework**: React 18.3
- **Build Tool**: Vite 6.3.5
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Radix UI
- **Charts**: Recharts 2.15
- **Key Libraries**:
  - react-hook-form: Form handling
  - sonner: Notifications
  - lucide-react: Icons
  - date-fns: Date utilities

---

## 🌐 Expected Deployment URLs

After deployment, you'll have:

| Service | URL | Purpose |
|---------|-----|---------|
| **Dashboard** | https://do-sensor-dashboard.vercel.app | Main UI |
| **API Base** | https://do-sensor-backend.onrender.com | Backend |
| **Health Check** | https://do-sensor-backend.onrender.com/api/health | Status |

---

## 📱 Raspberry Pi Integration

Your Raspberry Pi will:

1. **Collect sensor data** every 1-5 minutes
2. **POST to backend**: `https://do-sensor-backend.onrender.com/api/readings`
3. **Include JWT token** in Authorization header
4. **Receive confirmation** from backend

### Example Python Code:
```python
import requests
import time

API_BASE = "https://do-sensor-backend.onrender.com/api"
EMAIL = "your-email@example.com"
PASSWORD = "your-password"

# Login once
login = requests.post(f"{API_BASE}/auth/login", json={
    "email": EMAIL, "password": PASSWORD
})
token = login.json()["token"]

# Send readings periodically
while True:
    data = {
        "sensor_id": "sensor-001",
        "do_level": 8.5,
        "temperature": 25.3,
        "pressure": 1013.25
    }
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.post(
        f"{API_BASE}/readings",
        json=data,
        headers=headers
    )
    print(f"Data sent: {response.status_code}")
    time.sleep(300)  # Every 5 minutes
```

---

## 🔐 Security Features

- ✅ **JWT Authentication**: Secure token-based auth
- ✅ **Password Hashing**: bcryptjs with salt rounds
- ✅ **HTTPS/SSL**: Automatic with Render & Vercel
- ✅ **CORS Protection**: Whitelisted domain only
- ✅ **Environment Variables**: Sensitive data never in code
- ✅ **Rate Limiting**: API protection ready
- ✅ **Error Handling**: No sensitive data in errors

---

## 🆓 Free Tier Information

### Render Backend
- **Cost**: FREE
- **Sleep**: Spins down after 15 min inactivity
- **Cold Start**: First request = 30-60 seconds
- **Database**: PostgreSQL 256 MB FREE
- **Good For**: Development, testing, small projects
- **Upgrade When**: Need instant availability

### Vercel Frontend
- **Cost**: FREE
- **Bandwidth**: 100 GB/month
- **Deployments**: 12/day
- **CDN**: Global edge network
- **Good For**: Production-ready hosting
- **Upgrade When**: Need extra features/bandwidth

---

## ⚡ Performance Expectations

| Component | First Load | Subsequent | Notes |
|-----------|-----------|------------|-------|
| Dashboard (Vercel) | 2-3 seconds | <1 second | CDN-cached |
| API (Render) | 30-60 seconds* | <500ms | *Cold start |
| Database | <100ms | <100ms | Local query |
| Charts Load | 1-2 seconds | <500ms | Data render |

*Cold start only happens after 15 min inactivity

---

## 📊 Database Schema

### Users Table
```
id, email, password_hash, created_at, updated_at
```

### Sensors Table
```
id, user_id, name, device_id, type, created_at, updated_at
```

### Readings Table
```
id, sensor_id, do_level, temperature, pressure, timestamp
```

### Calibrations Table
```
id, sensor_id, calibration_value, timestamp
```

---

## 🆘 Troubleshooting

### Dashboard Won't Load
- [ ] Check VITE_API_BASE in Vercel env vars
- [ ] Verify backend is deployed and running
- [ ] Clear browser cache
- [ ] Check browser console for errors

### Can't Connect to Backend
- [ ] Verify CORS_ORIGIN in backend matches frontend URL
- [ ] Check DATABASE_URL is set correctly
- [ ] Restart backend service
- [ ] Wait for cold start if applicable

### Data Not Saving
- [ ] Verify JWT token is valid
- [ ] Check Authorization header format
- [ ] Verify sensor_id matches registered sensor
- [ ] Check backend logs in Render dashboard

### Slow Performance
- [ ] Normal on free tier if first request (cold start)
- [ ] Keep dashboard open to prevent spin-down
- [ ] Consider upgrading Render for production

---

## 📚 Documentation Files

| File | Purpose | Read Time |
|------|---------|-----------|
| **QUICK_START.md** | Quick reference card | 5 min |
| **QUICK_DEPLOY.md** | Simplified deploy guide | 10 min |
| **DEPLOYMENT_COMPLETE.md** | Full overview & details | 20 min |
| **PROJECT_STRUCTURE.md** | Detailed folder structure | 10 min |
| **This README.md** | General info & quick start | 10 min |

---

## 🔄 Deployment Flow

```
1. You deploy backend to Render
   ↓
2. Get backend URL: https://do-sensor-backend.onrender.com
   ↓
3. You deploy frontend to Vercel with backend URL
   ↓
4. Get frontend URL: https://do-sensor-dashboard.vercel.app
   ↓
5. Pi sends data to backend
   ↓
6. Frontend fetches & displays data in real-time
   ↓
7. ✨ Done! Remote monitoring is live
```

---

## 📈 What's Included

### ✅ Backend Features
- User registration & login
- Multi-user support
- Sensor data storage
- Real-time API endpoints
- JWT authentication
- Data export (CSV, Excel, PDF)
- Sensor calibration
- Health check endpoint
- Error handling
- PostgreSQL integration

### ✅ Frontend Features
- Professional dashboard UI
- Real-time data charts
- User authentication flow
- Multi-parameter visualization
- Data download functionality
- Sensor management
- Device configuration
- Analytics dashboard
- Responsive design
- Dark mode support

---

## 🎓 Learning Resources

- **Express.js**: https://expressjs.com/
- **React**: https://react.dev
- **Vite**: https://vitejs.dev
- **PostgreSQL**: https://www.postgresql.org/docs/
- **Render**: https://render.com/docs
- **Vercel**: https://vercel.com/docs

---

## 💡 Tips for Success

1. **Test locally first** before deploying
2. **Monitor logs** in Render & Vercel dashboards
3. **Keep Pi script simple** for reliability
4. **Update environment variables** after deployment
5. **Set up alerts** for critical DO levels
6. **Backup data** regularly
7. **Monitor free tier usage** to plan upgrades

---

## 🚀 Ready to Deploy?

Choose your deployment path:

1. **🏃 Quick & Simple** → Read `QUICK_START.md`
2. **📖 Detailed Guide** → Read `DEPLOYMENT_COMPLETE.md`
3. **⚡ Ultra-Fast** → Read `QUICK_DEPLOY.md`

---

## 📞 Project Information

- **Repository**: https://github.com/Agnibha2003/IoT-based-DO-Sensor-Monitoring
- **Backend Deployment**: Render (Free)
- **Frontend Deployment**: Vercel (Free)
- **Database**: PostgreSQL (Render Free)
- **Status**: ✅ Production Ready
- **Last Updated**: December 8, 2025

---

## ✨ You're All Set!

Everything is configured and ready. Just follow one of the deployment guides and you'll have a live IoT monitoring dashboard in minutes!

**Questions?** Check the documentation files included in the repository.

**Ready?** Pick a guide and start deploying! 🎉

---

**Happy Monitoring!** 📊🌊✨
