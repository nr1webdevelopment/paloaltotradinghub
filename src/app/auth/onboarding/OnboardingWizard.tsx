'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { saveOnboardingAction } from '@/lib/auth-actions';

type Option = { value: string; icon: string; title: string; desc: string };
type Step = {
  eyebrow: string;
  title: string | ((firstName: string) => string);
  sub: string;
  intro?: boolean;
  done?: boolean;
  key?: string;
  options?: Option[];
};

const STEPS: Step[] = [
  {
    eyebrow: 'Welcome',
    title: (n) => `Welcome, ${n}.`,
    sub: 'A few quick questions so PATH can pace your learning. Less than a minute.',
    intro: true,
  },
  {
    eyebrow: 'Step 1 of 4',
    title: "What's your trading background?",
    sub: "Don't worry — every module starts from first principles.",
    key: 'experience',
    options: [
      { value: 'beginner', icon: '◯', title: 'New to trading', desc: "I've heard of markets but never traded systematically." },
      { value: 'intermediate', icon: '◐', title: 'Some experience', desc: "I've traded manually or built simple strategies." },
      { value: 'advanced', icon: '●', title: 'Experienced', desc: 'I have a quant background and want sharper tools.' },
    ],
  },
  {
    eyebrow: 'Step 2 of 4',
    title: "What's your primary goal?",
    sub: "We'll highlight the modules most relevant to where you want to land.",
    key: 'goal',
    options: [
      { value: 'career', icon: '◆', title: 'Career change', desc: 'I want to work in quant finance.' },
      { value: 'income', icon: '$', title: 'Side income', desc: 'I want to build strategies for my own capital.' },
      { value: 'learning', icon: '◇', title: 'Pure curiosity', desc: 'I find AI and markets fascinating.' },
      { value: 'product', icon: '◈', title: 'Build a product', desc: "I'm shipping something market-related." },
    ],
  },
  {
    eyebrow: 'Step 3 of 4',
    title: 'How much time per week?',
    sub: "Most students finish PATH in 4–6 weeks. Set a pace you'll actually keep.",
    key: 'time',
    options: [
      { value: '1-3', icon: '◷', title: '1–3 hours', desc: 'Light pace — finish in ~12 weeks.' },
      { value: '3-6', icon: '◴', title: '3–6 hours', desc: 'Recommended — finish in ~6 weeks.' },
      { value: '6+', icon: '◵', title: '6+ hours', desc: 'Intensive — finish in 3–4 weeks.' },
    ],
  },
  {
    eyebrow: 'Step 4 of 4',
    title: 'How comfortable are you with code?',
    sub: "We'll adjust the pace of code-heavy lessons accordingly.",
    key: 'coding',
    options: [
      { value: 'none', icon: '⌗', title: 'Just starting', desc: "I'll learn Python alongside the content." },
      { value: 'some', icon: '⌘', title: 'Some Python', desc: 'I can read scripts and write basic code.' },
      { value: 'proficient', icon: '⌬', title: 'Comfortable', desc: 'Python is part of my daily work.' },
    ],
  },
  {
    eyebrow: 'All set',
    title: 'Your PATH is ready.',
    sub: "Here's how we recommend you start. You can always change pace from your account settings.",
    done: true,
  },
];

