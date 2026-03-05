# InterviuX — AI Voice Interview Simulator

## Project Overview

**InterviuX** is a production-grade, resume-level SaaS application that simulates realistic technical interviews with voice interaction, real-time feedback, structured scoring, and performance tracking.

---

## Core Product Idea

### User Flow
1. User selects role: SDE, Frontend, Backend, Full-Stack
2. User selects topic: DSA, System Design, JavaScript, React, Node.js, Behavioral
3. User selects difficulty: Easy, Medium, Hard
4. AI acts as senior interviewer (10+ years experience)
5. AI asks questions and evaluates answers via voice
6. AI generates follow-up questions
7. Session stored in MongoDB
8. Final summary + weak areas + improvement tips

### Voice Features
- **Speech-to-Text**: Web Speech API with Whisper API fallback
- **Text-to-Speech**: SpeechSynthesis API for AI responses

### Streaming
- AI responses streamed via Server-Sent Events (SSE) for natural chat experience

---

## Tech Stack

### Frontend
- React 18+
- Vite
- TypeScript
- TailwindCSS
- Framer Motion (animations)
- Recharts (performance dashboard)

### Backend
- Node.js
- Express
- TypeScript
- MongoDB (Mongoose)
- Vercel AI SDK (ai package)
- Groq Llama 3.3 70B

### Validation
- Zod (strict validation of AI output)

---

## Architecture

### Backend Structure
```
src/
├── controllers/
├── services/
├── routes/
├── models/
├── middleware/
├── validators/
├── utils/
├── ai/
├── types/
└── index.ts
```

### Frontend Structure
```
src/
├── components/
├── features/
├── hooks/
├── services/
├── pages/
├── animations/
├── types/
├── utils/
└── App.tsx
```

---

## AI Behavior

### System Prompt Requirements
The AI must:
- Act like a senior interviewer (10+ years experience)
- Ask probing follow-up questions
- Evaluate depth, clarity, correctness
- Know when to move on
- Provide structured JSON output

### Structured Output Schema
```json
{
  "score": number (0-10),
  "technicalAccuracy": string,
  "communication": string,
  "depth": string,
  "followUp": string,
  "moveToNextQuestion": boolean
}
```

---

## Database Design

### Collections

#### Users
- Basic user information
- Authentication data

#### Sessions
- role: string
- topic: string
- difficulty: string
- exchanges: Array<{question: string, answer: string, evaluation: object}>
- overallScore: number
- summary: string
- duration: number
- createdAt: timestamp

---

## Performance Dashboard

Metrics displayed:
- Score over time graph
- Topic-wise weakness analysis
- Average score per difficulty
- Number of interviews taken

---

## UI Requirements

### Design System
- Dark mode by default
- Subtle gradients
- Glassmorphism effects
- Smooth transitions
- Animated chat bubbles
- Typing indicator animation
- Voice waveform animation when user speaks
- Animated score cards
- Interactive performance charts

### Animations
- Framer Motion for transitions
- Subtle microinteractions
- Clean spacing
- Modern typography

---

## Error Handling

- Centralized error handler
- Async wrapper utility
- Input validation middleware
- Rate limiting
- Environment validation
- Graceful fallback for voice errors
- Loading states everywhere

---

## Deployment

### Environment
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

### Environment Variables Required
```
# Backend
MONGODB_URI=
GROQ_API_KEY=
PORT=

# Frontend
VITE_API_URL=
```

---

## Success Criteria

- [ ] Voice interaction works smoothly
- [ ] AI evaluates answers in structured JSON
- [ ] SSE streaming provides natural chat experience
- [ ] Performance dashboard shows accurate metrics
- [ ] Clean architecture with proper separation of concerns
- [ ] Production-ready error handling
- [ ] Professional UI that looks like a funded startup MVP
