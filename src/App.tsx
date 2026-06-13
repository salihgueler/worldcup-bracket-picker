import { useState, useCallback, useEffect } from "react";
import { api } from "aws-blocks";
import { useAuth } from "./hooks/useAuth";
import { usePicks } from "./hooks/usePicks";
import { useRealtime } from "./hooks/useRealtime";
import { useBracket } from "./hooks/useBracket";
import { Navbar } from "./components/Navbar";
import { BracketFlow } from "./components/BracketFlow";
import { MyBracket } from "./components/MyBracket";
import { TeamRosters } from "./components/TeamRosters";
import { AIPredictorChat } from "./components/AIPredictorChat";
import { Leaderboard } from "./components/Leaderboard";
import { LiveFeed } from "./components/LiveFeed";
import { TEAMS } from "./data/worldcup2026";
import type { Team } from "./types";

export function App() {
  const { user, signOut } = useAuth();
  const { picks } = usePicks();
  const events = useRealtime();
  const bracket = useBracket();
  const [view, setView] = useState("bracket");
  const [aiPrompt, setAiPrompt] = useState<string | undefined>();

  // Seed tournament reference data once the user is signed in. Idempotent:
  // the backend no-ops if teams already exist.
  useEffect(() => {
    if (!user) return;
    api
      .ensureSeeded()
      .catch((err) => console.error("Failed to seed tournament data", err));
  }, [user]);

  const teams: Team[] = TEAMS.map((t) => ({ ...t, type: "TEAM" }));
  const teamMap = new Map(teams.map((t) => [t.teamId, t]));

  const handleAskAI = useCallback((prompt: string) => {
    setAiPrompt(prompt);
    setView("predictor");
  }, []);
  void handleAskAI;

  return (
    <div className="min-h-screen bg-navy-950">
      <Navbar
        activeView={view}
        onViewChange={setView}
        username={user?.username ?? ""}
        onSignOut={signOut}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex gap-6">
          <div className="flex-1 min-w-0">
            {view === "bracket" && (
              <BracketFlow
                groupPicks={bracket.groupPicks}
                thirdPlacePicks={bracket.thirdPlacePicks}
                knockoutPicks={bracket.knockoutPicks}
                locked={bracket.locked}
                groupsComplete={bracket.groupsComplete}
                thirdPlaceComplete={bracket.thirdPlaceComplete}
                r32Complete={bracket.r32Complete}
                r16Complete={bracket.r16Complete}
                qfComplete={bracket.qfComplete}
                sfComplete={bracket.sfComplete}
                thirdComplete={bracket.thirdComplete}
                finalComplete={bracket.finalComplete}
                allComplete={bracket.allComplete}
                resolveTeamForSeed={bracket.resolveTeamForSeed}
                onGroupPick={bracket.setGroupPick}
                onThirdPlacePick={bracket.setThirdPlacePicks}
                onKnockoutPick={bracket.setKnockoutPick}
                onLock={bracket.lockBracket}
              />
            )}
            {view === "mybracket" && (
              <MyBracket
                groupPicks={bracket.groupPicks}
                knockoutPicks={bracket.knockoutPicks}
                locked={bracket.locked}
                groupsComplete={bracket.groupsComplete}
                totalKnockoutPicks={bracket.totalKnockoutPicks}
                resolveTeamForSeed={bracket.resolveTeamForSeed}
              />
            )}
            {view === "teams" && <TeamRosters />}
            {view === "predictor" && (
              <AIPredictorChat initialPrompt={aiPrompt} />
            )}
            {view === "leaderboard" && <Leaderboard />}
          </div>

          <aside className="hidden xl:block w-72 flex-shrink-0">
            <div className="sticky top-20">
              <LiveFeed events={events} teams={teamMap} />
              <div className="mt-4 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4">
                <h4 className="text-white/40 text-[11px] font-semibold uppercase tracking-wider mb-3">
                  Your Stats
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <div className="text-gold-400 font-bold text-xl">
                      {picks.length}
                    </div>
                    <div className="text-white/30 text-[10px] mt-0.5">
                      Picks Made
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-gold-400 font-bold text-xl">
                      {bracket.groupsComplete}/12
                    </div>
                    <div className="text-white/30 text-[10px] mt-0.5">
                      Groups Done
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
