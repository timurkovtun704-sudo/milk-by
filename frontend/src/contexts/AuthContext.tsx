
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import type { PropsWithChildren } from "react";

import { login as requestLogin } from "../services/authService";

import type {
  AuthSession,
  AuthUser,
} from "../services/authService";

interface AuthContextValue {
  session: AuthSession | null;
  user: AuthUser | null;
  accessToken: string | null;
  role: string | null;
  isAuthenticated: boolean;

  login: (
    email: string,
    password: string
  ) => Promise<AuthSession>;

  logout: () => void;
}

const AuthContext = createContext<
  AuthContextValue | undefined
>(undefined);

export function AuthProvider({
  children,
}: PropsWithChildren) {
  const [session, setSession] =
    useState<AuthSession | null>(null);

  const login = useCallback(
    async (
      email: string,
      password: string
    ): Promise<AuthSession> => {
      const nextSession = await requestLogin(
        email,
        password
      );

      setSession(nextSession);

      return nextSession;
    },
    []
  );

  const logout = useCallback(() => {
    setSession(null);
  }, []);

  const user = session?.user ?? null;

  const role =
    typeof user?.app_metadata?.role === "string"
      ? user.app_metadata.role
      : null;

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user,
      accessToken: session?.accessToken ?? null,
      role,
      isAuthenticated: session !== null,
      login,
      logout,
    }),
    [session, user, role, login, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Получение состояния авторизации
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth должен использоваться внутри AuthProvider"
    );
  }

  return context;
}
