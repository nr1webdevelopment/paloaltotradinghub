'use client';

import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

/**
 * Client-side wrapper for the authenticated app layout.
 * Owns the mobile drawer open state.
 */
export function AppShell({
  initial,
  progressPct,
  lessonsDone,
  lessonsTotal,
  children,
}: {
  initial: string;
  progressPct: number;
  lessonsDone: number;
  lessonsTotal: number;
  children: React.ReactNode;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="grid md:grid-cols-[260px_1fr] h-screen md:h-[100dvh] relative z-10">
      <Sidebar
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        progressPct={progressPct}
        lessonsDone={lessonsDone}
        lessonsTotal={lessonsTotal}
      />
      <main className="flex flex-col overflow-hidden">
        <Topbar initial={initial} onMenuToggle={() => setDrawerOpen(true)} />
        <div className="flex-1 overflow-y-auto px-5 md:px-10 py-7 pb-20">
          {children}
        </div>
      </main>
    </div>
  );
}
