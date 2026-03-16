export type FeedbackDirection = 'higher' | 'lower' | 'correct';

export function validateFeedback(
  computerGuess: number,
  userSecret: number,
): FeedbackDirection {
  if (computerGuess === userSecret) return 'correct';
  if (computerGuess < userSecret) return 'higher';
  return 'lower';
}

export function isCheatAttempt(
  computerGuess: number,
  userSecret: number,
  userResponse: FeedbackDirection,
): boolean {
  const correctResponse = validateFeedback(computerGuess, userSecret);
  return userResponse !== correctResponse;
}
