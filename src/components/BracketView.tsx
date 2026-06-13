import { useState } from "react";
import type { Team, Match } from "../types";
import { GroupStage } from "./GroupStage";
import { KnockoutBracket } from "./KnockoutBracket";

interface BracketViewProps {
  teams: Team[];
  matches: Match[];
  picks: Map<string, string>;
  onPick: (matchId: string, teamId: string) => void;
  onAskAI: (team1: string, team2: string) => void;
}

export function BracketView({ teams, matches, picks, onPick, onAskAI }: BracketViewProps) {
  const [tab, setTab] = useState<"groups" | "knockout">("groups");
  const teamMap = new Map(teams.map((t) => [t.teamId, t]));
  const knockoutMatches = matches.filter((m) => m.stage !== "group");

  return (
    <div>
      <div className="flex items-center justify-center gap-1 mb-8 bg-white/[0.03] rounded-xl p-1.5 max-w-xs mx-auto">
        <button
          onClick={() => setTab("groups")}
          className={`flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
            tab === "groups"
              ? "bg-gold-400 text-navy-900 shadow-lg shadow-gold-400/20"
              : "text-white/60 hover:text-white"
          }`}
        >
          Groups
        </button>
        <button
          onClick={() => setTab("knockout")}
          className={`flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
            tab === "knockout"
              ? "bg-gold-400 text-navy-900 shadow-lg shadow-gold-400/20"
              : "text-white/60 hover:text-white"
          }`}
        >
          Knockout
        </button>
      </div>
      {tab === "groups" ? (
        <GroupStage teams={teams} matches={matches} picks={picks} onPick={onPick} onAskAI={onAskAI} />
      ) : (
        <KnockoutBracket matches={knockoutMatches} teams={teamMap} picks={picks} onPick={onPick} onAskAI={onAskAI} />
      )}
    </div>
  );
}
