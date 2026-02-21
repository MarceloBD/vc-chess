"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Chess } from "chess.js";
import { getPusherClient } from "@/lib/pusher/client";
import { GameStatus } from "@/enums/game-status";
import type { PlayerColor } from "@/enums/player-color";
import type {
  GameResponse,
  MoveRecord,
  PusherMoveEvent,
} from "@/lib/game/types";

interface UseGameReturn {
  fen: string;
  status: GameStatus;
  turn: PlayerColor | null;
  playerColor: PlayerColor | null;
  moves: MoveRecord[];
  isOpponentConnected: boolean;
  isLoading: boolean;
  error: string | null;
  makeMove: (from: string, to: string, promotion?: string) => Promise<boolean>;
}

const INITIAL_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export function useGame(gameId: string, playerId: string | null): UseGameReturn {
  const [fen, setFen] = useState(INITIAL_FEN);
  const [status, setStatus] = useState<GameStatus>(GameStatus.WAITING_FOR_OPPONENT);
  const [turn, setTurn] = useState<PlayerColor | null>(null);
  const [playerColor, setPlayerColor] = useState<PlayerColor | null>(null);
  const [moves, setMoves] = useState<MoveRecord[]>([]);
  const [isOpponentConnected, setIsOpponentConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasJoined = useRef(false);

  useEffect(() => {
    if (!playerId) {
      return;
    }

    async function fetchAndJoinGame() {
      try {
        const joinResponse = await fetch(`/api/game/${gameId}/join`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ playerId }),
        });

        if (joinResponse.ok) {
          const { color } = await joinResponse.json();
          setPlayerColor(color);
        }

        const stateResponse = await fetch(
          `/api/game/${gameId}?playerId=${playerId}`
        );

        if (!stateResponse.ok) {
          setError("Game not found");
          setIsLoading(false);
          return;
        }

        const game: GameResponse = await stateResponse.json();
        setFen(game.fen);
        setStatus(game.status);
        setTurn(game.turn);
        setPlayerColor(game.playerColor);
        setMoves(game.moves);
        setIsOpponentConnected(game.isBlackConnected);
        setIsLoading(false);
      } catch {
        setError("Failed to connect to game");
        setIsLoading(false);
      }
    }

    if (!hasJoined.current) {
      hasJoined.current = true;
      fetchAndJoinGame();
    }
  }, [gameId, playerId]);

  useEffect(() => {
    if (!playerId) {
      return;
    }

    const pusher = getPusherClient();
    const channel = pusher.subscribe(`game-${gameId}`);

    channel.bind("move-made", (data: PusherMoveEvent) => {
      setFen(data.fen);
      setTurn(data.turn);
      setStatus(data.status);
      setMoves((previous) => [...previous, data.move]);
    });

    channel.bind("player-joined", () => {
      setIsOpponentConnected(true);
      setStatus(GameStatus.PLAYING);
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(`game-${gameId}`);
    };
  }, [gameId, playerId]);

  const makeMove = useCallback(
    async (from: string, to: string, promotion?: string): Promise<boolean> => {
      if (!playerId) {
        return false;
      }

      const chess = new Chess(fen);
      try {
        const result = chess.move({ from, to, promotion });
        setFen(chess.fen());
        setTurn(chess.turn() as PlayerColor);
        setMoves((previous) => [
          ...previous,
          { san: result.san, from: result.from, to: result.to, color: result.color as PlayerColor },
        ]);
      } catch {
        return false;
      }

      try {
        const response = await fetch(`/api/game/${gameId}/move`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ playerId, from, to, promotion }),
        });

        return response.ok;
      } catch {
        return false;
      }
    },
    [gameId, playerId, fen]
  );

  return {
    fen,
    status,
    turn,
    playerColor,
    moves,
    isOpponentConnected,
    isLoading,
    error,
    makeMove,
  };
}
