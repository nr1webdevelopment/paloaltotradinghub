import Link from 'next/link';
import { createServerSupabase } from '@/lib/supabase/server';
import { COURSE } from '@/lib/course-content';
import { totalLessons, moduleProgress } from '@/lib/utils';
import { ModuleHero } from '@/components/ModuleHero';

export const metadata = { title: 'Modules · PATH' };

export default async function ModulesPage() {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: progress } = await supabase
    .from('lesson_progress')
    .select('lesson_id')
    .eq('user_id', user!.id);
  const completedIds = new Set(progress?.map((p) => p.lesson_id) ?? []);

  return (
    <>
      <header className="mb-7">
        <div className="eyebrow">Curriculum</div>
        <h1 className="display text-[28px] md:text-[32px] leading-tight">
          {COURSE.modules.length} Modules · {totalLessons()} Lessons
        </h1>
        <p className="text-[15px] max-w-[680px] mt-1.5" style={{ color: 'var(--text-2)' }}>
          A complete path from &ldquo;what is alpha&rdquo; to a live, monitored strategy. Modules are designed to be taken in
          order — each builds on the last.
        </p>
      </header>

      <div className="grid gap-4 md:gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
        {COURSE.modules.map((m, i) => {
          const p = moduleProgress(m, completedIds);
          const status = p.pct === 100 ? 'Complete' : p.pct === 0 ? 'Not started' : 'In progress';
          const statusClass = p.pct === 100 ? 'pill-done' : p.pct === 0 ? '' : 'pill-live';
          return (
            <Link
              key={m.id}
              href={`/modules/${m.id}`}
              className="card group flex flex-col overflow-hidden cursor-pointer transition hover:-translate-y-0.5 hover:shadow-[0_8px_30px_-10px_var(--accent-glow)]"
              style={{ borderRadius: 18 }}
            >
              <div className="h-[130px] overflow-hidden border-b" style={{ borderColor: 'var(--line)' }}>
                <ModuleHero index={i} />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-1.5">
                  <span className="font-mono text-[11px] uppercase font-extrabold" style={{ letterSpacing: '.14em', color: 'var(--accent)' }}>
                    Module {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className={`pill ${statusClass}`}>{status}</span>
                </div>
                <h3 className="display text-[17px] md:text-[18px] mt-1.5 mb-2 leading-tight">{m.title}</h3>
                <p className="text-[13px] mb-4 leading-snug" style={{ color: 'var(--text-2)' }}>{m.summary}</p>
                <div className="flex gap-3.5 font-mono text-[11px] mb-3 mt-auto" style={{ color: 'var(--text-3)' }}>
                  <span>◷ {m.duration}</span>
                  <span>◇ {m.lessons.length} lessons</span>
                  <span>⌗ Quiz</span>
                </div>
                <div className="h-1 rounded-full overflow-hidden mb-1.5" style={{ background: 'var(--bg-3)' }}>
                  <div className="h-full transition-[width]" style={{ width: `${p.pct}%`, background: 'linear-gradient(90deg, var(--accent), var(--blue))' }} />
                </div>
                <div className="flex justify-between font-mono text-[11px]" style={{ color: 'var(--text-2)' }}>
                  <span>{p.done} of {p.total} complete</span>
                  <span>{p.pct}%</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
