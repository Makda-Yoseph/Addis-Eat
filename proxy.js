import { NextResponse } from "next/server";

export function proxy(request) {
  const sessionCookie = request.cookies.get("session");

  if (!sessionCookie?.value) {
    const signInUrl = new URL("/signin", request.url);
    const next = request.nextUrl.pathname + request.nextUrl.search;

    signInUrl.searchParams.set("next", next);

    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/checkout/:path*", "/orders/:path*", "/admin/:path*"],
};
