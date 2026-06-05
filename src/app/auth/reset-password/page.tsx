import { AuthShell } from '@/components/AuthShell';
import { ResetPasswordForm } from './ResetPasswordForm';

export const metadata = { title: 'Reset password · PATH' };

export default function ResetPasswordPage() {
  return (
    <AuthShell activeTab="recovery">
      <div>
        <h1 className="display text-[24px] md:text-[30px] leading-tight mb-1.5">Choose a new password.</h1>
        <p className="text-sm mb-6" style={{ color: 'var(--text-2)' }}>
          Pick something strong. After saving, you&apos;ll be signed in automatically.
        </p>
        <ResetPasswordForm />
      </div>
    </AuthShell>
  );
}
