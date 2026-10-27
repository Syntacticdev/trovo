import { createContext, use, useState, type PropsWithChildren } from "react";

type SessionValue = {
  signIn: () => void;
  signOut: () => void;
  session: string | null;
  isLoading: boolean;
};

const SessionContext = createContext<SessionValue | null>(null);

export function useSession() {
  const value = use(SessionContext);
  if (!value) {
    throw new Error("useSession must be wrapped in a <SessionProvider />");
  }
  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<string | null>(null);

  return (
    <SessionContext.Provider
      value={{
        signIn: () => setSession("trovo-session"),
        signOut: () => setSession(null),
        session,
        isLoading: false,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}
