# Quick Setup Guide

## Step-by-Step Instructions

### 1️⃣ Install Dependencies

Open terminal in the project root and run:

```bash
npm run install:all
```

This installs dependencies for both frontend and backend.

### 2️⃣ Set Up Backend Environment

Copy the environment example file:

```bash
cd server
copy .env.example .env
```

The default `.env` should work for local development. If you need to change settings, edit `server/.env`:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
DB_PATH=./database/nafira.db
UPLOAD_PATH=./uploads
```

### 3️⃣ Initialize Database

From the project root, run:

```bash
npm run server:init
```

You should see:
```
✅ Database initialized successfully
✅ Demo user created
✅ User settings created
✅ Demo badges created

📝 Demo credentials:
   Email: demo@nafira.app
   Password: demo123
```

### 4️⃣ Start the Application

From the project root, run:

```bash
npm run dev
```

This starts both:
- **Frontend** at http://localhost:3000
- **Backend** at http://localhost:5000

### 5️⃣ Login

Open your browser to http://localhost:3000

You'll see the landing page. Click "Get Started" or navigate to `/login`

Use the demo credentials:
- **Email**: demo@nafira.app
- **Password**: demo123

## Alternative: Run Separately

If you prefer to run frontend and backend in separate terminals:

**Terminal 1 (Backend):**
```bash
npm run server
```

**Terminal 2 (Frontend):**
```bash
npm start
```

## Troubleshooting

### "Port 3000 is already in use"
Another app is using port 3000. Either:
- Close the other app
- Or the terminal will ask if you want to use a different port (press Y)

### "Port 5000 is already in use"
Change the port in `server/.env`:
```env
PORT=5001
```

Then update frontend `.env`:
```env
REACT_APP_API_URL=http://localhost:5001/api
```

### Database errors
Reset the database:
```bash
cd server
del database\nafira.db
npm run init-db
cd ..
```

### Can't login
Make sure:
1. Backend is running (check http://localhost:5000/api/health)
2. Database is initialized (`npm run server:init`)
3. Using correct credentials (demo@nafira.app / demo123)

## What's Next?

After logging in, you can:

1. **Dashboard** - View your health stats
2. **Meal Analysis** - Upload meal photos for analysis
3. **History** - View past meals and trends
4. **Profile** - Update your information and goals

## Creating Your Own Account

Instead of using the demo account:

1. Go to `/login`
2. Click "Register"
3. Fill in your details
4. Start tracking your meals!

---

Need help? Check the main README.md for detailed documentation.
