import { useState, useCallback } from "react";
import { api } from "cdk-blocks";
import type { Pick } from "../types";

export function usePicks() {
  const [picks, setPicks] = useState<Pick[]>([]);
  const [loading, setLoading] = useState(false);

  const loadMyPicks = useCallback(async () => {
    setLoading(true);
    try {
      const result = await api.getMyPicks();
      setPicks(result as Pick[]);
    } finally {
      setLoading(false);
    }
  }, []);

  const makePick = useCallback(
    async (matchId: string, predictedWinner: string, confidence?: number) => {
      const saved = (await api.makePick(
        matchId,
        predictedWinner,
        confidence,
      )) as Pick;
      setPicks((prev) => {
        const idx = prev.findIndex((p) => p.matchId === matchId);
        if (idx >= 0) {
          const u = [...prev];
          u[idx] = saved;
          return u;
        }
        return [...prev, saved];
      });
      return saved;
    },
    [],
  );

  return { picks, loading, loadMyPicks, makePick };
}
