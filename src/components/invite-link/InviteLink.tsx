"use client";

import { useState } from "react";

interface InviteLinkProps {
  gameId: string;
}

export function InviteLink({ gameId }: InviteLinkProps) {
  const [isCopied, setIsCopied] = useState(false);

  const gameUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/game/${gameId}`
      : "";

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(gameUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = gameUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-sm text-zinc-400">
        Share this link to invite your opponent:
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          readOnly
          value={gameUrl}
          className="flex-1 bg-zinc-800 text-zinc-200 rounded-lg px-3 py-2 text-sm border border-zinc-700 focus:outline-none focus:border-zinc-500"
        />
        <button
          onClick={handleCopy}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            isCopied
              ? "bg-green-600 text-white"
              : "bg-zinc-700 text-zinc-200 hover:bg-zinc-600"
          }`}
        >
          {isCopied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}
