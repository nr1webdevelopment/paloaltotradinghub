import { redirect } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase/server';
import { OnboardingWizard } from './OnboardingWizard';

export const metadata = { title: 'Welcome · PATH' };

export default async function OnboardingPage() {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/signin');

  const { data: profile } = await supabase
    .from('profiles')
    .select('name, onboarded')
    .eq('id', user.id)
    .single();

  // Already onboarded — straight to the app
  if (profile?.onboarded) redirect('/dashboard');

  const firstName = (profile?.name || user.email?.split('@')[0] || 'there').split(' ')[0];
  return <OnboardingWizard firstName={firstName} />;
}
