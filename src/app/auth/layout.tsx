/**
 * Layout for /auth/* routes — full-screen overlay with brand panel + form area.
 * The actual signin/register/onboarding pages decide their own contents.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto flex items-center justify-center p-0 md:p-8"
      style={{
        background:
          'radial-gradient(800px 600px at 100% 0%, var(--accent-soft), transparent 60%), radial-gradient(800px 600px at 0% 100%, var(--blue-soft), transparent 60%), var(--bg-0)',
      }}
    >
      {children}
    </div>
  );
}
