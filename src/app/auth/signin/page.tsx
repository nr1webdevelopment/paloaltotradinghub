import { AuthShell } from '@/components/AuthShell';
import { SigninForm } from './SigninForm';

export const metadata = { title: 'Sign in · PATH' };

export default function SigninPage() {
  return (
    <AuthShell activeTab="signin">
      <div>
        <h1 className="display text-[24px] md:text-[30px] leading-tight mb-1.5">Welcome back.</h1>
        <p className="text-sm mb-6" style={{ color: 'var(--text-2)' }}>
          Sign in to continue your AI trading journey.
        </p>
        <SigninForm />
      </div>
    </AuthShell>
  );
}
