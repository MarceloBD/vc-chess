"use client";

import { GameStatus } from "@/enums/game-status";
import type { PlayerColor } from "@/enums/player-color";

interface GameInfoProps {
  status: GameStatus;
  turn: PlayerColor | null;
  playerColor: PlayerColor | null;
  isOpponentConnected: boolean;
}

const STATUS_LABELS: Record<GameStatus, string> = {
  [GameStatus.WAITING_FOR_OPPONENT]: "Waiting for opponent...",
  [GameStatus.PLAYING]: "Game in progress",
  [GameStatus.CHECKMATE]: "Checkmate!",
  [GameStatus.STALEMATE]: "Stalemate - Draw",
  [GameStatus.DRAW]: "Draw",
  [GameStatus.RESIGNED]: "Resigned",
};

function getColorLabel(color: PlayerColor | null): string {
  if (color === "w") return "White";
  if (color === "b") return "Black";
  return "Spectator";
}

function getTurnMessage(
  turn: PlayerColor | null,
  playerColor: PlayerColor | null
): string {
  if (!turn) return "";
  if (turn === playerColor) return "Your turn";
  return `${getColorLabel(turn)}'s turn`;
}

function getResultMessage(
  status: GameStatus,
  turn: PlayerColor | null,
  playerColor: PlayerColor | null
): string | null {
  if (status === GameStatus.CHECKMATE) {
    const winner = turn === "w" ? "Black" : "White";
    const isWinner =
      (turn === "w" && playerColor === "b") ||
      (turn === "b" && playerColor === "w");
    return isWinner ? `${winner} wins - You won!` : `${winner} wins`;
  }
  if (status === GameStatus.STALEMATE) return "Stalemate - Game drawn";
  if (status === GameStatus.DRAW) return "Game drawn";
  return null;
}

export function GameInfo({
  status,
  turn,
  playerColor,
  isOpponentConnected,
}: GameInfoProps) {
  const isGameOver =
    status === GameStatus.CHECKMATE ||
    status === GameStatus.STALEMATE ||
    status === GameStatus.DRAW;

  const resultMessage = getResultMessage(status, turn, playerColor);

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex items-center justify-between bg-zinc-800/50 rounded-lg px-4 py-3">
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              playerColor === "w" ? "bg-white" : "bg-zinc-900 border border-zinc-600"
            }`}
          />
          <span className="text-sm text-zinc-300">
            You play as <strong className="text-white">{getColorLabel(playerColor)}</strong>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isOpponentConnected ? "bg-green-500" : "bg-yellow-500 animate-pulse"
            }`}
          />
          <span className="text-xs text-zinc-400">
            {isOpponentConnected ? "Opponent connected" : "Waiting for opponent"}
          </span>
        </div>
      </div>

      <div className="bg-zinc-800/50 rounded-lg px-4 py-3 text-center">
        {isGameOver && resultMessage ? (
          <p className="text-lg font-semibold text-amber-400">{resultMessage}</p>
        ) : (
          <div>
            <p className="text-sm text-zinc-400">{STATUS_LABELS[status]}</p>
            {status === GameStatus.PLAYING && (
              <p
                className={`text-lg font-semibold mt-1 ${
                  turn === playerColor ? "text-green-400" : "text-zinc-300"
                }`}
              >
                {getTurnMessage(turn, playerColor)}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
