# DO Sensor Dashboard - Organized Project Structure

## 📁 Root Directory Structure

```
DO Sensor copy/
├── frontend/           # All frontend React application files
├── backend/            # All backend Node.js/Express API files
├── README.md           # Main project documentation
└── DELIVERY_SUMMARY.md # Project completion summary
```

---

## 🎨 Frontend Directory (`frontend/`)

**Location:** `c:\Users\agnib\OneDrive\Desktop\Web dashboard\DO Sensor copy\frontend\`

### Structure:
```
frontend/
├── src/                      # Source code
│   ├── components/           # React components
│   │   ├── pages/           # Dashboard pages (9 pages)
│   │   ├── ui/              # UI components (40+ shadcn components)
│   │   ├── utils/           # Utilities (backend.ts, themeContext, translations)
│   │   ├── figma/           # Figma components
│   │   └── ...other components
│   ├── styles/              # Global styles
│   ├── guidelines/          # Development guidelines
│   └── main.tsx             # Entry point
│
├── node_modules/            # Frontend dependencies
├── index.html              # HTML entry point
├── package.json            # Frontend dependencies & scripts
├── package-lock.json       # Dependency lock file
├── vite.config.ts          # Vite build configuration
└── vercel.json             # Vercel deployment config
```

### Key Frontend Files:

**Entry Points:**
- `index.html` - HTML entry
- `src/main.tsx` - React entry point
- `src/App.tsx` - Main App component

**Core Components:**
- `src/components/LoginPage.tsx` - Authentication with backend
- `src/components/Dashboard.tsx` - Main dashboard layout
- `src/components/Header.tsx` - Top navigation
- `src/components/Sidebar.tsx` - Side navigation

**Dashboard Pages (9):**
- `src/components/pages/HomePage.tsx` - Real-time dashboard
- `src/components/pages/OldDOPage.tsx` - Uncorrected DO
- `src/components/pages/NewDOPage.tsx` - Corrected DO
- `src/components/pages/TemperaturePage.tsx` - Temperature monitoring
- `src/components/pages/PressurePage.tsx` - Pressure data
- `src/components/pages/DOSaturationPage.tsx` - DO saturation
- `src/components/pages/AnalyticsPage.tsx` - Advanced analytics
- `src/components/pages/DataDownloadPage.tsx` - CSV export
- `src/components/pages/SettingsPage.tsx` - User preferences

**Utilities:**
- `src/components/utils/backend.ts` - API client with JWT auth
- `src/components/utils/themeContext.tsx` - Theme & language context
- `src/components/utils/translations.ts` - 14 language translations
- `src/components/utils/countries.ts` - Country list
- `src/components/utils/timezones.ts` - Timezone list

**UI Components (40+):**
- Located in `src/components/ui/`
- shadcn/ui components: buttons, cards, dialogs, forms, charts, etc.

### Frontend Commands:

```bash
cd frontend

# Install dependencies
npm install

# Start development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Frontend Environment Variables:

Create `.env` in frontend folder:
```env
VITE_API_BASE=http://localhost:5000              # Local development
# VITE_API_BASE=https://backend-url.onrender.com # Production
```

---

## 🖥️ Backend Directory (`backend/`)

**Location:** `c:\Users\agnib\OneDrive\Desktop\Web dashboard\DO Sensor copy\backend\`

### Structure:
```
backend/
├── src/                           # Source code
│   ├── routes/                    # API route handlers (6 modules)
│   │   ├── auth.js               # 7 authentication endpoints
│   │   ├── readings.js           # 4 reading endpoints
│   │   ├── sensors.js            # 2 sensor endpoints
│   │   ├── export.js             # 2 CSV export endpoints
│   │   ├── calibrate.js          # 1 calibration endpoint
│   │   └── dac.js                # 1 DAC endpoint
│   │
│   ├── services/                  # Business logic layer
│   │   ├── authService.js        # User auth, JWT, passwords
│   │   ├── sensorService.js      # Sensor management
│   │   ├── readingService.js     # Reading operations
│   │   └── analyticsService.js   # Data aggregation
│   │
│   ├── middleware/                # Express middleware
│   │   ├── auth.js               # JWT + API key validation
│   │   └── asyncHandler.js       # Error wrapping
│   │
│   ├── utils/                     # Utilities (empty, ready for use)
│   │
│   ├── index.js                   # Express server entry point
│   ├── config.js                  # Environment configuration
│   └── db-postgres.js             # PostgreSQL connection & schema
│
├── package.json                   # Backend dependencies & scripts
├── .env.example                   # Environment template
└── render.yaml                    # Render deployment config
```

### Key Backend Files:

**Core Server:**
- `src/index.js` - Express app with CORS, logging, routes
- `src/config.js` - Environment variable management
- `src/db-postgres.js` - PostgreSQL pool, schema, queries

**Routes (18 endpoints):**
- `src/routes/auth.js` - Registration, login, preferences, password
- `src/routes/readings.js` - Ingest, latest, history, stats
- `src/routes/sensors.js` - List sensors, regenerate API keys
- `src/routes/export.js` - CSV export for readings & stats
- `src/routes/calibrate.js` - Record calibration events
- `src/routes/dac.js` - Update DAC settings

**Services:**
- `src/services/authService.js` - User CRUD, JWT tokens
- `src/services/sensorService.js` - Sensor CRUD, API keys
- `src/services/readingService.js` - Reading queries
- `src/services/analyticsService.js` - Data summaries

**Middleware:**
- `src/middleware/auth.js` - requireAuth, requireDeviceKey
- `src/middleware/asyncHandler.js` - Async error handler

### Backend Commands:

```bash
cd backend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
# Edit .env with your database credentials

