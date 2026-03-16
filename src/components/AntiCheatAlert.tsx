import { motion, AnimatePresence } from 'framer-motion';

interface AntiCheatAlertProps {
  visible: boolean;
  onDismiss: () => void;
}

export default function AntiCheatAlert({ visible, onDismiss }: AntiCheatAlertProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          <motion.div
            className="relative glass rounded-3xl p-8 max-w-md mx-4 border-2 border-neon-red/30 text-center space-y-5"
            initial={{ scale: 0.5, rotate: -5 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <motion.div
              className="text-6xl"
              animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              🚨
            </motion.div>

            <h3 className="font-display text-2xl font-bold text-neon-red">
              CHEAT DETECTED!
            </h3>

            <p className="text-gray-300 text-sm leading-relaxed">
              Your response doesn't match your secret number. Nice try! The correct feedback has been applied automatically.
            </p>

            <motion.button
              onClick={onDismiss}
              className="
                px-8 py-3 rounded-xl font-display font-bold
                bg-neon-red/15 border border-neon-red/30 text-neon-red
                hover:bg-neon-red/25 hover:border-neon-red/50
                transition-all duration-200 cursor-pointer
              "
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              I'll Play Fair
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
