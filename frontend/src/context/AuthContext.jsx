import {
  startTransition,
  useEffect,
  useState
} from "react";
import { supabase } from "../lib/supabaseClient";
import AuthContext from "./authContext";

async function fetchRole(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (error) {
    throw error;
  }

  return data.role;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function syncAuthState(nextSession) {
      startTransition(() => {
        setSession(nextSession);
        setUser(nextSession?.user ?? null);
      });

      if (!nextSession?.user) {
        startTransition(() => {
          setRole(null);
          setLoading(false);
        });
        return;
      }

      try {
        const nextRole = await fetchRole(nextSession.user.id);

        if (!isMounted) {
          return;
        }

        startTransition(() => {
          setRole(nextRole);
          setAuthError("");
          setLoading(false);
        });
      } catch (error) {
        if (!isMounted) {
          return;
        }

        startTransition(() => {
          setRole(null);
          setAuthError(error.message || "Unable to load your profile.");
          setLoading(false);
        });
      }
    }

    async function hydrateAuthState() {
      setLoading(true);
      const {
        data: { session: existingSession }
      } = await supabase.auth.getSession();

      if (!isMounted) {
        return;
      }

      await syncAuthState(existingSession);
    }

    void hydrateAuthState();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      void syncAuthState(nextSession);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function signup(email, password) {
    setAuthError("");

    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      throw error;
    }

    return data;
  }

  async function login(email, password) {
    setAuthError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw error;
    }

    const nextRole = await fetchRole(data.user.id);
    setRole(nextRole);

    return {
      ...data,
      role: nextRole
    };
  }

  async function loginWithGoogle() {
    setAuthError("");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/`
      }
    });

    if (error) {
      throw error;
    }
  }

  async function signupWithGoogle() {
    return loginWithGoogle();
  }

  async function logout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }
  }

  const value = {
    user,
    session,
    role,
    loading,
    authError,
    isAuthenticated: Boolean(session),
    signup,
    login,
    loginWithGoogle,
    signupWithGoogle,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
