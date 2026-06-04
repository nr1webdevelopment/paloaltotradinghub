import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Middleware-side Supabase client.
 * Runs on every request to refresh the user's auth cookies, then
 * gates access to /(app) routes by checking for an authenticated user.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  // IMPORTANT: This must be called for the session to refresh.
  const { data: { user } } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Public auth routes
  const isAuthRoute = pathname.startsWith('/auth');
  const isOnboarding = pathname === '/auth/onboarding';

  // Unauthenticated users may only access /auth/*
  if (!user && !isAuthRoute) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  // Authenticated users hitting /auth/signin or /auth/register → home
  if (user && (pathname === '/auth/signin' || pathname === '/auth/register')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Authenticated users on /auth/onboarding stay there until done — handled
  // in the page itself by reading the profile.
  // (no extra logic needed here)
  void isOnboarding;

  return response;
}
