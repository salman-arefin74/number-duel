import { motion } from 'framer-motion';

interface RangeBarProps {
  low: number;
  high: number;
  accent: 'cyan' | 'magenta';
  label?: string;
}

export default function RangeBar({ low, high, accent, label }: RangeBarProps) {
  const leftPercent = ((low - 1) / 99) * 100;
  const widthPercent = ((high - low) / 99) * 100;

  const colors = accent === 'cyan'
    ? { bg: 'bg-cyan-glow/20', fill: 'bg-cyan-glow', shadow: 'shadow-cyan-glow/30', text: 'text-cyan-glow' }
    : { bg: 'bg-magenta-glow/20', fill: 'bg-magenta-glow', shadow: 'shadow-magenta-glow/30', text: 'text-magenta-glow' };

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <p className={`text-xs font-medium uppercase tracking-wider ${colors.text} opacity-60`}>
          {label}
        </p>
      )}
      <div className={`relative h-3 rounded-full ${colors.bg} overflow-hidden`}>
        <motion.div
          className={`absolute top-0 h-full rounded-full ${colors.fill} shadow-lg ${colors.shadow}`}
          initial={false}
          animate={{
            left: `${leftPercent}%`,
            width: `${Math.max(widthPercent, 1)}%`,
          }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          style={{ opacity: 0.7 }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500 font-mono">
        <span>{low}</span>
        <span>{high}</span>
      </div>
    </div>
  );
}
