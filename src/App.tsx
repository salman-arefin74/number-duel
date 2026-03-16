import { AnimatePresence } from 'framer-motion';
import { useGameState } from './hooks/useGameState';
import WelcomeScreen from './components/WelcomeScreen';
import SecretNumberInput from './components/SecretNumberInput';
import GameBoard from './components/GameBoard';
import WinCelebration from './components/WinCelebration';
import AntiCheatAlert from './components/AntiCheatAlert';
import AnimatedBackground from './components/AnimatedBackground';

export default function App() {
  const {
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
  } = useGameState();

  return (
    <div className="h-screen w-screen overflow-hidden relative">
      <AnimatedBackground />
      <div className="fixed inset-0 bg-grid pointer-events-none z-0" />

      <div className="relative z-10 h-full">
        <AnimatePresence mode="wait">
          {state.phase === 'welcome' && (
            <WelcomeScreen
              key="welcome"
              bestOf={state.bestOf}
              onSetBestOf={setBestOf}
              onStart={startGame}
            />
          )}

          {state.phase === 'secret-input' && (
            <SecretNumberInput
              key="secret"
              onSubmit={submitSecret}
              currentRound={state.currentRound}
            />
          )}

          {(state.phase === 'playing' || state.phase === 'round-end' || state.phase === 'match-end') && (
            <GameBoard
              key="game"
              state={state}
              onUserGuess={userGuess}
              onRespondToComputer={respondToComputer}
            />
          )}
        </AnimatePresence>
      </div>

      <AntiCheatAlert
        visible={state.cheatDetected}
        onDismiss={dismissCheat}
      />

      <AnimatePresence>
        {state.phase === 'round-end' && state.lastRoundWinner && (
          <WinCelebration
            key="round-win"
            winner={state.lastRoundWinner}
            isMatchEnd={false}
            userScore={state.userScore}
            computerScore={state.computerScore}
            computerSecret={state.computerSecret}
            onNext={nextRound}
            onRestart={playAgain}
            onHome={restartGame}
          />
        )}

        {state.phase === 'match-end' && state.matchWinner && (
          <WinCelebration
            key="match-win"
            winner={state.matchWinner}
            isMatchEnd={true}
            userScore={state.userScore}
            computerScore={state.computerScore}
            computerSecret={state.computerSecret}
            onNext={nextRound}
            onRestart={playAgain}
            onHome={restartGame}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
