import { useState, useCallback, useRef } from 'react';
import { useComputerAI } from './useComputerAI';
import { validateFeedback, isCheatAttempt } from '../utils/antiCheat';
import type { FeedbackDirection } from '../utils/antiCheat';

export type GamePhase =
  | 'welcome'
  | 'secret-input'
  | 'playing'
  | 'round-end'
  | 'match-end';

export type Turn = 'user' | 'computer';

export interface GuessEntry {
  guess: number;
  feedback: FeedbackDirection | null;
  turn: number;
}

export interface RoundResult {
  winner: 'user' | 'computer';
  userGuessCount: number;
  computerGuessCount: number;
}

export interface GameState {
  phase: GamePhase;
  bestOf: 3 | 5;
  currentRound: number;
  userScore: number;
  computerScore: number;
  turn: Turn;
  turnNumber: number;
  userSecret: number | null;
  computerSecret: number | null;
  userGuesses: GuessEntry[];
  computerGuesses: GuessEntry[];
  currentComputerGuess: number | null;
  roundResults: RoundResult[];
  lastRoundWinner: 'user' | 'computer' | null;
  cheatDetected: boolean;
  matchWinner: 'user' | 'computer' | null;
  userRangeLow: number;
  userRangeHigh: number;
  computerRangeLow: number;
  computerRangeHigh: number;
}

const initialGameState: GameState = {
  phase: 'welcome',
  bestOf: 3,
  currentRound: 1,
  userScore: 0,
  computerScore: 0,
  turn: 'user',
  turnNumber: 1,
  userSecret: null,
  computerSecret: null,
  userGuesses: [],
  computerGuesses: [],
  currentComputerGuess: null,
  roundResults: [],
  lastRoundWinner: null,
  cheatDetected: false,
  matchWinner: null,
  userRangeLow: 1,
  userRangeHigh: 100,
  computerRangeLow: 1,
  computerRangeHigh: 100,
};

