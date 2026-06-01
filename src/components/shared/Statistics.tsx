"use client";
import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { Users, FileText, CheckCircle, Zap } from 'lucide-react';

// Reusable Animated Counter Engine Component
function AnimatedCounter({ from = 0, to, duration = 2, suffix = "" }) {
    const count = useMotionValue(from);
    const rounded = useTransform(count, (latest) => {
        return Math.floor(latest).toLocaleString() + suffix;
    });
    const [displayValue, setDisplayValue] = useState(from.toLocaleString() + suffix);

    useEffect(() => {
        const controls = animate(count, to, {
            duration: duration,
            ease: "easeOut",
            onUpdate: (latest) => {
                setDisplayValue(Math.floor(latest).toLocaleString() + suffix);
            }
        });
        return () => controls.stop();
    }, [count, to, duration, suffix]);

    return <span className="font-mono">{displayValue}</span>;
}

export default function Statistics() {
    const stats = [
        {
            label: 'Active System Operators',
            targetNum: 10000,
            suffix: '+',
            description: 'Global creators, managers, and designers driving content nodes daily.',
            icon: Users,
            iconColor: 'text-indigo-600 bg-indigo-50',
        },
        {
            label: 'Autonomous Words Compiled',
            targetNum: 500000,
            suffix: '+',
            description: 'Production-ready copy generated, reviewed, and optimized by background agents.',
            icon: FileText,
            iconColor: 'text-emerald-600 bg-emerald-50',
        },
        {
            label: 'Average Task Efficiency',
            targetNum: 88,
            suffix: '%',
            description: 'Reduction in manual writing draft overhead reported by enterprise workspaces.',
            icon: Zap,
            iconColor: 'text-amber-600 bg-amber-50',
        }
    ];

    return (
        <section className="relative w-full bg-white px-4 py-24 sm:px-6 lg:px-8 border-t border-gray-100 overflow-hidden">

            {/* Structural visual anchor lines matching image_98fd81.png dashboard canvas geometry */}
            <div className="absolute top-0 left-1/3 w-px h-full bg-gray-50/60 pointer-events-none hidden lg:block" />
            <div className="absolute top-0 left-2/3 w-px h-full bg-gray-50/60 pointer-events-none hidden lg:block" />

            <div className="mx-auto max-w-7xl relative z-10">

                {/* Section Heading Setup */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <p className="text-xs font-semibold tracking-wider text-indigo-600 uppercase mb-3">System Metrics</p>
                    <h2 className="text-3xl font-extrabold tracking-tight text-[#0B1220]">
                        Trusted to automate multi-channel copy at scale
                    </h2>
                </div>

                {/* Metric Cards Container Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {stats.map((stat, idx) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={idx}
                                className="flex flex-col justify-between p-6 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all duration-300 group"
                            >
                                <div>
                                    {/* Card Icon & Meta Header */}
                                    <div className="flex items-center justify-between mb-6">
                                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.iconColor}`}>
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50/50 px-2 py-0.5 rounded-full">
                                            <CheckCircle className="h-3 w-3" /> Live Verified
                                        </span>
                                    </div>

                                    {/* Main Animated Numeric Metrics Data Display */}
                                    <div className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#0B1220] mb-2">
                                        <AnimatedCounter to={stat.targetNum} suffix={stat.suffix} />
                                    </div>

                                    {/* Identifier Label */}
                                    <h3 className="text-sm font-bold text-gray-800 tracking-tight group-hover:text-indigo-600 transition-colors duration-200">
                                        {stat.label}
                                    </h3>

                                    {/* Detailed Description Subtext */}
                                    <p className="mt-2 text-xs text-gray-400 leading-relaxed">
                                        {stat.description}
                                    </p>
                                </div>

                                {/* Decorative Bottom Performance Bar Indicator */}
                                <div className="mt-6 pt-4 border-t border-gray-50">
                                    <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: '100%' }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 1.5, ease: "easeOut", delay: idx * 0.2 }}
                                            className="h-full bg-gradient-to-right from-indigo-500 to-indigo-600 rounded-full"
                                        />
                                    </div>
                                </div>

                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}