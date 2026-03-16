import { motion, AnimatePresence } from 'framer-motion';
import type { GuessEntry } from '../hooks/useGameState';

interface GuessHistoryProps {
  entries: GuessEntry[];
  accent: 'cyan' | 'magenta';
}

export default function GuessHistory({ entries, accent }: GuessHistoryProps) {
  const colors = accent === 'cyan'
    ? { border: 'border-cyan-glow/20', text: 'text-cyan-glow', num: 'text-cyan-300' }
    : { border: 'border-magenta-glow/20', text: 'text-magenta-glow', num: 'text-pink-300' };

  return (
    <div className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-1">
      <AnimatePresence mode="popLayout">
        {entries.map((entry, i) => (
          <motion.div
            key={`${entry.turn}-${entry.guess}-${i}`}
            layout
            initial={{ opacity: 0, x: accent === 'cyan' ? -20 : 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            style={{ padding: '12px 16px' }}
            className={`
              flex items-center justify-between gap-3 rounded-xl
              glass ${colors.border} border
            `}
          >
            <span className="text-gray-500 text-xs font-mono w-6">#{i + 1}</span>
            <span className={`font-display font-bold text-lg ${colors.num} flex-1 text-center`}>
              {entry.guess}
            </span>
            <FeedbackBadge feedback={entry.feedback} />
          </motion.div>
        ))}
      </AnimatePresence>

      {entries.length === 0 && (
        <div className="flex items-center justify-center h-full text-gray-600 text-sm">
          No guesses yet
        </div>
      )}
    </div>
  );
}

function FeedbackBadge({ feedback }: { feedback: string | null }) {
  if (!feedback) return null;

  if (feedback === 'correct') {
    return (
      <span style={{ padding: '4px 10px' }} className="text-neon-green text-xs font-bold rounded-md bg-neon-green/10">
        CORRECT
      </span>
    );
  }

  const isHigher = feedback === 'higher';
  return (
    <span
      style={{ padding: '4px 10px' }}
      className={`
        text-xs font-bold rounded-md flex items-center gap-1
        ${isHigher
          ? 'text-orange-400 bg-orange-400/10'
          : 'text-blue-400 bg-blue-400/10'
        }
      `}
    >
      {isHigher ? '▲' : '▼'}
      {isHigher ? 'Higher' : 'Lower'}
    </span>
  );
}
