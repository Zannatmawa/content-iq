import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth/auth.config";

/**
 * Middleware uses the edge-safe authConfig ONLY — no Prisma, no bcrypt.
 * The `authorized` callback in authConfig handles route protection.
 */
const { auth } = NextAuth(authConfig);

export default auth;

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|login|register|api/auth).*)",
    ],
};