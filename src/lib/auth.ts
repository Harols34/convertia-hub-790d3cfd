import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";

export interface AuthState {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
}

export const checkAdminRole = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    if (error) {
      console.error("Error checking admin role:", error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error("Error in checkAdminRole:", error);
    return false;
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
};

export const signUpWithEmail = async (email: string, password: string) => {
  const redirectUrl = `${window.location.origin}/`;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectUrl,
    },
  });

  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};
