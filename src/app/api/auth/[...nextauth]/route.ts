import { handlers, signIn, signOut, auth } from "@/lib/auth/auth-index";
export const { GET, POST } = handlers;
// app / api / auth / [...nextauth] / route.ts

// import NextAuth from "next-auth";
// import { authOptions } from "@/lib/auth";

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };