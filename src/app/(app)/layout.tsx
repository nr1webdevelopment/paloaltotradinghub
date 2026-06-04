import { redirect } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase/server';
import { AppShell } from '@/components/AppShell';
import { COURSE } from '@/lib/course-content';
import { totalLessons } from '@/lib/utils';

/**
 * Authenticated app layout — every page under (app) renders inside this.
 * Fetches the user + profile + progress on the server, then passes the
 * derived "sidebar progress" numbers to the client-side AppShell.
 */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/signin');

  const { data: profile } = await supabase
    .from('profiles')
    .select('name, onboarded')
    .eq('id', user.id)
    .single();

  if (!profile?.onboarded) redirect('/auth/onboarding');

  const { data: progress } = await supabase
    .from('lesson_progress')
    .select('lesson_id')
    .eq('user_id', user.id);

  const done = progress?.length ?? 0;
  const total = totalLessons();
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const initial = (profile.name?.[0] || user.email?.[0] || 'U').toUpperCase();

  return (
    <AppShell
      initial={initial}
      progressPct={pct}
      lessonsDone={done}
      lessonsTotal={total}
    >
      {children}
    </AppShell>
  );
}
