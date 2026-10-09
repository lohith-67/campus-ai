/**
 * Authentication context and provider.
 * Manages Supabase Auth state and exposes user + role across the app.
 * Supports demo mode when credentials are not configured.
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase, isConfigured } from '@/lib/supabase';

// ── Types ────────────────────────────────────────────────────────────

export type UserRole = 'student' | 'faculty' | 'staff' | 'admin';

export interface NexusUser {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  department: string;
  photoURL: string | null;
}

interface AuthContextType {
  user: NexusUser | null;
  supabaseUser: User | null;
  loading: boolean;
  isDemo: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
  loginAsDemo: (role: UserRole) => void;
}

// ── Demo Users ───────────────────────────────────────────────────────

const demoUsers: Record<UserRole, NexusUser> = {
  student: {
    uid: 'demo-student',
    email: 'student@nexus.demo',
    displayName: 'Rahul Sharma',
    role: 'student',
    department: 'Computer Science & Engineering',
    photoURL: null,
  },
  faculty: {
    uid: 'demo-faculty',
    email: 'faculty@nexus.demo',
    displayName: 'Dr. Anita Desai',
    role: 'faculty',
    department: 'Computer Science & Engineering',
    photoURL: null,
  },
  staff: {
    uid: 'demo-staff',
    email: 'staff@nexus.demo',
    displayName: 'Suresh Kumar',
    role: 'staff',
    department: 'Facilities & Maintenance',
    photoURL: null,
  },
  admin: {
    uid: 'demo-admin',
    email: 'admin@nexus.demo',
    displayName: 'Campus Admin',
    role: 'admin',
    department: 'Administration',
    photoURL: null,
  },
};

// ── Context ──────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

// ── Provider ─────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [user, setUser] = useState<NexusUser | null>(null);
  const [loading, setLoading] = useState(true);
  const isDemo = !isConfigured;

  useEffect(() => {
    if (!isConfigured) {
      setLoading(false);
      return;
    }

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleAuthChange(session?.user ?? null);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      handleAuthChange(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function handleAuthChange(sbUser: User | null) {
    setSupabaseUser(sbUser);
    if (sbUser) {
      const nexusUser = await fetchOrCreateProfile(sbUser);
      setUser(nexusUser);
    } else {
      setUser(null);
    }
    setLoading(false);
  }

  async function fetchOrCreateProfile(sbUser: User): Promise<NexusUser> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', sbUser.id)
      .single();

    if (data) {
      return {
        uid: sbUser.id,
        email: sbUser.email ?? '',
        displayName: data.name ?? sbUser.email ?? '',
        role: data.role as UserRole,
        department: data.department ?? '',
        photoURL: sbUser.user_metadata?.avatar_url ?? null,
      };
    }

    // Profile should ideally be created by the Postgres Trigger handle_new_user.
    // If it isn't here yet, we'll return a fallback until it synchronizes.
    return {
      uid: sbUser.id,
      email: sbUser.email ?? '',
      displayName: sbUser.user_metadata?.name ?? sbUser.email ?? '',
      role: (sbUser.user_metadata?.role as UserRole) ?? 'student',
      department: '',
      photoURL: sbUser.user_metadata?.avatar_url ?? null,
    };
  }

  async function signIn(email: string, password: string) {
    if (!isConfigured) throw new Error('Supabase not configured');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }

  async function signUp(email: string, password: string, displayName: string) {
    if (!isConfigured) throw new Error('Supabase not configured');
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: displayName,
          role: 'student', // default role
        },
      },
    });
    if (error) throw error;
  }

  async function signInWithGoogle() {
    if (!isConfigured) throw new Error('Supabase not configured');
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) throw error;
  }

  async function signOutFn() {
    if (isConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSupabaseUser(null);
  }

  const loginAsDemo = useCallback((role: UserRole) => {
    setUser(demoUsers[role]);
  }, []);

  async function getIdToken(): Promise<string | null> {
    if (!isConfigured) return null;
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token ?? null;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        supabaseUser,
        loading,
        isDemo,
        signIn,
        signUp,
        signInWithGoogle,
        signOut: signOutFn,
        getIdToken,
        loginAsDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
