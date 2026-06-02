"use client";

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";

export function AuthSessionProvider({
    children,
    session,
}: {
    children: React.ReactNode;
    session: Session | null;
}) {
    return (
        <SessionProvider
            session={session}
            refetchInterval={5 * 60}      // re-fetch every 5 min
            refetchOnWindowFocus={true}   // re-fetch when tab regains focus
        >
            {children}
        </SessionProvider>
    );
}
