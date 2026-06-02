// src/types/next-auth.d.ts
// Extends the built-in NextAuth types so session.user.id is available
// everywhere — useSession(), auth(), and server components.

import type { DefaultSession, DefaultUser } from "next-auth";
import type { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name: string | null;
            email: string;
            image: string | null;
        } & DefaultSession["user"];
    }

    interface User extends DefaultUser {
        id: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        id: string;
    }
}