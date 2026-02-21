"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePlayerId } from "@/hooks/usePlayerId";

export default function HomePage() {
  const router = useRouter();
  const playerId = usePlayerId();
  const [isCreating, setIsCreating] = useState(false);

  async function handleCreateGame() {
    if (!playerId || isCreating) {
      return;
    }

    setIsCreating(true);

    try {
      const response = await fetch("/api/game/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId }),
      });

      const { gameId } = await response.json();
      router.push(`/game/${gameId}`);
    } catch {
      setIsCreating(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="flex flex-col items-center gap-8 max-w-md text-center">
        <div className="flex flex-col gap-3">
          <h1 className="text-5xl font-bold tracking-tight">
            ChessLink
          </h1>
          <p className="text-zinc-400 text-lg">
            Play chess online with a friend. Create a game and share the invite link.
          </p>
        </div>

        <button
          onClick={handleCreateGame}
          disabled={!playerId || isCreating}
          className="px-8 py-4 bg-white text-zinc-900 rounded-xl text-lg font-semibold hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCreating ? "Creating..." : "New Game"}
        </button>

        <div className="flex flex-col gap-2 text-sm text-zinc-500">
          <p>Create a game, then share the link with your opponent.</p>
          <p>No account required.</p>
        </div>
      </div>
    </main>
  );
}
