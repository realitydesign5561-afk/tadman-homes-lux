import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export type AppRole = "admin" | "merchant" | "agent" | "user";

type AuthState = {
  session: Session | null;
  user: User | null;
  roles: AppRole[];
  loading: boolean;
  isAdmin: boolean;
  isMerchant: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState>({
  session: null,
  user: null,
  roles: [],
  loading: true,
  isAdmin: false,
  isMerchant: false,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return;
      setSession(nextSession);
    });

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      // Loading will finish after roles are loaded.
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const userId = session?.user?.id;

    if (!userId) {
      setRoles([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    let active = true;

    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .then(({ data, error }) => {
        if (!active) return;

        if (error) {
          console.error("Failed to load user roles:", error);
          setRoles([]);
        } else {
          setRoles(
            ((data ?? []) as { role: AppRole }[]).map((r) => r.role)
          );
        }

        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [session?.user?.id]);

  const value = useMemo<AuthState>(
    () => ({
      session,
      user: session?.user ?? null,
      roles,
      loading,
      isAdmin: roles.includes("admin"),
      isMerchant:
        roles.includes("merchant") || roles.includes("agent"),

      signOut: async () => {
        setLoading(true);
        await supabase.auth.signOut();
        setRoles([]);
        setSession(null);
        setLoading(false);
      },
    }),
    [session, roles, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}