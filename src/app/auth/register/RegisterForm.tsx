'use client';

import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { registerAction, type ActionState } from '@/lib/auth-actions';
import { passwordStrength, STRENGTH_LABELS } from '@/lib/utils';

export function RegisterForm() {
  const [state, formAction] = useFormState<ActionState, FormData>(registerAction, undefined);
  const [pw, setPw] = useState('');
  const score = passwordStrength(pw);

  return (
    <form action={formAction} autoComplete="on" noValidate className="flex flex-col gap-3.5">
      {state?.error && <div className="form-error">{state.error}</div>}

      <div>
        <label className="form-label" htmlFor="name">Full name</label>
        <input id="name" name="name" type="text" autoComplete="name" required className="form-input" />
      </div>

      <div>
        <label className="form-label" htmlFor="email">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" required className="form-input" />
      </div>

      <div>
        <label className="form-label" htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          className="form-input"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
        />
        <div className="strength-meter">
          {[1, 2, 3, 4, 5].map((i) => (
            <span key={i} className={'seg' + (i <= score ? ` on-${score}` : '')} />
          ))}
        </div>
        <div className="form-help">
          {pw.length === 0 ? '8 or more characters with letters, numbers, and a symbol.' : `Strength: ${STRENGTH_LABELS[score]}`}
        </div>
      </div>

      <SubmitButton />

      <div
        className="mt-2 p-3 rounded-lg text-[12.5px] leading-snug border border-dashed"
        style={{ background: 'var(--bg-2)', borderColor: 'var(--line)', color: 'var(--text-2)' }}
      >
        By signing up you accept our terms. Your data is stored in your own Supabase project.
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-primary w-full justify-center py-3 mt-1" disabled={pending}>
      {pending ? 'Creating account…' : 'Create account →'}
    </button>
  );
}
