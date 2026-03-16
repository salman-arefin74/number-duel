import { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

interface WinCelebrationProps {
  winner: 'user' | 'computer';
  isMatchEnd: boolean;
  userScore: number;
  computerScore: number;
  computerSecret?: number | null;
  onNext: () => void;
  onRestart: () => void;
  onHome: () => void;
}

export default function WinCelebration({
  winner,
  isMatchEnd,
  userScore,
  computerScore,
  computerSecret,
  onNext,
  onRestart,
  onHome,
}: WinCelebrationProps) {
  useEffect(() => {
    if (winner === 'user') {
      const duration = isMatchEnd ? 4000 : 2000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#00f5ff', '#00b4d8', '#0077b6'],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#00f5ff', '#00b4d8', '#0077b6'],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [winner, isMatchEnd]);

  const isUser = winner === 'user';

  return (
    <motion.div
      className="fixed inset-0 z-40 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <motion.div
        style={{ padding: 48 }}
        className="relative glass rounded-3xl max-w-lg mx-4 text-center space-y-6"
        initial={{ scale: 0.3, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.3, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        <motion.div
          className="text-7xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.6, repeat: 2 }}
        >
          {isUser ? '🏆' : '🤖'}
        </motion.div>

        <div>
          <motion.h2
            className={`font-display text-4xl font-black ${isUser ? 'text-cyan-glow' : 'text-magenta-glow'}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {isMatchEnd
              ? (isUser ? 'YOU WIN THE MATCH!' : 'COMPUTER WINS!')
              : (isUser ? 'ROUND WON!' : 'ROUND LOST!')
            }
          </motion.h2>

          <motion.p
            className="text-gray-400 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {isMatchEnd
              ? `Final Score: ${userScore} – ${computerScore}`
              : `Score: ${userScore} – ${computerScore}`
            }
          </motion.p>

          {computerSecret && (
            <motion.p
              className="text-gray-500 text-sm mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Computer's number was <span className="text-magenta-glow font-bold">{computerSecret}</span>
            </motion.p>
          )}
        </div>

        <motion.div
          className="flex gap-4 justify-center flex-wrap"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {isMatchEnd ? (
            <>
              <motion.button
                onClick={onRestart}
                style={{ padding: '16px 40px' }}
                className="
                  rounded-xl font-display font-bold
                  bg-gradient-to-r from-cyan-glow to-magenta-glow text-gray-950
                  hover:shadow-[0_0_30px_rgba(0,245,255,0.4)]
                  transition-shadow duration-300 cursor-pointer
                "
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                PLAY AGAIN
              </motion.button>
              <motion.button
                onClick={onHome}
                style={{ padding: '16px 40px' }}
                className="
                  rounded-xl font-display font-bold
                  glass border border-gray-500/30 text-gray-300
                  hover:border-gray-400/50 hover:text-white
                  hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]
                  transition-all duration-300 cursor-pointer
                "
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                RETURN HOME
              </motion.button>
            </>
          ) : (
            <motion.button
              onClick={onNext}
              style={{ padding: '16px 40px' }}
              className="
                rounded-xl font-display font-bold
                bg-gradient-to-r from-cyan-glow/20 to-magenta-glow/20
                border border-cyan-glow/30 text-white
                hover:border-cyan-glow/50 hover:shadow-[0_0_20px_rgba(0,245,255,0.2)]
                transition-all duration-300 cursor-pointer
              "
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              NEXT ROUND
            </motion.button>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