# Start development server (http://localhost:5000)
npm run dev

# Start production server
npm start
```

### Backend Environment Variables:

Create `.env` in backend folder:
```env
NODE_ENV=development
BACKEND_PORT=5000
CORS_ORIGIN=http://localhost:3000
DATABASE_URL=postgresql://user:password@localhost:5432/do_sensor
JWT_SECRET=your-secret-key-change-this
DEVICE_ID=demo-sensor-001
DEVICE_API_KEY=demo-key-12345
```

---

## 📊 Database Schema (PostgreSQL)

**5 Tables:**
1. **users** - User accounts with roles, preferences
2. **sensors** - Per-user sensors with API keys
3. **readings** - Time-series data (5 DO parameters)
4. **calibration_events** - Sensor calibration history
5. **dac_settings** - DAC control values

**3 Performance Indexes:**
- readings(sensor_id, captured_at)
- sensors(user_id)
- users(LOWER(email))

Auto-created on backend startup via `db-postgres.js`

---

## 🚀 Running the Full Stack Locally

### Terminal 1 - Backend:
```bash
cd "c:\Users\agnib\OneDrive\Desktop\Web dashboard\DO Sensor copy\backend"
npm install
# Configure .env with DATABASE_URL
npm run dev
# Backend: http://localhost:5000
```

### Terminal 2 - Frontend:
```bash
cd "c:\Users\agnib\OneDrive\Desktop\Web dashboard\DO Sensor copy\frontend"
npm install
# Frontend will use VITE_API_BASE=http://localhost:5000
npm run dev
# Frontend: http://localhost:3000
```

### Verify:
1. Open http://localhost:3000
2. Register new user
3. Login
4. Dashboard should load

---

## 📦 Deployment

### Frontend (Vercel):
```bash
cd frontend
# Push to GitHub
# Vercel: Import Project → Set VITE_API_BASE to backend URL
```

### Backend (Render):
```bash
cd backend
# Push to GitHub
# Render: New → Blueprint → Auto-deploys from render.yaml
```

---

## 📚 Documentation Files

**Root Level:**
- `README.md` - Main project documentation
- `DELIVERY_SUMMARY.md` - Project completion summary
- `PROJECT_STRUCTURE.md` - This file (organization guide)

**Located Elsewhere:**
- Architecture docs: `d:\VS_C_Progs\Web dashboard\DO Sensor\`
  - QUICK_START.md
  - ARCHITECTURE_ANALYSIS.md
  - VISUAL_REFERENCE.md
  - IMPLEMENTATION_SUMMARY.md
  - PROJECT_COMPLETION_REPORT.md
  - DOCUMENTATION_GUIDE.md

---

## 🔑 Key Points

### Separation of Concerns:
- ✅ **Frontend** (`frontend/`) - React UI, pages, components, styles
- ✅ **Backend** (`backend/`) - Express API, routes, services, database
- ✅ **Root** - Project-level documentation

### Independent Operation:
- Frontend has its own `package.json` and `node_modules`
- Backend has its own `package.json` (will have node_modules after install)
- Each can be deployed independently

### Clean Structure:
- No mixed frontend/backend files at root
- Clear separation makes development easier
- Easy to navigate and understand

---

## 🎯 Benefits of This Structure

1. **Clarity** - Easy to find frontend vs backend files
2. **Independence** - Each part has its own dependencies
3. **Deployment** - Deploy frontend and backend separately
4. **Scalability** - Can add more services (e.g., admin panel, mobile app)
5. **Team Work** - Frontend and backend developers work in separate folders
6. **Maintenance** - Easy to update one without affecting the other

---

## ✨ Quick Reference

| What | Where |
|------|-------|
| React components | `frontend/src/components/` |
| Dashboard pages | `frontend/src/components/pages/` |
| API client | `frontend/src/components/utils/backend.ts` |
| Frontend config | `frontend/vite.config.ts`, `frontend/vercel.json` |
| API routes | `backend/src/routes/` |
| Business logic | `backend/src/services/` |
| Database | `backend/src/db-postgres.js` |
| Backend config | `backend/.env.example`, `backend/render.yaml` |
| Main docs | Root level (README.md, DELIVERY_SUMMARY.md) |

---

**Project is now cleanly organized and ready for development! 🎉**
