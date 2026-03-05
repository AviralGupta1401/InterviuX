# InterviuX - Architecture Documentation

## Overview

InterviuX is a production-grade SaaS application that provides AI-powered voice interview simulation. The architecture follows clean architecture principles with clear separation of concerns between frontend and backend.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐│
│  │   Pages     │  │ Components  │  │      Context/Hooks       ││
│  │ - Home      │  │ - UI        │  │ - InterviewContext       ││
│  │ - Interview │  │ - Interview │  │ - useSpeechRecognition   ││
│  │ - Dashboard │  │ - Dashboard │  │ - useTextToSpeech        ││
│  │ - Summary   │  └─────────────┘  └─────────────────────────┘│
│  └─────────────┘                                                │
│         │                                                        │
│         ▼                                                        │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    Services Layer                           ││
│  │              api.ts (REST + SSE client)                    ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Backend                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    Routes Layer                              ││
│  │         sessionRoutes.ts  │  questionRoutes.ts             ││
│  └─────────────────────────────────────────────────────────────┘│
│         │                                                        │
│         ▼                                                        │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                Controllers Layer                            ││
│  │     sessionController.ts  │  questionController.ts         ││
│  └─────────────────────────────────────────────────────────────┘│
│         │                                                        │
│         ▼                                                        │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                  Services Layer                              ││
│  │                      AI Service                              ││
│  │           (Groq + Vercel AI SDK + Zod)                      ││
│  └─────────────────────────────────────────────────────────────┘│
│         │                                                        │
│         ▼                                                        │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                   Data Layer                                  ││
│  │              MongoDB + Mongoose Models                       ││
│  │              Session │ User │ Question                       ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

## Clean Architecture Principles

### Backend Structure

```
backend/src/
├── controllers/     # Request handlers, business logic orchestration
├── services/        # Business logic, external integrations
├── routes/          # Route definitions, endpoint organization
├── models/          # MongoDB/Mongoose schemas
├── middleware/      # Express middleware (error handling, rate limiting)
├── validators/     # Zod validation schemas
├── utils/          # Utility functions (DB, async handler, SSE)
├── ai/             # AI service, prompt engineering
├── types/          # TypeScript type definitions
└── index.ts       # Application entry point
```

### Frontend Structure

```
frontend/src/
├── components/
│   ├── ui/         # Reusable UI components (Button, Card, Input)
│   ├── interview/ # Interview-specific components
│   └── dashboard/  # Dashboard charts and metrics
├── features/      # Feature modules
├── hooks/          # Custom React hooks (voice APIs)
├── services/       # API client, external services
├── pages/          # Page components
├── context/        # React Context providers
├── types/          # TypeScript type definitions
├── utils/         # Utility functions
└── App.tsx        # Application entry point
```

## Server-Sent Events (SSE)

### Why SSE?

SSE is used for streaming AI responses to the frontend because:

1. **Unidirectional**: Server sends updates, client receives - perfect for our use case
2. **Automatic reconnection**: Browsers automatically reconnect on disconnect
3. **Lightweight**: No WebSocket overhead, simpler protocol
4. **HTTP/2 compatible**: Works seamlessly with HTTP/2

### Implementation

The backend implements SSE through the `SSEStream` utility:

```typescript
// backend/src/utils/sse.ts
export class SSEStream {
  private res: Response;
  
  constructor(res: Response) {
    setupSSE(res);  // Sets proper headers
  }
  
  send(event: string, data: unknown): void {
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }
  
  end(): void {
    res.end();
  }
}
```

Frontend connects via EventSource:

```typescript
const eventSource = new EventSource('/api/interview/start', {
  withCredentials: true,
});

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  // Handle data
};
```

## AI Structured Validation

### Why Zod?

Zod is used for strict validation of AI outputs because:

1. **TypeScript-first**: Inferred types from schemas
2. **Declarative**: Clear, readable validation rules
3. **Composability**: Easy to combine and nest schemas
4. **Error handling**: Detailed error messages

### Evaluation Schema

```typescript
// backend/src/validators/index.ts
const evaluationSchema = z.object({
  score: z.number().min(0).max(10),
  technicalAccuracy: z.string(),
  communication: z.string(),
  depth: z.string(),
  followUp: z.string(),
  moveToNextQuestion: z.boolean(),
});
```

