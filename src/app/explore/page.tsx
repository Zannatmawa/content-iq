import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Star, ChevronLeft, ChevronRight, FileText, Mail, Share2, Megaphone, Activity, Sparkles } from 'lucide-react';

// --- MOCK DATABASE ARRAY ---
const ALL_TEMPLATES = [
    { id: 1, name: 'SEO Long-Form Article Writer', desc: 'Generates optimized background structures, H2/H3 arrays, and organic text density hooks.', category: 'Blog', rating: 4.9, views: 12400, date: '2026-01-15', icon: FileText, color: 'text-indigo-600 bg-indigo-50' },
    { id: 2, name: 'Transactional Drip Email Drop', desc: 'Engineers deep sequence paths for conversion sequences, retention nudges, and sales leads.', category: 'Email', rating: 4.7, views: 9800, date: '2026-03-22', icon: Mail, color: 'text-amber-600 bg-amber-50' },
    { id: 3, name: 'LinkedIn Lead Positioning Magnet', desc: 'High-visibility structural formatting optimized explicitly for personal authority reach metrics.', category: 'Social Media', rating: 4.5, views: 8200, date: '2026-04-01', icon: Share2, color: 'text-emerald-600 bg-emerald-50' },
    { id: 4, name: 'Google Performance Max Ad Copy', desc: 'Generates variations of punchy headlines and descriptions built around click-through criteria.', category: 'Ad Copy', rating: 4.2, views: 14200, date: '2025-12-10', icon: Megaphone, color: 'text-rose-600 bg-rose-50' },
    { id: 5, name: 'Catchy Blog Pillar Hook Blueprint', desc: 'Spins absolute viral titles, introductory thesis setups, and quick scannable outlines.', category: 'Blog', rating: 3.9, views: 6100, date: '2026-05-14', icon: FileText, color: 'text-indigo-600 bg-indigo-50' },
    { id: 6, name: 'X / Twitter Authority Thread Engine', desc: 'Breaks long technical concepts down smoothly into interconnected micro-posts that maintain engagement.', category: 'Social Media', rating: 4.8, views: 11000, date: '2026-02-18', icon: Share2, color: 'text-emerald-600 bg-emerald-50' },
    { id: 7, name: 'Cold Enterprise Inbound Sequence', desc: 'B2B tailored email parameters targeting higher key stakeholder response ratios securely.', category: 'Email', rating: 4.6, views: 7400, date: '2026-01-20', icon: Mail, color: 'text-amber-600 bg-amber-50' },
    { id: 8, name: 'Meta Ad Scaler Suite', desc: 'Constructs pattern-interrupt copies, creative text layers, and quick target-audience variations.', category: 'Ad Copy', rating: 3.5, views: 5300, date: '2026-04-19', icon: Megaphone, color: 'text-rose-600 bg-rose-50' },
    { id: 9, name: 'Technical Product Update Log', desc: 'Transforms intricate raw dev change frameworks into clean, public changelog announcements.', category: 'Blog', rating: 4.4, views: 3200, date: '2026-05-02', icon: FileText, color: 'text-indigo-600 bg-indigo-50' },
    { id: 10, name: 'Weekly Newsletter Round-up Node', desc: 'Curated compilation structural framing meant for rapid community digest broadcasts.', category: 'Email', rating: 4.1, views: 4100, date: '2026-03-05', icon: Mail, color: 'text-amber-600 bg-amber-50' },
    { id: 11, name: 'Instagram Caption Context Carousel', desc: 'Compiles secondary structural content layouts combined with micro-call-to-actions smoothly.', category: 'Social Media', rating: 4.3, views: 6900, date: '2026-02-28', icon: Share2, color: 'text-emerald-600 bg-emerald-50' },
    { id: 12, name: 'Retargeting Retainer Text Blocks', desc: 'Direct response copy blueprints centered purely on driving returning customer checkout logic.', category: 'Ad Copy', rating: 4.0, views: 2900, date: '2025-11-20', icon: Megaphone, color: 'text-rose-600 bg-rose-50' },
    { id: 13, name: 'Affiliate Review Asset Compiler', desc: 'Structured analysis layouts that balance natural user value items cleanly with referral hooks.', category: 'Blog', rating: 4.7, views: 3800, date: '2026-05-20', icon: FileText, color: 'text-indigo-600 bg-indigo-50' },
    { id: 14, name: 'Product Launch Announcement Blast', desc: 'High-impact outbound copywriting layout for product reveal drops and waitlist alerts.', category: 'Email', rating: 4.9, views: 15100, date: '2026-05-25', icon: Mail, color: 'text-amber-600 bg-amber-50' }
];

