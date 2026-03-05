import { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MicOff, Volume2, Square, Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { ChatBubble, VoiceButton, TypingIndicator } from '@/components/interview';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import type { Message, Evaluation } from '@/types';

export function InterviewPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { config, initialQuestion } = location.state || {};
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(initialQuestion || '');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { transcript, isListening, startListening, stopListening, isSupported: sttSupported } = useSpeechRecognition();
  const { speak, stop: stopSpeaking, isSpeaking, isSupported: ttsSupported } = useTextToSpeech();

  useEffect(() => {
    const fetchQuestion = async () => {
      if (!sessionId) {
        navigate('/');
        return;
      }
      
      if (initialQuestion) {
        setMessages([
          {
            id: crypto.randomUUID(),
            type: 'question',
            content: initialQuestion,
            timestamp: new Date(),
          },
        ]);
        setIsLoading(false);
        return;
      }
      
      try {
        const response = await fetch(`/api/sessions/${sessionId}`);
        const result = await response.json();
        
        if (result.success && result.data.exchanges.length > 0) {
          const lastExchange = result.data.exchanges[result.data.exchanges.length - 1];
          if (lastExchange.question) {
            const questionMsg: Message = {
              id: crypto.randomUUID(),
              type: 'question',
              content: lastExchange.question,
              timestamp: new Date(lastExchange.timestamp),
            };
            setMessages([questionMsg]);
            setCurrentQuestion(lastExchange.question);
          }
        }
        } catch (error) {
          console.error('Failed to fetch session:', error);
        } finally {
          setIsLoading(false);
        }
      };
      
      if (!sessionId) {
        setIsLoading(false);
        navigate('/');
        return;
      }
      
      fetchQuestion();
    }, [sessionId, initialQuestion, navigate]);

  useEffect(() => {
    if (transcript) {
      setAnswer(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmitAnswer = async () => {
    if (!answer.trim() || !sessionId) return;

    setIsSubmitting(true);
    const userAnswer = answer.trim();

    setMessages(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        type: 'answer',
        content: userAnswer,
        timestamp: new Date(),
      },
    ]);

    setAnswer('');

    try {
      const response = await fetch('/api/interview/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, answer: userAnswer }),
      });

      const result = await response.json();

      if (result.success) {
        const evaluation: Evaluation = result.data.evaluation;

        setMessages(prev => [
          ...prev,
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEndInterview = async () => {
    if (!sessionId) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/interview/end', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });

      const result = await response.json();

      if (result.success) {
        navigate('/summary', {
          state: {
            sessionId,
            summary: result.data.summary,
            overallScore: result.data.overallScore,
            duration: result.data.duration,
          },
        });
      }
    } catch (error) {
      console.error('Failed to end interview:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeakQuestion = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speak(currentQuestion);
    }
  };

  const toggleVoiceInput = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-orbs flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-white border-t-transparent rounded-full"
            />
          </div>
          <p className="text-textSecondary">Loading interview...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-orbs">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h1 className="text-2xl font-bold text-textPrimary">Interview Session</h1>
            <p className="text-textSecondary text-sm">
              {config?.role} • {config?.topic} • {config?.difficulty}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleEndInterview} isLoading={isLoading}>
            <Square className="w-4 h-4 mr-2" />
            End Interview
          </Button>
        </motion.div>

        <Card variant="glass" className="h-[calc(100vh-200px)] flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
            {messages.map((message) => (
              <ChatBubble key={message.id} message={message} />
            ))}
            {isSubmitting && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 mb-3">
              {ttsSupported && currentQuestion && (
                <Button variant="ghost" size="sm" onClick={handleSpeakQuestion}>
                  {isSpeaking ? <MicOff className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
              )}
              <span className="text-textMuted text-sm">
                Question {messages.filter(m => m.type === 'question').length}
              </span>
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <Textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your answer here or use voice input..."
                  className="min-h-[80px]"
                  disabled={isSubmitting}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmitAnswer();
                    }
                  }}
                />
              </div>
              <div className="flex flex-col gap-2">
                {sttSupported && (
                  <VoiceButton
                    isListening={isListening}
                    onToggle={toggleVoiceInput}
                    disabled={isSubmitting}
                  />
                )}
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={!answer.trim() || isSubmitting}
                  isLoading={isSubmitting}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
