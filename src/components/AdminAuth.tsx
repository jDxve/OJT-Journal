'use client';

import { useState, useEffect, ReactNode } from 'react';
import Link from 'next/link';
import { Lock, LogOut, LayoutDashboard } from 'lucide-react';

interface AdminAuthProps {
  children: ReactNode;
}

const AUTH_KEY = 'ojt-admin-auth';

export default function AdminAuth({ children }: AdminAuthProps) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_KEY);
    if (stored === 'true') {
      setAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const adminPw = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || process.env.NEXT_PUBLIC_ADMIN_PASS || 'admin';
    if (password === adminPw || password === 'admin') {
      localStorage.setItem(AUTH_KEY, 'true');
      setAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(AUTH_KEY);
    setAuthenticated(false);
    setPassword('');
  };

  if (loading) {
    return (
      <div className="min-h-[100vh] bg-[#0d1117] flex items-center justify-center p-6">
        <div className="w-8 h-8 border-4 border-[#30363d] border-t-[#3fb950] rounded-full animate-spin" />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex flex-col items-center justify-center p-6 space-y-6">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-[#21262d] border border-[#30363d] rounded-full flex items-center justify-center mb-4 text-[#8b949e]">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-light text-[#c9d1d9] tracking-tight">Sign in to Admin</h1>
          </div>
          
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="px-4 py-3 bg-[rgba(248,81,73,0.1)] border border-[rgba(248,81,73,0.4)] text-[#ff7b72] text-sm rounded-md font-medium">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#c9d1d9]">
                  Passphrase
                </label>
                <input
                  id="admin-password-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-1.5 text-sm text-[#c9d1d9] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all"
                  autoFocus
                />
                <p className="text-xs text-[#8b949e] mt-2">
                  (Default mockup password: <span className="font-mono bg-[rgba(240,246,252,0.1)] px-1 py-0.5 rounded text-[#c9d1d9]">admin</span>)
                </p>
              </div>
              
              <button 
                type="submit" 
                className="w-full bg-[#238636] hover:bg-[#2ea043] text-white font-medium text-sm py-2 rounded-md transition-colors border border-[rgba(240,246,252,0.1)] mt-4"
              >
                Unlock
              </button>
            </form>
          </div>
          
          <p className="text-center text-xs text-[#8b949e] mt-8">
            Protected area. For authorized users only.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] font-sans">
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
          <span className="px-2 py-0.5 rounded-full border border-[#30363d] text-[10px] font-black text-[#8b949e] uppercase tracking-wider">Admin</span>
        </div>
        
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xs font-bold text-[#8b949e] hover:text-[#58a6ff] transition-all flex items-center gap-1.5 px-3 py-1.5 hover:bg-[#21262d] rounded-md">
            View Site <LayoutDashboard className="w-3 h-3" />
          </Link>
          <div className="h-4 w-px bg-[#30363d]" />
          <button
            onClick={handleLogout}
            className="text-[#8b949e] hover:text-[#ff7b72] transition-colors p-2 rounded-md hover:bg-[#21262d]/50"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </nav>
      {children}
    </div>
  );
}
