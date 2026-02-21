import { NextResponse } from "next/server";
import { getGame } from "@/lib/game/store";
import { PlayerColor } from "@/enums/player-color";
import type { GameResponse } from "@/lib/game/types";

interface RouteParams {
  params: Promise<{ gameId: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { gameId } = await params;
  const playerId = new URL(_request.url).searchParams.get("playerId");
  const game = getGame(gameId);

  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  let playerColor: PlayerColor | null = null;
  if (playerId === game.whitePlayerId) {
    playerColor = PlayerColor.WHITE;
  } else if (playerId === game.blackPlayerId) {
    playerColor = PlayerColor.BLACK;
  }

  const response: GameResponse = {
    gameId: game.gameId,
    fen: game.fen,
    pgn: game.pgn,
    status: game.status,
    turn: game.turn,
    playerColor,
    moves: game.moves,
    isWhiteConnected: true,
    isBlackConnected: game.blackPlayerId !== null,
  };

  return NextResponse.json(response);
}
