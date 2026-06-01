import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { z } from "zod";

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

/**
 * Edge-compatible auth config.
 * NO Prisma/database imports here — this file runs in the Edge runtime
 * (middleware). The Prisma adapter lives in auth.ts only.
 */
export const authConfig: NextAuthConfig = {
    pages: {
        signIn: "/login",
        error: "/login",
    },

    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        /**
         * Credentials provider is declared here so NextAuth knows it exists,
         * but the actual `authorize` logic (which needs Prisma) lives in auth.ts
         * and overrides this at runtime on the Node.js server.
         */
        Credentials({
            async authorize() {
                // Real implementation in auth.ts — this stub satisfies the Edge build.
                return null;
            },
        }),
    ],

    callbacks: {
        // Protect routes: redirect unauthenticated users to /login
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isProtected =
                nextUrl.pathname.startsWith("/dashboard") ||
                nextUrl.pathname.startsWith("/workspace") ||
                nextUrl.pathname.startsWith("/projects") ||
                nextUrl.pathname.startsWith("/content") ||
                nextUrl.pathname.startsWith("/analytics") ||
                nextUrl.pathname.startsWith("/settings");

            if (isProtected && !isLoggedIn) return false; // triggers redirect to signIn page
            return true;
        },

        async jwt({ token, user }) {
            if (user) token.id = user.id;
            return token;
        },

        async session({ session, token }) {
            if (token.id) session.user.id = token.id as string;
            return session;
        },
    },
};