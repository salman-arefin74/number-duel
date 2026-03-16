import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface NumberInputProps {
  onSubmit: (num: number) => void;
  disabled?: boolean;
}

export default function NumberInput({ onSubmit, disabled }: NumberInputProps) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled) {
      const timer = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [disabled]);

  const handleSubmit = () => {
    const num = parseInt(value, 10);
    if (isNaN(num) || num < 1 || num > 100) {
      setError('Enter 1–100');
      return;
    }
    setError('');
    onSubmit(num);
    setValue('');
  };

  return (
    <div className="flex flex-col items-center gap-3 py-2">
      <div className="flex items-center gap-3">
        <input
          ref={inputRef}
          type="number"
          min={1}
          max={100}
          value={value}
          onChange={e => {
            setValue(e.target.value);
            setError('');
          }}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          disabled={disabled}
          placeholder="1–100"
          style={{ width: 120, height: 52, padding: '8px 12px' }}
          className="
            text-center text-xl font-display font-bold
            glass rounded-xl text-cyan-glow
            placeholder:text-gray-600
            focus:outline-none focus:border-cyan-glow/50
            focus:shadow-[0_0_20px_rgba(0,245,255,0.15)]
            disabled:opacity-30 disabled:cursor-not-allowed
            transition-all duration-300
          "
        />
        <motion.button
          onClick={handleSubmit}
          disabled={disabled}
          style={{ height: 52, padding: '8px 24px' }}
          className="
            rounded-xl font-display font-bold text-sm
            bg-cyan-glow/15 border border-cyan-glow/30 text-cyan-glow
            hover:bg-cyan-glow/25 hover:border-cyan-glow/50
            disabled:opacity-30 disabled:cursor-not-allowed
            transition-all duration-200 cursor-pointer
          "
          whileHover={disabled ? {} : { scale: 1.05 }}
          whileTap={disabled ? {} : { scale: 0.95 }}
        >
          GUESS
        </motion.button>
      </div>
      {error && (
        <motion.p
          className="text-neon-red text-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