export function useGameState() {
  const [state, setState] = useState<GameState>(initialGameState);
  const ai = useComputerAI();
  const cheatCallbackRef = useRef<(() => void) | null>(null);

  const setBestOf = useCallback((bestOf: 3 | 5) => {
    setState(s => ({ ...s, bestOf }));
  }, []);

  const startGame = useCallback(() => {
    setState(s => ({ ...s, phase: 'secret-input' }));
  }, []);

  const submitSecret = useCallback((secret: number) => {
    ai.reset();
    const computerSecret = Math.floor(Math.random() * 100) + 1;
    setState(s => ({
      ...s,
      phase: 'playing',
      userSecret: secret,
      computerSecret,
      turn: 'user',
      turnNumber: 1,
      userGuesses: [],
      computerGuesses: [],
      currentComputerGuess: null,
      cheatDetected: false,
      userRangeLow: 1,
      userRangeHigh: 100,
      computerRangeLow: 1,
      computerRangeHigh: 100,
    }));
  }, [ai]);

  const userGuess = useCallback((guess: number) => {
    setState(s => {
      if (!s.computerSecret || s.turn !== 'user') return s;

      const feedback = validateFeedback(guess, s.computerSecret);
      const entry: GuessEntry = { guess, feedback, turn: s.turnNumber };

      let newLow = s.userRangeLow;
      let newHigh = s.userRangeHigh;
      if (feedback === 'higher') newLow = Math.max(newLow, guess + 1);
      if (feedback === 'lower') newHigh = Math.min(newHigh, guess - 1);

      if (feedback === 'correct') {
        const newUserScore = s.userScore + 1;
        const winsNeeded = Math.ceil(s.bestOf / 2);
        const matchOver = newUserScore >= winsNeeded;
        const result: RoundResult = {
          winner: 'user',
          userGuessCount: s.userGuesses.length + 1,
          computerGuessCount: s.computerGuesses.length,
        };

        return {
          ...s,
          userGuesses: [...s.userGuesses, entry],
          userScore: newUserScore,
          roundResults: [...s.roundResults, result],
          lastRoundWinner: 'user' as const,
          phase: matchOver ? 'match-end' : 'round-end',
          matchWinner: matchOver ? 'user' : null,
          turn: 'user',
          userRangeLow: newLow,
          userRangeHigh: newHigh,
        };
      }

      const computerGuess = ai.makeGuess();
      return {
        ...s,
        userGuesses: [...s.userGuesses, entry],
        turn: 'computer' as Turn,
        currentComputerGuess: computerGuess,
        userRangeLow: newLow,
        userRangeHigh: newHigh,
      };
    });
  }, [ai]);

  const respondToComputer = useCallback((response: FeedbackDirection) => {
    setState(s => {
      if (s.currentComputerGuess === null || s.userSecret === null || s.turn !== 'computer') return s;

      const cheated = isCheatAttempt(s.currentComputerGuess, s.userSecret, response);
      if (cheated) {
        return { ...s, cheatDetected: true };
      }

      const entry: GuessEntry = {
        guess: s.currentComputerGuess,
        feedback: response,
        turn: s.turnNumber,
      };

      let newLow = s.computerRangeLow;
      let newHigh = s.computerRangeHigh;
      if (response === 'higher') newLow = Math.max(newLow, s.currentComputerGuess + 1);
      if (response === 'lower') newHigh = Math.min(newHigh, s.currentComputerGuess - 1);

      ai.receiveFeedback(response);

      if (response === 'correct') {
        const newCompScore = s.computerScore + 1;
        const winsNeeded = Math.ceil(s.bestOf / 2);
        const matchOver = newCompScore >= winsNeeded;
        const result: RoundResult = {
          winner: 'computer',
          userGuessCount: s.userGuesses.length,
          computerGuessCount: s.computerGuesses.length + 1,
        };

        return {
          ...s,
          computerGuesses: [...s.computerGuesses, entry],
          computerScore: newCompScore,
          roundResults: [...s.roundResults, result],
          lastRoundWinner: 'computer' as const,
          phase: matchOver ? 'match-end' : 'round-end',
          matchWinner: matchOver ? 'computer' : null,
          currentComputerGuess: null,
          turn: 'computer',
          computerRangeLow: newLow,
          computerRangeHigh: newHigh,
        };
      }

      return {
        ...s,
        computerGuesses: [...s.computerGuesses, entry],
        turn: 'user' as Turn,
        turnNumber: s.turnNumber + 1,
        currentComputerGuess: null,
        computerRangeLow: newLow,
        computerRangeHigh: newHigh,
      };
    });
  }, [ai]);

  const dismissCheat = useCallback(() => {
    setState(s => {
      if (s.currentComputerGuess === null || s.userSecret === null) return s;

      const correctFeedback = validateFeedback(s.currentComputerGuess, s.userSecret);
      const entry: GuessEntry = {
        guess: s.currentComputerGuess,
        feedback: correctFeedback,
        turn: s.turnNumber,
      };

      let newLow = s.computerRangeLow;
      let newHigh = s.computerRangeHigh;
      if (correctFeedback === 'higher') newLow = Math.max(newLow, s.currentComputerGuess + 1);
      if (correctFeedback === 'lower') newHigh = Math.min(newHigh, s.currentComputerGuess - 1);

      ai.receiveFeedback(correctFeedback);

      if (correctFeedback === 'correct') {
        const newCompScore = s.computerScore + 1;
        const winsNeeded = Math.ceil(s.bestOf / 2);
        const matchOver = newCompScore >= winsNeeded;
        const result: RoundResult = {
          winner: 'computer',
          userGuessCount: s.userGuesses.length,
          computerGuessCount: s.computerGuesses.length + 1,
        };
        return {
          ...s,
          cheatDetected: false,
          computerGuesses: [...s.computerGuesses, entry],
          computerScore: newCompScore,
          roundResults: [...s.roundResults, result],
          lastRoundWinner: 'computer' as const,
          phase: matchOver ? 'match-end' : 'round-end',
          matchWinner: matchOver ? 'computer' : null,
          currentComputerGuess: null,
          turn: 'computer',
          computerRangeLow: newLow,
          computerRangeHigh: newHigh,
        };
      }

      return {
        ...s,
        cheatDetected: false,
        computerGuesses: [...s.computerGuesses, entry],
        turn: 'user' as Turn,
        turnNumber: s.turnNumber + 1,
        currentComputerGuess: null,
        computerRangeLow: newLow,
        computerRangeHigh: newHigh,
      };
    });
  }, [ai]);

  const nextRound = useCallback(() => {
    setState(s => ({
      ...s,
      phase: 'secret-input',
      currentRound: s.currentRound + 1,
      turn: 'user',
      turnNumber: 1,
      userSecret: null,
      computerSecret: null,
      userGuesses: [],
      computerGuesses: [],
      currentComputerGuess: null,
      cheatDetected: false,
      lastRoundWinner: null,
      userRangeLow: 1,
      userRangeHigh: 100,
      computerRangeLow: 1,
      computerRangeHigh: 100,
    }));
  }, []);

  const playAgain = useCallback(() => {
    ai.reset();
    setState(s => ({
      ...initialGameState,
      bestOf: s.bestOf,
      phase: 'secret-input' as GamePhase,
    }));
  }, [ai]);

  const restartGame = useCallback(() => {
    ai.reset();
    setState(initialGameState);
  }, [ai]);

  return {
    state,
    setBestOf,
    startGame,
    submitSecret,
    userGuess,
    respondToComputer,
    dismissCheat,
    nextRound,
    playAgain,
    restartGame,
    cheatCallbackRef,
  };
}
