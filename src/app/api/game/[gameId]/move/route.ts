import { NextResponse } from "next/server";
import { makeMove } from "@/lib/game/store";
import { getPusherServer } from "@/lib/pusher/server";
import type { MovePayload, PusherMoveEvent } from "@/lib/game/types";

interface RouteParams {
  params: Promise<{ gameId: string }>;
}

export async function POST(request: Request, { params }: RouteParams) {
  const { gameId } = await params;
  const { playerId, from, to, promotion } =
    (await request.json()) as MovePayload;

  if (!playerId || !from || !to) {
    return NextResponse.json(
      { error: "playerId, from, and to are required" },
      { status: 400 }
    );
  }

  const result = makeMove(gameId, playerId, from, to, promotion);

  if (!result) {
    return NextResponse.json({ error: "Invalid move" }, { status: 400 });
  }

  const { game, move } = result;

  const pusherEvent: PusherMoveEvent = {
    fen: game.fen,
    pgn: game.pgn,
    move,
    turn: game.turn,
    status: game.status,
  };

  const pusher = getPusherServer();
  await pusher.trigger(`game-${gameId}`, "move-made", pusherEvent);

  return NextResponse.json(pusherEvent);
}
