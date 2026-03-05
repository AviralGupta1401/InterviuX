# InterviuX - Interview Guide

## How to Explain This Project in Interviews

### Elevator Pitch (30 seconds)

> "I built InterviuX, a voice-enabled AI mock interview platform. Users select a role, topic, and difficulty, then practice with an AI interviewer that evaluates their answers in real-time using speech-to-text. The app provides structured feedback and tracks performance over time. It's built with React, Node.js, MongoDB, and uses Groq's Llama model for AI evaluation."

### Key Features to Highlight

1. **Full-stack Development**: End-to-end application
2. **AI Integration**: Real-time evaluation with structured output
3. **Voice Technology**: Web Speech API for STT/TTS
4. **Data Persistence**: MongoDB for session storage
5. **Real-time**: Server-Sent Events for streaming
6. **Performance Analytics**: Dashboard with Recharts

---

## System Design Discussion

### Architecture Overview

**"The app follows a clean architecture with separate frontend and backend services. The frontend is a React SPA with Vite for fast builds. The backend is Express with TypeScript. Data is stored in MongoDB, and AI processing uses Groq's Llama model."**

### Why These Choices?

| Decision | Rationale |
|----------|-----------|
| React + Vite | Fast development, good DX, large ecosystem |
| Node.js + Express | JavaScript everywhere, easy to learn |
| MongoDB | Flexible schema for interview sessions |
| Groq Llama 3.3 | Fast inference, cost-effective |
| SSE | Simpler than WebSockets for our use case |
| Web Speech API | Built-in browser support, no external API needed |

### Trade-offs Made

1. **SSE vs WebSockets**: Chose SSE for simpler unidirectional streaming
2. **Web Speech API vs Whisper**: Browser-native for lower latency, Whisper as fallback
3. **MongoDB vs PostgreSQL**: Flexible schema for evolving session data
4. **Groq vs OpenAI**: Faster inference, more cost-effective for our use case

### Challenges Faced

- **AI Output Validation**: Used Zod to ensure structured responses
- **Voice API Compatibility**: Different browser support, fallback strategy
- **Real-time Streaming**: SSE implementation with proper error handling

---

## Technical Deep Dives

### How does the AI evaluation work?

1. User answers question via voice/text
2. Backend sends answer + question to Groq Llama
3. AI generates structured JSON with scores and feedback
4. Zod validates the response
5. If invalid, retry with fallback values
6. Save to MongoDB, stream back to frontend

### Why Server-Sent Events?

- **Simplicity**: No WebSocket handshake overhead
- **Automatic reconnection**: Browser handles this
- **HTTP/2 compatible**: Works with modern protocols
- **Unidirectional**: Perfect for server → client streaming

### How does voice work?

1. **Input**: Web Speech API's SpeechRecognition
2. **Output**: SpeechSynthesis API for text-to-speech
3. **Fallback**: Can integrate Whisper for STT if needed

---

## Future Improvements

When asked "What would you improve?":

1. **Authentication**: Add JWT/OAuth for user accounts
2. **Caching**: Redis for frequently asked questions
3. **WebSockets**: For bidirectional real-time communication
4. **Better Voice**: Whisper API for higher accuracy
5. **Analytics**: More detailed performance insights
6. **Mobile App**: React Native or Expo
7. **AI Persona Selection**: Different interviewer styles
8. **Recording**: Save and replay sessions

---

## Scaling Discussion

### Current Limitations

- Single backend instance
- No caching layer
- AI requests are synchronous
- No message queue for heavy processing

### Scaling Strategy

1. **Horizontal Scaling**: Multiple backend instances behind load balancer
2. **Caching**: Redis for question bank and user sessions
3. **Message Queue**: Bull/Redis for async AI processing
4. **CDN**: Static assets via CDN
5. **Database**: Read replicas for MongoDB

### Rate Limiting

- Per-IP rate limiting (100 req/15min)
- Interview-specific limits (10/5min)
- Future: Per-user limits with authentication

---

## Security Considerations

Current:
- Input validation with Zod
- Rate limiting
- Environment variables for secrets
- CORS configuration

Future:
- Authentication (JWT/OAuth)
- API key management
- Request signing
- Audit logging

---

## Code Examples to Know

### Async Error Handling

```typescript
// Backend utility
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Usage
router.get('/sessions', asyncHandler(getAllSessions));
```

### Zod Validation

```typescript
const evaluationSchema = z.object({
  score: z.number().min(0).max(10),
  technicalAccuracy: z.string(),
  moveToNextQuestion: z.boolean(),
});

const result = await generateObject({
  model: groqModel,
  schema: evaluationSchema,
  messages,
});
```

### SSE Streaming

```typescript
res.writeHead(200, {
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-cache',
  'Connection': 'keep-alive',
});

res.write(`data: ${JSON.stringify(data)}\n\n`);
```

---

## Questions You Might Get

### Q: Why not use WebSockets?
**A**: WebSockets are for bidirectional communication. We only need server → client streaming, so SSE is simpler and has better browser support for our use case.

### Q: How do you handle AI hallucinations?
**A**: Zod validation ensures structured output. If the AI returns invalid JSON, we retry with a more specific prompt or use fallback values.

### Q: What if the user doesn't have a microphone?
**A**: The app supports both voice and text input. Users can type their answers if voice isn't available.

### Q: How does the scoring work?
**A**: The AI evaluates answers on multiple dimensions (technical accuracy, communication, depth) and provides a 0-10 score. We average scores across all questions for the overall score.

### Q: What happens if the AI API fails?
**A**: We have error handling that returns fallback evaluation values, logs the error, and allows the user to retry or continue with a new question.
