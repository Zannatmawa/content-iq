"use client";
import React, { useState } from 'react';
import { FileText, Mail, FileCheck, Share2, Search, Sliders } from 'lucide-react';

export default function PopularTemplates() {
    const [isLoading, setIsLoading] = useState(false);

    const templates = [
        {
            title: 'SEO Long-Form Blog',
            description: 'Generates structured H2/H3 layouts, keywords, and copy optimizing for active reach algorithms.',
            icon: FileText,
            iconColor: 'text-indigo-600 bg-indigo-50',
            badge: 'Blog'
        },
        {
            title: 'Email Sequence Drop',
            description: 'Creates hyper-targeted onboarding, retention, and sales transactional email cadences.',
            icon: Mail,
            iconColor: 'text-amber-600 bg-amber-50',
            badge: 'Email'
        },
        {
            title: 'LinkedIn Lead Magnet',
            description: 'High-engagement positioning framework focused on building visibility and CTR metrics.',
            icon: Share2,
            iconColor: 'text-emerald-600 bg-emerald-50',
            badge: 'Social'
        },
        {
            title: 'Technical Case Study',
            description: 'Deep-dive analytical blueprinting that turns custom performance data into crisp enterprise pitches.',
            icon: FileCheck,
            iconColor: 'text-rose-600 bg-rose-50',
            badge: 'B2B Copy'
        }
    ];

    return (
        <section className="w-full bg-white px-4 py-20 sm:px-6 lg:px-8 border-t border-gray-100">
            <div className="mx-auto max-w-7xl">

                {/* Section Header Controls */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
                    <div className="max-w-xl text-left">
                        <p className="text-xs font-semibold tracking-wider text-indigo-600 uppercase mb-3">Pre-Built Automation</p>
                        <h2 className="text-3xl font-extrabold tracking-tight text-[#0B1220]">
                            Popular Task Blueprints
                        </h2>
                        <p className="mt-2 text-sm text-gray-500">
                            Instantly deploy pre-configured prompt frameworks directly into your workspace.
                        </p>
                    </div>

                    {/* Interactive State Control Panel (For demoing loading skeleton state) */}
                    <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-xl border border-gray-100 self-start sm:self-auto">
                        <button
                            onClick={() => setIsLoading(false)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${!isLoading ? 'bg-white text-[#0B1220] shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            Active UI
                        </button>
                        <button
                            onClick={() => setIsLoading(true)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${isLoading ? 'bg-white text-[#0B1220] shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            Skeleton Loading
                        </button>
                    </div>
                </div>

                {/* 4-Column Card Grid (Maps exactly 4-per-row on desktop screens) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {isLoading
                        ? // 1. Skeleton Loader State Array Loop
                        Array.from({ length: 4 }).map((_, idx) => (
                            <div
                                key={idx}
                                className="animate-pulse rounded-xl border border-gray-100 p-5 bg-white space-y-4"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="h-10 w-10 rounded-lg bg-gray-200" />
                                    <div className="h-5 w-14 rounded-full bg-gray-100" />
                                </div>
                                <div className="space-y-2.5 pt-2">
                                    <div className="h-4 w-3/4 rounded bg-gray-200" />
                                    <div className="h-3 w-full rounded bg-gray-100" />
                                    <div className="h-3 w-5/6 rounded bg-gray-100" />
                                </div>
                                <div className="pt-4 flex items-center justify-between">
                                    <div className="h-3 w-16 rounded bg-gray-100" />
                                    <div className="h-3 w-3 rounded bg-gray-200" />
                                </div>
                            </div>
                        ))

                        : // 2. Active Component Content Template Cards
                        templates.map((template, idx) => {
                            const Icon = template.icon;
                            return (
                                <div
                                    key={idx}
                                    className="group flex flex-col justify-between rounded-xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-200"
                                >
                                    <div>
                                        {/* Top Metric Header Row */}
                                        <div className="flex items-center justify-between mb-5">
                                            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${template.iconColor}`}>
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <span className="text-[10px] font-semibold text-gray-500 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-md">
                                                {template.badge}
                                            </span>
                                        </div>

                                        {/* Heading */}
                                        <h3 className="text-base font-bold text-[#0B1220] group-hover:text-indigo-600 transition-colors">
                                            {template.title}
                                        </h3>

                                        {/* Body Copy */}
                                        <p className="mt-2 text-xs text-gray-500 leading-relaxed">
                                            {template.description}
                                        </p>
                                    </div>

                                    {/* Bottom Utility Interactive Mimicry Row */}
                                    <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between text-[11px] font-medium text-gray-400">
                                        <span className="group-hover:text-indigo-600 transition-colors">Use template</span>
                                        <span className="transform translate-x-0 group-hover:translate-x-0.5 transition-transform">→</span>
                                    </div>

                                </div>
                            );
                        })
                    }
                </div>

            </div>
        </section>
    );
}