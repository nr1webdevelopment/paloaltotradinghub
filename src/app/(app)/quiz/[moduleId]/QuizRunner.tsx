'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';
import { saveQuizScoreAction } from '@/lib/auth-actions';
import type { QuizQuestion } from '@/lib/types';

export function QuizRunner({
  moduleId,
  moduleTitle,
  questions,
}: {
  moduleId: string;
  moduleTitle: string;
  questions: QuizQuestion[];
}) {
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const [pending, startTransition] = useTransition();

  const q = questions[qIndex];

  if (finished) {
    const correct = answers.filter((a, i) => a === questions[i].correct).length;
    const pct = Math.round((correct / questions.length) * 100);
    const passed = pct >= 66;
    return (
      <div className="max-w-[720px] mx-auto text-center py-12">
        <div className="text-[11px] uppercase font-extrabold mb-2" style={{ letterSpacing: '.18em', color: passed ? 'var(--accent)' : 'var(--warn)' }}>
          {passed ? 'Quiz Passed' : 'Try Again'}
        </div>
        <div className="font-mono text-[48px] md:text-[64px] font-bold" style={{ background: 'linear-gradient(90deg, var(--accent), var(--blue))', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
          {correct}<span className="text-[28px] md:text-[36px]" style={{ color: 'var(--text-3)' }}>/{questions.length}</span>
        </div>
        <h2 className="display text-[20px] md:text-[26px] my-2 leading-tight">{moduleTitle}</h2>
        <p className="text-[15px] mt-2 mb-6 mx-auto max-w-[420px]" style={{ color: 'var(--text-2)' }}>
          {passed ? "You've locked in the key concepts of this module. Onwards." : 'You need 66% to pass. Re-read the lessons and try again.'}
        </p>
        <div className="flex gap-2.5 justify-center">
          <button
            className="btn"
            onClick={() => {
              setFinished(false);
              setQIndex(0);
              setAnswers([]);
              setRevealed(false);
              setSelected(null);
            }}
          >
            Retry Quiz
          </button>
          <Link href="/modules" className="btn btn-primary">Back to Modules</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[720px]">
      <header className="mb-7">
        <div className="eyebrow">{moduleTitle} · Quiz</div>
        <h1 className="display text-[28px] md:text-[32px] leading-tight">Knowledge Check</h1>
        <p className="text-[15px] mt-1.5" style={{ color: 'var(--text-2)' }}>
          Question {qIndex + 1} of {questions.length}
        </p>
      </header>

      <div className="flex gap-1.5 mb-6">
        {questions.map((_, i) => (
          <div
            key={i}
            className="flex-1 h-1 rounded-full"
            style={{ background: i < qIndex ? 'var(--blue)' : i === qIndex ? 'var(--accent)' : 'var(--bg-3)' }}
          />
        ))}
      </div>

      <div className="display text-[20px] md:text-[24px] mb-5 leading-snug">{q.q}</div>

      <div className="flex flex-col gap-2.5 mb-6">
        {q.options.map((opt, i) => {
          let bg = 'var(--bg-1)';
          let borderColor = 'var(--line)';
          let color = 'var(--text-1)';
          if (revealed) {
            if (i === q.correct) {
              bg = 'var(--blue-soft)'; borderColor = 'var(--blue)'; color = 'var(--blue)';
            } else if (i === selected) {
              bg = '#ff5b6e22'; borderColor = 'var(--danger)'; color = 'var(--danger)';
            }
          }
          const letter = String.fromCharCode(65 + i);
          return (
            <button
              key={i}
              onClick={() => {
                if (revealed) return;
                setSelected(i);
                setRevealed(true);
                const next = [...answers];
                next[qIndex] = i;
                setAnswers(next);
              }}
              disabled={revealed}
              className="text-left px-4 py-3.5 rounded-xl text-[14px] flex gap-3 items-center transition border hover:border-[var(--text-3)]"
              style={{ background: bg, borderColor, color }}
            >
              <span
                className="w-[22px] h-[22px] rounded-full grid place-items-center font-mono text-[11px] border"
                style={{
                  background: revealed && i === q.correct ? 'var(--blue)' : revealed && i === selected ? 'var(--danger)' : 'transparent',
                  borderColor: revealed && i === q.correct ? 'var(--blue)' : revealed && i === selected ? 'var(--danger)' : 'var(--line)',
                  color: revealed && (i === q.correct || i === selected) ? '#fff' : 'var(--text-3)',
                }}
              >
                {letter}
              </span>
              <span>{opt}</span>
            </button>
          );
        })}
      </div>

      {revealed && (
        <div
          className="p-3.5 rounded-xl text-[13.5px] mb-5 border"
          style={
            selected === q.correct
              ? { background: 'var(--blue-soft)', color: 'var(--blue)', borderColor: 'var(--blue-soft)' }
              : { background: '#ff5b6e22', color: 'var(--danger)', borderColor: '#ff5b6e44' }
          }
        >
          <strong>{selected === q.correct ? '✓ Correct.' : '✗ Not quite.'}</strong> {q.why}
        </div>
      )}

      <div className="flex gap-2.5">
        <Link href="/modules" className="btn">Quit</Link>
        <div className="flex-1" />
        {revealed && (
          <button
            className="btn btn-primary"
            disabled={pending}
            onClick={() => {
              if (qIndex < questions.length - 1) {
                setQIndex(qIndex + 1);
                setRevealed(false);
                setSelected(null);
              } else {
                // last question — persist the score
                const correct = answers.filter((a, i) => a === questions[i].correct).length;
                startTransition(async () => {
                  await saveQuizScoreAction(moduleId, correct, questions.length);
                  setFinished(true);
                });
              }
            }}
          >
            {qIndex < questions.length - 1 ? 'Next →' : pending ? 'Saving…' : 'See Results →'}
          </button>
        )}
      </div>
    </div>
  );
}
