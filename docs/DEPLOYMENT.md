# InterviuX - Deployment Guide

## Overview

InterviuX consists of two parts that can be deployed separately:
- **Frontend**: Vercel (recommended) or any static hosting
- **Backend**: Render, Railway, or any Node.js hosting

## Deployment Architecture

```
                    ┌─────────────────┐
                    │     Browser     │
                    └────────┬────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Frontend (Vercel)                            │
│                  https://intervux.vercel.app                    │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Backend (Render)                             │
│                  https://intervux-api.onrender.com              │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   MongoDB Atlas                                 │
│              mongodb+srv://intervux-cluster                      │
└─────────────────────────────────────────────────────────────────┘
```

## Frontend Deployment (Vercel)

### Option 1: Vercel CLI

```bash
cd frontend
npm i -g vercel
vercel login
vercel
```

### Option 2: Git Integration

1. Push code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Import repository
4. Configure:
   - Framework: Vite
   - Build command: `npm run build`
   - Output directory: `dist`
5. Add environment variable:
   - `VITE_API_URL`: Your backend URL
6. Deploy

### Vercel Configuration (vercel.json)

```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "https://your-backend.onrender.com/api/$1" }
  ]
}
```

## Backend Deployment (Render)

### 1. Prepare for Deployment

Update CORS in `src/index.ts`:

```typescript
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://your-vercel-app.vercel.app' 
    : ['http://localhost:5173'],
  credentials: true,
}));
```

### 2. Deploy to Render

1. Push code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Create new Web Service
4. Connect GitHub repository
5. Configure:
   - Build command: `npm run build`
   - Start command: `npm start`
6. Add environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `GROQ_API_KEY`: Your Groq API key
   - `NODE_ENV`: `production`
   - `PORT`: `3001`
7. Deploy

## MongoDB Atlas Setup

### 1. Create Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster (M0)

### 2. Configure Network Access

1. Go to Network Access
2. Add IP: `0.0.0.0/0` (allow all for development)

### 3. Create Database User

1. Go to Database Access
2. Create user with read/write permissions

### 4. Get Connection String

1. Go to Database > Connect
2. Select "Connect your application"
3. Copy connection string
4. Replace `<password>` with your database user password

## Environment Variables

### Production Backend (.env)

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/intervux?retryWrites=true&w=majority
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
PORT=3001
NODE_ENV=production
```

### Production Frontend (.env)

```
VITE_API_URL=https://your-backend.onrender.com
```

## Custom Domain (Optional)

### Vercel

1. Go to Project Settings > Domains
2. Add your domain
3. Update DNS records as instructed

### Render

1. Go to Settings > Custom Domains
2. Add your domain
3. Update DNS CNAME record

## SSL/HTTPS

Both Vercel and Render provide free SSL certificates:
- **Vercel**: Automatic with custom domains
- **Render**: Automatic for custom domains

## Monitoring

### Backend Logs

- Render: Dashboard > Logs
- Or add logging service (Datadog, Sentry)

### Performance

- Vercel: Built-in analytics
- Add Core Web Vitals monitoring

## Security Checklist

- [ ] Enable HTTPS
- [ ] Set NODE_ENV to production
- [ ] Use strong MongoDB credentials
- [ ] Rotate API keys regularly
- [ ] Enable CORS for specific domains only
- [ ] Add rate limiting for production
- [ ] Implement authentication (future)

## Troubleshooting

### CORS Errors

Ensure frontend URL is in CORS whitelist:

```typescript
app.use(cors({
  origin: 'https://your-vercel-app.vercel.app',
  credentials: true,
}));
```

### 502 Bad Gateway (Render)

- Check backend logs
- Ensure PORT environment variable is set
- Verify build completed successfully

### Slow Response Times

- Check MongoDB connection string (should use +srv)
- Add connection pooling
- Consider Redis caching (future)

## Cost Estimation

| Service | Free Tier | Notes |
|---------|-----------|-------|
| Vercel | 100GB bandwidth | Frontend only |
| Render | 750 hours | Backend |
| MongoDB Atlas | 512MB storage | M0 cluster |
| Groq | $0/1M tokens | Free tier available |

Total: Free for development and small-scale production use.
