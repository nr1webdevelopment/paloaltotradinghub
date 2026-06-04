import { createServerSupabase } from '@/lib/supabase/server';
import { AccountForms } from './AccountForms';

export const metadata = { title: 'Account · PATH' };

export default async function AccountPage() {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user!.id)
    .single();

  const joinedStr = new Date(profile?.joined_at || Date.now()).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
  const initial = (profile?.name?.[0] || user!.email?.[0] || 'U').toUpperCase();

  return (
    <>
      <header className="mb-7">
        <div className="eyebrow">Account</div>
        <h1 className="display text-[28px] md:text-[32px] leading-tight">Your settings.</h1>
        <p className="text-[15px] max-w-[680px] mt-1.5" style={{ color: 'var(--text-2)' }}>
          Manage your profile, password, and learning preferences.
        </p>
      </header>

      <div
        className="flex flex-wrap items-center gap-4 p-5 md:p-6 mb-5 border rounded-[18px]"
        style={{
          background: 'radial-gradient(500px 200px at 100% 0%, var(--accent-soft), transparent 70%), var(--bg-1)',
          borderColor: 'var(--line)',
        }}
      >
        <div
          className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] rounded-full grid place-items-center text-white font-extrabold text-[20px] md:text-[24px] flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, var(--accent), var(--blue))', boxShadow: '0 6px 18px -8px var(--accent-glow)' }}
        >
          {initial}
        </div>
        <div className="flex-1 min-w-0">
          <div className="display text-[19px] md:text-[20px] leading-tight">{profile?.name}</div>
          <div className="text-[13px]" style={{ color: 'var(--text-2)' }}>{user?.email}</div>
          <div className="text-[13px]" style={{ color: 'var(--text-2)' }}>Member since {joinedStr}</div>
        </div>
        <span className="pill pill-done">Active</span>
      </div>

      <AccountForms
        initialName={profile?.name || ''}
        initialEmail={user?.email || ''}
        digestPref={profile?.digest_pref || 'Weekly'}
      />
    </>
  );
}
