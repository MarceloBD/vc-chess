"use client";

import { useState, useEffect } from "react";
import { nanoid } from "nanoid";

const STORAGE_KEY = "chesslink-player-id";

export function usePlayerId(): string | null {
  const [playerId, setPlayerId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {
      setPlayerId(stored);
      return;
    }

    const newId = nanoid(12);
    localStorage.setItem(STORAGE_KEY, newId);
    setPlayerId(newId);
  }, []);

  return playerId;
}
