"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
    LayoutDashboard,
    Building2,
    FolderOpen,
    FileText,
    BarChart3,
    Settings,
    Menu,
    X,
    Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

// ── Nav items ────────────────────────────────────────────────────────────────
const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Workspaces", href: "/workspace", icon: Building2 },
    { label: "Projects", href: "/projects", icon: FolderOpen },
    { label: "Content", href: "/content", icon: FileText },
    { label: "Analytics", href: "/analytics", icon: BarChart3 },
    { label: "Settings", href: "/settings", icon: Settings },
] as const;

// ── Shared nav link ──────────────────────────────────────────────────────────
function NavLink({
    item,
    active,
    onClick,
}: {
    item: (typeof navItems)[number];
    active: boolean;
    onClick?: () => void;
}) {
    const Icon = item.icon;
    return (
        <Link
            href={item.href}
            onClick={onClick}
            className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                active
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
            )}
        >
            <Icon
                className={cn(
                    "h-4 w-4 shrink-0 transition-transform duration-150 group-hover:scale-110",
                    active && "scale-110"
                )}
            />
            {item.label}
        </Link>
    );
}

// ── Logo mark ────────────────────────────────────────────────────────────────
function Logo() {
    return (
        <Link href="/dashboard" className="flex items-center gap-2.5 px-3 py-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 dark:bg-white">
                <Sparkles className="h-4 w-4 text-white dark:text-slate-900" />
            </div>
            <span className="text-[15px] font-semibold tracking-tight text-slate-900 dark:text-white">
                ContentIQ
            </span>
        </Link>
    );
}

// ── Sidebar inner content (reused in both desktop + sheet) ───────────────────
function SidebarContent({ onNavClick }: { onNavClick?: () => void }) {
    const pathname = usePathname();

    return (
        <div className="flex h-full flex-col gap-1 px-3 py-4">
            {/* Logo */}
            <div className="mb-4 mt-1">
                <Logo />
            </div>

            {/* Label */}
            <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-600">
                Menu
            </p>

            {/* Nav links */}
            <nav className="flex flex-col gap-0.5">
                {navItems.map((item) => (
                    <NavLink
                        key={item.href}
                        item={item}
                        active={
                            item.href === "/dashboard"
                                ? pathname === "/dashboard"
                                : pathname.startsWith(item.href)
                        }
                        onClick={onNavClick}
                    />
                ))}
            </nav>
        </div>
    );
}

// ── Main export ──────────────────────────────────────────────────────────────
export function Sidebar() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <>
            {/* ── Desktop sidebar (hidden on mobile) ─────────────────────────── */}
            <aside className="hidden w-60 shrink-0 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 lg:flex lg:flex-col">
                <SidebarContent />
            </aside>

            {/* ── Mobile trigger (visible on small screens only) ─────────────── */}
            <div className="fixed left-4 top-3.5 z-40 lg:hidden">
                <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                    <SheetTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-slate-700 dark:text-slate-300"
                            aria-label="Open menu"
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>

                    <SheetContent
                        side="left"
                        className="w-60 border-r border-slate-200 bg-white p-0 dark:border-slate-800 dark:bg-slate-900"
                    >
                        {/* Close button inside sheet */}
                        <button
                            onClick={() => setMobileOpen(false)}
                            className="absolute right-3 top-3 rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
                            aria-label="Close menu"
                        >
                            <X className="h-4 w-4" />
                        </button>

                        <SidebarContent onNavClick={() => setMobileOpen(false)} />
                    </SheetContent>
                </Sheet>
            </div>
        </>
    );
}
