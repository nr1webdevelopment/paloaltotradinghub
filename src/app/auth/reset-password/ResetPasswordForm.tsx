'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { resetPasswordAction } from '@/lib/auth-actions';
import { passwordStrength, STRENGTH_LABELS } from '@/lib/utils';

export function ResetPasswordForm() {
  const router = useRouter();
  const [pw, setPw] = useState('');
  const [cf, setCf] = useState('');
  const [status, setStatus] = useState<{ error?: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const score = passwordStrength(pw);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    if (pw.length < 8) return setStatus({ error: 'Password must be at least 8 characters' });
    if (score < 3) return setStatus({ error: 'Choose a stronger password' });
    if (pw !== cf) return setStatus({ error: 'Passwords do not match' });

    startTransition(async () => {
      const r = await resetPasswordAction(pw);
      if (r.error) {
        setStatus({ error: r.error });
        return;
      }
      router.replace('/dashboard');
      router.refresh();
    });
  }

  return (
    <form onSubmit={submit} autoComplete="off" noValidate className="flex flex-col gap-3.5">
      {status?.error && <div className="form-error">{status.error}</div>}

      <div>
        <label className="form-label" htmlFor="pw">New password</label>
        <input
          id="pw"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          className="form-input"
        />
        <div className="strength-meter">
          {[1, 2, 3, 4, 5].map((i) => (
            <span key={i} className={'seg' + (i <= score ? ` on-${score}` : '')} />
          ))}
        </div>
        <div className="form-help">
          {pw.length === 0
            ? '8 or more characters with letters, numbers, and a symbol.'
            : `Strength: ${STRENGTH_LABELS[score]}`}
        </div>
      </div>

      <div>
        <label className="form-label" htmlFor="cf">Confirm new password</label>
        <input
          id="cf"
          name="confirm"
          type="password"
          autoComplete="new-password"
          required
          value={cf}
          onChange={(e) => setCf(e.target.value)}
          className="form-input"
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary w-full justify-center py-3 mt-1"
        disabled={pending || !pw || !cf}
      >
        {pending ? 'Saving…' : 'Update password →'}
      </button>
    </form>
  );
}
