# NAFIRA - AI Metabolic Intelligence

A modern nutrition tracking application powered by AI that provides personalized metabolic insights and meal analysis.

## Features

- **AI-Powered Meal Analysis**: Upload meal photos for instant nutritional analysis using Gemini Vision AI
- **Personalized Insights**: Get AI-generated metabolic recommendations using Hugging Face text generation
- **Health Dashboard**: Track calories, macros, health scores, and trends
- **Meal History**: Complete timeline with weekly analytics and visualizations
- **User Profiles**: Manage health goals, allergies, and dietary preferences
- **Gamification**: Earn badges and maintain tracking streaks
- **Secure Authentication**: JWT-based user authentication with bcrypt password hashing

## Impact

- **Sustainable Food Dashboard**: Track the environmental footprint of your dietary choices and promote eco-friendly eating habits
- **Impact Score**: A holistic metric that evaluates the nutritional quality and environmental sustainability of your meals
- **Curated Wellness Library**: Access a library of expert resources on metabolic health, nutrition, and sustainable living

## Tech Stack

**Frontend**
- React 18 with React Router
- Tailwind CSS for styling
- Framer Motion for animations
- Recharts for data visualization
- Lucide React icons

**Backend**
- Node.js with Express
- SQLite database
- Hugging Face Inference API (Mistral-7B)
- Gemini Vision AI for meal analysis
- JWT authentication

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm


### Installation

1. **Install Dependencies**
```bash
npm run install:all
```

2. **Configure Environment Variables**

Create `server/.env`:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
DB_PATH=./database/nafira.db
UPLOAD_PATH=./uploads
GEMINI_API_KEY=your-gemini-api-key-here
HUGGINGFACE_API_KEY=your-huggingface-api-key-optional
# Frontend origin(s) allowed to call the API with credentials (cookies/Authorization).
# Comma-separated list.
CORS_ORIGIN=http://localhost:5000,http://127.0.0.1:5000
```

Create `.env` in root:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

3. **Initialize Database**
```bash
npm run server:init
```

Demo credentials:
- Email: `demo@nafira.app`
- Password: `demo123`

4. **Run Application**

**Windows**: Right-click `start.bat` and select "Run as administrator"

**Manual**:
```bash
npm run dev
```

Access at:
- App (frontend + API): http://localhost:5000
- Backend API: http://localhost:5000/api

## Internet Accessibility

The frontend is configured to run on port 80 for easy internet access.

### Local Network Access

1. Find your local IP: `ipconfig`
2. Access from other devices: `http://<your-local-ip>`

### Internet Access

1. **Configure Windows Firewall**:
   - Allow incoming connections on port 80
   - Windows Defender Firewall → Advanced Settings → Inbound Rules

2. **Configure Router**:
   - Forward port 80 to your machine's local IP
   - Access router settings (usually 192.168.1.1)

3. **Access**:
   - Use your public IP: `http://<your-public-ip>`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `PUT /api/user/settings` - Update settings
- `GET /api/user/quick-stats` - Dashboard statistics
- `GET /api/user/badges` - User badges
- `GET /api/user/ai-focus` - AI-generated insights

### Meals
- `POST /api/meals` - Upload and analyze meal
- `GET /api/meals/recent` - Recent meals
- `GET /api/meals/history` - Meal history
- `GET /api/meals/weekly-stats` - Weekly statistics

## Project Structure

```
app2/
├── .env                    # Frontend environment variables
├── .env.example           # Frontend env template
├── README.md              # Project documentation
├── package.json           # Frontend dependencies
├── start.bat              # Windows startup script
├── install.bat            # Windows install script
├── src/                   # Frontend source
│   ├── components/        # UI components
│   ├── context/          # React context
│   ├── pages/            # Page components
│   └── services/         # API service
└── server/               # Backend
    ├── .env              # Backend environment variables
    ├── .env.example      # Backend env template
    ├── package.json      # Backend dependencies
    ├── server.js         # Express server
    ├── config/           # Database config
    ├── routes/           # API routes
    ├── services/         # AI services
    │   ├── huggingfaceService.js  # Hugging Face integration
    │   └── geminiService.js       # Gemini Vision AI
    └── database/         # SQLite database
```

## AI Integration

### Hugging Face Text Generation

The app uses Mistral-7B-Instruct-v0.2 for generating personalized nutrition insights:
- Analyzes user profile, goals, and meal history
- Generates contextual metabolic recommendations
- Falls back to smart insights if API is unavailable

### Gemini Vision AI

Processes meal photos to extract:
- Ingredient identification
- Nutritional information (calories, macros)
- Health scores and recommendations

## Development

### Frontend
```bash
npm start
```

### Backend
```bash
cd server
npm run dev
```

### Reset Database
```bash
cd server
rm database/nafira.db
npm run init-db
```

## Production Build

```bash
npm run build:prod
```

Deploy the `build/` folder (frontend) and `server/` folder (backend) separately or together.

## Security

- JWT-based authentication with 7-day token expiration
- Bcrypt password hashing
- Rate limiting (100 requests per 15 minutes)
- File upload limits (10MB max)
- CORS configuration
- Helmet security headers

## Troubleshooting

**Port 80 Access Denied**
- Run as administrator
- Or change PORT in `.env` to a higher port (e.g., 3000)

**Database Issues**
```bash
cd server
rm database/nafira.db
npm run init-db
```

**CORS Errors**
- Verify `REACT_APP_API_URL` matches backend URL
- Check CORS allowed origins in `server/server.js`

**AI API Errors**
- Check API keys in `.env`
- Verify internet connection
- App will fall back to smart insights automatically

## License

This project is private and proprietary.

---

**Built with ❤️ for metabolic health and wellness**
