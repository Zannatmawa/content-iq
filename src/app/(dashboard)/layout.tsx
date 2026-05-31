import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    if (!session?.user) redirect("/login");

    return (
        // Full-viewport grid: sidebar | body column
        <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
            {/* ── Sidebar (desktop: always visible, mobile: sheet-based) ─────── */}
            <Sidebar />

            {/* ── Right-hand column ──────────────────────────────────────────── */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* ── Top header bar ─────────────────────────────────────────── */}
                <Header user={session.user} />

                {/* ── Scrollable main content ────────────────────────────────── */}
                <main className="flex-1 overflow-y-auto">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
