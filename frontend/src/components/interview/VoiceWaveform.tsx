import { motion } from 'framer-motion';

interface VoiceWaveformProps {
  isActive: boolean;
  className?: string;
}

export function VoiceWaveform({ isActive, className = '' }: VoiceWaveformProps) {
  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`flex items-center gap-1 ${className}`}
    >
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="w-1 bg-white rounded-full"
          animate={{
            height: ['10px', '24px', '16px', '28px', '12px'],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.1,
            ease: 'easeInOut',
          }}
        />
      ))}
    </motion.div>
  );
}

interface VoiceButtonProps {
  isListening: boolean;
  onToggle: () => void;
  disabled?: boolean;
  className?: string;
}

export function VoiceButton({ isListening, onToggle, disabled, className = '' }: VoiceButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      onClick={onToggle}
      disabled={disabled}
      className={`
        relative w-14 h-14 rounded-xl flex items-center justify-center
        transition-all duration-300
        ${isListening 
          ? 'bg-gradient-to-br from-error to-red-600 shadow-lg shadow-error/30' 
          : 'bg-gradient-to-br from-secondary to-cyan-500 shadow-lg shadow-secondary/30'
        }
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {isListening ? (
        <VoiceWaveform isActive={true} />
      ) : (
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      )}
      
      {isListening && (
        <motion.span
          className="absolute inset-0 rounded-xl border-2 border-white/50"
          animate={{ scale: [1, 1.1, 1], opacity: [1, 0.5, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
    </motion.button>
  );
}
