# Nafira - Metabolic Radiance Dashboard

A production-ready meal analysis and health tracking application with AI-powered insights, built with React and Node.js.

> **🚀 Want to get started quickly?** See [QUICKSTART.md](QUICKSTART.md) for Windows users or [SETUP.md](SETUP.md) for step-by-step instructions.

## 🌟 Features

- **Meal Analysis**: Upload meal photos for AI-powered nutritional analysis
- **Health Dashboard**: Track calories, macros, and health scores
- **History & Trends**: View meal history and weekly health trends
- **User Profiles**: Manage personal health goals and preferences
- **Gamification**: Earn badges and track streaks
- **Secure Authentication**: JWT-based user authentication

## 🏗️ Tech Stack

### Frontend
- React 18
- React Router v6
- Tailwind CSS
- Framer Motion (animations)
- Recharts (data visualization)
- Lucide React (icons)

### Backend
- Node.js with Express
- SQLite (better-sqlite3)
- JWT Authentication
- Bcrypt for password hashing
- Multer for file uploads

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## 🚀 Quick Start

### 1. Clone and Install Dependencies

```bash
# Install all dependencies (frontend + backend)
npm run install:all
```

### 2. Set Up Environment Variables

**Frontend** - Create `.env` in root directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

**Backend** - Copy the example file:
```bash
cd server
cp .env.example .env
```

Edit `server/.env` with your configuration:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
DB_PATH=./database/nafira.db
UPLOAD_PATH=./uploads
```

### 3. Initialize the Database

```bash
npm run server:init
```

This will:
- Create the SQLite database
- Set up all tables
- Create a demo user account

**Demo Credentials:**
- Email: `demo@nafira.app`
- Password: `demo123`

### 4. Run the Application

**Option A: Run Both Frontend and Backend Together**
```bash
npm run dev
```

**Option B: Run Separately**

Terminal 1 (Backend):
```bash
npm run server
```

Terminal 2 (Frontend):
```bash
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## 📁 Project Structure

```
nafira-app/
├── public/                 # Static files
├── src/                    # Frontend source
│   ├── components/         # Reusable UI components
│   ├── context/           # React context providers
│   ├── pages/             # Page components
│   ├── services/          # API service layer
│   └── data/              # Mock data (legacy)
├── server/                # Backend source
│   ├── config/            # Database configuration
│   ├── database/          # Database schema
│   ├── middleware/        # Express middleware
│   ├── routes/            # API routes
│   ├── scripts/           # Utility scripts
│   └── uploads/           # Uploaded meal images
└── README.md
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `PUT /api/user/settings` - Update user settings
- `GET /api/user/quick-stats` - Get dashboard stats
- `GET /api/user/badges` - Get user badges

### Meals
- `POST /api/meals` - Upload and analyze meal (with image)
- `GET /api/meals/recent` - Get recent meals
- `GET /api/meals/history` - Get meal history
- `GET /api/meals/weekly-stats` - Get weekly statistics

## 🎨 Key Features Explained

### Meal Analysis
Upload a meal photo and the system will:
1. Process the image
2. Generate nutritional analysis (macros, calories, hydration)
3. Provide AI-powered health advice
4. Calculate a health score

### Dashboard
- Real-time health statistics
- Recent meal cards with scores
- Quick access to meal analysis
- Personalized greetings

### History Page
- Complete meal timeline
- Weekly trend charts (health score & calories)
- Achievement badges
- Export functionality (UI ready)

### Profile Management
- Update personal information
- Set health goals and allergies
- Configure notification preferences
- View health profile summary

## 🔧 Development

### Frontend Development
```bash
npm start
```

### Backend Development
```bash
cd server
npm run dev
```

### Database Management

**Reset Database:**
```bash
cd server
rm database/nafira.db
npm run init-db
```

**View Database:**
You can use any SQLite browser like:
- DB Browser for SQLite
- SQLite Viewer (VS Code extension)

## 📦 Production Build

### Build Frontend
```bash
npm run build
```

### Build for Production
```bash
npm run build:prod
```

This creates an optimized production build in the `build/` folder.

### Run Production Server

1. Set environment variables:
```bash
cd server
# Edit .env file
NODE_ENV=production
FRONTEND_URL=https://your-domain.com
```

2. Start the server:
```bash
cd server
npm start
```

The server will serve both the API and the built React app.

## 🚢 Deployment

### Option 1: Traditional Hosting (VPS/Cloud)

1. Build the application:
```bash
npm run build:prod
```

2. Upload files to server
3. Install dependencies on server:
```bash
npm install --production
cd server && npm install --production
```

4. Set environment variables
5. Start with PM2 or similar:
```bash
cd server
pm2 start server.js --name nafira-api
```

### Option 2: Docker (Recommended)

Create `Dockerfile` in root:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
WORKDIR /app/server
RUN npm install --production
EXPOSE 5000
CMD ["node", "server.js"]
```

Build and run:
```bash
docker build -t nafira-app .
docker run -p 5000:5000 -e NODE_ENV=production nafira-app
```

### Option 3: Separate Deployments

**Frontend** (Netlify/Vercel):
- Deploy the `build/` folder
- Set `REACT_APP_API_URL` to your backend URL

**Backend** (Heroku/Railway/Render):
- Deploy the `server/` folder
- Set all required environment variables

## 🔒 Security Considerations

1. **Change JWT Secret**: Update `JWT_SECRET` in production
2. **Use HTTPS**: Always use HTTPS in production
3. **Rate Limiting**: Already configured (100 requests per 15 minutes)
4. **File Upload Limits**: 10MB max file size
5. **CORS**: Configure `FRONTEND_URL` for production

## 🐛 Troubleshooting

### Database Issues
```bash
# Reset database
cd server
rm database/nafira.db
npm run init-db
```

### Port Already in Use
```bash
# Change port in server/.env
PORT=5001
```

### CORS Errors
- Ensure `REACT_APP_API_URL` matches your backend URL
- Check `FRONTEND_URL` in server `.env`

### Authentication Issues
- Clear browser localStorage
- Check JWT_SECRET is set
- Verify token expiration (7 days default)

## 📝 License

This project is private and proprietary.

## 👥 Support

For issues and questions, please contact the development team.

---

**Built with ❤️ using React and Node.js**
