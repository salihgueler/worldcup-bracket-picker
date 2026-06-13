export interface AuthUser {
  userId: string;
  username: string;
}

export function useAuth() {
  const user: AuthUser = { userId: "demo-user", username: "Demo" };
  const signOut = async () => {};
  return { user, signOut };
}
