import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase/server';
import { findLesson, findModule, lessonNeighbors } from '@/lib/utils';
import { LessonActions } from './LessonActions';

export default async function LessonPage({ params }: { params: { id: string } }) {
  const lesson = findLesson(params.id);
  if (!lesson) notFound();
  const mod = findModule(lesson.moduleId)!;
  const { prev, next, index, total } = lessonNeighbors(lesson.id);

  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: progress } = await supabase
    .from('lesson_progress')
    .select('lesson_id')
    .eq('user_id', user!.id)
    .eq('module_id', mod.id);
  const completedIds = new Set(progress?.map((p) => p.lesson_id) ?? []);
  const isDone = completedIds.has(lesson.id);

  return (
    <article className="max-w-[1200px] grid lg:grid-cols-[240px_1fr] gap-7">
      {/* Module table of contents */}
      <aside className="lg:border-r lg:pr-5 lg:pb-0 pb-4 border-b lg:border-b-0 hidden md:block" style={{ borderColor: 'var(--line)' }}>
        <h4 className="text-[11px] uppercase font-extrabold mb-3" style={{ letterSpacing: '.16em', color: 'var(--text-3)' }}>
          {mod.title}
        </h4>
        <div className="font-mono text-[11px] mb-3" style={{ color: 'var(--text-3)' }}>
          {completedIds.size}/{mod.lessons.length} lessons · {Math.round((completedIds.size / mod.lessons.length) * 100)}%
        </div>
        <ul className="list-none p-0 m-0">
          {mod.lessons.map((l) => {
            const done = completedIds.has(l.id);
            const active = l.id === lesson.id;
            return (
              <li key={l.id} className="my-1">
                <Link
                  href={`/lessons/${l.id}`}
                  className={'flex items-center gap-2 px-2 py-1.5 rounded text-[13px] transition ' + (active ? 'font-bold' : '')}
                  style={{
                    background: active ? 'var(--bg-2)' : 'transparent',
                    color: active ? 'var(--accent)' : 'var(--text-2)',
                  }}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full grid place-items-center text-[9px]"
                    style={{
                      background: done ? 'var(--accent)' : 'transparent',
                      border: `1px solid ${done ? 'var(--accent)' : 'var(--line)'}`,
                      color: '#fff',
                    }}
                  >
                    {done ? '✓' : ''}
                  </span>
                  <span className="flex-1">{l.title}</span>
                  <span className="font-mono text-[11px]" style={{ color: 'var(--text-3)' }}>{l.duration}m</span>
                </Link>
              </li>
            );
          })}
          <li className="border-t border-dashed mt-1.5 pt-3" style={{ borderColor: 'var(--line-soft)' }}>
            <Link href={`/quiz/${mod.id}`} className="flex items-center gap-2 px-2 py-1.5 rounded text-[13px] font-bold" style={{ color: 'var(--text-1)' }}>
              <span className="w-3.5 h-3.5 rounded-full border" style={{ borderColor: 'var(--line)' }} />
              Module Quiz
            </Link>
          </li>
        </ul>
      </aside>

      {/* Lesson body */}
      <div className="max-w-[740px]">
        <div className="flex gap-2 items-center mb-3">
          <span className="pill">Lesson {index + 1} of {total}</span>
          <span className="pill">◷ {lesson.duration} min read</span>
          {isDone && <span className="pill pill-done">Completed</span>}
        </div>
        <h1 className="display text-[24px] md:text-[34px] leading-[1.1] mb-3.5">{lesson.title}</h1>

        <div
          className="lesson-prose"
          style={{ color: 'var(--text-1)', fontSize: 15, lineHeight: 1.7 }}
          dangerouslySetInnerHTML={{ __html: lesson.content }}
        />

        <LessonActions
          lessonId={lesson.id}
          moduleId={mod.id}
          isDone={isDone}
          prevHref={prev ? `/lessons/${prev.id}` : null}
          prevTitle={prev?.title}
          nextHref={next ? `/lessons/${next.id}` : null}
          nextTitle={next?.title}
          quizHref={!next ? `/quiz/${mod.id}` : null}
        />
      </div>
    </article>
  );
}
