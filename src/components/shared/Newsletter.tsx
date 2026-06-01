// "use client"

// import React, { useState } from 'react';
// import { Send, CheckCircle2, AlertCircle, Sparkles, Loader2 } from 'lucide-react';

// export default function NewsletterSignup() {
//     const [email, setEmail] = useState('');
//     const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
//     const [errorMessage, setErrorMessage] = useState('');

//     const validateEmail = (inputEmail) => {
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         return emailRegex.test(inputEmail);
//     };

//     const handleSubscribe = async (e) => {
//         e.preventDefault();
//         setErrorMessage('');

//         // 1. Structural Validation
//         if (!email.trim()) {
//             setStatus('error');
//             setErrorMessage('Email address field cannot be left empty.');
//             return;
//         }

//         if (!validateEmail(email)) {
//             setStatus('error');
//             setErrorMessage('Please include a valid email format (e.g., name@domain.com).');
//             return;
//         }

//         // 2. Mocking API Request Lifecycle
//         setStatus('loading');

//         setTimeout(() => {
//             // Simulating a perfect background processing loop sequence
//             setStatus('success');
//         }, 1200);
//     };

//     return (
//         <section className="w-full bg-white px-4 py-24 sm:px-6 lg:px-8 border-t border-gray-100 relative overflow-hidden">

//             {/* Background Aesthetic Elements (Matches the clean mesh styling from the layout flow) */}
//             <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

//             <div className="mx-auto max-w-4xl text-center relative z-10">

//                 {/* Decorative Internal Icon Hub */}
//                 <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 border border-gray-100 text-[#0B1220] mb-6">
//                     <Sparkles className="h-5 w-5 text-indigo-600" />
//                 </div>

//                 {/* Header Setup */}
//                 <h2 className="text-3xl font-extrabold tracking-tight text-[#0B1220] sm:text-4xl">
//                     Get agent optimization insights
//                 </h2>
//                 <p className="mx-auto mt-3 max-w-xl text-sm text-gray-500 leading-relaxed">
//                     Join our weekly briefing for production engineering strategies, advanced prompt parameters, and multi-channel system deep dives.
//                 </p>

//                 {/* Interactive Lifecycle Form Container */}
//                 <div className="mx-auto mt-10 max-w-md">
//                     {status !== 'success' ? (
//                         <form onSubmit={handleSubscribe} className="space-y-3" noValidate>
//                             <div className="relative flex items-center rounded-xl border border-gray-200 bg-white p-1.5 shadow-sm focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600 transition-all">

//                                 {/* Email Core Input */}
//                                 <input
//                                     type="email"
//                                     value={email}
//                                     onChange={(e) => {
//                                         setEmail(e.target.value);
//                                         if (status === 'error') setStatus('idle'); // Clear error state on type
//                                     }}
//                                     disabled={status === 'loading'}
//                                     placeholder="Enter your workspace email"
//                                     className="w-full bg-transparent px-3 py-2 text-sm text-[#0B1220] placeholder-gray-400 focus:outline-none disabled:opacity-50"
//                                 />

//                                 {/* Submit Action (Matches Main UI Action Button in image_98fd81.png) */}
//                                 <button
//                                     type="submit"
//                                     disabled={status === 'loading'}
//                                     className="flex items-center gap-2 rounded-lg bg-[#0B1220] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-opacity-90 active:scale-98 transition-all disabled:opacity-50 min-w-[110px] justify-center"
//                                 >
//                                     {status === 'loading' ? (
//                                         <Loader2 className="h-3.5 w-3.5 animate-spin" />
//                                     ) : (
//                                         <>
//                                             Subscribe
//                                             <Send className="h-3 w-3" />
//                                         </>
//                                     )}
//                                 </button>
//                             </div>

//                             {/* Dynamic Error Messaging Node */}
//                             {status === 'error' && (
//                                 <div className="flex items-center gap-2 px-3 text-left text-xs font-medium text-red-600 animate-in fade-in slide-in-from-top-1 duration-200">
//                                     <AlertCircle className="h-4 w-4 flex-shrink-0" />
//                                     <span>{errorMessage}</span>
//                                 </div>
//                             )}
//                         </form>
//                     ) : (

//                         /* 3. Smooth Success Feedback Template Component */
//                         <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-6 text-left shadow-sm animate-in zoom-in-95 duration-300">
//                             <div className="flex items-start gap-3.5">
//                                 <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
//                                 <div>
//                                     <h3 className="text-sm font-bold text-[#0B1220]">Pipeline Connected</h3>
//                                     <p className="mt-1 text-xs text-gray-500 leading-relaxed">
//                                         Success! We have mapped <span className="font-semibold text-gray-700">{email}</span> to our digest manifest. Expect your first engine optimization report next Tuesday.
//                                     </p>

//                                     {/* Reset workflow mimic for seamless testing validation loops */}
//                                     <button
//                                         onClick={() => { setStatus('idle'); setEmail(''); }}
//                                         className="mt-4 text-[11px] font-semibold text-indigo-600 hover:underline"
//                                     >
//                                         Register another pipeline node
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     )}

//                     {/* Bottom Compliance Framework Footer */}
//                     <p className="mt-4 text-[11px] text-gray-400 text-center">
//                         Zero noise. Safe data structures. Revoke permissions natively at any time.
//                     </p>
//                 </div>

//             </div>
//         </section>
//     );
// }