The AI service uses Vercel AI SDK's `generateObject` for structured output:

```typescript
// backend/src/ai/service.ts
const result = await generateObject({
  model: this.client,
  schema: evaluationSchema,
  messages: [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: prompt },
  ],
});
```

If validation fails, the system automatically retries with fallback values.

## Voice APIs

### Speech-to-Text (Web Speech API)

```typescript
// frontend/src/hooks/useSpeechRecognition.ts
const recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.interimResults = true;
recognition.lang = 'en-US';

recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  setTranscript(transcript);
};
```

**Browser Support**: Chrome, Edge, Safari (with prefixes)
**Fallback**: Whisper API integration (future enhancement)

### Text-to-Speech (SpeechSynthesis API)

```typescript
// frontend/src/hooks/useTextToSpeech.ts
const utterance = new SpeechSynthesisUtterance(text);
utterance.rate = 1;
utterance.pitch = 1;
utterance.voice = voices.find(v => v.lang.startsWith('en'));

window.speechSynthesis.speak(utterance);
```

## MongoDB Schema Design

### Collections

1. **Users**: Basic authentication and profile data
2. **Sessions**: Interview sessions with full exchange history
3. **Questions**: Question bank for different roles/topics/difficulties

### Session Schema

```typescript
// backend/src/models/Session.ts
const SessionSchema = new Schema({
  userId: { type: ObjectId, ref: 'User' },
  role: { type: String, enum: ['SDE', 'Frontend', 'Backend', 'Full-Stack'] },
  topic: { type: String, enum: ['DSA', 'System Design', 'JavaScript', 'React', 'Node.js', 'Behavioral'] },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'] },
  exchanges: [{
    question: String,
    answer: String,
    evaluation: {
      score: Number,
      technicalAccuracy: String,
      communication: String,
      depth: String,
      followUp: String,
      moveToNextQuestion: Boolean,
    },
    timestamp: Date,
  }],
  overallScore: Number,
  summary: String,
  duration: Number,
}, { timestamps: true });
```

### Indexing Strategy

- `{ createdAt: -1 }` - For sorting recent sessions
- `{ userId: 1, createdAt: -1 }` - For user-specific queries
- `{ role: 1, topic: 1, difficulty: 1 }` - For question lookup

## Error Handling

### Middleware Stack

1. **Environment Validator**: Ensures required env vars are set
2. **Rate Limiter**: Prevents abuse (100 req/15min for API, 10 req/5min for interviews)
3. **Async Handler**: Catches async errors and forwards to error handler
4. **Central Error Handler**: Formats and logs all errors

### Error Response Format

```json
{
  "success": false,
  "error": {
    "message": "Human-readable error message",
    "details": "Technical details (dev only)",
    "stack": "Error stack trace (dev only)"
  }
}
```

## Scalability Considerations

### Current Limitations

1. **In-memory AI state**: AI conversation history is rebuilt per request
2. **No caching**: Questions and evaluations computed fresh each time
3. **Single MongoDB connection**: Not optimized for high concurrency

### Future Enhancements

1. **Redis caching**: Cache frequently asked questions
2. **Message queues**: Offload AI processing to background jobs
3. **Horizontal scaling**: Stateless backend with load balancer
4. **CDN**: Static asset delivery via CDN
5. **WebSockets**: For more responsive real-time updates

### Rate Limiting Strategy

- **API routes**: 100 requests per 15 minutes
- **Interview endpoints**: 10 requests per 5 minutes
- **Per-IP limiting**: Prevents distributed attacks
- **Response headers**: X-RateLimit-Limit, X-RateLimit-Remaining

## Security

### Implemented

1. **CORS**: Configured for production domain
2. **Rate limiting**: Prevents abuse
3. **Input validation**: Zod schemas for all inputs
4. **Environment variables**: Secrets not in code
5. **TypeScript strict mode**: Catches type errors at compile time

### Recommended for Production

1. **Authentication**: JWT or OAuth2
2. **HTTPS**: TLS/SSL for all traffic
3. **API keys**: For paid AI services
4. **Request signing**: For sensitive operations
5. **Audit logging**: Track all API access
