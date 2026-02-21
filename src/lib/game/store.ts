import { Chess } from "chess.js";
import { nanoid } from "nanoid";
import { GameStatus } from "@/enums/game-status";
import { PlayerColor } from "@/enums/player-color";
import type { GameState, MoveRecord } from "./types";

const globalStore = globalThis as typeof globalThis & {
  __chessGames?: Map<string, GameState>;
};

if (!globalStore.__chessGames) {
  globalStore.__chessGames = new Map();
}

const games = globalStore.__chessGames;

export function createGame(whitePlayerId: string): GameState {
  const chess = new Chess();
  const gameId = nanoid(10);

  const game: GameState = {
    gameId,
    fen: chess.fen(),
    pgn: chess.pgn(),
    status: GameStatus.WAITING_FOR_OPPONENT,
    turn: PlayerColor.WHITE,
    whitePlayerId,
    blackPlayerId: null,
    moves: [],
    createdAt: Date.now(),
  };

  games.set(gameId, game);
  return game;
}

export function getGame(gameId: string): GameState | undefined {
  return games.get(gameId);
}

export function joinGame(
  gameId: string,
  blackPlayerId: string
): GameState | null {
  const game = games.get(gameId);

  if (!game) {
    return null;
  }

  if (game.blackPlayerId && game.blackPlayerId !== blackPlayerId) {
    return null;
  }

  if (game.whitePlayerId === blackPlayerId) {
    return game;
  }

  game.blackPlayerId = blackPlayerId;
  game.status = GameStatus.PLAYING;
  return game;
}

function resolveGameStatus(chess: Chess): GameStatus {
  if (chess.isCheckmate()) {
    return GameStatus.CHECKMATE;
  }

  if (chess.isStalemate()) {
    return GameStatus.STALEMATE;
  }

  if (chess.isDraw()) {
    return GameStatus.DRAW;
  }

  return GameStatus.PLAYING;
}

export function makeMove(
  gameId: string,
  playerId: string,
  from: string,
  to: string,
  promotion?: string
): { game: GameState; move: MoveRecord } | null {
  const game = games.get(gameId);

  if (!game || game.status !== GameStatus.PLAYING) {
    return null;
  }

  const isWhiteTurn = game.turn === PlayerColor.WHITE;
  const isPlayersTurn = isWhiteTurn
    ? playerId === game.whitePlayerId
    : playerId === game.blackPlayerId;

  if (!isPlayersTurn) {
    return null;
  }

  const chess = new Chess(game.fen);

  try {
    const moveResult = chess.move({ from, to, promotion });

    const moveRecord: MoveRecord = {
      san: moveResult.san,
      from: moveResult.from,
      to: moveResult.to,
      color: moveResult.color as PlayerColor,
    };

    game.fen = chess.fen();
    game.pgn = chess.pgn();
    game.turn = chess.turn() as PlayerColor;
    game.status = resolveGameStatus(chess);
    game.moves.push(moveRecord);

    return { game, move: moveRecord };
  } catch {
    return null;
  }
}
