import { NextResponse } from "next/server";
import { createGame } from "@/lib/game/store";

interface CreateGameBody {
  playerId: string;
}

export async function POST(request: Request) {
  const { playerId } = (await request.json()) as CreateGameBody;

  if (!playerId) {
    return NextResponse.json(
      { error: "playerId is required" },
      { status: 400 }
    );
  }

  const game = createGame(playerId);

  return NextResponse.json({ gameId: game.gameId });
}
