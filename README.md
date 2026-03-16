# Number Duel

A slick, neon-themed number guessing game where you go head-to-head against a computer opponent. Both sides pick a secret number between 1 and 100, then take alternating turns trying to guess each other's number first.

## How to Run

**Prerequisites:** Node.js 18+

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

To create a production build:

```bash
npm run build
npm run preview
```

## How to Play

### Setup
1. **Choose match length** — Best of 3 or Best of 5 rounds
2. **Enter your secret number** — Type a number between 1 and 100 using the PIN-style input. This number is stored locally and the computer AI never reads it directly.
3. The computer picks its own secret number randomly.

### Gameplay
Turns alternate between you and the computer:

- **Your turn:** Type a guess for the computer's number and hit GUESS (or press Enter). The game tells you if the actual number is **higher** or **lower** than your guess, or if you got it **correct**.
- **Computer's turn:** The computer shows its guess for your number. You respond by clicking **Higher**, **Lower**, or **Correct**. The game validates your response against your stored secret — if you try to lie, it catches you!

### Winning
- The first player to guess the other's number wins the round.
- Win the majority of rounds (2 of 3 or 3 of 5) to win the match.
- The range bar on each side narrows as guesses eliminate possibilities.

### Anti-Cheat
If you give feedback that contradicts your secret number (e.g., you say "Higher" but the guess is already above your number), the game catches the inconsistency, shows a warning, and auto-corrects your response.

## Features

- **Split-screen duel layout** — your guesses on the left, computer's on the right
- **Visual range narrowing** — animated bars show the shrinking range of possible numbers
- **Animated guess history** — each guess slides in with color-coded higher/lower indicators
- **Round-based scoring** — visual dot indicators track round wins
- **Anti-cheat detection** — impossible to lie about higher/lower feedback
- **Win celebrations** — confetti particle effects when you win
- **Dark neon UI** — glassmorphism cards, gradient accents, animated background

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS v4
- Framer Motion
- canvas-confetti
