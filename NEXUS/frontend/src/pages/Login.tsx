/**
 * Login / Sign Up page.
 * Supports Supabase auth and demo mode (when credentials aren't configured).
 */

import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth, type UserRole } from '@/contexts/AuthContext';
import { Cpu, Eye, EyeOff, Loader2, Users } from 'lucide-react';

const demoRoles: { role: UserRole; label: string; desc: string }[] = [
  { role: 'student', label: 'Student', desc: 'Report issues, track requests' },
  { role: 'faculty', label: 'Faculty', desc: 'Manage resources, requests' },
  { role: 'staff', label: 'Staff', desc: 'Handle assigned tasks' },
  { role: 'admin', label: 'Admin', desc: 'Full operations dashboard' },
];

export default function LoginPage() {
  const { user, signIn, signUp, signInWithGoogle, loading: authLoading, isDemo, loginAsDemo } = useAuth();
  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  if (user && !authLoading) {
    navigate('/dashboard', { replace: true });
    return null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        if (!displayName.trim()) {
          setError('Please enter your name.');
          setLoading(false);
          return;
        }
        await signUp(email, password, displayName);
      } else {
        await signIn(email, password);
      }
      navigate('/dashboard', { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed.';
      if (msg.includes('Invalid login credentials') || msg.includes('invalid-credential')) {
        setError('Invalid email or password.');
      } else if (msg.includes('User already registered') || msg.includes('email-already-in-use')) {
        setError('An account with this email already exists.');
      } else if (msg.includes('Password should be at least 6 characters') || msg.includes('weak-password')) {
        setError('Password must be at least 6 characters.');
      } else if (msg.includes('invalid email') || msg.includes('invalid-email')) {
        setError('Please enter a valid email address.');
      } else if (msg.includes('Failed to fetch')) {
        console.error('Authentication network request failed. Original error:', err);
        setError('Unable to connect to the authentication service. Please verify your network connection and configuration.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate('/dashboard', { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google sign-in failed.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  function handleDemoLogin(role: UserRole) {
    loginAsDemo(role);
    navigate('/dashboard', { replace: true });
  }

  return (
    <div className="min-h-screen bg-nexus-bg nexus-grid flex items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-[-150px] right-[-100px] w-[400px] h-[400px] rounded-full bg-nexus-cyan/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-150px] left-[-100px] w-[400px] h-[400px] rounded-full bg-nexus-violet/5 blur-[100px] pointer-events-none" />

      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-nexus-cyan to-nexus-blue flex items-center justify-center">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-gradient-cyan">
            NEXUS
          </span>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8 glow-cyan">
          {isDemo ? (
            /* ── Demo Mode ── */
            <>
              <h2 className="text-xl font-bold text-nexus-text text-center mb-1">
                Welcome to NEXUS
              </h2>
              <p className="text-sm text-nexus-text-secondary text-center mb-2">
                Select a role to explore the platform
              </p>
              <div className="flex items-center justify-center gap-2 mb-6">
                <span className="px-2.5 py-1 rounded-lg bg-nexus-amber/10 border border-nexus-amber/30 text-xs text-amber-400 font-medium">
                  Demo Mode
                </span>
              </div>

              <div className="space-y-3">
                {demoRoles.map((dr) => (
                  <button
                    key={dr.role}
                    onClick={() => handleDemoLogin(dr.role)}
                    className="w-full flex items-center gap-4 p-4 rounded-xl bg-nexus-surface-2 border border-nexus-border hover:border-nexus-cyan/40 hover:bg-nexus-surface-3 transition-all duration-200 text-left group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-nexus-surface-3 flex items-center justify-center group-hover:bg-nexus-cyan/10 transition-colors">
                      <Users className="w-4 h-4 text-nexus-text-secondary group-hover:text-nexus-cyan transition-colors" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-nexus-text">
                        {dr.label}
                      </p>
                      <p className="text-xs text-nexus-text-muted">
                        {dr.desc}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              <p className="text-xs text-nexus-text-muted text-center mt-5">
                Configure Supabase credentials to enable real authentication.
              </p>
            </>
          ) : (
            /* ── Supabase Auth Mode ── */
            <>
              <h2 className="text-xl font-bold text-nexus-text text-center mb-1">
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p className="text-sm text-nexus-text-secondary text-center mb-6">
                {isSignUp
                  ? 'Join the Intelligent Campus Network'
                  : 'Sign in to access NEXUS'}
              </p>

              {error && (
                <div
                  className="mb-4 px-4 py-2.5 rounded-xl bg-nexus-red/10 border border-nexus-red/30 text-sm text-red-400"
                  role="alert"
                >
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignUp && (
                  <div>
                    <label
                      htmlFor="displayName"
                      className="block text-sm font-medium text-nexus-text-secondary mb-1.5"
                    >
                      Full Name
                    </label>
                    <input
                      id="displayName"
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-nexus-surface-2 border border-nexus-border text-nexus-text placeholder:text-nexus-text-muted focus:border-nexus-cyan/50 focus:outline-none transition-colors"
                      placeholder="Enter your full name"
                      autoComplete="name"
                    />
                  </div>
                )}

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-nexus-text-secondary mb-1.5"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-nexus-surface-2 border border-nexus-border text-nexus-text placeholder:text-nexus-text-muted focus:border-nexus-cyan/50 focus:outline-none transition-colors"
                    placeholder="your.email@university.edu"
                    autoComplete="email"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-nexus-text-secondary mb-1.5"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2.5 pr-11 rounded-xl bg-nexus-surface-2 border border-nexus-border text-nexus-text placeholder:text-nexus-text-muted focus:border-nexus-cyan/50 focus:outline-none transition-colors"
                      placeholder="Enter your password"
                      autoComplete={isSignUp ? 'new-password' : 'current-password'}
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-nexus-text-muted hover:text-nexus-text transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-nexus-cyan to-nexus-blue hover:shadow-lg hover:shadow-nexus-cyan/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isSignUp ? (
                    'Create Account'
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-nexus-border" />
                <span className="text-xs text-nexus-text-muted">or</span>
                <div className="flex-1 h-px bg-nexus-border" />
              </div>

              {/* Google Sign-In */}
              <button
                onClick={handleGoogle}
                disabled={loading}
                className="w-full py-2.5 rounded-xl font-medium text-nexus-text bg-nexus-surface-2 border border-nexus-border hover:border-nexus-cyan/40 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </button>

              {/* Toggle Sign Up / Sign In */}
              <p className="text-center text-sm text-nexus-text-secondary mt-5">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError('');
                  }}
                  className="text-nexus-cyan hover:underline font-medium"
                >
                  {isSignUp ? 'Sign In' : 'Create Account'}
                </button>
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
