"use client";

import React, { useState, useEffect, useRef } from "react";
import {
    Menu,
    X,
    ChevronDown,
    FileText,
    LayoutDashboard,
    LogOut,
    Settings,
    Sparkles,
    type LucideIcon,
} from "lucide-react";

// Optional: Proper typing for nav links
type NavLink = {
    name: string;
    href: string;
    icon?: LucideIcon;
};

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
    const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    // ✅ FIX: Proper ref type (solves "contains does not exist on never")
    const profileDropdownRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as Node;

            if (
                profileDropdownRef.current &&
                !profileDropdownRef.current.contains(target)
            ) {
                setIsProfileOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const loggedOutLinks: NavLink[] = [
        { name: "Home", href: "#" },
        { name: "Explore", href: "/explore" },
        { name: "Blog", href: "#" },
        { name: "About", href: "#" },
        { name: "Contact", href: "#" },
    ];

    const loggedInLinks: NavLink[] = [
        { name: "Home", href: "#" },
        { name: "Explore", href: "#" },
        { name: "Blog", href: "#" },
        { name: "Dashboard", href: "#", icon: LayoutDashboard },
        { name: "My Documents", href: "#", icon: FileText },
    ];

    const activeLinks = isLoggedIn ? loggedInLinks : loggedOutLinks;

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">

                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0B1220] text-white">
                            <Sparkles className="h-5 w-5 text-indigo-400" />
                        </div>
                        <span className="text-xl font-bold text-[#0B1220]">
                            Content<span className="text-indigo-600">.IQ</span>
                        </span>
                    </div>

                    {/* Desktop Links */}
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

                    {/* Desktop Auth / Profile */}
                    <div className="hidden items-center gap-4 md:flex">
                        {!isLoggedIn ? (
                            <>
                                <button
                                    onClick={() => setIsLoggedIn(true)}
                                    className="text-sm font-medium text-gray-600 hover:text-[#0B1220]"
                                >
                                    Sign In
                                </button>
                                <button
                                    onClick={() => setIsLoggedIn(true)}
                                    className="rounded-lg bg-[#0B1220] px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90"
                                >
                                    Get Started
                                </button>
                            </>
                        ) : (
                            <div className="relative" ref={profileDropdownRef}>
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 p-1.5 pr-3 hover:bg-gray-100"
                                >
                                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0B1220] text-xs font-semibold text-white">
                                        ZM
                                    </div>

                                    <span className="text-sm font-medium text-gray-700">
                                        Zannatul Mawa
                                    </span>

                                    <ChevronDown
                                        className={`h-4 w-4 text-gray-400 transition-transform ${isProfileOpen ? "rotate-180" : ""
                                            }`}
                                    />
                                </button>

                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-100 bg-white p-2 shadow-lg">
                                        <div className="mb-1 border-b px-3 py-2">
                                            <p className="text-xs text-gray-400">
                                                Signed in as
                                            </p>
                                            <p className="truncate text-sm font-semibold">
                                                zannatul@writeflow.ai
                                            </p>
                                        </div>

                                        <a className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-gray-50">
                                            <LayoutDashboard className="h-4 w-4" />
                                            Dashboard
                                        </a>

                                        <a className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-gray-50">
                                            <FileText className="h-4 w-4" />
                                            My Documents
                                        </a>

                                        <a className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-gray-50">
                                            <Settings className="h-4 w-4" />
                                            Settings
                                        </a>

                                        <div className="my-1 border-t" />

                                        <button
                                            onClick={() => {
                                                setIsLoggedIn(false);
                                                setIsProfileOpen(false);
                                            }}
                                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Log out
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Mobile Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() =>
                                setIsMobileMenuOpen(!isMobileMenuOpen)
                            }
                            className="rounded-lg p-2 text-gray-500 hover:bg-gray-50"
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="space-y-2 border-t bg-white px-4 py-3 md:hidden">
                    {activeLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-600 hover:bg-gray-50"
                        >
                            {link.icon && (
                                <link.icon className="h-5 w-5 text-gray-400" />
                            )}
                            {link.name}
                        </a>
                    ))}
                </div>
            )}
        </nav>
    );
}