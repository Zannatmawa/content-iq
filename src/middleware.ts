import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default auth((req) => {
    const { nextUrl, auth: session } = req as NextRequest & { auth: typeof req.auth };
    const isLoggedIn = !!session?.user;
    const isAuthPage = nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/register");
    const isProtectedPage = nextUrl.pathname.startsWith("/dashboard") ||
        nextUrl.pathname.startsWith("/workspace") ||
        nextUrl.pathname.startsWith("/projects");

    if (isProtectedPage && !isLoggedIn) {
        return NextResponse.redirect(new URL("/login", nextUrl));
    }
    if (isAuthPage && isLoggedIn) {
        return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
    return NextResponse.next();
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};