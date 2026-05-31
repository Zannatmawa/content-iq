"use client";

import { logoutUser } from "@/actions/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";
import type { Session } from "next-auth";

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Returns up to two uppercase initials from a display name or email. */
function getInitials(name?: string | null, email?: string | null): string {
    if (name) {
        const parts = name.trim().split(/\s+/);
        return parts.length >= 2
            ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
            : parts[0].slice(0, 2).toUpperCase();
    }
    return email ? email.slice(0, 2).toUpperCase() : "??";
}

// ── Props ────────────────────────────────────────────────────────────────────
type HeaderProps = {
    user: Session["user"];
};

// ── Component ────────────────────────────────────────────────────────────────
export function Header({ user }: HeaderProps) {
    const initials = getInitials(user?.name, user?.email);

    return (
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80 sm:px-6">
            {/* ── Left: spacer on desktop; on mobile the Menu button sits here ── */}
            {/* The Menu button is rendered inside Sidebar (fixed-positioned),    */}
            {/* so we just reserve the space with an invisible placeholder.       */}
            <div className="w-9 lg:hidden" aria-hidden="true" />

            {/* ── Centre / page breadcrumb slot (extend later as needed) ─────── */}
            <div className="flex-1" />

            {/* ── Right: user avatar dropdown ────────────────────────────────── */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                        className="rounded-full outline-none ring-offset-white focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 dark:ring-offset-slate-900 dark:focus-visible:ring-white"
                        aria-label="User menu"
                    >
                        <Avatar className="h-8 w-8 cursor-pointer transition-opacity hover:opacity-80">
                            <AvatarImage
                                src={user?.image ?? undefined}
                                alt={user?.name ?? "User avatar"}
                            />
                            <AvatarFallback className="bg-slate-900 text-xs font-semibold text-white dark:bg-white dark:text-slate-900">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                    </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                    {/* User info */}
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col gap-0.5">
                            {user?.name && (
                                <p className="text-sm font-medium leading-none">{user.name}</p>
                            )}
                            {user?.email && (
                                <p className="text-xs leading-none text-muted-foreground">
                                    {user.email}
                                </p>
                            )}
                        </div>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    {/* Profile link */}
                    <DropdownMenuItem asChild>
                        <a href="/settings" className="cursor-pointer">
                            <User className="mr-2 h-4 w-4" />
                            Profile
                        </a>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {/* Sign out */}
                    <DropdownMenuItem
                        className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700 dark:text-red-400 dark:focus:bg-red-950"
                        onSelect={async () => {
                            await logoutUser();
                        }}
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    );
}
