export const PlayerColor = {
  WHITE: "w",
  BLACK: "b",
} as const;

export type PlayerColor = (typeof PlayerColor)[keyof typeof PlayerColor];
