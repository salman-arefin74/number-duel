import { motion } from 'framer-motion';

interface RoundScoreboardProps {
  bestOf: 3 | 5;
  userScore: number;
  computerScore: number;
  currentRound: number;
}

export default function RoundScoreboard({
  bestOf,
  userScore,
  computerScore,
  currentRound,
}: RoundScoreboardProps) {
  return (
    <motion.div
      className="flex items-center justify-center gap-6 md:gap-10"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1 }}
    >
      <div className="flex items-center gap-3">
        <span className="text-cyan-glow font-display font-bold text-sm uppercase tracking-wider">You</span>
        <div className="flex gap-1.5">
          {Array.from({ length: Math.ceil(bestOf / 2) }).map((_, i) => (
            <div
              key={i}
              className={`
                w-3.5 h-3.5 rounded-full transition-all duration-500
                ${i < userScore
                  ? 'bg-cyan-glow shadow-[0_0_10px_rgba(0,245,255,0.6)]'
                  : 'bg-gray-700/50 border border-gray-600/30'
                }
              `}
            />
          ))}
        </div>
      </div>

      <div className="text-center">
        <p className="text-gray-500 text-xs uppercase tracking-widest font-display">Round</p>
        <p className="font-display font-black text-2xl text-white">{currentRound}</p>
        <p className="text-gray-600 text-xs font-body">of {bestOf}</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex gap-1.5">
          {Array.from({ length: Math.ceil(bestOf / 2) }).map((_, i) => (
            <div
              key={i}
              className={`
                w-3.5 h-3.5 rounded-full transition-all duration-500
                ${i < computerScore
                  ? 'bg-magenta-glow shadow-[0_0_10px_rgba(255,0,229,0.6)]'
                  : 'bg-gray-700/50 border border-gray-600/30'
                }
              `}
            />
          ))}
        </div>
        <span className="text-magenta-glow font-display font-bold text-sm uppercase tracking-wider">CPU</span>
      </div>
    </motion.div>
  );
}
