"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown, User, FileText, LayoutDashboard, LogOut, Settings, Sparkles } from 'lucide-react';

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Toggle to simulate logged-in state

    const profileDropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Navigation Links configuration
    const loggedOutLinks = [
        { name: 'Home', href: '#' },
        { name: 'Explore', href: '#' },
        { name: 'Blog', href: '#' },
        { name: 'About', href: '#' },
        { name: 'Contact', href: '#' },
    ];

    const loggedInLinks = [
        { name: 'Home', href: '#' },
        { name: 'Explore', href: '#' },
        { name: 'Blog', href: '#' },
        { name: 'Dashboard', href: '#', icon: LayoutDashboard },
        { name: 'My Documents', href: '#', icon: FileText },
    ];

    const activeLinks = isLoggedIn ? loggedInLinks : loggedOutLinks;

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between items-center">

                    {/* Brand Logo */}
                    <div className="flex flex-shrink-0 items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0B1220] text-white">
                            <Sparkles className="h-5 w-5 text-indigo-400" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-[#0B1220]">
                            Content<span className="text-indigo-600">.IQ</span>
                        </span>
                    </div>

                    {/* Desktop Navigation Routes */}
                    <div className="hidden md:flex space-x-8">
                        {activeLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-sm font-medium text-gray-500 hover:text-[#0B1220] transition-colors duration-200"
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>

                    {/* Desktop Action Actions (Auth / Profile) */}
                    <div className="hidden md:flex items-center gap-4">
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
                                    className="rounded-lg bg-[#0B1220] px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90 transition-all duration-200"
                                >
                                    Get Started
                                </button>
                            </>
                        ) : (
                            /* Profile Dropdown Menu */
                            <div className="relative" ref={profileDropdownRef}>
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 p-1.5 pr-3 hover:bg-gray-100 transition-all focus:outline-none"
                                >
                                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0B1220] text-xs font-semibold text-white">
                                        ZM
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">Zannatul Mawa</span>
                                    <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown Card */}
                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-gray-100 bg-white p-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <div className="px-3 py-2 border-b border-gray-50 mb-1">
                                            <p className="text-xs text-gray-400">Signed in as</p>
                                            <p className="text-sm font-semibold text-gray-800 truncate">zannatul@writeflow.ai</p>
                                        </div>

                                        <a href="#" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#0B1220]">
                                            <LayoutDashboard className="h-4 w-4" /> Dashboard
                                        </a>
                                        <a href="#" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#0B1220]">
                                            <FileText className="h-4 w-4" /> My Documents
                                        </a>
                                        <a href="#" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#0B1220]">
                                            <Settings className="h-4 w-4" /> Settings
                                        </a>

                                        <div className="my-1 border-t border-gray-50"></div>

                                        <button
                                            onClick={() => { setIsLoggedIn(false); setIsProfileOpen(false); }}
                                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                                        >
                                            <LogOut className="h-4 w-4" /> Log out
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Mobile Hamburger Button */}
                    <div className="flex md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="inline-flex items-center justify-center rounded-lg p-2 text-gray-500 hover:bg-gray-50 hover:text-[#0B1220] focus:outline-none"
                        >
                            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Responsive Side Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-2 pb-4 space-y-1 shadow-inner animate-in fade-in slide-in-from-top-2 duration-200">
                    {activeLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-[#0B1220]"
                        >
                            {link.icon && <link.icon className="h-5 w-5 text-gray-400" />}
                            {link.name}
                        </a>
                    ))}

                    <div className="mt-4 pt-4 border-t border-gray-100">
                        {!isLoggedIn ? (
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => { setIsLoggedIn(true); setIsMobileMenuOpen(false); }}
                                    className="w-full text-center rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                                >
                                    Sign In
                                </button>
                                <button
                                    onClick={() => { setIsLoggedIn(true); setIsMobileMenuOpen(false); }}
                                    className="w-full text-center rounded-lg bg-[#0B1220] py-2 text-sm font-medium text-white hover:bg-opacity-90"
                                >
                                    Get Started
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0B1220] text-xs font-semibold text-white">
                                        ZM
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">Zannatul Mawa</p>
                                        <p className="text-xs text-gray-400">zannatul@writeflow.ai</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => { setIsLoggedIn(false); setIsMobileMenuOpen(false); }}
                                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium text-red-600 hover:bg-red-50"
                                >
                                    <LogOut className="h-5 w-5" /> Log out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}