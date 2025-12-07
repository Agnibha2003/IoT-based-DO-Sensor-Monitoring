# Quick Start: Push & Deploy

## 1️⃣ Push to GitHub (1-2 minutes)

Choose ONE method:

### Method A: GitHub CLI (Easiest)
```powershell
gh auth login
cd "c:\Users\agnib\OneDrive\Desktop\Web dashboard\DO Sensor copy"
git push -u origin main
```

### Method B: Personal Access Token
1. Go to https://github.com/settings/tokens/new
2. Create token with "repo" scope
3. Copy token
4. Run:
   ```powershell
   cd "c:\Users\agnib\OneDrive\Desktop\Web dashboard\DO Sensor copy"
   git push -u origin main
   # Paste token when prompted for password
   ```

### Method C: SSH Key
1. Generate: `ssh-keygen -t ed25519`
2. Add to https://github.com/settings/keys
3. Run:
   ```powershell
   git remote set-url origin git@github.com:Agnibha2003/IoT-DO-Sensor.git
   git push -u origin main
   ```

---

## 2️⃣ Deploy Backend to Render (5-10 minutes)

1. Sign up: https://render.com
2. Connect GitHub account
3. Click **New** → **Blueprint**
4. Select: `Agnibha2003/IoT-DO-Sensor`
5. Confirm deployment
6. Wait for build to complete
7. Copy your backend URL (e.g., `https://do-sensor-backend.onrender.com`)

---

## 3️⃣ Deploy Frontend to Vercel (5 minutes)

1. Sign up: https://vercel.com
2. Connect GitHub account
3. Click **Add New** → **Project**
4. Select: `Agnibha2003/IoT-DO-Sensor`
5. Set **Root Directory**: `frontend`
6. Add env var: `VITE_API_BASE=<your-render-url>`
7. Click **Deploy**
8. Get your frontend URL

---

## 4️⃣ Update Configs

After getting URLs:

**In Render Dashboard** (do-sensor-backend):
- Environment Variables → `CORS_ORIGIN`
- Set to: `https://<your-vercel-url>`

**Already configured in repo**:
- `frontend/vercel.json`: Has correct Render URL
- `backend/render.yaml`: Has correct frontend URL

---

## URLs You'll Get

After deployment, you'll have:
- **Frontend**: `https://your-project.vercel.app`
- **Backend**: `https://your-project.onrender.com`

---

## Test Connection

1. Visit your Vercel frontend URL
2. Try to login
3. Check if data loads
4. Check browser console for errors

---

**⏱️ Total Time**: ~20-30 minutes
**Cost**: FREE (Render free tier + Vercel free tier)
**Status**: ✅ Ready to Deploy!
