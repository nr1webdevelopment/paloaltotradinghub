'use client';

import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const t = (document.documentElement.getAttribute('data-theme') as 'dark' | 'light') || 'dark';
    setTheme(t);
  }, []);

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('path.theme', next);
    } catch {}
  }

  if (!mounted) {
    // SSR-safe placeholder; theme will be applied by the inline head script before paint
    return <div className="w-[38px] h-[38px]" />;
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle theme"
      className="w-[38px] h-[38px] rounded-lg grid place-items-center cursor-pointer transition border"
      style={{ background: 'var(--bg-2)', borderColor: 'var(--line)', color: 'var(--text-1)' }}
    >
      {theme === 'dark' ? (
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="10" cy="10" r="3.4" />
          <line x1="10" y1="2" x2="10" y2="4" /><line x1="10" y1="16" x2="10" y2="18" />
          <line x1="2" y1="10" x2="4" y2="10" /><line x1="16" y1="10" x2="18" y2="10" />
          <line x1="4.2" y1="4.2" x2="5.6" y2="5.6" /><line x1="14.4" y1="14.4" x2="15.8" y2="15.8" />
          <line x1="4.2" y1="15.8" x2="5.6" y2="14.4" /><line x1="14.4" y1="5.6" x2="15.8" y2="4.2" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 11.5A7 7 0 0 1 8.5 3a7 7 0 1 0 8.5 8.5z" />
        </svg>
      )}
    </button>
  );
}
