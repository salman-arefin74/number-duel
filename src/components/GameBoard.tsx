import { motion } from 'framer-motion';
import type { GameState, Turn } from '../hooks/useGameState';
import type { FeedbackDirection } from '../utils/antiCheat';
import RangeBar from './RangeBar';
import GuessHistory from './GuessHistory';
import NumberInput from './NumberInput';
import RoundScoreboard from './RoundScoreboard';

interface GameBoardProps {
  state: GameState;
  onUserGuess: (n: number) => void;
  onRespondToComputer: (f: FeedbackDirection) => void;
}

export default function GameBoard({ state, onUserGuess, onRespondToComputer }: GameBoardProps) {
  const isUserTurn = state.turn === 'user';
  const isComputerTurn = state.turn === 'computer';

  return (
    <motion.div
      className="flex flex-col h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="shrink-0 pt-5 pb-3 px-6">
        <RoundScoreboard
          bestOf={state.bestOf}
          userScore={state.userScore}
          computerScore={state.computerScore}
          currentRound={state.currentRound}
        />
      </div>

      <div className="shrink-0 text-center pb-3">
        <TurnIndicator turn={state.turn} turnNumber={state.turnNumber} />
      </div>

      <div className="flex-1 min-h-0 flex flex-col md:flex-row gap-5 px-5 pb-5">
        {/* User's side */}
        <motion.div
          style={{ padding: 24 }}
          className={`
            flex-1 flex flex-col gap-5 rounded-2xl
            glass transition-all duration-500
            ${isUserTurn ? 'animate-pulse-cyan border-cyan-glow/30 border' : 'border border-transparent opacity-70'}
          `}
          layout
        >
          <div className="flex items-center gap-2 shrink-0">
            <div className={`w-2.5 h-2.5 rounded-full ${isUserTurn ? 'bg-cyan-glow animate-pulse' : 'bg-gray-600'}`} />
            <h3 className="font-display font-bold text-sm text-cyan-glow uppercase tracking-wider">
              Your Guesses
            </h3>
            <span className="text-gray-500 text-xs ml-auto font-mono">
              {state.userGuesses.length} guess{state.userGuesses.length !== 1 ? 'es' : ''}
            </span>
          </div>

          <RangeBar
            low={state.userRangeLow}
            high={state.userRangeHigh}
            accent="cyan"
            label="Possible Range"
          />

          <GuessHistory entries={state.userGuesses} accent="cyan" />

          <div className="shrink-0 pt-4 border-t border-white/5">
            <NumberInput onSubmit={onUserGuess} disabled={!isUserTurn} />
          </div>
        </motion.div>

        {/* Divider */}
        <div className="hidden md:flex items-center">
          <div className="w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent" />
        </div>
        <div className="md:hidden flex justify-center">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        {/* Computer's side */}
        <motion.div
          style={{ padding: 24 }}
          className={`
            flex-1 flex flex-col gap-5 rounded-2xl
            glass transition-all duration-500
            ${isComputerTurn ? 'animate-pulse-magenta border-magenta-glow/30 border' : 'border border-transparent opacity-70'}
          `}
          layout
        >
          <div className="flex items-center gap-2 shrink-0">
            <div className={`w-2.5 h-2.5 rounded-full ${isComputerTurn ? 'bg-magenta-glow animate-pulse' : 'bg-gray-600'}`} />
            <h3 className="font-display font-bold text-sm text-magenta-glow uppercase tracking-wider">
              Computer's Guesses
            </h3>
            <span className="text-gray-500 text-xs ml-auto font-mono">
              {state.computerGuesses.length} guess{state.computerGuesses.length !== 1 ? 'es' : ''}
            </span>
          </div>

          <RangeBar
            low={state.computerRangeLow}
            high={state.computerRangeHigh}
            accent="magenta"
            label="Possible Range"
          />

          <GuessHistory entries={state.computerGuesses} accent="magenta" />

          <div className="shrink-0 pt-4 border-t border-white/5">
            <ComputerGuessDisplay
              guess={state.currentComputerGuess}
              isActive={isComputerTurn}
              onRespond={onRespondToComputer}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function TurnIndicator({ turn, turnNumber }: { turn: Turn; turnNumber: number }) {
  return (
    <motion.div
      key={`${turn}-${turnNumber}`}
      style={{ padding: '10px 24px' }}
      className="inline-flex items-center gap-3 rounded-full glass"
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <span className="text-gray-500 text-xs font-mono">Turn {turnNumber}</span>
      <span className="text-gray-600">·</span>
      <span className={`text-xs font-display font-bold uppercase tracking-wider ${
        turn === 'user' ? 'text-cyan-glow' : 'text-magenta-glow'
      }`}>
        {turn === 'user' ? 'Your Turn' : 'Computer\'s Turn'}
      </span>
    </motion.div>
  );
}

function ComputerGuessDisplay({
  guess,
  isActive,
  onRespond,
}: {
  guess: number | null;
  isActive: boolean;
  onRespond: (f: FeedbackDirection) => void;
}) {
  if (!isActive || guess === null) {
    return (
      <div className="flex items-center justify-center py-4 text-gray-600 text-sm">
        Waiting for your turn to finish...
      </div>
    );
  }

  return (
    <motion.div
      className="flex flex-col items-center gap-4 py-2"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <div className="text-center">
        <p className="text-gray-400 text-xs mb-1">Computer guesses</p>
        <motion.span
          className="font-display font-black text-3xl text-magenta-glow"
          key={guess}
          initial={{ scale: 1.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          {guess}
        </motion.span>
      </div>
      <div className="flex gap-3">
        <FeedbackButton
          label="▲ Higher"
          onClick={() => onRespond('higher')}
          className="bg-orange-500/10 border-orange-500/30 text-orange-400 hover:bg-orange-500/20"
        />
        <FeedbackButton
          label="✓ Correct"
          onClick={() => onRespond('correct')}
          className="bg-neon-green/10 border-neon-green/30 text-neon-green hover:bg-neon-green/20"
        />
        <FeedbackButton
          label="▼ Lower"
          onClick={() => onRespond('lower')}
          className="bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20"
        />
      </div>
    </motion.div>
  );
}

function FeedbackButton({
  label,
  onClick,
  className,
}: {
  label: string;
  onClick: () => void;
  className: string;
}) {
  return (
    <motion.button
      onClick={onClick}
      style={{ padding: '10px 20px' }}
      className={`rounded-xl text-sm font-display font-bold border transition-all duration-200 cursor-pointer ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {label}
    </motion.button>
  );
}
