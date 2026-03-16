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
    const guess = Math.floor((low + high) / 2);
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
