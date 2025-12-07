# PostgreSQL Setup Guide for DO Sensor Backend

## ✅ Quick Setup Instructions

### Option 1: Using PostgreSQL Local Installation (Windows)

#### Step 1: Install PostgreSQL
1. Download from: https://www.postgresql.org/download/windows/
2. Run the installer
3. Note your password for the `postgres` user (you'll need it)
4. Use default port: **5432**

#### Step 2: Verify Installation
Open PowerShell and run:
```powershell
psql --version
# Should show: psql (PostgreSQL) X.X
```

#### Step 3: Create Database
```powershell
# Connect to PostgreSQL as admin
psql -U postgres

# Inside psql prompt, run:
CREATE DATABASE do_sensor_db;
\q
# Exit psql
```

#### Step 4: Update .env
Edit `backend/.env` and update:
```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/do_sensor_db
```
Replace `YOUR_PASSWORD` with the password you set during installation.

---

### Option 2: Using PostgreSQL Docker (If you have Docker)

```bash
docker run --name do-sensor-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=do_sensor_db \
  -p 5432:5432 \
  -d postgres:15
```

Then use in `.env`:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/do_sensor_db
```

---

### Option 3: Cloud PostgreSQL (Recommended for Production)

Use services like:
- **Render** (https://render.com) - Free PostgreSQL
- **Supabase** (https://supabase.com) - PostgreSQL hosting
- **AWS RDS** - Managed PostgreSQL
- **DigitalOcean** - PostgreSQL droplet

Get the connection string and update `.env`:
```env
DATABASE_URL=postgresql://user:password@host:port/database
```

---

## 🚀 Verify Connection

Once PostgreSQL is running and `.env` is configured:

```bash
cd backend

# The .env file is already created
# Just run the backend
npm run dev
```

**Expected output:**
```
Server running on http://localhost:5000
✓ Connected to PostgreSQL database
✓ Schema initialized with 5 tables
```

---

## 📊 Database Schema

The backend automatically creates these tables on startup:

1. **users** - User accounts
2. **sensors** - Sensors per user
3. **readings** - Time-series DO data
4. **calibration_events** - Calibration history
5. **dac_settings** - DAC control values

No manual SQL needed! Schema auto-creates.

---

## 🧪 Test the Connection

After backend starts successfully, test with:

```bash
# In another PowerShell window
curl -X GET http://localhost:5000/health

# Should return:
# {"status":"ok"}
```

---

## 🐛 Troubleshooting

### Error: "Connection refused"
- **Cause:** PostgreSQL not running
- **Solution:** Start PostgreSQL service
  ```powershell
  # Windows
  pg_ctl -D "C:\Program Files\PostgreSQL\15\data" start
  
  # Or restart the service in Services app
  ```

### Error: "Database do_sensor_db does not exist"
- **Cause:** Database not created
- **Solution:** Create database
  ```powershell
  psql -U postgres -c "CREATE DATABASE do_sensor_db;"
  ```

### Error: "Password authentication failed"
- **Cause:** Wrong password in DATABASE_URL
- **Solution:** Update .env with correct password
  ```env
  DATABASE_URL=postgresql://postgres:CORRECT_PASSWORD@localhost:5432/do_sensor_db
  ```

### Error: "Port 5432 already in use"
- **Cause:** PostgreSQL already running or another app using port
- **Solution:** Change port in DATABASE_URL
  ```env
  DATABASE_URL=postgresql://postgres:password@localhost:5433/do_sensor_db
  # Then connect PostgreSQL to port 5433
  ```

---

## 📝 Default Credentials (Local)

After fresh PostgreSQL install:
- **Username:** postgres
- **Password:** The password you entered during installation
- **Host:** localhost
- **Port:** 5432
- **Database:** do_sensor_db (create this)

---

## ✨ Tips

1. **Keep .env secure** - Never commit `.env` to git (it's in .gitignore)
2. **Test locally first** - Before deploying to Render
3. **Backup data** - Use `pg_dump` for backups
4. **Monitor performance** - Check query logs in pgAdmin

---

## 🎉 You're Ready!

Once PostgreSQL is running and `.env` is configured:

```bash
cd backend
npm run dev
```

Backend will:
1. Connect to PostgreSQL
2. Create tables if they don't exist
3. Start server on http://localhost:5000
4. Ready for frontend to connect!

---

**Need help?** Check the error message in the terminal - it will tell you what's wrong.
