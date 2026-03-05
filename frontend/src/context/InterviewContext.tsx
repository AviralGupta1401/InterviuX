import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Message, InterviewConfig } from '@/types';

interface InterviewContextType {
  isInterviewing: boolean;
  sessionId: string | null;
  messages: Message[];
  currentQuestion: string;
  isLoading: boolean;
  isSpeaking: boolean;
  isListening: boolean;
  config: InterviewConfig | null;
  startInterview: (config: InterviewConfig) => Promise<void>;
  submitAnswer: (answer: string) => Promise<void>;
  endInterview: () => Promise<{ summary: string; overallScore: number }>;
  setIsSpeaking: (speaking: boolean) => void;
  setIsListening: (listening: boolean) => void;
  resetInterview: () => void;
}

const InterviewContext = createContext<InterviewContextType | null>(null);

export function InterviewProvider({ children }: { children: ReactNode }) {
  const [isInterviewing, setIsInterviewing] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [config, setConfig] = useState<InterviewConfig | null>(null);

  const startInterview = useCallback(async (newConfig: InterviewConfig) => {
    setIsLoading(true);
    setConfig(newConfig);
    
    try {
      const { question, sessionId: newSessionId } = await fetch('/api/interview/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConfig),
      }).then(res => res.json()).then(d => d.data);

      setSessionId(newSessionId);
      setCurrentQuestion(question);
      setMessages([
        {
          id: crypto.randomUUID(),
          type: 'question',
          content: question,
          timestamp: new Date(),
        },
      ]);
      setIsInterviewing(true);
    } catch (error) {
      console.error('Failed to start interview:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const submitAnswer = useCallback(async (answer: string) => {
    if (!sessionId) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/interview/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, answer }),
      });
      
      const result = await response.json();

      if (result.success) {
        const evaluation = result.data.evaluation;
        
        setMessages(prev => [
          ...prev,
          {
            id: crypto.randomUUID(),
            type: 'answer',
            content: answer,
            timestamp: new Date(),
          },
          {
            id: crypto.randomUUID(),
            type: 'evaluation',
            content: '',
            timestamp: new Date(),
            evaluation,
          },
        ]);

        if (result.data.question) {
          setCurrentQuestion(result.data.question.question);
          setMessages(prev => [
            ...prev,
            {
              id: crypto.randomUUID(),
              type: 'question',
              content: result.data.question.question,
              timestamp: new Date(),
            },
          ]);
        }
      }
    } catch (error) {
      console.error('Failed to submit answer:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  const endInterview = useCallback(async () => {
    if (!sessionId) throw new Error('No active session');
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/interview/end', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setIsInterviewing(false);
        return {
          summary: result.data.summary,
          overallScore: result.data.overallScore,
        };
      }
      
      throw new Error('Failed to end interview');
    } catch (error) {
      console.error('Failed to end interview:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  const resetInterview = useCallback(() => {
    setIsInterviewing(false);
    setSessionId(null);
    setMessages([]);
    setCurrentQuestion('');
    setIsLoading(false);
    setIsSpeaking(false);
    setIsListening(false);
    setConfig(null);
  }, []);

  return (
    <InterviewContext.Provider
      value={{
        isInterviewing,
        sessionId,
        messages,
        currentQuestion,
        isLoading,
        isSpeaking,
        isListening,
        config,
        startInterview,
        submitAnswer,
        endInterview,
        setIsSpeaking,
        setIsListening,
        resetInterview,
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
}

export function useInterview() {
  const context = useContext(InterviewContext);
  if (!context) {
    throw new Error('useInterview must be used within an InterviewProvider');
  }
  return context;
}
