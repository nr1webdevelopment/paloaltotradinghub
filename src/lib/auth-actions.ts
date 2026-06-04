'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createServerSupabase } from '@/lib/supabase/server';

const SigninSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Enter your password'),
});

const RegisterSchema = z.object({
  name: z.string().min(2, 'Enter your full name'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type ActionState = { error?: string; ok?: boolean } | undefined;

/** Sign in with email + password. Returns an error string on failure. */
export async function signinAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = SigninSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  const supabase = createServerSupabase();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { error: 'Email or password is incorrect.' };

  revalidatePath('/', 'layout');
  redirect('/');
}

/** Register a new account. Profile row is created by DB trigger. */
export async function registerAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = RegisterSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  const supabase = createServerSupabase();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { data: { name: parsed.data.name } },
  });
  if (error) return { error: error.message };

  revalidatePath('/', 'layout');
  redirect('/auth/onboarding');
}

/** Sign out — clears the session and bounces to /auth/signin. */
export async function signoutAction() {
  const supabase = createServerSupabase();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/auth/signin');
}

/** Save onboarding answers to the profile row. */
export async function saveOnboardingAction(answers: Record<string, string>) {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not signed in' };

  const { error } = await supabase
    .from('profiles')
    .update({ onboarded: true, onboarding: answers, updated_at: new Date().toISOString() })
    .eq('id', user.id);

  if (error) return { error: error.message };
  revalidatePath('/', 'layout');
  return { ok: true };
}

/** Mark a lesson complete. */
export async function completeLessonAction(lessonId: string, moduleId: string) {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not signed in' };

  const { error } = await supabase
    .from('lesson_progress')
    .upsert({ user_id: user.id, lesson_id: lessonId, module_id: moduleId });

  if (error) return { error: error.message };
  revalidatePath('/dashboard');
  revalidatePath('/modules');
  return { ok: true };
}

/** Remove lesson completion. */
export async function uncompleteLessonAction(lessonId: string) {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not signed in' };

  await supabase.from('lesson_progress').delete()
    .eq('user_id', user.id).eq('lesson_id', lessonId);

  revalidatePath('/dashboard');
  revalidatePath('/modules');
  return { ok: true };
}

/** Save (or update) a quiz score for a module. */
export async function saveQuizScoreAction(moduleId: string, score: number, total: number) {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not signed in' };

  const { data: existing } = await supabase
    .from('quiz_scores')
    .select('attempts')
    .eq('user_id', user.id)
    .eq('module_id', moduleId)
    .maybeSingle();

  const attempts = (existing?.attempts ?? 0) + 1;
  const { error } = await supabase
    .from('quiz_scores')
    .upsert({ user_id: user.id, module_id: moduleId, score, total, attempts, taken_at: new Date().toISOString() });

  if (error) return { error: error.message };
  revalidatePath('/dashboard');
  return { ok: true };
}

/** Update profile name + email. */
export async function updateProfileAction(name: string, email: string) {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not signed in' };

  // Update auth email if it changed (will email-confirm by default).
  if (email !== user.email) {
    const { error: authErr } = await supabase.auth.updateUser({ email });
    if (authErr) return { error: authErr.message };
  }

  const { error } = await supabase
    .from('profiles')
    .update({ name, email, updated_at: new Date().toISOString() })
    .eq('id', user.id);

  if (error) return { error: error.message };
  revalidatePath('/account');
  return { ok: true };
}

/** Change password. */
export async function changePasswordAction(newPassword: string) {
  const supabase = createServerSupabase();
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) return { error: error.message };
  return { ok: true };
}
