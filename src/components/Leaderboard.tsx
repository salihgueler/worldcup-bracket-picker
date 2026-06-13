import { useState, useEffect, useCallback } from "react";
import { api } from "aws-blocks";
import { POINTS } from "../data/bracketConstants";
import { useAuth } from "../hooks/useAuth";

interface Standing {
  userId: string;
  score: number;
  picks: number;
}

export function Leaderboard() {
  const { user } = useAuth();
  const [standings, setStandings] = useState<Standing[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncNote, setSyncNote] = useState<string | null>(null);

  const maxPoints =
    24 * POINTS.GROUP_QUALIFIER +
    24 * POINTS.GROUP_POSITION_BONUS +
    16 * POINTS.R32_WINNER +
    8 * POINTS.R16_WINNER +
    4 * POINTS.QF_WINNER +
    2 * POINTS.SF_WINNER +
    POINTS.THIRD_PLACE +
    POINTS.FINAL_WINNER;

  const loadLeaderboard = useCallback(async () => {
    setLoading(true);
    try {
      const result = (await api.getLeaderboard()) as Standing[];
      setStandings(result ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadLeaderboard();
  }, [loadLeaderboard]);

  const syncResults = useCallback(async () => {
    setSyncing(true);
    setSyncNote(null);
    try {
      const res = (await api.syncResultsNow()) as {
        checked: number;
        pending: number;
        updated: number;
        leaderboard: Standing[];
      };
      setStandings(res.leaderboard ?? []);
      setSyncNote(
        `Checked ${res.checked} matches · ${res.updated} updated · ${res.pending} still pending`,
      );
    } catch (err) {
      setSyncNote(
        err instanceof Error ? `Sync failed: ${err.message}` : "Sync failed",
      );
    } finally {
      setSyncing(false);
    }
  }, []);

  const hasStandings = standings.length > 0;

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-white/[0.06] bg-gradient-to-r from-gold-400/10 to-transparent flex items-center justify-between gap-3">
          <h3 className="text-gold-400 font-bold text-lg flex items-center gap-2">
            <span className="text-2xl">🏆</span> Leaderboard
          </h3>
          <button
            onClick={syncResults}
            disabled={syncing}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-gold-400/10 text-gold-400 border border-gold-400/20 hover:bg-gold-400/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {syncing ? "Syncing…" : "↻ Sync results"}
          </button>
        </div>

        {syncNote && (
          <div className="px-6 py-2 text-xs text-white/50 border-b border-white/[0.06]">
            {syncNote}
          </div>
        )}

        {loading ? (
          <div className="px-6 py-8 text-center text-white/50 text-sm">
            Loading standings…
          </div>
        ) : hasStandings ? (
          <ul className="divide-y divide-white/[0.06]">
            {standings.map((s, i) => {
              const isMe = user?.username === s.userId;
              return (
                <li
                  key={s.userId}
                  className={`px-6 py-3 flex items-center gap-3 ${
                    isMe ? "bg-gold-400/[0.06]" : ""
                  }`}
                >
                  <span className="w-6 text-center font-bold text-white/40 text-sm">
                    {i + 1}
                  </span>
                  <span className="flex-1 text-white/90 text-sm font-medium truncate">
                    {s.userId}
                    {isMe && (
                      <span className="ml-2 text-gold-400 text-xs">you</span>
                    )}
                  </span>
                  <span className="text-white/40 text-xs">{s.picks} picks</span>
                  <span className="text-gold-400 font-bold text-sm w-12 text-right">
                    {s.score}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="px-6 py-8 text-center space-y-4">
            <div className="text-4xl">📊</div>
            <p className="text-white/70 text-sm leading-relaxed">
              No results yet. Points will appear as World Cup matches are played
              — hit <span className="text-gold-400">Sync results</span> to pull
              the latest scores.
            </p>
            <p className="text-white/40 text-xs">
              Tournament runs June 11 – July 19, 2026. Lock in your bracket
              before the first match!
            </p>
          </div>
        )}
      </div>

      {/* Points system explanation */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
        <h4 className="text-white font-semibold text-sm mb-4">Points System</h4>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between text-white/60">
            <span>Correct group qualifier</span>
            <span className="text-gold-400 font-semibold">
              {POINTS.GROUP_QUALIFIER} pts
            </span>
          </div>
          <div className="flex justify-between text-white/60">
            <span>Correct group position (1st/2nd)</span>
            <span className="text-gold-400 font-semibold">
              +{POINTS.GROUP_POSITION_BONUS} bonus
            </span>
          </div>
          <div className="flex justify-between text-white/60">
            <span>Correct R32 winner</span>
            <span className="text-gold-400 font-semibold">
              {POINTS.R32_WINNER} pts
            </span>
          </div>
          <div className="flex justify-between text-white/60">
            <span>Correct R16 winner</span>
            <span className="text-gold-400 font-semibold">
              {POINTS.R16_WINNER} pts
            </span>
          </div>
          <div className="flex justify-between text-white/60">
            <span>Correct QF winner</span>
            <span className="text-gold-400 font-semibold">
              {POINTS.QF_WINNER} pts
            </span>
          </div>
          <div className="flex justify-between text-white/60">
            <span>Correct SF winner</span>
            <span className="text-gold-400 font-semibold">
              {POINTS.SF_WINNER} pts
            </span>
          </div>
          <div className="flex justify-between text-white/60">
            <span>Correct 3rd place</span>
            <span className="text-gold-400 font-semibold">
              {POINTS.THIRD_PLACE} pts
            </span>
          </div>
          <div className="flex justify-between text-white/60">
            <span>Correct World Cup winner</span>
            <span className="text-gold-400 font-semibold">
              {POINTS.FINAL_WINNER} pts
            </span>
          </div>
          <div className="flex justify-between text-white/60">
            <span>Correct score prediction</span>
            <span className="text-gold-400 font-semibold">
              +{POINTS.CORRECT_SCORE_BONUS} bonus
            </span>
          </div>
          <div className="border-t border-white/[0.06] pt-2 mt-3 flex justify-between text-white/80 font-semibold">
            <span>Maximum possible points</span>
            <span className="text-gold-400">{maxPoints}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
