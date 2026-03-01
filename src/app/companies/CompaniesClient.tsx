"use client";

import { CompanyShortRow } from "@/lib/queries";
import Link from "next/link";
import Image from "next/image";
import { Users, TrendingUp, MapPin, Briefcase, Search, ChevronLeft, ChevronRight, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import React, { useState, useMemo, useEffect } from "react";
import { getCompanyTier, normalizeTier } from "@/../lib/tier-mappings";

interface CompaniesClientProps {
    rows: CompanyShortRow[];
}

export function CompaniesClient({ rows }: CompaniesClientProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const [selectedTier, setSelectedTier] = useState("All Tiers");
    const [sortOption, setSortOption] = useState("Name (A-Z)");
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 15;

    const categories = useMemo(() => {
        const uniqueCategories = new Set(rows.map(r => r.short_json?.category).filter(Boolean));
        return ["All Categories", ...Array.from(uniqueCategories as Set<string>).sort()];
    }, [rows]);

    const tiers = useMemo(() => {
        const uniqueTiers = new Set(rows.map(r => getCompanyTier(r.short_json?.name, r.short_json?.tier_level)).filter(Boolean));
        return ["All Tiers", ...Array.from(uniqueTiers as Set<string>).sort()];
    }, [rows]);

    const filteredAndSortedRows = useMemo(() => {
        let result = [...rows];

        // Filter by Search Query (Name, Short Name, Category)
        if (searchQuery.trim() !== "") {
            const query = searchQuery.toLowerCase();
            result = result.filter(r => {
                const nameMatch = r.short_json?.name?.toLowerCase().includes(query);
                const shortNameMatch = r.short_json?.short_name?.toLowerCase().includes(query);
                const categoryMatch = r.short_json?.category?.toLowerCase().includes(query);
                return nameMatch || shortNameMatch || categoryMatch;
            });
        }

        // Filter by Category
        if (selectedCategory !== "All Categories") {
            result = result.filter(r => r.short_json?.category === selectedCategory);
        }

        // Filter by Tier
        if (selectedTier !== "All Tiers") {
            result = result.filter(r => getCompanyTier(r.short_json?.name, r.short_json?.tier_level) === selectedTier);
        }

        // Sorting
        result.sort((a, b) => {
            const nameA = a.short_json?.name ?? '';
            const nameB = b.short_json?.name ?? '';
            const tierA = getCompanyTier(a.short_json?.name, a.short_json?.tier_level);
            const tierB = getCompanyTier(b.short_json?.name, b.short_json?.tier_level);
            const catA = a.short_json?.category ?? '';
            const catB = b.short_json?.category ?? '';

            if (sortOption === "Name (A-Z)") return nameA.localeCompare(nameB);
            if (sortOption === "Name (Z-A)") return nameB.localeCompare(nameA);
            if (sortOption === "Tier") {
                const tierCompare = tierA.localeCompare(tierB);
                return tierCompare !== 0 ? tierCompare : nameA.localeCompare(nameB);
            }
            if (sortOption === "Category") {
                const catCompare = catA.localeCompare(catB);
                return catCompare !== 0 ? catCompare : nameA.localeCompare(nameB);
            }
            return 0;
        });

        return result;
    }, [rows, searchQuery, selectedCategory, selectedTier, sortOption]);

    // Pagination
    const totalPages = Math.ceil(filteredAndSortedRows.length / rowsPerPage);
    const paginatedRows = useMemo(() => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        return filteredAndSortedRows.slice(startIndex, startIndex + rowsPerPage);
    }, [filteredAndSortedRows, currentPage]);

    // Reset page to 1 when filters change
    useEffect(() => {
        // eslint-disable-next-line
        setCurrentPage(1);
    }, [searchQuery, selectedCategory, selectedTier, sortOption]);

    if (rows.length === 0) {
        return (
            <div className="text-center py-24 text-slate-500">
                <Briefcase className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                <p className="text-lg font-medium text-slate-900">No companies found.</p>
                <p className="text-sm mt-1">The database is empty or unreachable.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Companies Directory</h1>
                    <p className="text-slate-500 mt-1">Browse and analyze top-tier companies in the network.</p>
                </div>
            </div>

            {/* Top Bar: Search & Filters */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col xl:flex-row gap-4 justify-between">

                {/* Search */}
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search by name, short name, or category..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 placeholder:text-slate-400"
                    />
                </div>

                {/* Filters Row */}
                <div className="flex flex-wrap items-center gap-3">
                    <select
                        className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer min-w-[140px]"
                        value={selectedTier}
                        onChange={(e) => setSelectedTier(e.target.value)}
                    >
                        {tiers.map((tier: string) => (
                            <option key={tier} value={tier}>{tier}</option>
                        ))}
                    </select>

                    <select
                        className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer min-w-[160px]"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        {categories.map((cat: string) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>

                    <div className="h-6 w-px bg-slate-200 hidden sm:block mx-1"></div>

                    <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                        <ChevronsUpDown className="w-4 h-4 text-slate-500" />
                        <select
                            className="bg-transparent text-sm font-medium text-slate-700 focus:outline-none cursor-pointer"
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                        >
                            <option>Name (A-Z)</option>
                            <option>Name (Z-A)</option>
                            <option>Tier</option>
                            <option>Category</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Results Info */}
            <div className="text-sm font-medium text-slate-500">
                {filteredAndSortedRows.length} {filteredAndSortedRows.length === 1 ? 'result' : 'results'} found
            </div>

            {/* Table View */}
            {filteredAndSortedRows.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-16 text-center shadow-sm">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                        <Search className="w-8 h-8 text-slate-300" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">No results found</h3>
                    <p className="text-slate-500 text-sm">Try adjusting your search or filters to find what you're looking for.</p>
                    <button
                        onClick={() => {
                            setSearchQuery("");
                            setSelectedCategory("All Categories");
                            setSelectedTier("All Tiers");
                            setSortOption("Name (A-Z)");
                        }}
                        className="mt-6 px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors rounded-lg text-sm font-medium"
                    >
                        Clear all filters
                    </button>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-slate-50 font-medium text-slate-500 border-b border-slate-200 sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Company</th>
                                    <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Tier</th>
                                    <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Category</th>
                                    <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Size</th>
                                    <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs text-right">Growth Rate</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {paginatedRows.map((row, index) => {
                                    const company = row.short_json;
                                    if (!company) return null;

                                    return (
                                        <tr
                                            key={row.company_id}
                                            className={cn(
                                                "group hover:bg-slate-50/70 transition-colors",
                                                index % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                                            )}
                                        >
                                            <td className="px-6 py-4">
                                                <Link href={`/companies/${row.company_id}`} className="flex items-center gap-4 outline-none">
                                                    <div className="relative w-10 h-10 bg-white rounded-lg border border-slate-200 p-1.5 shadow-sm overflow-hidden shrink-0 group-hover:border-primary/30 transition-colors">
                                                        <Image
                                                            src={(company.logo_url && company.logo_url.startsWith('http')) ? company.logo_url : `https://placehold.co/100x100?text=${encodeURIComponent(company.name?.charAt(0) ?? '?')}`}
                                                            alt={company.name ?? 'Company'}
                                                            fill
                                                            className="object-contain p-1"
                                                            unoptimized
                                                            onError={(e) => {
                                                                const target = e.target as HTMLImageElement;
                                                                target.srcset = "";
                                                                target.src = `https://placehold.co/100x100?text=${encodeURIComponent(company.name?.charAt(0) ?? '?')}`;
                                                            }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-900 group-hover:text-primary transition-colors">
                                                            {/* Highlight matching text if searching */}
                                                            {searchQuery ? (
                                                                <span dangerouslySetInnerHTML={{
                                                                    __html: (company.name || '').replace(
                                                                        new RegExp(`(${searchQuery})`, 'gi'),
                                                                        '<mark className="bg-yellow-200 text-slate-900 px-0.5 rounded">$1</mark>'
                                                                    )
                                                                }} />
                                                            ) : (
                                                                company.name ?? 'Not Available'
                                                            )}
                                                            {company.short_name && <span className="text-slate-400 font-medium ml-2 text-xs">({company.short_name})</span>}
                                                        </div>
                                                        <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5 line-clamp-1 max-w-xs">
                                                            <MapPin className="w-3 h-3" />
                                                            {company.office_locations ? company.office_locations.split(';').slice(0, 2).join(', ') : 'Location N/A'}
                                                        </div>
                                                    </div>
                                                </Link>
                                            </td>

                                            <td className="px-6 py-4">
                                                {(() => {
                                                    const displayTier = getCompanyTier(company.name, company.tier_level);
                                                    return displayTier ? (
                                                        <span className={cn(
                                                            "inline-flex font-bold px-2.5 py-1 rounded-md text-xs border uppercase tracking-wide",
                                                            displayTier.includes('1') ? "bg-purple-50 text-purple-700 border-purple-200" :
                                                                displayTier.includes('2') ? "bg-blue-50 text-blue-700 border-blue-200" :
                                                                    "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                        )}>
                                                            {displayTier}
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-400 text-sm italic">N/A</span>
                                                    );
                                                })()}
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                                                    {company.category ?? 'Not Available'}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                                    <Users className="w-4 h-4 text-slate-400" />
                                                    {company.employee_size ?? 'N/A'}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 text-right">
                                                {company.yoy_growth_rate ? (
                                                    <div className="inline-flex items-center text-sm font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
                                                        <TrendingUp className="w-3.5 h-3.5 mr-1" />
                                                        {company.yoy_growth_rate}
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-400 text-sm italic">N/A</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="px-6 py-4 flex items-center justify-between border-t border-slate-200 bg-slate-50/50">
                            <div className="text-sm text-slate-500">
                                Showing <span className="font-bold text-slate-900">{(currentPage - 1) * rowsPerPage + 1}</span> to <span className="font-bold text-slate-900">{Math.min(currentPage * rowsPerPage, filteredAndSortedRows.length)}</span> of <span className="font-bold text-slate-900">{filteredAndSortedRows.length}</span> entries
                            </div>

                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>

                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                                    .map((page, index, array) => (
                                        <React.Fragment key={page}>
                                            {index > 0 && array[index - 1] !== page - 1 && (
                                                <span className="px-2 text-slate-400">...</span>
                                            )}
                                            <button
                                                onClick={() => setCurrentPage(page)}
                                                className={cn(
                                                    "w-8 h-8 rounded-lg text-sm font-medium transition-colors border",
                                                    currentPage === page
                                                        ? "bg-primary text-white border-primary"
                                                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                                                )}
                                            >
                                                {page}
                                            </button>
                                        </React.Fragment>
                                    ))
                                }

                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
