import Link from 'next/link';
import { AuthShell } from '@/components/AuthShell';
import { ForgotPasswordForm } from './ForgotPasswordForm';

export const metadata = { title: 'Forgot password · PATH' };

export default function ForgotPasswordPage() {
  return (
    <AuthShell activeTab="recovery">
      <div>
        <h1 className="display text-[24px] md:text-[30px] leading-tight mb-1.5">Forgot your password?</h1>
        <p className="text-sm mb-6" style={{ color: 'var(--text-2)' }}>
          Enter the email you registered with and we&apos;ll send you a reset link.
        </p>
        <ForgotPasswordForm />
        <p className="text-[13px] mt-5" style={{ color: 'var(--text-2)' }}>
          Remembered it?{' '}
          <Link href="/auth/signin" className="font-bold underline" style={{ color: 'var(--accent)' }}>
            Back to sign in
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