export default function ExplorePage() {
    // --- STATE HEADERS ---
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedRating, setSelectedRating] = useState('All');
    const [selectedSort, setSelectedSort] = useState('Most Popular');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    // --- RENDERING FILTER LOGIC CORES ---
    const filteredAndSortedTemplates = useMemo(() => {
        let result = [...ALL_TEMPLATES];

        // 1. Fully Functional Name/Keyword Search Filter
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (t) => t.name.toLowerCase().includes(query) || t.desc.toLowerCase().includes(query)
            );
        }

        // 2. Category Drop Filter Execution
        if (selectedCategory !== 'All') {
            result = result.filter((t) => t.category === selectedCategory);
        }

        // 3. Star Level Rating Filter Execution
        if (selectedRating !== 'All') {
            const minRating = parseFloat(selectedRating);
            result = result.filter((t) => t.rating >= minRating);
        }

        // 4. Sorting Evaluation Logic Loop
        if (selectedSort === 'Most Popular') {
            result.sort((a, b) => b.views - a.views);
        } else if (selectedSort === 'Newest') {
            result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        } else if (selectedSort === 'Highest Rated') {
            result.sort((a, b) => b.rating - a.rating);
        }

        return result;
    }, [searchQuery, selectedCategory, selectedRating, selectedSort]);

    // --- PAGINATION MANAGEMENT ---
    const totalPages = Math.ceil(filteredAndSortedTemplates.length / itemsPerPage) || 1;

    // Safe adjust index if filters cut down results dramatically
    const sanitizedCurrentPage = Math.min(currentPage, totalPages);

    const paginatedTemplates = useMemo(() => {
        const startIndex = (sanitizedCurrentPage - 1) * itemsPerPage;
        return filteredAndSortedTemplates.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredAndSortedTemplates, sanitizedCurrentPage]);

    // Handle resetting active state page cleanly during filter clicks
    const handleCategoryChange = (cat) => {
        setSelectedCategory(cat);
        setCurrentPage(1);
    };

    const handleRatingChange = (rate) => {
        setSelectedRating(rate);
        setCurrentPage(1);
    };

    return (
        <div className="min-h-screen w-full bg-[#F8FAFC] px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">

                {/* Page Shell Header Title */}
                <div className="text-left mb-10">
                    <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider text-indigo-600">
                        <Sparkles className="h-4 w-4" />
                        <span>WriteFlow Automation Engine</span>
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-[#0B1220]">
                        Explore Task Templates
                    </h1>
                    <p className="mt-1 text-sm text-gray-400">
                        Deploy background agents instantly to run complex content generation operations autonomously.
                    </p>
                </div>

                {/* --- SYSTEM INTERACTIVE FILTER DOCK BAR --- */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm space-y-4 lg:space-y-0 lg:flex lg:items-center lg:justify-between lg:gap-4 mb-8">

                    {/* Functional Dynamic Search Input Bar */}
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                            placeholder="Search blueprint name or keyword..."
                            className="w-full pl-10 pr-4 py-2 text-sm text-[#0B1220] placeholder-gray-400 bg-gray-50/50 rounded-lg border border-gray-200 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all"
                        />
                    </div>

                    {/* Filters Select Drop Grid Node Array */}
                    <div className="grid grid-cols-2 sm:flex sm:items-center gap-3">

                        {/* Filter Element 1: Category */}
                        <div className="flex flex-col text-left">
                            <span className="text-[10px] uppercase font-bold text-gray-400 mb-1 px-1">Category</span>
                            <select
                                value={selectedCategory}
                                onChange={(e) => handleCategoryChange(e.target.value)}
                                className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-600 font-medium focus:outline-none focus:border-indigo-600"
                            >
                                <option value="All">All Categories</option>
                                <option value="Blog">Blog Posts</option>
                                <option value="Social Media">Social Media</option>
                                <option value="Email">Email Copy</option>
                                <option value="Ad Copy">Ad Copy</option>
                            </select>
                        </div>

                        {/* Filter Element 2: Star Rating Minimum */}
                        <div className="flex flex-col text-left">
                            <span className="text-[10px] uppercase font-bold text-gray-400 mb-1 px-1">Rating Minimum</span>
                            <select
                                value={selectedRating}
                                onChange={(e) => handleRatingChange(e.target.value)}
                                className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-600 font-medium focus:outline-none focus:border-indigo-600"
                            >
                                <option value="All">All Review States</option>
                                <option value="4.0">4★ and above</option>
                                <option value="3.0">3★ and above</option>
                            </select>
                        </div>

                        {/* Filter Element 3: Sorting Operations */}
                        <div className="flex flex-col text-left">
                            <span className="text-[10px] uppercase font-bold text-gray-400 mb-1 px-1">Sorting Index</span>
                            <select
                                value={selectedSort}
                                onChange={(e) => setSelectedSort(e.target.value)}
                                className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-600 font-medium focus:outline-none focus:border-indigo-600"
                            >
                                <option value="Most Popular">Most Popular</option>
                                <option value="Newest">Newest Launch</option>
                                <option value="Highest Rated">Highest Rated</option>
                            </select>
                        </div>

                    </div>
                </div>

                {/* --- 12 ITEM TEMPLATE CARD RENDERING GRID --- */}
                {paginatedTemplates.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {paginatedTemplates.map((template) => {
                            const Icon = template.icon;
                            return (
                                <div
                                    key={template.id}
                                    className="group flex flex-col justify-between bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-200"
                                >
                                    <div>
                                        {/* Top Meta Line Row */}
                                        <div className="flex items-center justify-between mb-4">
                                            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${template.color}`}>
                                                <Icon className="h-4 w-4" />
                                            </div>

                                            <div className="flex items-center gap-1.5">
                                                <div className="flex items-center text-amber-500 gap-0.5 text-xs font-bold">
                                                    <Star className="h-3 w-3 fill-amber-400 stroke-amber-400" />
                                                    <span>{template.rating}</span>
                                                </div>
                                                <span className="text-[10px] bg-gray-50 border border-gray-100 text-gray-400 px-2 py-0.5 rounded-md uppercase font-medium">
                                                    {template.category}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Template Context Data Info */}
                                        <h3 className="text-base font-bold text-[#0B1220] group-hover:text-indigo-600 text-left transition-colors truncate">
                                            {template.name}
                                        </h3>
                                        <p className="mt-2 text-xs text-gray-400 text-left line-clamp-3 leading-relaxed">
                                            {template.desc}
                                        </p>
                                    </div>

                                    {/* Foot Operational Metric Mapping Interface */}
                                    <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between text-[11px] font-medium text-gray-400">
                                        <span className="font-mono text-gray-300">
                                            {(template.views / 1000).toFixed(1)}k uses
                                        </span>
                                        <button className="text-indigo-600 font-bold hover:underline bg-transparent border-none p-0 cursor-pointer flex items-center gap-0.5">
                                            Run Node <span>→</span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    /* Empty Search Null Results Placeholder Match */
                    <div className="bg-white rounded-xl border border-gray-200 p-16 text-center max-w-xl mx-auto shadow-sm">
                        <div className="h-12 w-12 rounded-xl bg-gray-50 border border-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-4">
                            <Activity className="h-5 w-5" />
                        </div>
                        <h3 className="text-base font-bold text-[#0B1220]">No automation matrices matched</h3>
                        <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                            Your current query combination did not return any records. Try stripping your search criteria or altering filter parameters.
                        </p>
                        <button
                            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setSelectedRating('All'); }}
                            className="mt-5 px-4 py-2 rounded-lg bg-[#0B1220] text-xs text-white font-semibold hover:bg-opacity-90 transition-all"
                        >
                            Reset Terminal Parameters
                        </button>
                    </div>
                )}

                {/* --- SYSTEM FULLY FUNCTIONAL PAGINATION CONTROLS RIBBON --- */}
                <div className="mt-12 border-t border-gray-200 pt-6 flex items-center justify-between">

                    {/* Metadata Count Summary Text */}
                    <div className="text-xs text-gray-400 font-medium">
                        Showing <span className="font-bold text-gray-700">
                            {filteredAndSortedTemplates.length === 0 ? 0 : (sanitizedCurrentPage - 1) * itemsPerPage + 1}
                        </span> to <span className="font-bold text-gray-700">
                            {Math.min(sanitizedCurrentPage * itemsPerPage, filteredAndSortedTemplates.length)}
                        </span> of <span className="font-bold text-gray-700">{filteredAndSortedTemplates.length}</span> records
                    </div>

                    {/* Multi-Button Linear Navigation Array */}
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={sanitizedCurrentPage === 1}
                            className="p-2 border border-gray-200 bg-white rounded-lg text-gray-500 hover:text-[#0B1220] disabled:opacity-40 disabled:hover:text-gray-500 transition-all cursor-pointer"
                            aria-label="Previous Page"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>

                        {Array.from({ length: totalPages }).map((_, pageIdx) => {
                            const pageNumber = pageIdx + 1;
                            const isPageActive = sanitizedCurrentPage === pageNumber;
                            return (
                                <button
                                    key={pageNumber}
                                    onClick={() => setCurrentPage(pageNumber)}
                                    className={`h-8 w-8 text-xs font-bold rounded-lg transition-all border ${isPageActive
                                        ? 'bg-[#0B1220] text-white border-[#0B1220]'
                                        : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    {pageNumber}
                                </button>
                            );
                        })}

                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={sanitizedCurrentPage === totalPages}
                            className="p-2 border border-gray-200 bg-white rounded-lg text-gray-500 hover:text-[#0B1220] disabled:opacity-40 disabled:hover:text-gray-500 transition-all cursor-pointer"
                            aria-label="Next Page"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
}