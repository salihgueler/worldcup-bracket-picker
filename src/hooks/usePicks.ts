import { useState, useCallback } from "react";
import type { Pick } from "../types";

export function usePicks() {
  const [picks, setPicks] = useState<Pick[]>([]);

  const loadMyPicks = useCallback(async () => {}, []);

  const makePick = useCallback(async (matchId: string, predictedWinner: string) => {
    setPicks((prev) => {
      const newPick: Pick = {
        oddsType: "PICK", oddsId: `local#${matchId}`, userId: "demo-user",
        matchId, predictedWinner, confidence: 50, createdAt: Date.now(),
      };
      const idx = prev.findIndex((p) => p.matchId === matchId);
      if (idx >= 0) { const u = [...prev]; u[idx] = newPick; return u; }
      return [...prev, newPick];
    });
  }, []);

  return { picks, loading: false, loadMyPicks, makePick };
}
