# InterviuX — AI Voice Interview Simulator

A production-grade, resume-level SaaS application that simulates realistic technical interviews with voice interaction, real-time feedback, structured scoring, and performance tracking.

![InterviuX](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green) 
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)

## Features 

- 🎙️ **Voice Interaction**: Practice with voice input using Web Speech API
- 🤖 **AI-Powered Evaluation**: Get real-time feedback from AI interviewer
- 📊 **Performance Dashboard**: Track your progress over time
- 🎯 **Multiple Topics**: DSA, System Design, JavaScript, React, Node.js, Behavioral
- 📈 **Structured Scoring**: Detailed evaluation on technical accuracy, communication, depth
- 💬 **Natural Conversations**: SSE streaming for smooth interactions

## Tech Stack

### Frontend
- React 18 
- Vite
- TypeScript
- TailwindCSS
- Framer Motion
- Recharts 
- React Router

### Backend
- Node.js
- Express
- TypeScript
- MongoDB (Mongoose)
- Vercel AI SDK
- Groq Llama 3.3 70B

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB
- Groq API Key

### Installation

```bash
# Clone the repository
cd InterviuX

# Install backend dependencies
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and Groq API key

# Install frontend dependencies
cd ../frontend
npm install
cp .env.example .env
```

### Running Locally

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Open http://localhost:5173

## Project Structure

```
InterviuX/
├── backend/
│   ├── src/
│   │   ├── ai/              # AI service
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API routes
│   │   ├── types/         # TypeScript types
│   │   ├── utils/         # Utilities
│   │   ├── validators/    # Zod schemas
│   │   └── index.ts       # Entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/       # React Context
│   │   ├── hooks/         # Custom hooks
│   │   ├── pages/         # Page components
│   │   ├── services/      # API client
│   │   ├── types/         # TypeScript types
│   │   └── App.tsx        # Entry point
│   └── package.json
└── docs/
    ├── ARCHITECTURE.md
    ├── DEPLOYMENT.md
    ├── INTERVIEW_GUIDE.md
    └── SETUP.md
```

## Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://...
GROQ_API_KEY=your_groq_api_key
PORT=3001
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001
```

## Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel
```

### Backend (Render)
```bash
cd backend
# Deploy via GitHub integration
```

See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed instructions.

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Setup Guide](docs/SETUP.md)
- [Deployment](docs/DEPLOYMENT.md)
- [Interview Guide](docs/INTERVIEW_GUIDE.md)

## License

MIT

---

Built with ❤️ using React, Node.js, and Groq AI
