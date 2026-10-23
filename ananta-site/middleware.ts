import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return response;
  const supabase = createServerClient(url, key, { cookies: {
    getAll() { return request.cookies.getAll(); },
    setAll(cookies) { cookies.forEach(({ name, value }) => request.cookies.set(name, value)); response = NextResponse.next({ request }); cookies.forEach(({ name, value, options }) => response.cookies.set(name, value, options)); }
  }});
  const { data: { user } } = await supabase.auth.getUser();
  if (request.nextUrl.pathname.startsWith('/admin/dashboard')) {
    if (!user || !process.env.ADMIN_EMAIL || user.email?.toLowerCase() !== process.env.ADMIN_EMAIL.toLowerCase()) {
      const login = request.nextUrl.clone(); login.pathname = '/admin'; login.searchParams.set('login', '1');
      return NextResponse.redirect(login);
    }
  }
  return response;
}
export const config = { matcher: ['/admin/:path*'] };
