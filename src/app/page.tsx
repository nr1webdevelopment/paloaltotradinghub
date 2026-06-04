import { redirect } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase/server';

/**
 * Entry route — decides where the user lands.
 * - Signed out → /auth/signin
 * - Signed in but not onboarded → /auth/onboarding
 * - Signed in + onboarded → /dashboard
 */
export default async function Index() {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth/signin');

  const { data: profile } = await supabase
    .from('profiles')
    .select('onboarded')
    .eq('id', user.id)
    .single();

  if (!profile?.onboarded) redirect('/auth/onboarding');
  redirect('/dashboard');
}