export function OnboardingWizard({ firstName }: { firstName: string }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();
  const totalSteps = STEPS.length - 1;

  const s = STEPS[step];
  const pct = (step / totalSteps) * 100;

  function finish() {
    startTransition(async () => {
      await saveOnboardingAction(answers);
      router.push('/dashboard');
    });
  }

  function skip() {
    if (!confirm('Skip onboarding? You can complete it later from your account page.')) return;
    startTransition(async () => {
      await saveOnboardingAction(answers);
      router.push('/dashboard');
    });
  }

  return (
    <div className="max-w-[720px] w-full flex flex-col gap-5 p-5">
      <header className="flex items-center justify-between px-1.5">
        <Image src="/logo_path.png" alt="PATH" width={100} height={100} className="w-[100px] h-auto invert mix-blend-lighten" />
        <button type="button" onClick={skip} className="text-sm font-semibold py-2 px-3 rounded-md hover:bg-bg-2" style={{ color: 'var(--text-3)' }}>
          Skip for now
        </button>
      </header>

      <div className="h-1 rounded-full overflow-hidden border" style={{ background: 'var(--bg-2)', borderColor: 'var(--line)' }}>
        <div className="h-full transition-all duration-500 ease-out" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, var(--accent), var(--blue))' }} />
      </div>

      <div className="card p-6 md:p-9 flex flex-col" style={{ minHeight: 460 }}>
        {s.intro ? (
          <>
            <div className="eyebrow">{s.eyebrow}</div>
            <h1 className="display text-[24px] md:text-[32px] leading-tight">{typeof s.title === 'function' ? s.title(firstName) : s.title}</h1>
            <p className="text-[15px] mt-2.5 mb-6" style={{ color: 'var(--text-2)' }}>{s.sub}</p>
            <div className="flex-1 flex items-center justify-center text-center" style={{ color: 'var(--text-3)' }}>
              <div>
                <div className="font-mono text-[11px] uppercase tracking-[.18em] font-extrabold mb-2" style={{ color: 'var(--text-2)' }}>
                  What we&apos;ll ask
                </div>
                <div className="text-sm">Background → Goal → Pace → Coding</div>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-7 pt-5 border-t" style={{ borderColor: 'var(--line-soft)' }}>
              <button className="btn btn-primary ml-auto px-5 py-3" onClick={() => setStep(step + 1)}>
                Begin onboarding →
              </button>
            </div>
          </>
        ) : s.done ? (
          <>
            <div className="text-center py-2.5">
              <div className="w-[76px] h-[76px] rounded-full mx-auto mb-4 grid place-items-center text-white text-[34px] font-extrabold" style={{ background: 'linear-gradient(135deg, var(--accent), var(--blue))', boxShadow: '0 10px 30px -10px var(--accent-glow)' }}>
                ✓
              </div>
              <div className="eyebrow">{s.eyebrow}</div>
              <h1 className="display text-[24px] md:text-[32px] leading-tight">{s.title as string}</h1>
              <p className="text-[15px] my-2.5 mx-auto max-w-[480px]" style={{ color: 'var(--text-2)' }}>{s.sub}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-5 text-left">
                {[
                  ['START HERE', 'Module 1', 'Foundations · 5 lessons'],
                  ['CORE', 'Modules 2–5', 'Data, ML, backtest, risk'],
                  ['CAPSTONE', 'Modules 6–7', 'Execution & deployment'],
                ].map(([k, t, m]) => (
                  <div key={k} className="card p-4">
                    <div className="font-mono text-[10px] tracking-[.14em] font-extrabold mb-1" style={{ color: 'var(--accent)' }}>{k}</div>
                    <div className="text-sm font-extrabold" style={{ color: 'var(--text-0)' }}>{t}</div>
                    <div className="text-xs" style={{ color: 'var(--text-2)' }}>{m}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3 pt-5 border-t" style={{ borderColor: 'var(--line-soft)' }}>
              <button className="btn btn-primary w-full justify-center py-3" onClick={finish} disabled={isPending}>
                {isPending ? 'Saving…' : 'Enter PATH →'}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="eyebrow">{s.eyebrow}</div>
            <h1 className="display text-[22px] md:text-[28px] leading-tight">{s.title as string}</h1>
            <p className="text-[15px] mt-2.5 mb-6 max-w-[520px]" style={{ color: 'var(--text-2)' }}>{s.sub}</p>
            <div className="grid gap-2.5 flex-1">
              {s.options!.map((o) => {
                const selected = answers[s.key!] === o.value;
                return (
                  <button
                    type="button"
                    key={o.value}
                    onClick={() => setAnswers({ ...answers, [s.key!]: o.value })}
                    className={'flex items-center gap-3.5 p-4 rounded-xl border text-left transition w-full' + (selected ? ' shadow-[0_0_0_3px_var(--accent-glow)]' : '')}
                    style={{
                      background: selected ? 'var(--accent-soft)' : 'var(--bg-2)',
                      borderColor: selected ? 'var(--accent)' : 'var(--line)',
                      color: 'var(--text-0)',
                    }}
                  >
                    <div className="w-10 h-10 rounded-[10px] grid place-items-center flex-shrink-0 text-[18px] font-extrabold" style={{ background: selected ? 'var(--accent)' : 'var(--bg-3)', color: selected ? '#fff' : 'var(--text-1)' }}>
                      {o.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[15px] font-extrabold tracking-[-.01em]" style={{ color: 'var(--text-0)' }}>{o.title}</div>
                      <div className="text-[12.5px]" style={{ color: 'var(--text-2)' }}>{o.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-3 mt-6 pt-5 border-t" style={{ borderColor: 'var(--line-soft)' }}>
              <button className="btn" onClick={() => setStep(step - 1)} disabled={step === 0}>← Back</button>
              <button className="btn btn-primary" onClick={() => setStep(step + 1)} disabled={!answers[s.key!]}>
                Continue →
              </button>
              <span className="ml-auto font-mono text-[12.5px] font-bold" style={{ color: 'var(--text-3)' }}>
                {step} / {totalSteps}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
