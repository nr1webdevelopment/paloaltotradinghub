'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';

const CRUMBS: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/modules': 'Modules',
  '/progress': 'Progress',
  '/account': 'Account',
  '/glossary': 'Glossary',
  '/community': 'Community',
};

export function Topbar({ initial, onMenuToggle }: { initial: string; onMenuToggle: () => void }) {
  const pathname = usePathname();
  const label =
    Object.entries(CRUMBS).find(([k]) => pathname.startsWith(k))?.[1] ||
    (pathname.startsWith('/lessons') ? 'Lesson' : pathname.startsWith('/quiz') ? 'Quiz' : 'PATH');

  return (
    <header
      className="h-16 border-b flex items-center gap-3 md:gap-4 px-4 md:px-7 flex-shrink-0"
      style={{ background: 'var(--bg-1)', borderColor: 'var(--line)' }}
    >
      <button
        type="button"
        onClick={onMenuToggle}
        aria-label="Open menu"
        className="md:hidden w-[34px] h-[34px] rounded-lg grid place-items-center border"
        style={{ background: 'var(--bg-2)', borderColor: 'var(--line)', color: 'var(--text-1)' }}
      >
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="3" y1="6" x2="17" y2="6" />
          <line x1="3" y1="10" x2="17" y2="10" />
          <line x1="3" y1="14" x2="17" y2="14" />
        </svg>
      </button>

      <div className="text-sm flex-1 truncate" style={{ color: 'var(--text-2)' }}>
        <strong className="display text-[15px]" style={{ color: 'var(--text-0)' }}>{label}</strong>
      </div>

      {/* Decorative market ticker — hidden on small screens */}
      <div className="hidden lg:flex gap-5 items-center font-mono text-[12px]" style={{ color: 'var(--text-2)' }}>
        <span className="flex gap-1.5"><span className="font-bold" style={{ color: 'var(--text-1)' }}>SPY</span><span style={{ color: 'var(--blue)' }}>+0.42%</span></span>
        <span className="flex gap-1.5"><span className="font-bold" style={{ color: 'var(--text-1)' }}>QQQ</span><span style={{ color: 'var(--accent)' }}>−0.18%</span></span>
        <span className="flex gap-1.5"><span className="font-bold" style={{ color: 'var(--text-1)' }}>BTC</span><span style={{ color: 'var(--blue)' }}>+1.97%</span></span>
      </div>

      <ThemeToggle />

      <Link
        href="/account"
        className={
          'w-[34px] h-[34px] rounded-full grid place-items-center font-bold text-[13px] border cursor-pointer transition hover:translate-y-[-1px] ' +
          (pathname === '/account' ? 'shadow-[0_0_0_2px_var(--accent)]' : 'hover:shadow-[0_0_0_3px_var(--accent-glow)]')
        }
        style={{
          background: 'linear-gradient(135deg, var(--bg-3), var(--bg-2))',
          borderColor: pathname === '/account' ? 'var(--accent)' : 'var(--line)',
          color: 'var(--text-0)',
        }}
        aria-label="Account"
      >
        {initial}
      </Link>
    </header>
  );
}
