"use client";

import { useRef, useEffect } from "react";
import type { MoveRecord } from "@/lib/game/types";

interface MoveHistoryProps {
  moves: MoveRecord[];
}

export function MoveHistory({ moves }: MoveHistoryProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [moves]);

  const movePairs = groupMovesIntoPairs(moves);

  return (
    <div className="flex flex-col gap-2 w-full">
      <h3 className="text-sm font-medium text-zinc-400">Move History</h3>
      <div
        ref={scrollRef}
        className="bg-zinc-800/50 rounded-lg p-3 max-h-64 overflow-y-auto"
      >
        {movePairs.length === 0 ? (
          <p className="text-sm text-zinc-500 text-center py-4">
            No moves yet
          </p>
        ) : (
          <div className="flex flex-col gap-1">
            {movePairs.map(({ moveNumber, whiteMove, blackMove }) => (
              <div
                key={moveNumber}
                className="flex items-center text-sm font-mono"
              >
                <span className="w-8 text-zinc-500 shrink-0">
                  {moveNumber}.
                </span>
                <span className="w-20 text-zinc-200">{whiteMove}</span>
                <span className="w-20 text-zinc-400">{blackMove ?? ""}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface MovePair {
  moveNumber: number;
  whiteMove: string;
  blackMove: string | null;
}

function groupMovesIntoPairs(moves: MoveRecord[]): MovePair[] {
  const pairs: MovePair[] = [];

  for (let index = 0; index < moves.length; index += 2) {
    pairs.push({
      moveNumber: Math.floor(index / 2) + 1,
      whiteMove: moves[index].san,
      blackMove: moves[index + 1]?.san ?? null,
    });
  }

  return pairs;
}
