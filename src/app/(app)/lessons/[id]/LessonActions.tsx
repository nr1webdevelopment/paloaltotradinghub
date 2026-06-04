'use client';

import Link from 'next/link';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { completeLessonAction, uncompleteLessonAction } from '@/lib/auth-actions';

export function LessonActions({
  lessonId,
  moduleId,
  isDone,
  prevHref,
  prevTitle,
  nextHref,
  nextTitle,
  quizHref,
}: {
  lessonId: string;
  moduleId: string;
  isDone: boolean;
  prevHref: string | null;
  prevTitle?: string;
  nextHref: string | null;
  nextTitle?: string;
  quizHref: string | null;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function toggleDone() {
    startTransition(async () => {
      if (isDone) await uncompleteLessonAction(lessonId);
      else await completeLessonAction(lessonId, moduleId);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2 mt-9 pt-6 border-t" style={{ borderColor: 'var(--line)' }}>
      {prevHref && (
        <Link href={prevHref} className="btn truncate">
          ← {prevTitle}
        </Link>
      )}
      <div className="flex-1 hidden md:block" />
      <button onClick={toggleDone} className={'btn' + (isDone ? '' : ' btn-primary')} disabled={pending}>
        {pending ? '…' : isDone ? 'Mark Incomplete' : 'Mark Complete'}
      </button>
      {nextHref ? (
        <Link href={nextHref} className="btn truncate">
          {nextTitle} →
        </Link>
      ) : quizHref ? (
        <Link href={quizHref} className="btn btn-primary">Take Quiz →</Link>
      ) : null}
    </div>
  );
}
