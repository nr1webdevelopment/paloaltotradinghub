'use client';

import Link from 'next/link';
import { useFormState, useFormStatus } from 'react-dom';
import { signinAction, type ActionState } from '@/lib/auth-actions';

export function SigninForm() {
  const [state, formAction] = useFormState<ActionState, FormData>(signinAction, undefined);

  return (
    <form action={formAction} autoComplete="on" noValidate className="flex flex-col gap-3.5">
      {state?.error && <div className="form-error">{state.error}</div>}

      <div>
        <label className="form-label" htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue=""
          placeholder="you@example.com"
          className="form-input"
        />
      </div>

      <div>
        <div className="flex items-baseline justify-between">
          <label className="form-label" htmlFor="password">Password</label>
          <Link
            href="/auth/forgot-password"
            className="text-[12px] font-bold hover:underline"
            style={{ color: 'var(--accent)' }}
          >
            Forgot password?
          </Link>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="form-input"
        />
      </div>

      <SubmitButton />

      <div
        className="mt-2 p-3 rounded-lg text-[12.5px] leading-snug border border-dashed"
        style={{ background: 'var(--bg-2)', borderColor: 'var(--line)', color: 'var(--text-2)' }}
      >
        <strong style={{ color: 'var(--text-1)' }}>First time here?</strong>{' '}
        Create an account via the &ldquo;Create account&rdquo; tab — accounts are real, stored in your Supabase database.
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-primary w-full justify-center py-3 mt-1" disabled={pending}>
      {pending ? 'Signing in…' : 'Sign in →'}
    </button>
  );
}
