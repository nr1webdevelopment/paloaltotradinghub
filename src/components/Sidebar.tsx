'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const NAV_PRIMARY = [
  { href: '/dashboard', label: 'Dashboard', icon: '◰' },
  { href: '/modules',   label: 'Modules',   icon: '◇' },
  { href: '/progress',  label: 'Progress',  icon: '▣' },
];
const NAV_SECONDARY = [
  { href: '/glossary',  label: 'Glossary',  icon: '⌗' },
  { href: '/community', label: 'Community', icon: '◎' },
];

export function Sidebar({
  open,
  onClose,
  progressPct,
  lessonsDone,
  lessonsTotal,
}: {
  open: boolean;
  onClose: () => void;
  progressPct: number;
  lessonsDone: number;
  lessonsTotal: number;
}) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <>
      {/* Mobile backdrop */}
      {mounted && open && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ background: 'rgba(0,0,0,.55)', backdropFilter: 'blur(3px)' }}
          onClick={onClose}
        />
      )}
      <aside
        className={
          'fixed md:relative left-0 top-0 bottom-0 z-50 w-[280px] md:w-[260px] max-w-[86vw] flex flex-col p-5 border-r overflow-y-auto transition-transform duration-300 ease-out ' +
          (open ? 'translate-x-0' : '-translate-x-full md:translate-x-0')
        }
        style={{ background: 'var(--bg-1)', borderColor: 'var(--line)' }}
      >
        <Link
          href="/dashboard"
          className="flex justify-center items-center pb-5 mb-4 border-b transition-opacity hover:opacity-80"
          style={{ borderColor: 'var(--line-soft)' }}
          onClick={onClose}
        >
          <Image
            src="/logo_path.png"
            alt="PATH"
            width={170}
            height={170}
            className="invert-logo w-full max-w-[170px] h-auto"
            priority
          />
        </Link>

        <div className="text-[10px] uppercase font-extrabold mx-3 mt-3 mb-2" style={{ letterSpacing: '.18em', color: 'var(--text-3)' }}>
          Workspace
        </div>
        {NAV_PRIMARY.map((item) => (
          <NavItem key={item.href} {...item} active={pathname.startsWith(item.href)} onClick={onClose} />
        ))}

        <div className="text-[10px] uppercase font-extrabold mx-3 mt-4 mb-2" style={{ letterSpacing: '.18em', color: 'var(--text-3)' }}>
          Resources
        </div>
        {NAV_SECONDARY.map((item) => (
          <NavItem key={item.href} {...item} active={pathname.startsWith(item.href)} onClick={onClose} />
        ))}

        <div className="mt-auto p-3.5 rounded-xl border" style={{ background: 'var(--bg-2)', borderColor: 'var(--line)' }}>
          <h4 className="text-[11px] uppercase font-extrabold mb-1.5" style={{ letterSpacing: '.14em', color: 'var(--text-2)' }}>
            Course Progress
          </h4>
          <div className="font-mono text-[22px] font-bold" style={{ color: 'var(--accent)' }}>
            {progressPct}%
          </div>
          <div className="h-1.5 mt-2.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-3)' }}>
            <div className="h-full rounded-full transition-[width] duration-500" style={{ width: `${progressPct}%`, background: 'linear-gradient(90deg, var(--accent), var(--blue))' }} />
          </div>
          <div className="font-mono text-[11px] mt-2" style={{ color: 'var(--text-3)' }}>
            {lessonsDone} / {lessonsTotal} lessons
          </div>
        </div>
      </aside>
    </>
  );
}

function NavItem({ href, label, icon, active, onClick }: { href: string; label: string; icon: string; active: boolean; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={
        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-bold transition select-none ' +
        (active ? 'shadow-[inset_2px_0_0_var(--accent)]' : 'hover:bg-bg-2')
      }
      style={{
        color: active ? 'var(--accent)' : 'var(--text-1)',
        background: active ? 'var(--bg-3)' : 'transparent',
      }}
    >
      <span className="w-4 text-center opacity-80">{icon}</span>
      {label}
    </Link>
  );
}
