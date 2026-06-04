import { AuthShell } from '@/components/AuthShell';
import { RegisterForm } from './RegisterForm';

export const metadata = { title: 'Create account · PATH' };

export default function RegisterPage() {
  return (
    <AuthShell activeTab="register">
      <div>
        <h1 className="display text-[24px] md:text-[30px] leading-tight mb-1.5">Start your PATH.</h1>
        <p className="text-sm mb-6" style={{ color: 'var(--text-2)' }}>
          Create your account — it takes 30 seconds.
        </p>
        <RegisterForm />
      </div>
    </AuthShell>
  );
}
