"use client";

import { use } from "react";
import { usePlayerId } from "@/hooks/usePlayerId";
import { useGame } from "@/hooks/useGame";
import { ChessBoard } from "@/components/chess-board/ChessBoard";
import { GameInfo } from "@/components/game-info/GameInfo";
import { InviteLink } from "@/components/invite-link/InviteLink";
import { MoveHistory } from "@/components/move-history/MoveHistory";
import { GameStatus } from "@/enums/game-status";

interface GamePageProps {
  params: Promise<{ gameId: string }>;
}

export default function GamePage({ params }: GamePageProps) {
  const { gameId } = use(params);
  const playerId = usePlayerId();
  const {
    fen,
    status,
    turn,
    playerColor,
    moves,
    isOpponentConnected,
    isLoading,
    error,
    makeMove,
  } = useGame(gameId, playerId);

  if (!playerId || isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-zinc-600 border-t-white rounded-full animate-spin" />
          <p className="text-zinc-400">Loading game...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-red-400 text-lg">{error}</p>
          <a
            href="/"
            className="text-zinc-400 hover:text-white transition-colors underline"
          >
            Back to home
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 w-full max-w-5xl">
        <div className="flex flex-col items-center gap-4 flex-1">
          <ChessBoard
            fen={fen}
            playerColor={playerColor}
            turn={turn}
            status={status}
            onMove={makeMove}
          />
        </div>

        <div className="flex flex-col gap-4 w-full lg:w-72 shrink-0">
          <GameInfo
            status={status}
            turn={turn}
            playerColor={playerColor}
            isOpponentConnected={isOpponentConnected}
          />

          {status === GameStatus.WAITING_FOR_OPPONENT && (
            <InviteLink gameId={gameId} />
          )}

          <MoveHistory moves={moves} />

          <a
            href="/"
            className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors text-center"
          >
            New Game
          </a>
        </div>
      </div>
    </main>
  );
}
