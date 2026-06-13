import { useState } from "react";

interface NavbarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  username: string;
  onSignOut: () => void;
}

const TABS = [
  { id: "bracket", label: "Bracket", icon: "🏆" },
  { id: "mybracket", label: "My Bracket", icon: "📋" },
  { id: "teams", label: "Teams", icon: "👥" },
  { id: "predictor", label: "AI Predictor", icon: "🤖" },
  { id: "leaderboard", label: "Leaderboard", icon: "📊" },
];

export function Navbar({ activeView, onViewChange, username, onSignOut }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-navy-900/95 backdrop-blur-md border-b border-white/5 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⚽</span>
          <div className="leading-tight">
            <span className="text-gold-400 font-bold text-sm tracking-wide">WORLD CUP</span>
            <span className="text-white/50 text-xs block">2026 Bracket Picker</span>
          </div>
        </div>

        {/* Desktop tabs */}
        <div className="hidden md:flex items-center gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onViewChange(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeView === tab.id
                  ? "bg-gold-400 text-navy-900 shadow-lg shadow-gold-400/20"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="mr-1.5">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <span className="text-white/50 text-sm">👤 {username}</span>
          <button
            onClick={onSignOut}
            className="text-xs text-white/40 hover:text-red-400 transition-colors font-medium"
          >
            Sign Out
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white/70 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/5 bg-navy-900/98 px-4 py-3 space-y-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { onViewChange(tab.id); setMenuOpen(false); }}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold transition ${
                activeView === tab.id
                  ? "bg-gold-400 text-navy-900"
                  : "text-white/70 hover:bg-white/5"
              }`}
            >
              <span className="mr-2">{tab.icon}</span>{tab.label}
            </button>
          ))}
          <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-2">
            <span className="text-white/50 text-sm">👤 {username}</span>
            <button onClick={onSignOut} className="text-xs text-red-400 font-medium">Sign Out</button>
          </div>
        </div>
      )}
    </nav>
  );
}
