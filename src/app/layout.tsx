// src/app/layout.tsx  — SERVER component (no "use client")
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// import { auth } from "@/lib/auth";                          // server-side auth
import { AuthSessionProvider } from "@/components/providers/session-provider";
import { Toaster } from "sonner";
import { auth } from "@/lib/auth/auth-index";
// import Navbar from "@/components/navbar";                   // adjust path if needed

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ContentIQ — AI Content Platform",
  description: "Generate professional content with AI",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthSessionProvider session={session}>
          {/* <Navbar /> */}
          {children}
          <Toaster richColors position="top-center" />
        </AuthSessionProvider>
      </body>
    </html>
  );
}
