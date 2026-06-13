import { POINTS } from "../data/bracketConstants";

export function Leaderboard() {
  const maxPoints =
    24 * POINTS.GROUP_QUALIFIER + 24 * POINTS.GROUP_POSITION_BONUS +
    16 * POINTS.R32_WINNER + 8 * POINTS.R16_WINNER +
    4 * POINTS.QF_WINNER + 2 * POINTS.SF_WINNER +
    POINTS.THIRD_PLACE + POINTS.FINAL_WINNER;

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-white/[0.06] bg-gradient-to-r from-gold-400/10 to-transparent">
          <h3 className="text-gold-400 font-bold text-lg flex items-center gap-2">
            <span className="text-2xl">🏆</span> Leaderboard
          </h3>
        </div>
        <div className="px-6 py-8 text-center space-y-4">
          <div className="text-4xl">📊</div>
          <p className="text-white/70 text-sm leading-relaxed">
            Points will be calculated as World Cup matches are played.
          </p>
          <p className="text-white/40 text-xs">
            Tournament runs June 11 – July 19, 2026. Lock in your bracket before the first match!
          </p>
        </div>
      </div>

      {/* Points system explanation */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
        <h4 className="text-white font-semibold text-sm mb-4">Points System</h4>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between text-white/60">
            <span>Correct group qualifier</span><span className="text-gold-400 font-semibold">{POINTS.GROUP_QUALIFIER} pts</span>
          </div>
          <div className="flex justify-between text-white/60">
            <span>Correct group position (1st/2nd)</span><span className="text-gold-400 font-semibold">+{POINTS.GROUP_POSITION_BONUS} bonus</span>
          </div>
          <div className="flex justify-between text-white/60">
            <span>Correct R32 winner</span><span className="text-gold-400 font-semibold">{POINTS.R32_WINNER} pts</span>
          </div>
          <div className="flex justify-between text-white/60">
            <span>Correct R16 winner</span><span className="text-gold-400 font-semibold">{POINTS.R16_WINNER} pts</span>
          </div>
          <div className="flex justify-between text-white/60">
            <span>Correct QF winner</span><span className="text-gold-400 font-semibold">{POINTS.QF_WINNER} pts</span>
          </div>
          <div className="flex justify-between text-white/60">
            <span>Correct SF winner</span><span className="text-gold-400 font-semibold">{POINTS.SF_WINNER} pts</span>
          </div>
          <div className="flex justify-between text-white/60">
            <span>Correct 3rd place</span><span className="text-gold-400 font-semibold">{POINTS.THIRD_PLACE} pts</span>
          </div>
          <div className="flex justify-between text-white/60">
            <span>Correct World Cup winner</span><span className="text-gold-400 font-semibold">{POINTS.FINAL_WINNER} pts</span>
          </div>
          <div className="flex justify-between text-white/60">
            <span>Correct score prediction</span><span className="text-gold-400 font-semibold">+{POINTS.CORRECT_SCORE_BONUS} bonus</span>
          </div>
          <div className="border-t border-white/[0.06] pt-2 mt-3 flex justify-between text-white/80 font-semibold">
            <span>Maximum possible points</span><span className="text-gold-400">{maxPoints}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
