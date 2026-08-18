import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Runs before every matched request. Refreshes the Supabase session cookie
 * and gates /portal (clients) and /admin (staff) behind auth + role checks.
 *
 * Note: in Next.js 16 this file replaces the deprecated `middleware.ts`
 * convention — same purpose, new name (`proxy`).
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isPortalRoute = pathname.startsWith("/portal");
  const isAdminRoute = pathname.startsWith("/admin");

  if ((isPortalRoute || isAdminRoute) && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminRoute && user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const staffRoles = ["admin", "operator", "sales"];
    if (!profile || !staffRoles.includes(profile.role)) {
      return NextResponse.redirect(new URL("/portal", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/portal/:path*", "/admin/:path*"],
};
