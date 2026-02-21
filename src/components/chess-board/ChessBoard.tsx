"use client";

import { useMemo, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import type { Square } from "chess.js";
import type { Piece, PromotionPieceOption } from "react-chessboard/dist/chessboard/types";
import type { PlayerColor } from "@/enums/player-color";
import { GameStatus } from "@/enums/game-status";

interface ChessBoardProps {
  fen: string;
  playerColor: PlayerColor | null;
  turn: PlayerColor | null;
  status: GameStatus;
  onMove: (from: string, to: string, promotion?: string) => Promise<boolean>;
}

export function ChessBoard({
  fen,
  playerColor,
  turn,
  status,
  onMove,
}: ChessBoardProps) {
  const [promotionSquare, setPromotionSquare] = useState<Square | null>(null);
  const [pendingMove, setPendingMove] = useState<{
    from: Square;
    to: Square;
  } | null>(null);

  const isPlayerTurn = turn === playerColor;
  const isGameActive = status === GameStatus.PLAYING;
  const canInteract = isPlayerTurn && isGameActive;

  const boardOrientation = playerColor === "b" ? "black" : "white";

  const highlightedSquares = useMemo(() => {
    const chess = new Chess(fen);
    const styles: Record<string, React.CSSProperties> = {};

    if (!canInteract) {
      return styles;
    }

    if (chess.inCheck()) {
      const kingSquare = findKingSquare(chess, turn!);
      if (kingSquare) {
        styles[kingSquare] = {
          backgroundColor: "rgba(255, 0, 0, 0.4)",
          borderRadius: "50%",
        };
      }
    }

    return styles;
  }, [fen, canInteract, turn]);

  function findKingSquare(chess: Chess, color: PlayerColor): Square | null {
    const board = chess.board();
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece?.type === "k" && piece.color === color) {
          const file = String.fromCharCode(97 + col);
          const rank = 8 - row;
          return `${file}${rank}` as Square;
        }
      }
    }
    return null;
  }

  function needsPromotion(from: Square, to: Square): boolean {
    const chess = new Chess(fen);
    const piece = chess.get(from);
    if (!piece || piece.type !== "p") {
      return false;
    }
    const targetRank = to[1];
    return (
      (piece.color === "w" && targetRank === "8") ||
      (piece.color === "b" && targetRank === "1")
    );
  }

  function isValidLocalMove(from: Square, to: Square, promotion?: string): boolean {
    const chess = new Chess(fen);
    try {
      chess.move({ from, to, promotion });
      return true;
    } catch {
      return false;
    }
  }

  function handlePieceDrop(
    sourceSquare: Square,
    targetSquare: Square,
    _piece: Piece
  ): boolean {
    if (!canInteract) {
      return false;
    }

    if (needsPromotion(sourceSquare, targetSquare)) {
      setPendingMove({ from: sourceSquare, to: targetSquare });
      setPromotionSquare(targetSquare);
      return true;
    }

    if (!isValidLocalMove(sourceSquare, targetSquare)) {
      return false;
    }

    onMove(sourceSquare, targetSquare);
    return true;
  }

  function handlePromotionPieceSelect(
    piece?: PromotionPieceOption,
    promoteFromSquare?: Square,
    promoteToSquare?: Square,
  ): boolean {
    const from = pendingMove?.from ?? promoteFromSquare;
    const to = pendingMove?.to ?? promoteToSquare;
    setPromotionSquare(null);
    setPendingMove(null);

    if (!piece || !from || !to) {
      return false;
    }

    const promotionPiece = piece[1]?.toLowerCase() ?? "q";

    if (!isValidLocalMove(from, to, promotionPiece)) {
      return false;
    }

    onMove(from, to, promotionPiece);
    return true;
  }

  function isDraggablePiece({ piece }: { piece: string }): boolean {
    if (!canInteract) {
      return false;
    }
    const pieceColor = piece[0];
    return pieceColor === playerColor;
  }

  return (
    <div className="w-full max-w-[min(90vw,560px)] aspect-square">
      <Chessboard
        id="online-chess"
        position={fen}
        onPieceDrop={handlePieceDrop}
        boardOrientation={boardOrientation}
        isDraggablePiece={isDraggablePiece}
        customSquareStyles={highlightedSquares}
        onPromotionPieceSelect={handlePromotionPieceSelect}
        promotionToSquare={promotionSquare}
        animationDuration={200}
      />
    </div>
  );
}
