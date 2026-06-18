import { useEffect, useRef, type ReactNode } from "react";
import { authApi } from "aws-blocks";
import { Authenticator } from "@aws-blocks/blocks/ui";
import { useAuth } from "../hooks/useAuth";

/**
 * Gates the app behind authentication. While signed out it mounts the
 * provider-agnostic <Authenticator> (sign up / sign in with username +
 * password). Once signed in, it renders the protected app.
 */
export function AuthGate({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loading || user || !mountRef.current) return;
    // Authenticator is a framework-agnostic DOM element. Mount it into the
    // React-managed container and clean it up on unmount / auth change.
    const host = mountRef.current;
    host.innerHTML = "";
    host.appendChild(Authenticator(authApi));
    return () => {
      host.innerHTML = "";
    };
  }, [loading, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,192,32,0.06)_0%,transparent_60%)]" />
        <div className="text-white/40 text-sm animate-pulse">Loading…</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center px-4 relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,192,32,0.08)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(90,102,244,0.06)_0%,transparent_50%)]" />

        {/* Decorative floating elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gold-400/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-navy-500/10 rounded-full blur-3xl" />

        <div className="w-full max-w-sm relative z-10">
          {/* Header with trophy */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-gold-400 to-gold-600 shadow-lg shadow-gold-400/20 mb-4">
              <svg
                className="w-8 h-8 text-navy-950"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M5 3h14c.6 0 1 .4 1 1v2c0 2.8-1.8 5.2-4.3 6.1L15 12.5V15h1c.6 0 1 .4 1 1v2H7v-2c0-.6.4-1 1-1h1v-2.5l-.7-.4C5.8 11.2 4 8.8 4 6V4c0-.6.4-1 1-1zm2 2v1c0 1.9 1.2 3.5 2.9 4.2l1.1.5 1.1-.5C13.8 9.5 15 7.9 15 6V5H7zm3 10v2h4v-2h-4zM2 6h1v1c0 1.3.3 2.5.9 3.6-.6-1.3-.9-2.8-.9-4.3V6zm19 0h1v.3c0 1.5-.3 3-1 4.3.6-1.1 1-2.3 1-3.6V6z" />
              </svg>
            </div>
            <h1 className="text-white font-bold text-2xl tracking-tight">
              World Cup 2026
            </h1>
            <p className="text-white/40 text-sm mt-2 leading-relaxed">
              Sign in or create an account to
              <br />
              build your bracket predictions.
            </p>
          </div>

          {/* Auth form card */}
          <div className="bg-white/3 backdrop-blur-sm border border-white/8 rounded-2xl p-6 shadow-2xl shadow-black/20">
            <div ref={mountRef} className="auth-container" />
          </div>

          {/* Footer */}
          <p className="text-center text-white/20 text-xs mt-6">
            🏆 Predict • Compete • Win
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
