import Link from 'next/link';
import Image from 'next/image';

/**
 * The split-panel shell used by both signin and register pages.
 * Renders the brand panel on the left and slot for form content on the right.
 */
export function AuthShell({ children, activeTab }: { children: React.ReactNode; activeTab: 'signin' | 'register' | 'recovery' }) {
  return (
    <div
      className="grid md:grid-cols-[1.05fr_1fr] max-w-[1000px] w-full min-h-[600px] md:min-h-0 md:rounded-[22px] overflow-hidden md:border md:shadow-[0_30px_80px_-30px_rgba(0,0,0,.5)]"
      style={{ background: 'var(--bg-1)', borderColor: 'var(--line)' }}
    >
      {/* Brand panel */}
      <aside
        className="flex flex-col justify-between p-7 md:p-11 text-white relative md:border-r"
        style={{
          background:
            'radial-gradient(500px 400px at 0% 100%, rgba(59,130,246,.25), transparent 60%), radial-gradient(500px 400px at 100% 0%, rgba(255,59,92,.25), transparent 60%), linear-gradient(135deg, #1a0a1f, #06030c)',
          borderColor: 'var(--line)',
        }}
      >
        <Image src="/logo_path.png" alt="PATH" width={130} height={130} className="invert mix-blend-lighten w-[110px] md:w-[130px] h-auto" priority />
        <div className="my-6 md:my-0">
          <div className="text-[11px] uppercase tracking-[.18em] font-extrabold text-white/55 mb-3">
            Palo Alto Trading Hub
          </div>
          <h2 className="display text-[26px] md:text-[38px] leading-none text-white">
            Trade markets<br />with code.
          </h2>
          <p className="text-white/65 text-sm md:text-[15px] leading-snug max-w-[340px] mt-4">
            The complete curriculum on AI trading — from first feature to a live, monitored strategy.
          </p>
        </div>
        <div className="flex gap-6 md:gap-8 pt-5 border-t border-white/10">
          {[['7','Modules'],['30','Lessons'],['6w','To finish']].map(([n,l]) => (
            <div key={l}>
              <div className="display text-[24px] md:text-[30px] leading-none text-white">{n}</div>
              <div className="text-[10px] uppercase tracking-[.14em] font-extrabold text-white/50 mt-1.5">{l}</div>
            </div>
          ))}
        </div>
      </aside>

      {/* Form panel */}
      <section className="p-7 md:p-12 flex flex-col gap-5" style={{ background: 'var(--bg-1)' }}>
        <div
          className="flex gap-1 rounded-[10px] p-1 border"
          style={{ background: 'var(--bg-2)', borderColor: 'var(--line)' }}
        >
          <TabLink href="/auth/signin" active={activeTab === 'signin'}>Sign in</TabLink>
          <TabLink href="/auth/register" active={activeTab === 'register'}>Create account</TabLink>
        </div>
        {children}
      </section>
    </div>
  );
}

function TabLink({ href, children, active }: { href: string; children: React.ReactNode; active: boolean }) {
  return (
    <Link
      href={href}
      className={
        'flex-1 text-center px-3.5 py-2 rounded-[7px] text-[13px] font-bold transition ' +
        (active ? 'shadow-[0_2px_8px_rgba(0,0,0,.25)]' : 'opacity-60 hover:opacity-100')
      }
      style={{
        background: active ? 'var(--bg-1)' : 'transparent',
        color: active ? 'var(--text-0)' : 'var(--text-2)',
      }}
    >
      {children}
    </Link>
  );
}
