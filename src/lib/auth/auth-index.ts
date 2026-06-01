import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { authConfig } from "./auth.config";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

/**
 * Full NextAuth config — imports Prisma, runs on Node.js server only.
 * NEVER imported by middleware.ts.
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },

  // Spread the edge-safe config (pages, callbacks, Google provider)
  ...authConfig,

  // Override providers to add the real Credentials authorize logic
  providers: [
    // Re-include Google from authConfig
    ...(authConfig.providers ?? []).filter(
      (p) => (p as { id?: string }).id !== "credentials"
    ),

    Credentials({
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        });
        if (!user || !user.password) return null;

        const valid = await bcrypt.compare(parsed.data.password, user.password);
        if (!valid) return null;

        return user;
      },
    }),
  ],
});