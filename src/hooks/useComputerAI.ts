import { useCallback, useRef } from 'react';
import type { FeedbackDirection } from '../utils/antiCheat';

interface AIState {
  low: number;
  high: number;
  lastGuess: number | null;
}

export function useComputerAI() {
  const state = useRef<AIState>({ low: 1, high: 100, lastGuess: null });

  const reset = useCallback(() => {
    state.current = { low: 1, high: 100, lastGuess: null };
  }, []);

  const makeGuess = useCallback((): number => {
    const { low, high } = state.current;
    const range = high - low;
    const mid = Math.floor((low + high) / 2);

    let guess: number;
    if (range <= 3) {
      // Closing in — be precise
      guess = mid;
    } else {
      // Human-like variance: deviate from midpoint by up to ~18% of remaining range,
      // but bias slightly toward the midpoint so it stays strategically sound.
      const maxDeviation = Math.max(1, Math.floor(range * 0.18));
      // Two random draws averaged gives a soft bell-curve (more likely near centre)
      const r1 = Math.floor(Math.random() * (maxDeviation * 2 + 1)) - maxDeviation;
      const r2 = Math.floor(Math.random() * (maxDeviation * 2 + 1)) - maxDeviation;
      const deviation = Math.round((r1 + r2) / 2);
      guess = Math.min(high, Math.max(low, mid + deviation));
    }

    state.current.lastGuess = guess;
    return guess;
  }, []);

  const receiveFeedback = useCallback((feedback: FeedbackDirection) => {
    const { lastGuess } = state.current;
    if (lastGuess === null) return;

    if (feedback === 'higher') {
      state.current.low = lastGuess + 1;
    } else if (feedback === 'lower') {
      state.current.high = lastGuess - 1;
    }
  }, []);

  return { makeGuess, receiveFeedback, reset };
}
