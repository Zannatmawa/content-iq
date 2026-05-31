"use client";
import React, { useState } from 'react';
import { LayoutGrid, FileText, Sparkles, Send, Check } from 'lucide-react';

export default function HowItWorks() {
    const [activeStep, setActiveStep] = useState(0);

    const steps = [
        {
            number: '01',
            title: 'Pick template',
            description: 'Choose your workflow canvas. Select from structured formats like deep-dive SEO blog articles, transactional email flows, or micro-copy sets.',
            icon: LayoutGrid,
        },
        {
            number: '02',
            title: 'Enter topic',
            description: 'Input your core concept, audience targets, and focus keywords. Our agent acts on these raw data parameters to anchor context.',
            icon: FileText,
        },
        {
            number: '03',
            title: 'AI generates',
            description: 'The background process kicks off autonomously. Watch as content variants, strategic hooks, and reviews build simultaneously in your workspace.',
            icon: Sparkles,
        },
        {
            number: '04',
            title: 'Edit & publish',
            description: 'Make final refinements directly inside our collaborative rich-text document suite, then push clean outputs directly to your live channels.',
            icon: Send,
        }
    ];

    return (
        <section className="w-full bg-[#F8FAFC] px-4 py-24 sm:px-6 lg:px-8 border-t border-gray-100">
            <div className="mx-auto max-w-7xl">

                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <p className="text-xs font-semibold tracking-wider text-indigo-600 uppercase mb-3">System Mechanics</p>
                    <h2 className="text-3xl font-extrabold tracking-tight text-[#0B1220] sm:text-4xl">
                        Four simple steps to autonomous production
                    </h2>
                    <p className="mt-4 text-base text-gray-500 max-w-xl mx-auto">
                        From raw concept ingestion to multi-platform delivery—engineered to minimize manual drag entirely.
                    </p>
                </div>

                {/* Pipeline Interface Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                    {/* Left Side: Interactive Step Selectors */}
                    <div className="lg:col-span-5 space-y-4">
                        {steps.map((step, idx) => {
                            const Icon = step.icon;
                            const isActive = activeStep === idx;

                            return (
                                <div
                                    key={idx}
                                    onClick={() => setActiveStep(idx)}
                                    className={`group flex items-start gap-4 rounded-xl p-5 border cursor-pointer transition-all duration-300 ${isActive
                                        ? 'bg-white border-gray-200 shadow-md'
                                        : 'bg-transparent border-transparent hover:bg-gray-100/70'
                                        }`}
                                >
                                    {/* Step Index Circle */}
                                    <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg font-bold text-sm transition-colors ${isActive
                                        ? 'bg-[#0B1220] text-white'
                                        : 'bg-gray-200/60 text-gray-500 group-hover:bg-gray-200'
                                        }`}>
                                        {step.number}
                                    </div>

                                    {/* Step Brief Context */}
                                    <div className="text-left">
                                        <h3 className={`text-base font-bold transition-colors ${isActive ? 'text-[#0B1220]' : 'text-gray-600'}`}>
                                            {step.title}
                                        </h3>
                                        <p className={`mt-1 text-xs leading-relaxed transition-opacity ${isActive ? 'text-gray-500' : 'text-gray-400 line-clamp-1 group-hover:line-clamp-none'}`}>
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Right Side: Dynamically Synced Visual Mockup Screen */}
                    <div className="lg:col-span-7 bg-white rounded-xl border border-gray-200 shadow-xl p-6 relative overflow-hidden h-[400px] flex flex-col justify-between">

                        {/* Top Minimal Mock Window Chrome */}
                        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full bg-red-400" />
                                <div className="h-3 w-3 rounded-full bg-amber-400" />
                                <div className="h-3 w-3 rounded-full bg-green-400" />
                                <span className="text-[11px] text-gray-400 font-medium ml-2 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                                    writeflow_pipeline_v1.ms
                                </span>
                            </div>
                            <span className="text-[10px] bg-indigo-50 text-indigo-600 font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-pulse" />
                                Active Node: Step {steps[activeStep].number}
                            </span>
                        </div>

                        {/* Dynamic Card Internal Visualization Body based on active state */}
                        <div className="flex-1 flex flex-col justify-center items-center text-center px-8 relative">

                            {/* Giant background faded icon for spatial depth */}
                            {React.createElement(steps[activeStep].icon, {
                                className: "absolute h-44 w-44 text-gray-50/70 -z-0 pointer-events-none"
                            })}

                            <div className="z-10 bg-white/90 backdrop-blur-sm p-6 rounded-xl border border-gray-100 shadow-sm max-w-sm">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 text-[#0B1220] mb-4 border border-gray-100">
                                    {React.createElement(steps[activeStep].icon, { className: "h-6 w-6" })}
                                </div>
                                <h4 className="text-lg font-bold text-[#0B1220] mb-2">{steps[activeStep].title}</h4>
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    {steps[activeStep].description}
                                </p>
                            </div>
                        </div>

                        {/* Bottom Status Ribbon (Matches dashboard data footer style) */}
                        <div className="border-t border-gray-100 pt-4 mt-4 flex items-center justify-between text-[11px] text-gray-400">
                            <div className="flex items-center gap-1.5">
                                <Check className="h-3.5 w-3.5 text-emerald-500" />
                                <span>Background agent listening...</span>
                            </div>
                            <span className="font-mono text-gray-300">ReadyState: True</span>
                        </div>

                    </div>

                </div>

            </div>
        </section>
    );
}