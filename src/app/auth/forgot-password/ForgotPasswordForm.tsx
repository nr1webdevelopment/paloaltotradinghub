'use client';

import { useState, useTransition } from 'react';
import { forgotPasswordAction } from '@/lib/auth-actions';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<{ sent?: boolean; error?: string } | null>(null);
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    startTransition(async () => {
      const r = await forgotPasswordAction(email);
      if (r.error) setStatus({ error: r.error });
      else setStatus({ sent: true });
    });
  }

  if (status?.sent) {
    return (
      <div
        className="p-4 rounded-lg text-[13.5px] leading-relaxed border"
        style={{ background: 'var(--bg-2)', borderColor: 'var(--line)', color: 'var(--text-1)' }}
      >
        <div className="font-bold mb-1" style={{ color: 'var(--accent)' }}>Check your inbox.</div>
        If an account exists for <strong>{email}</strong>, we just sent a password reset link.
        It expires in one hour. Don&apos;t see it? Check your spam folder.
      </div>
    );
  }

  return (
    <form onSubmit={submit} autoComplete="on" noValidate className="flex flex-col gap-3.5">
      {status?.error && <div className="form-error">{status.error}</div>}

      <div>
        <label className="form-label" htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="form-input"
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary w-full justify-center py-3 mt-1"
        disabled={pending || !email}
      >
        {pending ? 'Sending…' : 'Send reset link →'}
      </button>
    </form>
  );
}
