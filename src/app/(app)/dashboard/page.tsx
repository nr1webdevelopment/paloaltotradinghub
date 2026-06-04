import Link from 'next/link';
import { createServerSupabase } from '@/lib/supabase/server';
import { COURSE } from '@/lib/course-content';
import { totalLessons, moduleProgress } from '@/lib/utils';

export const metadata = { title: 'Dashboard · PATH' };

export default async function DashboardPage() {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: progress }, { data: scores }] = await Promise.all([
    supabase.from('lesson_progress').select('lesson_id, module_id, completed_at').eq('user_id', user!.id),
    supabase.from('quiz_scores').select('module_id, score, total').eq('user_id', user!.id),
  ]);

  const completedIds = new Set(progress?.map((p) => p.lesson_id) ?? []);
  const completedCount = completedIds.size;
  const total = totalLessons();
  const overallPct = total > 0 ? Math.round((completedCount / total) * 100) : 0;
  const passedQuizzes = (scores ?? []).filter((s) => s.score / s.total >= 0.66).length;

  // Find next lesson to take
  const nextLesson = COURSE.modules
    .flatMap((m) => m.lessons.map((l) => ({ module: m, lesson: l })))
    .find(({ lesson }) => !completedIds.has(lesson.id));

  return (
    <>
      <header className="mb-7">
        <div className="eyebrow">Welcome back</div>
        <h1 className="display text-[28px] md:text-[32px] leading-tight">Your AI Trading desk.</h1>
        <p className="text-[15px] max-w-[680px] mt-1.5" style={{ color: 'var(--text-2)' }}>
          Track your progress, continue where you left off, and ship your first systematic strategy.
        </p>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        <Stat label="Lessons Complete" val={completedCount} sub={`/ ${total}`} delta={`${overallPct}% of course`} color="var(--accent)" />
        <Stat label="Quizzes Passed" val={passedQuizzes} sub={`/ ${COURSE.modules.length}`} delta="≥66% to pass" color="var(--blue)" />
        <Stat label="Modules" val={COURSE.modules.filter((m) => moduleProgress(m, completedIds).pct === 100).length} sub={`/ ${COURSE.modules.length}`} delta="completed" color="var(--gold)" />
        <Stat label="Streak" val={1} sub=" days" delta="Keep going" color="var(--warn)" />
      </div>

      <div className="grid lg:grid-cols-[2fr_1fr] gap-5">
        <div>
          {nextLesson ? (
            <div
              className="p-6 md:p-7 rounded-[18px] border relative overflow-hidden mb-5"
              style={{
                background: 'radial-gradient(600px 200px at 100% 0%, var(--accent-soft), transparent 70%), var(--bg-1)',
                borderColor: 'var(--line)',
              }}
            >
              <div className="eyebrow">Continue Learning</div>
              <h2 className="display text-[22px] md:text-[24px] leading-tight mt-1.5">{nextLesson.lesson.title}</h2>
              <p className="text-[14px] my-2 mb-4 max-w-[560px]" style={{ color: 'var(--text-2)' }}>
                {nextLesson.module.title} · pick up where you left off and keep your streak alive.
              </p>
              <div className="flex gap-4 font-mono text-[12px] mb-4" style={{ color: 'var(--text-3)' }}>
                <span>◷ {nextLesson.lesson.duration} min</span>
                <span>◇ Module {COURSE.modules.indexOf(nextLesson.module) + 1} of {COURSE.modules.length}</span>
              </div>
              <Link href={`/lessons/${nextLesson.lesson.id}`} className="btn btn-primary">
                Resume Lesson →
              </Link>
            </div>
          ) : (
            <div className="card p-6 mb-5">
              <div className="eyebrow">Course Complete</div>
              <h2 className="display text-[22px] leading-tight">You finished PATH</h2>
              <p className="mt-2" style={{ color: 'var(--text-2)' }}>
                Every lesson complete. Now go push your first real trade.
              </p>
            </div>
          )}

          <div className="card p-5">
            <h3 className="text-sm font-bold mb-3.5">Module Progress</h3>
            <div className="flex flex-col gap-3">
              {COURSE.modules.map((m, i) => {
                const p = moduleProgress(m, completedIds);
                return (
                  <Link key={m.id} href={`/modules/${m.id}`} className="grid grid-cols-[28px_1fr_auto] gap-3 items-center hover:opacity-80 transition">
                    <div className="font-mono text-[11px]" style={{ color: 'var(--text-3)' }}>
                      M{String(i + 1).padStart(2, '0')}
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold" style={{ color: 'var(--text-1)' }}>{m.title}</div>
                      <div className="h-1 mt-1 rounded-full overflow-hidden" style={{ background: 'var(--bg-3)' }}>
                        <div className="h-full" style={{ width: `${p.pct}%`, background: 'var(--accent)' }} />
                      </div>
                    </div>
                    <div className="font-mono text-[11px] text-right" style={{ color: 'var(--text-2)' }}>
                      {p.done}/{p.total}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="card p-5">
            <h3 className="text-sm font-bold mb-3.5">Recent Activity</h3>
            {progress && progress.length > 0 ? (
              <div className="flex flex-col gap-3">
                {progress
                  .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())
                  .slice(0, 5)
                  .map((p) => {
                    const lesson = COURSE.modules.flatMap((m) => m.lessons).find((l) => l.id === p.lesson_id);
                    return (
                      <div key={p.lesson_id} className="flex items-center gap-2.5 text-[13px] pb-1.5 border-b border-dashed" style={{ color: 'var(--text-1)', borderColor: 'var(--line-soft)' }}>
                        <span className="w-2 h-2 rounded-full" style={{ background: 'var(--accent)', boxShadow: '0 0 8px var(--accent-glow)' }} />
                        <span>Completed <strong style={{ color: 'var(--text-0)' }}>{lesson?.title || p.lesson_id}</strong></span>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="text-[13px]" style={{ color: 'var(--text-3)' }}>
                No activity yet — open a lesson to get started.
              </div>
            )}
          </div>

          <div className="card p-5">
            <h3 className="text-sm font-bold mb-1.5">This week</h3>
            <p className="text-[13px] m-0" style={{ color: 'var(--text-2)' }}>
              Aim for 30 minutes a day. Most students finish PATH in 4–6 weeks of consistent practice.
            </p>
            <Link href="/modules" className="btn w-full justify-center mt-3.5">Browse Modules</Link>
          </div>
        </div>
      </div>
    </>
  );
}

function Stat({ label, val, sub, delta, color }: { label: string; val: number; sub?: string; delta?: string; color: string }) {
  return (
    <div className="card relative p-4 md:p-5 overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ background: color, boxShadow: `0 0 10px ${color}55` }} />
      <div className="text-[11px] uppercase font-extrabold" style={{ letterSpacing: '.14em', color: 'var(--text-3)' }}>{label}</div>
      <div className="font-mono text-[22px] md:text-[28px] font-bold mt-2" style={{ letterSpacing: '-.03em' }}>
        {val}<span className="text-[16px] md:text-[18px]" style={{ color: 'var(--text-3)' }}>{sub}</span>
      </div>
      {delta && <div className="text-[11px] md:text-[12px] mt-1" style={{ color: 'var(--text-2)' }}>{delta}</div>}
    </div>
  );
}
