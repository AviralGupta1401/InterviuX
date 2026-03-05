import { motion } from 'framer-motion';
import type { Message } from '@/types';

interface ChatBubbleProps {
  message: Message;
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isQuestion = message.type === 'question';
  const isEvaluation = message.type === 'evaluation';

  if (isEvaluation && message.evaluation) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="mb-4"
      >
        <div className="glass rounded-2xl p-5 border-l-4 border-l-accent">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {message.evaluation.score}
              </span>
            </div>
            <div>
              <p className="text-textPrimary font-semibold">AI Evaluation</p>
              <p className="text-textMuted text-xs">Real-time feedback</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-surfaceElevated">
              <p className="text-xs text-primary uppercase tracking-wider mb-1.5 font-medium">Technical Accuracy</p>
              <p className="text-textSecondary text-sm">{message.evaluation.technicalAccuracy}</p>
            </div>
            <div className="p-3 rounded-xl bg-surfaceElevated">
              <p className="text-xs text-secondary uppercase tracking-wider mb-1.5 font-medium">Communication</p>
              <p className="text-textSecondary text-sm">{message.evaluation.communication}</p>
            </div>
            <div className="p-3 rounded-xl bg-surfaceElevated">
              <p className="text-xs text-accent uppercase tracking-wider mb-1.5 font-medium">Depth</p>
              <p className="text-textSecondary text-sm">{message.evaluation.depth}</p>
            </div>
            {message.evaluation.followUp && (
              <div className="pt-4 border-t border-white/10">
                <p className="text-xs text-primary uppercase tracking-wider mb-2 font-medium">Follow-up Question</p>
                <p className="text-textSecondary text-sm">{message.evaluation.followUp}</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`mb-4 ${isQuestion ? 'mr-8' : 'ml-8'}`}
    >
      <div
        className={`
          p-5 rounded-2xl
          ${isQuestion 
            ? 'bg-gradient-to-br from-primary/20 via-orange-500/10 to-accent/20 border border-primary/20' 
            : 'bg-surfaceElevated border border-white/5'
          }
        `}
      >
        <div className="flex items-start gap-3">
          <div
            className={`
              w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
              ${isQuestion ? 'bg-gradient-to-br from-primary to-orange-500' : 'bg-gradient-to-br from-secondary to-cyan-500'}
            `}
          >
            {isQuestion ? (
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-textMuted mb-2 font-medium">
              {isQuestion ? 'AI Interviewer' : 'You'}
            </p>
            <p className="text-textPrimary whitespace-pre-wrap leading-relaxed">{message.content}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
