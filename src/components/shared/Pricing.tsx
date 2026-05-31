"use client";
import React, { useState } from 'react';
import { Check, X, HelpCircle, Sparkles } from 'lucide-react';

export default function Pricing() {
    const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' or 'annual'

    const plans = [
        {
            name: 'Free',
            description: 'Perfect for individual builders exploring autonomous agent mechanics.',
            price: { monthly: 0, annual: 0 },
            features: ['1 Workspace Node', '3 AI Agent Runs / day', 'Basic Template Access', 'Standard Rich-Text Editor'],
            cta: 'Get Started Free',
            popular: false,
        },
        {
            name: 'Pro',
            description: 'Engineered for dedicated content creators needing reliable background pipelines.',
            price: { monthly: 29, annual: 22 },
            features: ['3 Workspaces', 'Unlimited Agent Runs', 'All Custom Blueprints', 'Tone Rewriting Engine', 'Priority Processing Queue'],
            cta: 'Upgrade to Pro',
            popular: true, // Highlights with the #0B1220 brand color from image_98fd81.png
        },
        {
            name: 'Team',
            description: 'Complete infrastructure built for cross-functional brand operations.',
            price: { monthly: 79, annual: 59 },
            features: ['Unlimited Workspaces', 'Multi-Role User Governance', 'Advanced SEO Audit Agents', 'Shared Document Versioning', 'Dedicated API Token Node'],
            cta: 'Contact Sales',
            popular: false,
        }
    ];

    const comparisonMatrix = [
        { feature: 'Autonomous Background Agents', free: true, pro: true, team: true },
        { feature: 'Multi-Role Permissions Workspace', free: false, pro: false, team: true },
        { feature: 'Custom Tone Rewriting Persona Slots', free: '1 Active', pro: '5 Active', team: 'Unlimited' },
        { feature: 'SEO Audit Engine Suite', free: false, pro: true, team: true },
        { feature: 'Dedicated Account Token Bridge', free: false, pro: false, team: true },
        { feature: 'Operational Support SLA', free: 'Community', pro: 'Priority Email', team: '24/7 Slack Intercom' },
    ];

    return (
        <section className="w-full bg-[#F8FAFC] px-4 py-24 sm:px-6 lg:px-8 border-t border-gray-100">
            <div className="mx-auto max-w-7xl">

                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <p className="text-xs font-semibold tracking-wider text-indigo-600 uppercase mb-3">Predictable Scale</p>
                    <h2 className="text-3xl font-extrabold tracking-tight text-[#0B1220] sm:text-4xl">
                        Flexible packages built for every stage of growth
                    </h2>

                    {/* Billing Cycle Toggle Switch */}
                    <div className="mt-6 inline-flex items-center gap-2 bg-white p-1.5 rounded-xl border border-gray-200/80 shadow-sm">
                        <button
                            onClick={() => setBillingCycle('monthly')}
                            className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all ${billingCycle === 'monthly' ? 'bg-[#0B1220] text-white' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            Monthly billing
                        </button>
                        <button
                            onClick={() => setBillingCycle('annual')}
                            className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${billingCycle === 'annual' ? 'bg-[#0B1220] text-white' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            Annual billing
                            <span className="text-[10px] bg-emerald-50 text-emerald-600 font-bold px-1.5 py-0.5 rounded border border-emerald-200">
                                -25%
                            </span>
                        </button>
                    </div>
                </div>

                {/* 3 Tier Cards Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start mb-24">
                    {plans.map((plan, idx) => (
                        <div
                            key={idx}
                            className={`relative flex flex-col justify-between rounded-xl bg-white p-6 shadow-sm border transition-all ${plan.popular
                                ? 'border-indigo-600 ring-1 ring-indigo-600 scale-102 z-10 shadow-md'
                                : 'border-gray-200/60'
                                }`}
                        >
                            {plan.popular && (
                                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1 shadow">
                                    <Sparkles className="h-3 w-3" /> Recommended Node
                                </span>
                            )}

                            <div>
                                <h3 className="text-lg font-bold text-[#0B1220]">{plan.name}</h3>
                                <p className="mt-2 text-xs text-gray-400 min-h-[32px] leading-relaxed">{plan.description}</p>

                                {/* Rate Display */}
                                <div className="mt-5 flex items-baseline text-[#0B1220]">
                                    <span className="text-3xl font-extrabold tracking-tight">$</span>
                                    <span className="text-5xl font-extrabold tracking-tight">
                                        {billingCycle === 'monthly' ? plan.price.monthly : plan.price.annual}
                                    </span>
                                    <span className="ml-1 text-sm font-semibold text-gray-400">/month</span>
                                </div>

                                {/* Vertical Features Check Array */}
                                <ul className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                                    {plan.features.map((feat, fIdx) => (
                                        <li key={fIdx} className="flex items-start gap-2.5 text-xs text-gray-600">
                                            <Check className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                            <span>{feat}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Call to Action Trigger Button */}
                            <button className={`mt-8 w-full py-3 px-4 rounded-xl text-xs font-bold transition-all duration-200 ${plan.popular
                                ? 'bg-[#0B1220] text-white hover:bg-opacity-90 shadow-sm'
                                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                                }`}>
                                {plan.cta}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Granular Feature Comparison Matrix Section */}
                <div className="hidden lg:block">
                    <div className="text-left mb-8">
                        <h3 className="text-xl font-bold text-[#0B1220]">Compare core platform attributes</h3>
                        <p className="text-xs text-gray-400 mt-1">Review granular resource capabilities distributed across each distinct service tier block.</p>
                    </div>

                    <div className="overflow-hidden bg-white border border-gray-200/80 rounded-xl shadow-sm">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                    <th className="p-4 w-1/2">Capability Metrics</th>
                                    <th className="p-4 text-center">Free</th>
                                    <th className="p-4 text-center bg-indigo-50/40 text-indigo-900">Pro</th>
                                    <th className="p-4 text-center">Team</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                                {comparisonMatrix.map((row, rIdx) => (
                                    <tr key={rIdx} className="hover:bg-gray-50/60 transition-colors">
                                        <td className="p-4 font-medium text-[#0B1220] flex items-center gap-1.5">
                                            {row.feature}
                                        </td>

                                        {/* Free Evaluator */}
                                        <td className="p-4 text-center font-medium">
                                            {typeof row.free === 'boolean'
                                                ? (row.free ? <Check className="h-4 w-4 text-emerald-500 mx-auto" /> : <X className="h-4 w-4 text-gray-300 mx-auto" />)
                                                : <span className="text-gray-500">{row.free}</span>
                                            }
                                        </td>

                                        {/* Pro Evaluator */}
                                        <td className="p-4 text-center font-semibold bg-indigo-50/20 text-indigo-950">
                                            {typeof row.pro === 'boolean'
                                                ? (row.pro ? <Check className="h-4 w-4 text-indigo-600 mx-auto" /> : <X className="h-4 w-4 text-gray-300 mx-auto" />)
                                                : <span>{row.pro}</span>
                                            }
                                        </td>

                                        {/* Team Evaluator */}
                                        <td className="p-4 text-center font-medium">
                                            {typeof row.team === 'boolean'
                                                ? (row.team ? <Check className="h-4 w-4 text-emerald-500 mx-auto" /> : <X className="h-4 w-4 text-gray-300 mx-auto" />)
                                                : <span className="text-gray-500">{row.team}</span>
                                            }
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </section>
    );
}