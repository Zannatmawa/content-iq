import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth/auth.config";

/**
 * Middleware uses the edge-safe authConfig ONLY — no Prisma, no bcrypt.
 * The `authorized` callback in authConfig handles route protection.
 */
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
    matcher: [
        /*
         * Match all paths except:
         * - _next/static  (static files)
         * - _next/image   (image optimisation)
         * - favicon.ico
         * - /login and /register (public auth pages)
         * - /api/auth     (NextAuth route handler — must be public)
         */
        "/((?!_next/static|_next/image|favicon.ico|login|register|api/auth).*)",
    ],
};