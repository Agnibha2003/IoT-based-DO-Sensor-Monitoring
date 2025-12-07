# DO Sensor IoT Dashboard - Complete Deployment Guide

## Project Status
✅ Git repository initialized and committed
✅ Backend dependencies installed
✅ Frontend built successfully (output in `frontend/build/`)
✅ Render and Vercel configurations ready

---

## Step 1: Push to GitHub

### Prerequisites:
- GitHub account: **Agnibha2003** (verify your username)
- Repository: https://github.com/Agnibha2003/IoT-DO-Sensor

### Option A: Using GitHub CLI (Recommended)
```powershell
# Install GitHub CLI if not already installed
# Then authenticate
gh auth login

# Navigate to project
cd "c:\Users\agnib\OneDrive\Desktop\Web dashboard\DO Sensor copy"

# Push to GitHub
git push -u origin main
```

### Option B: Using Personal Access Token (PAT)
```powershell
# Generate a PAT at https://github.com/settings/tokens
# - Select scopes: repo, read:user
# - Create token and copy it

cd "c:\Users\agnib\OneDrive\Desktop\Web dashboard\DO Sensor copy"

# When prompted for password, paste your PAT token:
git push -u origin main
```

### Option C: Using SSH Key
```powershell
# Generate SSH key (if you don't have one)
ssh-keygen -t ed25519 -C "agnibha2003@gmail.com"

# Add SSH key to GitHub: https://github.com/settings/keys

# Update remote URL
git remote set-url origin git@github.com:Agnibha2003/IoT-DO-Sensor.git

# Push to GitHub
git push -u origin main
```

---

## Step 2: Deploy Backend to Render

### Prerequisites:
1. Create a Render account: https://render.com
2. Connect your GitHub account to Render

### Steps:
1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Blueprint"**
3. Select your GitHub repository: `Agnibha2003/IoT-DO-Sensor`
4. Confirm the service configuration
   - **Service Name**: `do-sensor-backend`
   - **Region**: Oregon (or your preferred)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Configure Environment Variables:
   - `NODE_ENV`: `production`
   - `JWT_SECRET`: (Auto-generated or provide your own)
   - `CORS_ORIGIN`: `https://<YOUR-VERCEL-DOMAIN>.vercel.app`
   - `DATABASE_URL`: Will be auto-populated from PostgreSQL database

6. Configure PostgreSQL Database:
   - Render will automatically create a PostgreSQL instance
   - Database name: `do-sensor-db`
   - User credentials will be auto-generated

7. Click **"Create Blueprint"**
8. Monitor deployment in the dashboard
9. Once deployed, copy your backend URL (e.g., `https://do-sensor-backend.onrender.com`)

### Database Setup:
```powershell
# After PostgreSQL is created on Render, run migrations:
# Use Render's built-in Database Console or connect via psql:
psql -U <username> -h <host> -d do-sensor-db

# Execute your migration scripts
# Check backend/POSTGRESQL_SETUP.md for schema setup
```

---

## Step 3: Deploy Frontend to Vercel

### Prerequisites:
1. Create a Vercel account: https://vercel.com
2. Connect your GitHub account to Vercel

### Steps:
1. Go to https://vercel.com
2. Click **"Add New"** → **"Project"**
3. Select your GitHub repository: `Agnibha2003/IoT-DO-Sensor`
4. Configure Project:
   - **Root Directory**: `frontend`
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Add Environment Variables:
   ```
   VITE_API_BASE: https://do-sensor-backend.onrender.com
   ```

6. Click **"Deploy"**
7. Monitor deployment in the dashboard
8. Once complete, you'll get a URL like: `https://do-sensor-dashboard-xxx.vercel.app`

### After Deployment:
1. Update Render's `CORS_ORIGIN` with your Vercel URL
2. Verify the connection between frontend and backend

---

## Step 4: Verify Deployment

### Frontend:
```powershell
# Visit your Vercel URL
# Test login functionality
# Check if data loads from backend
```

### Backend:
```powershell
# Check health endpoint (if available)
curl https://do-sensor-backend.onrender.com/api/health

# Monitor logs in Render dashboard
```

### Database:
```powershell
# Connect to PostgreSQL using Render's Database Console
# Run test queries to verify data

# Or use local connection:
psql -U <username> -h <render-host> -d do-sensor-db
```

---

## Environment Variables Summary

### Backend (.env):
```
NODE_ENV=production
PORT=10000
CORS_ORIGIN=https://<your-vercel-domain>.vercel.app
JWT_SECRET=<generate-secure-secret>
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<database>
```

### Frontend (.env):
```
VITE_API_BASE=https://do-sensor-backend.onrender.com
```

---

## Troubleshooting

### GitHub Push Issues:
- **Error 403**: Your GitHub username doesn't match the repository owner
  - Solution: Use correct GitHub account or create personal access token
- **Error 128**: Not a git repository
  - Solution: Ensure you're in correct directory with `.git` folder

### Render Deployment Issues:
- **Build fails**: Check logs in Render dashboard
- **Database not connecting**: Verify DATABASE_URL environment variable
- **CORS errors**: Update CORS_ORIGIN with frontend URL

### Vercel Deployment Issues:
- **Build fails**: Check build logs
- **API connection fails**: Update VITE_API_BASE environment variable
- **Blank page**: Check browser console for errors

---

## Project Structure

```
DO Sensor copy/
├── backend/                    # Node.js Express API
│   ├── src/
│   │   ├── index.js           # Main server file
│   │   ├── routes/            # API endpoints
│   │   ├── services/          # Business logic
│   │   └── middleware/        # Auth, CORS, etc
│   ├── render.yaml            # Render deployment config
│   ├── package.json
│   └── .env.example
├── frontend/                   # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   └── utils/             # Helper functions
│   ├── build/                 # Production build output
│   ├── vercel.json            # Vercel deployment config
│   ├── package.json
│   └── vite.config.ts
├── .gitignore
└── README.md
```

---

## Next Steps After Deployment

1. **Test the application**:
   - Login with test credentials
   - Check sensor data loading
   - Test export functionality

2. **Monitor performance**:
   - Check Render dashboard for CPU/memory usage
   - Monitor Vercel performance metrics
   - Review error logs

3. **Set up alerts**:
   - Configure Render alerts for downtime
   - Set up Vercel email notifications

4. **Continuous deployment**:
   - Push new changes to GitHub
   - Render and Vercel will auto-deploy on main branch changes

---

**Last Updated**: December 7, 2025
**Project**: DO Sensor IoT Dashboard
**Status**: Ready for Cloud Deployment
