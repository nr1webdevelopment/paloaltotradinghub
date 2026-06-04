import Link from 'next/link';
import { createServerSupabase } from '@/lib/supabase/server';
import { COURSE } from '@/lib/course-content';
import { totalLessons, moduleProgress } from '@/lib/utils';

export const metadata = { title: 'Progress · PATH' };

export default async function ProgressPage() {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: progress }, { data: scores }] = await Promise.all([
    supabase.from('lesson_progress').select('lesson_id, completed_at').eq('user_id', user!.id),
    supabase.from('quiz_scores').select('module_id, score, total').eq('user_id', user!.id),
  ]);

  const completedIds = new Set(progress?.map((p) => p.lesson_id) ?? []);
  const overallPct = Math.round((completedIds.size / totalLessons()) * 100);

  // 28-day activity heatmap
  const days: { count: number; date: string }[] = [];
  const dayCounts: Record<string, number> = {};
  (progress ?? []).forEach((p) => {
    const k = new Date(p.completed_at).toDateString();
    dayCounts[k] = (dayCounts[k] || 0) + 1;
  });
  for (let i = 27; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const k = d.toDateString();
    days.push({ count: dayCounts[k] || 0, date: k });
  }
  const heatLevel = (n: number) => (n === 0 ? 0 : n > 3 ? 4 : n > 2 ? 3 : n > 1 ? 2 : 1);

  return (
    <>
      <header className="mb-7">
        <div className="eyebrow">Progress</div>
        <h1 className="display text-[28px] md:text-[32px] leading-tight">How you&apos;re doing.</h1>
        <p className="text-[15px] max-w-[680px] mt-1.5" style={{ color: 'var(--text-2)' }}>
          A look at your activity, your module-by-module mastery, and what&apos;s left to ship.
        </p>
      </header>

      <div className="grid lg:grid-cols-2 gap-5 mb-5">
        <div className="card p-5">
          <h3 className="text-sm font-bold mb-3.5">Course Completion</h3>
          <div className="font-mono text-[40px] md:text-[48px] font-bold" style={{ color: 'var(--accent)', letterSpacing: '-.03em' }}>
            {completedIds.size}
            <span className="text-[20px] md:text-[24px]" style={{ color: 'var(--text-3)' }}>/{totalLessons()}</span>
          </div>
          <div className="text-[13px] mt-1" style={{ color: 'var(--text-2)' }}>lessons completed</div>
          <div className="h-1.5 mt-3.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-3)' }}>
            <div className="h-full" style={{ width: `${overallPct}%`, background: 'linear-gradient(90deg, var(--accent), var(--blue))' }} />
          </div>
        </div>

        <div className="card p-5">
          <h3 className="text-sm font-bold mb-3.5">Activity · Last 28 days</h3>
          <div className="grid gap-[3px]" style={{ gridTemplateColumns: 'repeat(28, 1fr)' }}>
            {days.map((d, i) => {
              const lvl = heatLevel(d.count);
              const colors = ['var(--bg-3)', 'var(--heat-l1)', 'var(--heat-l2)', 'var(--heat-l3)', 'var(--accent)'];
              return (
                <div
                  key={i}
                  title={`${d.date}: ${d.count} lessons`}
                  className="aspect-square rounded-[2px]"
                  style={{
                    background: colors[lvl],
                    boxShadow: lvl === 4 ? '0 0 4px var(--accent-glow)' : undefined,
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className="card p-5">
        <h3 className="text-sm font-bold mb-3.5">Module-by-module</h3>
        <div className="flex flex-col gap-3">
          {COURSE.modules.map((m, i) => {
            const p = moduleProgress(m, completedIds);
            const quiz = scores?.find((s) => s.module_id === m.id);
            return (
              <Link key={m.id} href={`/modules/${m.id}`} className="grid grid-cols-[28px_1fr_auto] gap-3 items-center hover:opacity-80 transition">
                <div className="font-mono text-[11px]" style={{ color: 'var(--text-3)' }}>M{String(i + 1).padStart(2, '0')}</div>
                <div>
                  <div className="text-[13px] font-semibold" style={{ color: 'var(--text-1)' }}>
                    {m.title}
                    {quiz && (
                      <span className="font-mono text-[11px] ml-2" style={{ color: 'var(--accent)' }}>
                        · quiz {quiz.score}/{quiz.total}
                      </span>
                    )}
                  </div>
                  <div className="h-1 mt-1 rounded-full overflow-hidden" style={{ background: 'var(--bg-3)' }}>
                    <div className="h-full" style={{ width: `${p.pct}%`, background: 'var(--accent)' }} />
                  </div>
                </div>
                <div className="font-mono text-[11px] text-right" style={{ color: 'var(--text-2)' }}>{p.pct}%</div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
