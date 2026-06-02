"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
    Menu, X, ChevronDown, FileText,
    LayoutDashboard, LogOut, Settings,
    Sparkles, Loader2, type LucideIcon,
} from "lucide-react";
import Link from "next/link";

type NavLink = {
    name: string;
    href: string;
    icon?: LucideIcon;
};

export default function Navbar() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const user = session?.user?.email
    console.log(user)

    const isLoading = status === "loading";
    const isLoggedIn = status === "authenticated";

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const profileDropdownRef = useRef<HTMLDivElement | null>(null);

    // Close profile dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as Node;
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(target)) {
                setIsProfileOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, []);

    async function handleSignOut() {
        setIsProfileOpen(false);
        setIsMobileMenuOpen(false);
        await signOut({ callbackUrl: "/" });
    }

    // Derive display values from real session
    const userName = session?.user?.name ?? "User";
    const userEmail = session?.user?.email ?? "";
    const userImage = session?.user?.image ?? null;

    // Initials from name (e.g. "Zannatul Mawa" → "ZM")
    const initials = userName
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    const loggedOutLinks: NavLink[] = [
        { name: "Home", href: "/" },
        { name: "Explore", href: "/explore" },
        // { name: "Templates", href: "/explore" },
        { name: "Blog", href: "/blog" },
        { name: "About", href: "/about" },
    ];

    const loggedInLinks: NavLink[] = [
        { name: "Home", href: "/" },
        // { name: "Templates", href: "/templates" },
        { name: "Explore", href: "/explore" },
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "My Content", href: "/content", icon: FileText },
    ];

    const activeLinks = isLoggedIn ? loggedInLinks : loggedOutLinks;

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">

                    {/* ── Logo ───────────────────────────────────────────────────── */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0B1220] text-white">
                            <Sparkles className="h-5 w-5 text-indigo-400" />
                        </div>
                        <span className="text-xl font-bold text-[#0B1220]">
                            Content<span className="text-indigo-600">.IQ</span>
                        </span>
                    </Link>

                    {/* ── Desktop nav links ───────────────────────────────────────── */}
                    <div className="hidden space-x-8 md:flex">
                        {activeLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-sm font-medium text-gray-500 transition-colors hover:text-[#0B1220]"
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>

                    {/* ── Desktop auth / profile ──────────────────────────────────── */}
                    <div className="hidden items-center gap-4 md:flex">
                        {/* Loading skeleton — prevents layout shift during session fetch */}
                        {isLoading && (
                            <div className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                                <div className="h-8 w-24 animate-pulse rounded-full bg-gray-100" />
                            </div>
                        )}

                        {/* Logged OUT */}
                        {!isLoading && !isLoggedIn && (
                            <>
                                <a
                                    href="/login"
                                    className="text-sm font-medium text-gray-600 hover:text-[#0B1220]"
                                >
                                    Sign In
                                </a>
                                <a
                                    href="/register"
                                    className="rounded-lg bg-[#0B1220] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
                                >
                                    Get Started
                                </a>
                            </>
                        )}

                        {/* Logged IN — profile dropdown */}
                        {!isLoading && isLoggedIn && (
                            <div className="relative" ref={profileDropdownRef}>
                                <button
                                    onClick={() => setIsProfileOpen((prev) => !prev)}
                                    className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 p-1.5 pr-3 transition-colors hover:bg-gray-100"
                                    aria-expanded={isProfileOpen}
                                    aria-haspopup="true"
                                >
                                    {/* Avatar — real image or initials fallback */}
                                    {userImage ? (
                                        <img
                                            src={userImage}
                                            alt={userName}
                                            className="h-7 w-7 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0B1220] text-xs font-semibold text-white">
                                            {initials}
                                        </div>
                                    )}
                                    <span className="max-w-[120px] truncate text-sm font-medium text-gray-700">
                                        {userName}
                                    </span>
                                    <ChevronDown
                                        className={`h-4 w-4 text-gray-400 transition-transform duration-150 ${isProfileOpen ? "rotate-180" : ""
                                            }`}
                                    />
                                </button>

                                {/* Dropdown */}
                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-100 bg-white p-2 shadow-lg">
                                        {/* User info header */}
                                        <div className="mb-1 border-b px-3 py-2">
                                            <p className="text-xs text-gray-400">Signed in as</p>
                                            <p className="truncate text-sm font-semibold">{userEmail}</p>
                                        </div>

                                        <a href="/dashboard" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                            <LayoutDashboard className="h-4 w-4 text-gray-400" />
                                            Dashboard
                                        </a>
                                        <a href="/content" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                            <FileText className="h-4 w-4 text-gray-400" />
                                            My Content
                                        </a>
                                        <a href="/settings" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                            <Settings className="h-4 w-4 text-gray-400" />
                                            Settings
                                        </a>

                                        <div className="my-1 border-t" />

                                        <button
                                            onClick={handleSignOut}
                                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Log out
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* ── Mobile hamburger ────────────────────────────────────────── */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                            className="rounded-lg p-2 text-gray-500 hover:bg-gray-50"
                            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                        >
                            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Mobile menu ─────────────────────────────────────────────────── */}
            {isMobileMenuOpen && (
                <div className="space-y-1 border-t bg-white px-4 py-3 md:hidden">
                    {activeLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {link.icon && <link.icon className="h-4 w-4 text-gray-400" />}
                            {link.name}
                        </a>
                    ))}

                    {/* Mobile auth buttons */}
                    <div className="border-t pt-2">
                        {isLoading && (
                            <div className="px-3 py-2">
                                <div className="h-4 w-32 animate-pulse rounded bg-gray-100" />
                            </div>
                        )}

                        {!isLoading && !isLoggedIn && (
                            <div className="flex flex-col gap-2 pt-1">
                                <a
                                    href="/login"
                                    className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                                >
                                    Sign In
                                </a>
                                <a
                                    href="/register"
                                    className="rounded-lg bg-[#0B1220] px-3 py-2 text-center text-sm font-medium text-white"
                                >
                                    Get Started
                                </a>
                            </div>
                        )}

                        {!isLoading && isLoggedIn && (
                            <div className="space-y-1 pt-1">
                                {/* Mobile user info */}
                                <div className="flex items-center gap-2 px-3 py-2">
                                    {userImage ? (
                                        <img src={userImage} alt={userName} className="h-7 w-7 rounded-full object-cover" />
                                    ) : (
                                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0B1220] text-xs font-semibold text-white">
                                            {initials}
                                        </div>
                                    )}
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium text-gray-900">{userName}</p>
                                        <p className="truncate text-xs text-gray-400">{userEmail}</p>
                                    </div>
                                </div>

                                <a href="/settings" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50">
                                    <Settings className="h-4 w-4 text-gray-400" />
                                    Settings
                                </a>

                                <button
                                    onClick={handleSignOut}
                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Log out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
