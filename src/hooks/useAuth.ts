import { useState, useEffect, useCallback } from "react";
import { authApi } from "aws-blocks";
import { onAuthChange, broadcastAuthChange } from "@aws-blocks/blocks/ui";

export interface AuthUser {
  userId: string;
  username: string;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribes to auth state (same-window + cross-tab). Fires immediately
    // with the current user, then again on every sign-in / sign-out.
    const unsubscribe = onAuthChange(authApi, (u) => {
      setUser(u ? { userId: u.userId, username: u.username } : null);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signOut = useCallback(async () => {
    const next = await authApi.setAuthState({ action: "signOut" });
    broadcastAuthChange(next.user ?? null);
  }, []);

  return { user, loading, signOut };
}
