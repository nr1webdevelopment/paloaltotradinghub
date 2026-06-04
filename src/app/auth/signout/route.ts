import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

/** POST /auth/signout — clears the session and redirects to signin. */
export async function POST(request: Request) {
  const supabase = createServerSupabase();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL('/auth/signin', request.url), { status: 302 });
}
