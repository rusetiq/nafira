# 🚀 Quick Start - Windows

## Option 1: Using Batch Files (Easiest)

### Step 1: Install
Double-click `install.bat` and wait for it to complete.

### Step 2: Start
Double-click `start.bat` to start both frontend and backend.

### Step 3: Open Browser
Go to http://localhost:3000

### Step 4: Login
- Email: `demo@nafira.app`
- Password: `demo123`

---

## Option 2: Using Command Prompt

Open Command Prompt (cmd.exe) in the project folder and run:

```cmd
# Install dependencies
npm install
cd server
npm install
npm run init-db
cd ..

# Start the app
npm run dev
```

Then open http://localhost:3000

---

## ⚠️ PowerShell Script Execution Issue

If you see an error about "running scripts is disabled", you have two options:

### Option A: Use Command Prompt (cmd.exe) instead of PowerShell
1. Press `Win + R`
2. Type `cmd` and press Enter
3. Navigate to your project folder
4. Run the commands above

### Option B: Enable PowerShell scripts (Admin required)
1. Open PowerShell as Administrator
2. Run: `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`
3. Type `Y` and press Enter
4. Close and reopen PowerShell

---

## 📝 What Each File Does

- **install.bat** - Installs all dependencies and sets up database
- **start.bat** - Starts both frontend and backend servers
- **README.md** - Full documentation
- **SETUP.md** - Detailed setup instructions

---

## 🐛 Troubleshooting

### "Port 3000 already in use"
Another app is using that port. Either close it or press `Y` when asked to use a different port.

### "Port 5000 already in use"
Edit `server/.env` and change `PORT=5000` to `PORT=5001`
Then edit `.env` and change the API URL to match.

### Can't login
Make sure you ran `install.bat` or `npm run server:init` to create the database.

### Database errors
Delete `server/database/nafira.db` and run `install.bat` again.

---

## ✅ Next Steps

After logging in:
1. Go to **Dashboard** - See your health stats
2. Click **Analyze new meal** - Upload a meal photo
3. Check **History** - View your meal timeline
4. Visit **Profile** - Update your information

Enjoy tracking your meals! 🍽️
