'use client';

import { useState, useEffect, ReactNode } from 'react';
import Link from 'next/link';
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Lock, LogOut, LayoutDashboard, Loader2, AlertCircle } from 'lucide-react';

export default function AdminAuth({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch {
      setError('Invalid email or password.');
      setPassword('');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignOut = () => firebaseSignOut(auth);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#30363d] animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm">
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-[#161b22] border border-[#30363d] rounded-full flex items-center justify-center mb-4">
              <Lock className="w-7 h-7 text-[#8b949e]" />
            </div>
            <h1 className="text-xl font-semibold text-white tracking-tight">Admin Sign In</h1>
            <p className="text-sm text-[#8b949e] mt-1">OJT Journal · Protected Area</p>
          </div>

          {/* Form */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden">
            <form onSubmit={handleSignIn} className="p-5 space-y-4">
              {error && (
                <div className="flex items-center gap-2 px-3 py-2.5 bg-[#f85149]/10 border border-[#f85149]/30 rounded-md text-[#ff7b72] text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#8b949e] uppercase tracking-wider">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  autoComplete="email"
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-sm text-[#c9d1d9] placeholder:text-[#484f58] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all"
                  placeholder="you@example.com"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#8b949e] uppercase tracking-wider">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-sm text-[#c9d1d9] placeholder:text-[#484f58] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={submitting || !email || !password}
                className="w-full flex items-center justify-center gap-2 bg-[#238636] hover:bg-[#2ea043] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm py-2 rounded-md transition-colors border border-[rgba(240,246,252,0.1)] mt-2"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {submitting ? 'Signing in…' : 'Sign In'}
              </button>
            </form>
          </div>

          <p className="text-center text-xs text-[#484f58] mt-6">Authorized personnel only.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] font-sans">
      {/* Admin Navbar */}
      <nav className="border-b border-[#30363d] bg-[#161b22]/80 backdrop-blur-xl px-6 h-16 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-full border border-[#30363d] overflow-hidden group-hover:border-[#58a6ff] transition-all">
              <img src="/images/profile.png" alt="jDxve" className="w-full h-full object-cover" />
            </div>
            <div className="flex items-center text-sm font-semibold tracking-tight">
              <span className="text-[#8b949e] group-hover:text-[#58a6ff] transition-colors">jDxve</span>
              <span className="mx-2 text-[#30363d]">/</span>
              <span className="text-white hover:underline">ojt-journal</span>
            </div>
          </Link>
          <span className="px-2 py-0.5 rounded-full border border-[#30363d] text-[10px] font-black text-[#8b949e] uppercase tracking-wider">
            Admin
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-xs font-semibold text-[#8b949e] hover:text-[#58a6ff] transition-colors flex items-center gap-1.5 px-3 py-1.5 hover:bg-[#21262d] rounded-md"
          >
            View Site <LayoutDashboard className="w-3 h-3" />
          </Link>
          <div className="h-4 w-px bg-[#30363d]" />
          <button
            onClick={handleSignOut}
            title="Sign out"
            className="text-[#8b949e] hover:text-[#ff7b72] transition-colors p-2 rounded-md hover:bg-[#21262d]/50"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {children}
    </div>
  );
}
