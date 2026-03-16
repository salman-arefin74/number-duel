import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SecretNumberInputProps {
  onSubmit: (num: number) => void;
  currentRound: number;
}

export default function SecretNumberInput({ onSubmit, currentRound }: SecretNumberInputProps) {
  const [digits, setDigits] = useState<string[]>(['', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;
    setError('');

    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);

    if (value && index < 2) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const numStr = digits.join('').replace(/^0+/, '') || '0';
    const num = parseInt(numStr, 10);

    if (isNaN(num) || num < 1 || num > 100) {
      setError('Pick a number between 1 and 100');
      return;
    }
    onSubmit(num);
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full gap-8 px-4"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-center space-y-2">
        <motion.p
          className="text-cyan-glow/70 font-display text-sm uppercase tracking-[0.3em]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Round {currentRound}
        </motion.p>
        <motion.h2
          className="font-display text-3xl md:text-4xl font-bold text-white"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          Enter Your Secret Number
        </motion.h2>
        <motion.p
          className="text-gray-400 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Choose wisely — the computer won't peek
        </motion.p>
      </div>

      <motion.div
        className="flex gap-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={el => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            style={{ width: 80, height: 100, padding: 12 }}
            className="
              text-center text-4xl md:text-5xl font-display font-bold
              glass rounded-2xl
              text-cyan-glow
              focus:outline-none focus:border-cyan-glow/50 focus:shadow-[0_0_30px_rgba(0,245,255,0.2)]
              transition-all duration-300
              caret-transparent
            "
          />
        ))}
      </motion.div>

      {error && (
        <motion.p
          className="text-neon-red text-sm font-medium"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.p>
      )}

      <motion.button
        onClick={handleSubmit}
        style={{ padding: '18px 56px' }}
        className="
          rounded-xl font-display font-bold text-lg
          bg-gradient-to-r from-cyan-glow/20 to-cyan-glow/10
          border-2 border-cyan-glow/40 text-cyan-glow
          hover:border-cyan-glow/70 hover:shadow-[0_0_30px_rgba(0,245,255,0.3)]
          transition-all duration-300 cursor-pointer
        "
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        LOCK IN
      </motion.button>

      <motion.p
        className="text-gray-600 text-xs max-w-xs text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 0.8 }}
      >
        Your number is stored securely and only used to validate responses. The AI never reads it directly.
      </motion.p>
    </motion.div>
  );
}
