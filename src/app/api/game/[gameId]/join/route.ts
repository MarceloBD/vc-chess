import { NextResponse } from "next/server";
import { joinGame, getGame } from "@/lib/game/store";
import { getPusherServer } from "@/lib/pusher/server";
import { PlayerColor } from "@/enums/player-color";

interface RouteParams {
  params: Promise<{ gameId: string }>;
}

interface JoinGameBody {
  playerId: string;
}

export async function POST(request: Request, { params }: RouteParams) {
  const { gameId } = await params;
  const { playerId } = (await request.json()) as JoinGameBody;

  if (!playerId) {
    return NextResponse.json(
      { error: "playerId is required" },
      { status: 400 }
    );
  }

  const existingGame = getGame(gameId);
  if (!existingGame) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  if (playerId === existingGame.whitePlayerId) {
    return NextResponse.json({ color: PlayerColor.WHITE });
  }

  const game = joinGame(gameId, playerId);
  if (!game) {
    return NextResponse.json({ error: "Game is full" }, { status: 400 });
  }

  const pusher = getPusherServer();
  await pusher.trigger(`game-${gameId}`, "player-joined", {
    color: PlayerColor.BLACK,
  });

  return NextResponse.json({ color: PlayerColor.BLACK });
}
