import { redirect, notFound } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase/server';
import { findModule } from '@/lib/utils';

/**
 * Opening a module just sends you to its first unfinished lesson
 * (or the first lesson if nothing is started yet).
 */
export default async function ModuleRedirect({ params }: { params: { id: string } }) {
  const mod = findModule(params.id);
  if (!mod) notFound();

  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: progress } = await supabase
    .from('lesson_progress')
    .select('lesson_id')
    .eq('user_id', user!.id)
    .eq('module_id', mod.id);
  const done = new Set(progress?.map((p) => p.lesson_id) ?? []);
  const next = mod.lessons.find((l) => !done.has(l.id)) ?? mod.lessons[0];
  redirect(`/lessons/${next.id}`);
}
