import React from 'react';
import { Sparkles, RefreshCw, Users, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export default function Features() {
    const featuresList = [
        {
            title: 'AI Drafting',
            description: 'Deploy context-aware background agents to autonomously compile high-performing long-form blog posts, email drip campaigns, and social hooks from a single simple prompt line.',
            icon: Sparkles,
            iconBg: 'bg-indigo-50 text-indigo-600',
            badge: 'Agentic Framework',
            capabilities: ['Multi-channel variants', 'Context preservation', 'SEO keyword integration']
        },
        {
            title: 'Tone Rewriting',
            description: 'Instantly transform existing copy to match any brand persona. Shift seamlessly from professional enterprise-grade analysis to engaging, high-growth startup micro-copy.',
            icon: RefreshCw,
            iconBg: 'bg-amber-50 text-amber-600',
            badge: 'Dynamic Persona Engine',
            capabilities: ['Style guide matching', 'Sentiment control', 'Length-optimized adjustments']
        },
        {
            title: 'Team Collaboration',
            description: 'Bring your workspace together. Manage granular project permissions, leave inline commentary, edit active agent parameters, and approve generated content across teams seamlessly.',
            icon: Users,
            iconBg: 'bg-emerald-50 text-emerald-600',
            badge: 'Multi-Role Spaces',
            capabilities: ['Shared workspace nodes', 'Real-time review states', 'Activity audit logs']
        }
    ];

    return (
        <section className="w-full bg-white px-4 py-20 sm:px-6 lg:px-8 border-t border-gray-50">
            <div className="mx-auto max-w-7xl">

                {/* Section Header */}
                <div className="max-w-3xl mb-16">
                    <p className="text-xs font-semibold tracking-wider text-indigo-600 uppercase mb-3">Core Infrastructure</p>
                    <h2 className="text-3xl font-extrabold tracking-tight text-[#0B1220] sm:text-4xl">
                        Autonomous workflows built for modern content operations
                    </h2>
                    <p className="mt-4 text-base text-gray-500 leading-relaxed">
                        WriteFlow AI transcends basic generative interfaces. Our multi-role background framework acts as an independent collaborator across your entire creation lifecycle.
                    </p>
                </div>

                {/* 3-Column Card Grid (Direct visual mapping to dashboard panels in image_98fd81.png) */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {featuresList.map((feature, idx) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={idx}
                                className="group relative flex flex-col justify-between rounded-xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-200"
                            >
                                <div>
                                    {/* Top Header Row within Card */}
                                    <div className="flex items-center justify-between mb-6">
                                        <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${feature.iconBg}`}>
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <span className="text-[10px] font-medium uppercase tracking-wider text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full">
                                            {feature.badge}
                                        </span>
                                    </div>

                                    {/* Feature Content */}
                                    <h3 className="text-xl font-bold text-[#0B1220] flex items-center gap-1 group-hover:text-indigo-600 transition-colors duration-200">
                                        {feature.title}
                                        <ArrowUpRight className="h-4 w-4 opacity-0 -translate-y-0.5 translate-x-0 group-hover:opacity-100 transition-all" />
                                    </h3>

                                    <p className="mt-3 text-sm text-gray-500 leading-relaxed">
                                        {feature.description}
                                    </p>

                                    {/* Micro Capabilities List */}
                                    <div className="mt-6 pt-6 border-t border-gray-50 space-y-2.5">
                                        {feature.capabilities.map((cap, capIdx) => (
                                            <div key={capIdx} className="flex items-center gap-2">
                                                <CheckCircle2 className="h-4 w-4 text-indigo-500 flex-shrink-0" />
                                                <span className="text-xs text-gray-600 font-medium">{cap}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Subtext Link mimicry matching the metrics panel formatting */}
                                <div className="mt-8 flex items-center gap-1 text-xs font-semibold text-indigo-600 group-hover:underline cursor-pointer">
                                    <span>Explore logic flow</span>
                                    <span className="text-[10px]">↗</span>
                                </div>

                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}