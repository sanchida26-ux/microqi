# MICRO-QI - Industrial Air Safety Monitoring System

A full-stack web application for monitoring industrial air quality with real-time alerts.

## Features

- **Authentication**: User registration and login with JWT tokens
- **Dashboard**: Real-time sensor data visualization  
- **Settings**: Customizable alert thresholds (persisted to backend)
- **Alerts**: Active alerts with severity indicators
- **Reports**: Historical data analysis
- **Sensor Nodes**: Multi-zone sensor management

## Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite
- Tailwind CSS
- React Router
- React Query
- Recharts

**Backend:**
- Node.js + Express
- SQLite3 (local database)
- JWT Authentication
- bcryptjs (password hashing)

## Installation

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment:**
   - `.env` file is already created with default values
   - Change `JWT_SECRET` in production

3. **Start the backend server:**
```bash
npm run server
```
   - Backend runs on `http://localhost:5000`

4. **In a new terminal, start the frontend:**
```bash
npm run dev
```
   - Frontend runs on `http://localhost:8080`

5. **Or run both simultaneously:**
```bash
npm run dev:full
```

## Database

The backend automatically initializes SQLite database with:
- **Users table**: Email, hashed password
- **Settings table**: User alert thresholds
- **Component Values table**: User component states

Database file: `server/microqi.db` (created automatically)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Settings
- `GET /api/settings` - Get user settings (requires auth)
- `POST /api/settings` - Save user settings (requires auth)

### Component Values
- `GET /api/component-values` - Get all component values (requires auth)
- `POST /api/component-values` - Save single component value (requires auth)
- `POST /api/component-values/bulk` - Save multiple values (requires auth)

## Authentication

All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

Token is automatically stored in localStorage after login/registration.

## Usage

1. **Create Account**: Click "Sign Up" on the login page
2. **Configure Thresholds**: Go to Settings to customize alert values
3. **Monitor Alerts**: View active alerts on the Alerts page
4. **View Reports**: Check historical data in Reports

## Development

- Frontend code: `src/`
- Backend code: `server/`
- API utilities: `src/lib/api.ts`
- Auth context: `src/context/AuthContext.tsx`
- Protected routes: `src/components/ProtectedRoute.tsx`

## Scripts

- `npm run dev` - Start frontend dev server
- `npm run server` - Start backend server
- `npm run dev:full` - Start both frontend and backend
- `npm run build` - Build frontend for production
- `npm run lint` - Run ESLint
- `npm test` - Run tests

## Security Notes

- Passwords are hashed with bcryptjs
- JWT tokens expire after 31 days
- Change `JWT_SECRET` in production
- Use environment variables for sensitive data

## Troubleshooting

**"Backend not responding"**
- Ensure backend is running: `npm run server`
- Check if port 5000 is available

**"Failed to authenticate"**
- Clear browser localStorage and try again
- Check if user exists in database

**"Settings not saving"**
- Ensure backend is running
- Check browser console for API errors

## Future Enhancements

- Email notifications for critical alerts
- Multi-user collaboration
- Advanced data export (CSV, PDF)
- Mobile application
- WebSocket real-time updates
- Database backups and recovery
