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
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <div className="text-white/40 text-sm">Loading…</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-6">
            <h1 className="text-white font-bold text-2xl">World Cup 2026</h1>
            <p className="text-white/40 text-sm mt-1">
              Sign in or create an account to build your bracket.
            </p>
          </div>
          <div
            ref={mountRef}
            className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6"
          />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
