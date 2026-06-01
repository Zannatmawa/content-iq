// import { handlers } from "@/lib/auth";
// export const { GET, POST } = handlers;
// app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
// import { authOptions } from "@/lib/auth";

const handler = NextAuth(authConfig);

export { handler as GET, handler as POST };