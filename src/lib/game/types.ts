import { GameStatus } from "@/enums/game-status";
import { PlayerColor } from "@/enums/player-color";

export interface GameState {
  gameId: string;
  fen: string;
  pgn: string;
  status: GameStatus;
  turn: PlayerColor;
  whitePlayerId: string;
  blackPlayerId: string | null;
  moves: MoveRecord[];
  createdAt: number;
}

export interface MoveRecord {
  san: string;
  from: string;
  to: string;
  color: PlayerColor;
}

export interface MovePayload {
  playerId: string;
  from: string;
  to: string;
  promotion?: string;
}

export interface GameResponse {
  gameId: string;
  fen: string;
  pgn: string;
  status: GameStatus;
  turn: PlayerColor;
  playerColor: PlayerColor | null;
  moves: MoveRecord[];
  isWhiteConnected: boolean;
  isBlackConnected: boolean;
}

export interface PusherMoveEvent {
  fen: string;
  pgn: string;
  move: MoveRecord;
  turn: PlayerColor;
  status: GameStatus;
}

export interface PusherPlayerJoinedEvent {
  color: PlayerColor;
}
