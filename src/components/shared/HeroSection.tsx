"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Cpu, Send, Layers } from 'lucide-react';

export default function Hero() {
    return (
        <section className="relative flex min-h-[65vh] w-full items-center justify-center overflow-hidden bg-white px-4 py-16 sm:px-6 lg:px-8">

            {/* 1. Subtle Structural Background Mesh (Matching the clean dashboard canvas) */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-60" />

            <div className="relative mx-auto max-w-5xl text-center z-10">

                {/* Decorative Badge */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50/80 px-3 py-1 text-xs font-medium text-gray-600 backdrop-blur-sm"
                >
                    <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                    <span>Next-Gen Agentic Content Engine</span>
                </motion.div>

                {/* 2. Interactive Animated Headline */}
                <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-[#0B1220] sm:text-5xl md:text-6xl">
                    Scale your pipeline with{' '}
                    <span className="relative block sm:inline">
                        <span className="relative z-10 text-indigo-600">Agentic AI</span>
                        <motion.svg
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ delay: 0.8, duration: 0.6 }}
                            className="absolute -bottom-2 left-0 h-3 w-full text-indigo-100 hidden sm:block"
                            viewBox="0 0 100 10"
                            preserveAspectRatio="none"
                        >
                            <path d="M0,5 Q50,10 100,5" stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round" />
                        </motion.svg>
                    </span>
                </h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-gray-500 leading-relaxed"
                >
                    WriteFlow AI works behind the scenes. Tell our autonomous background agents what you need, and watch them build, review, and schedule your multi-channel copy perfectly.
                </motion.p>

                {/* 3. High-Contrast Call to Action */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <button className="group flex items-center gap-2 rounded-xl bg-[#0B1220] px-6 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-opacity-90 transition-all duration-200 focus:outline-none w-full sm:w-auto justify-center">
                        Start Writing Free
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>

                    <button className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all duration-200 w-full sm:w-auto justify-center">
                        Book Tech Demo
                    </button>
                </motion.div>
            </div>

            {/* 4. Interactive Floating UI Cards (Representing the background processes) */}

            {/* Agent Card Left */}
            <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-[5%] top-[55%] hidden lg:flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 shadow-lg max-w-xs"
            >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    <Cpu className="h-5 w-5" />
                </div>
                <div className="text-left">
                    <p className="text-xs font-semibold text-gray-800">SEO Agent Executing</p>
                    <p className="text-[10px] text-gray-400">Optimizing H2 hierarchies...</p>
                </div>
            </motion.div>

            {/* Agent Card Right */}
            <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute right-[5%] top-[25%] hidden lg:flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 shadow-lg max-w-xs"
            >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <Layers className="h-5 w-5" />
                </div>
                <div className="text-left">
                    <p className="text-xs font-semibold text-gray-800">Multi-Channel Split</p>
                    <p className="text-[10px] text-gray-400">Drafting LinkedIn & Email hooks</p>
                </div>
            </motion.div>

            {/* 5. Clear Visual Flow Element (Directing users downward smoothly) */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-60">
                <span className="text-[10px] font-medium tracking-wider text-gray-400 uppercase">Explore System Features</span>
                <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="h-4 w-0.5 bg-gray-300 rounded-full"
                />
            </div>

        </section>
    );
}