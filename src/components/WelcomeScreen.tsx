import { motion } from 'framer-motion';

interface WelcomeScreenProps {
  bestOf: 3 | 5;
  onSetBestOf: (v: 3 | 5) => void;
  onStart: () => void;
}

export default function WelcomeScreen({ bestOf, onSetBestOf, onStart }: WelcomeScreenProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full gap-12 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center space-y-4">
        <motion.h1
          className="font-display text-6xl md:text-8xl font-black tracking-wider"
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <span className="bg-gradient-to-r from-cyan-glow via-blue-400 to-magenta-glow bg-clip-text text-transparent">
            NUMBER
          </span>
          <br />
          <span className="bg-gradient-to-r from-magenta-glow via-pink-400 to-cyan-glow bg-clip-text text-transparent">
            DUEL
          </span>
        </motion.h1>

        <motion.p
          className="text-gray-400 text-lg md:text-xl max-w-md mx-auto font-body"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Pick a secret number. Guess your opponent's. Outsmart the machine.
        </motion.p>
      </div>

      <motion.div
        className="flex flex-col items-center gap-8"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="text-center space-y-4">
          <p className="text-gray-300 text-sm font-medium uppercase tracking-widest">
            Match Length
          </p>
          <div className="flex gap-5">
            {([3, 5] as const).map(n => (
              <button
                key={n}
                onClick={() => onSetBestOf(n)}
                style={{ padding: '16px 36px' }}
                className={`
                  rounded-2xl font-display font-bold text-lg transition-all duration-300 cursor-pointer
                  ${bestOf === n
                    ? 'bg-gradient-to-r from-cyan-glow/20 to-magenta-glow/20 border-2 border-cyan-glow/50 text-white shadow-lg shadow-cyan-glow/20'
                    : 'glass text-gray-400 hover:text-white hover:border-white/20'
                  }
                `}
              >
                Best of {n}
              </button>
            ))}
          </div>
        </div>

        <motion.button
          onClick={onStart}
          style={{ padding: '20px 64px' }}
          className="
            relative rounded-2xl font-display font-bold text-xl
            bg-gradient-to-r from-cyan-glow to-magenta-glow
            text-gray-950 tracking-wide cursor-pointer
            hover:shadow-[0_0_40px_rgba(0,245,255,0.4),0_0_80px_rgba(255,0,229,0.2)]
            transition-shadow duration-300
          "
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          START DUEL
        </motion.button>
      </motion.div>

      <motion.div
        className="absolute bottom-8 text-gray-600 text-sm font-body"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        Numbers 1–100 · Alternating turns · Outsmart or be outsmarted
      </motion.div>
    </motion.div>
  );
}
