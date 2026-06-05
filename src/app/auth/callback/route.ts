import { NextResponse, type NextRequest } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

/**
 * Handles Supabase email-link callbacks (password reset, email change, etc).
 *
 * Supabase sends links of the form:
 *   https://<your-domain>/auth/callback?code=<one-time-code>&next=<destination>
 *
 * We exchange the code for a session cookie, then redirect to `next`.
 * If anything goes wrong, send the user back to signin with an error.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/signin?error=missing_code`);
  }

  const supabase = createServerSupabase();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/auth/signin?error=invalid_link`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
