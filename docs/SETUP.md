# InterviuX - Setup Guide

## Prerequisites

- Node.js 18+
- npm or pnpm
- MongoDB (local or Atlas)
- Groq API Key

## Installation

### 1. Clone the Repository

```bash
cd InterviuX
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```env
MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/intervux?retryWrites=true&w=majority
GROQ_API_KEY=your_groq_api_key_here
PORT=3001
NODE_ENV=development
```

Start the backend:

```bash
npm run dev
```

The backend will run on `http://localhost:3001`

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file:

```env
VITE_API_URL=http://localhost:3001
```

Start the frontend:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Getting a Groq API Key

1. Go to [Groq Console](https://console.groq.com/)
2. Sign up or log in
3. Navigate to API Keys
4. Create a new API key
5. Copy it to your backend `.env`

## Getting MongoDB

### Option 1: MongoDB Atlas (Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a free cluster
4. Create a database user
5. Network access: Allow all IPs (0.0.0.0/0) for development
6. Get connection string

### Option 2: Local MongoDB

```bash
# macOS
brew install mongodb-community
brew services start mongodb-community

# Ubuntu
sudo apt install mongodb
sudo systemctl start mongodb
```

Use `mongodb://localhost:27017/intervux` as MONGODB_URI.

## Running the Application

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm run dev`
3. Open `http://localhost:5173` in your browser

## Building for Production

### Backend

```bash
cd backend
npm run build
npm start
```

### Frontend

```bash
cd frontend
npm run build
npm run preview
```

## Troubleshooting

### Port Already in Use

```bash
# Find process using port
lsof -i :3001

# Kill process
kill -9 <PID>
```

### MongoDB Connection Issues

1. Check your connection string
2. Verify network access settings in Atlas
3. Ensure database user credentials are correct

### API Errors

Check the backend console for detailed error messages. Common issues:
- Invalid Groq API key
- MongoDB connection timeout
- Rate limiting (wait and retry)

### Voice Features Not Working

1. Use Chrome or Edge (best browser support)
2. Allow microphone permissions
3. Check browser console for errors

## Environment Variables Reference

### Backend

| Variable | Description | Required |
|----------|-------------|----------|
| MONGODB_URI | MongoDB connection string | Yes |
| GROQ_API_KEY | Groq API key for AI | Yes |
| PORT | Server port (default: 3001) | No |
| NODE_ENV | Environment (development/production) | No |

### Frontend

| Variable | Description | Required |
|----------|-------------|----------|
| VITE_API_URL | Backend API URL | No |
