"use client";
import React from 'react';
import { Sparkles, Mail, MapPin, Phone, ArrowUp } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        Product: [
            { name: 'Core Features', href: '#' },
            { name: 'Agent Mechanics', href: '#' },
            { name: 'Popular Templates', href: '#' },
            { name: 'Pricing Tiers', href: '#' },
        ],
        Resources: [
            { name: 'System Blog', href: '#' },
            { name: 'Documentation', href: '#' },
            { name: 'API Reference', href: '#' },
            { name: 'Status Monitor', href: '#' },
        ],
        Company: [
            { name: 'About Us', href: '#' },
            { name: 'Careers', href: '#' },
            { name: 'Privacy Policy', href: '#' },
            { name: 'Terms of Service', href: '#' },
        ],
    };

    // const socialIcons = [
    //     { icon: Twitter, href: '#', label: 'Twitter' },
    //     { icon: Linkedin, href: '#', label: 'LinkedIn' },
    //     { icon: Github, href: '#', label: 'GitHub' },
    // ];

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="w-full bg-white border-t border-gray-100 px-4 pt-16 pb-8 sm:px-6 lg:px-8 relative">
            <div className="mx-auto max-w-7xl">

                {/* Main Links & Information Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-gray-50">

                    {/* Brand & Description Block (4 Columns) */}
                    <div className="lg:col-span-4 space-y-4 text-left">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0B1220] text-white">
                                <Sparkles className="h-4 w-4 text-indigo-400" />
                            </div>
                            <span className="text-lg font-bold tracking-tight text-[#0B1220]">
                                WriteFlow<span className="text-indigo-600">.AI</span>
                            </span>
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
                            Autonomous background agent infrastructure engineered to scale multi-channel content pipelines seamlessly without manual drag.
                        </p>

                        {/* Social Media Nodes */}
                        {/* <div className="flex items-center gap-3 pt-2">
                            {socialIcons.map((social, idx) => {
                                const Icon = social.icon;
                                return (
                                    <a
                                        key={idx}
                                        href={social.href}
                                        aria-label={social.label}
                                        className="h-8 w-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#0B1220] hover:border-gray-300 bg-gray-50/50 hover:bg-white transition-all duration-200"
                                    >
                                        <Icon className="h-4 w-4" />
                                    </a>
                                );
                            })}
                        </div> */}
                    </div>

                    {/* Dynamic Navigation Columns Map (6 Columns) */}
                    <div className="lg:col-span-5 grid grid-cols-3 gap-4 text-left">
                        {Object.entries(footerLinks).map(([category, links]) => (
                            <div key={category}>
                                <h4 className="text-xs font-bold text-[#0B1220] tracking-wider uppercase mb-4">
                                    {category}
                                </h4>
                                <ul className="space-y-2.5">
                                    {links.map((link, lIdx) => (
                                        <li key={lIdx}>
                                            <a
                                                href={link.href}
                                                className="text-xs text-gray-400 hover:text-[#0B1220] transition-colors duration-150"
                                            >
                                                {link.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Contact Details Block (3 Columns) */}
                    <div className="lg:col-span-3 text-left space-y-4">
                        <h4 className="text-xs font-bold text-[#0B1220] tracking-wider uppercase mb-4">
                            System Support
                        </h4>
                        <ul className="space-y-3 text-xs text-gray-500">
                            <li className="flex items-start gap-2.5">
                                <Mail className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                                <a href="mailto:ops@writeflow.ai" className="hover:text-indigo-600 transition-colors">
                                    ops@writeflow.ai
                                </a>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <Phone className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-400">+1 (555) 234-5678</span>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-400 leading-relaxed">
                                    100 Pine Street, Suite 1200<br />San Francisco, CA 94111
                                </span>
                            </li>
                        </ul>
                    </div>

                </div>

                {/* Bottom Metadata Alignment Bar */}
                <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1">
                        <span>&copy; {currentYear} WriteFlow AI Technologies, Inc.</span>
                        <span className="hidden sm:inline text-gray-200">|</span>
                        <span className="text-gray-300 font-mono">Node ID: US-WEST_PROD</span>
                    </div>

                    {/* Back To Top Layout Anchor */}
                    <button
                        onClick={scrollToTop}
                        className="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-100 bg-gray-50 text-gray-400 hover:text-[#0B1220] hover:bg-white hover:border-gray-200 transition-all text-[11px] font-medium"
                    >
                        <span>Back to terminal top</span>
                        <ArrowUp className="h-3.5 w-3.5 transform translate-y-0 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                </div>

            </div>
        </footer>
    );
}