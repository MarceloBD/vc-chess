export const GameStatus = {
  WAITING_FOR_OPPONENT: "WAITING_FOR_OPPONENT",
  PLAYING: "PLAYING",
  CHECKMATE: "CHECKMATE",
  STALEMATE: "STALEMATE",
  DRAW: "DRAW",
  RESIGNED: "RESIGNED",
} as const;

export type GameStatus = (typeof GameStatus)[keyof typeof GameStatus];
