'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { changePasswordAction, updateProfileAction } from '@/lib/auth-actions';
import { passwordStrength, STRENGTH_LABELS } from '@/lib/utils';

export function AccountForms({
  initialName,
  initialEmail,
  digestPref,
}: {
  initialName: string;
  initialEmail: string;
  digestPref: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [profileStatus, setProfileStatus] = useState<{ ok?: boolean; error?: string } | null>(null);
  const [profilePending, profileTransition] = useTransition();

  const [curPw, setCurPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [cfPw, setCfPw] = useState('');
  const [pwStatus, setPwStatus] = useState<{ ok?: boolean; error?: string } | null>(null);
  const [pwPending, pwTransition] = useTransition();
  const score = passwordStrength(newPw);

  function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setProfileStatus(null);
    profileTransition(async () => {
      const r = await updateProfileAction(name, email);
      setProfileStatus(r);
      if (r.ok) router.refresh();
    });
  }

  function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwStatus(null);
    if (newPw.length < 8) return setPwStatus({ error: 'New password must be at least 8 characters' });
    if (score < 3) return setPwStatus({ error: 'Choose a stronger password' });
    if (newPw !== cfPw) return setPwStatus({ error: 'New passwords do not match' });
    pwTransition(async () => {
      const r = await changePasswordAction(newPw);
      setPwStatus(r);
      if (r.ok) {
        setCurPw('');
        setNewPw('');
        setCfPw('');
      }
    });
  }

  async function signout() {
    if (!confirm('Sign out? Your saved progress stays on this device.')) return;
    const form = document.createElement('form');
    form.action = '/auth/signout';
    form.method = 'POST';
    document.body.appendChild(form);
    form.submit();
  }

  return (
    <>
      {/* Profile */}
      <Section title="Profile" sub="Public info that appears across PATH.">
        <form onSubmit={saveProfile} className="flex flex-col">
          <Row label="Display name">
            <input className="form-input" value={name} maxLength={40} onChange={(e) => setName(e.target.value)} />
          </Row>
          <Row label="Email">
            <input className="form-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Row>
          <Actions>
            <button type="submit" className="btn btn-primary" disabled={profilePending}>
              {profilePending ? 'Saving…' : 'Save changes'}
            </button>
            {profileStatus?.ok && <span className="text-[13px]" style={{ color: 'var(--blue)' }}>✓ Saved</span>}
            {profileStatus?.error && <span className="text-[13px]" style={{ color: 'var(--danger)' }}>{profileStatus.error}</span>}
          </Actions>
        </form>
      </Section>

      {/* Password */}
      <Section title="Change password" sub="Use a strong password — 12+ characters with letters, numbers, and a symbol.">
        <form onSubmit={changePassword} className="flex flex-col">
          <Row label="New password">
            <div>
              <input className="form-input" type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} autoComplete="new-password" />
              <div className="strength-meter">
                {[1,2,3,4,5].map(i => (
                  <span key={i} className={'seg' + (i <= score ? ` on-${score}` : '')} />
                ))}
              </div>
              <div className="form-help">
                {newPw.length === 0 ? '8 or more characters with letters, numbers, and a symbol.' : `Strength: ${STRENGTH_LABELS[score]}`}
              </div>
            </div>
          </Row>
          <Row label="Confirm new password">
            <input className="form-input" type="password" value={cfPw} onChange={(e) => setCfPw(e.target.value)} autoComplete="new-password" />
          </Row>
          <Actions>
            <button type="submit" className="btn btn-primary" disabled={pwPending || !newPw}>
              {pwPending ? 'Saving…' : 'Update password'}
            </button>
            {pwStatus?.ok && <span className="text-[13px]" style={{ color: 'var(--blue)' }}>✓ Password updated</span>}
            {pwStatus?.error && <span className="text-[13px]" style={{ color: 'var(--danger)' }}>{pwStatus.error}</span>}
          </Actions>
        </form>
      </Section>

      {/* Danger zone */}
      <Section title="Danger zone" sub="These actions are permanent." danger>
        <div className="flex flex-col gap-3.5">
          <div className="flex items-center justify-between gap-3 py-3" style={{ borderBottom: '1px solid rgba(255,59,92,.15)' }}>
            <div>
              <div className="text-[14px] font-bold" style={{ color: 'var(--text-0)' }}>Sign out</div>
              <div className="form-help" style={{ marginTop: 2 }}>End this session.</div>
            </div>
            <button onClick={signout} className="btn">Sign out</button>
          </div>
        </div>
      </Section>
    </>
  );
}

function Section({ title, sub, children, danger }: { title: string; sub?: string; children: React.ReactNode; danger?: boolean }) {
  return (
    <div className="p-5 md:p-6 mb-4 border rounded-xl" style={{ background: 'var(--bg-1)', borderColor: danger ? 'rgba(255,59,92,.25)' : 'var(--line)' }}>
      <div className="mb-3.5 pb-3.5 border-b" style={{ borderColor: 'var(--line-soft)' }}>
        <h3 className="display text-[16px]" style={{ color: danger ? 'var(--danger)' : 'var(--text-0)' }}>{title}</h3>
        {sub && <div className="text-[13px] mt-1" style={{ color: 'var(--text-2)' }}>{sub}</div>}
      </div>
      {children}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-4 md:gap-5 items-start py-3 border-b last:border-b-0" style={{ borderColor: 'var(--line-soft)' }}>
      <label className="text-[13px] font-semibold pt-2.5" style={{ color: 'var(--text-1)' }}>{label}</label>
      {children}
    </div>
  );
}

function Actions({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mt-3.5 pt-3.5 border-t" style={{ borderColor: 'var(--line-soft)' }}>
      {children}
    </div>
  );
}
