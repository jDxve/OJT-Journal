'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const navStyles: Record<string, React.CSSProperties> = {
  nav: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: 'var(--nav-height)',
    background: 'rgba(10, 15, 13, 0.85)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottom: '1px solid var(--border)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
  },
  inner: {
    maxWidth: 'var(--max-width)',
    margin: '0 auto',
    padding: '0 24px',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logoPulse: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: 'var(--accent)',
    boxShadow: '0 0 12px var(--accent-glow-strong)',
    animation: 'pulse-glow 2s ease-in-out infinite',
  },
  logoText: {
    fontSize: '1.15rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
    letterSpacing: '-0.01em',
  },
  logoAccent: {
    color: 'var(--accent)',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  link: {
    padding: '8px 16px',
    borderRadius: 'var(--radius-sm)',
    fontSize: '0.875rem',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    textDecoration: 'none',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  linkActive: {
    color: 'var(--accent)',
    background: 'var(--accent-glow)',
  },
  accentLine: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: 'linear-gradient(90deg, transparent, var(--accent), transparent)',
    opacity: 0.5,
  },
};

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <nav
      style={{
        ...navStyles.nav,
        boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.3)' : 'none',
      }}
    >
      <div style={navStyles.inner}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={navStyles.logoWrap}>
            <div style={navStyles.logoPulse} />
            <span style={navStyles.logoText}>
              OJT<span style={navStyles.logoAccent}>Journal</span>
            </span>
          </div>
        </Link>

        <div style={navStyles.links}>
          <Link
            href="/"
            style={{
              ...navStyles.link,
              ...(isActive('/') ? navStyles.linkActive : {}),
            }}
          >
            Journal
          </Link>
          <Link
            href="/admin"
            style={{
              ...navStyles.link,
              ...(pathname.startsWith('/admin') ? navStyles.linkActive : {}),
            }}
          >
            Admin
          </Link>
        </div>
      </div>
      <div style={navStyles.accentLine} />
    </nav>
  );
}
