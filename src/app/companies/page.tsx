"use client";

import { MOCK_COMPANIES } from "@/data/mock";
import Link from "next/link";
import Image from "next/image";
import { Users, TrendingUp, MapPin, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useMemo } from "react";

export default function CompaniesPage() {
    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const [sortOption, setSortOption] = useState("Sort by Name");

    // Extract unique categories dynamically from the data
    const categories = useMemo(() => {
        const uniqueCategories = new Set(MOCK_COMPANIES.map(c => c.category).filter(Boolean));
        return ["All Categories", ...Array.from(uniqueCategories).sort()];
    }, []);

    const filteredAndSortedCompanies = useMemo(() => {
        let result = [...MOCK_COMPANIES];

        // 1. Filter
        if (selectedCategory !== "All Categories") {
            result = result.filter(c => c.category === selectedCategory);
        }

        // 2. Sort
        result.sort((a, b) => {
            if (sortOption === "Sort by Name") {
                return a.name.localeCompare(b.name);
            } else if (sortOption === "Sort by Growth") {
                // Parse "12%" -> 12
                const growthA = parseFloat(a.yoy_growth_rate.toString().replace('%', '')) || 0;
                const growthB = parseFloat(b.yoy_growth_rate.toString().replace('%', '')) || 0;
                return growthB - growthA; // Descending
            }
            return 0;
        });

        return result;
    }, [selectedCategory, sortOption]);

    return (
        <div className="space-y-6 fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">All Companies</h1>
                    <p className="text-muted-foreground mt-1">Browse and analyze {filteredAndSortedCompanies.length} top-tier companies.</p>
                </div>

                {/* Filters */}
                <div className="flex gap-2">
                    <select
                        className="bg-card border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer max-w-[200px]"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    <select
                        className="bg-card border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                    >
                        <option>Sort by Name</option>
                        <option>Sort by Growth</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAndSortedCompanies.map((company) => (
                    <Link href={`/companies/${company.company_id}`} key={company.company_id} className="group">
                        <div className="bg-card rounded-2xl border border-border/60 p-5 h-full hover:shadow-xl hover:border-primary/30 transition-all duration-300 flex flex-col group-hover:-translate-y-1">

                            {/* Header: Logo & Category */}
                            <div className="flex justify-between items-start mb-4">
                                <div className="relative w-16 h-16 bg-white rounded-xl border border-border/50 p-2 shadow-sm group-hover:scale-105 transition-transform overflow-hidden shrink-0">
                                    <Image
                                        src={(company.logo_url && company.logo_url.startsWith('http')) ? company.logo_url : `https://placehold.co/100x100?text=${company.name.charAt(0)}`}
                                        alt={company.name}
                                        fill
                                        className="object-contain p-2"
                                        unoptimized
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.srcset = "";
                                            target.src = `https://placehold.co/100x100?text=${company.name.charAt(0)}`;
                                        }}
                                    />
                                </div>
                                <span
                                    className={cn(
                                        "text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wide max-w-[120px] truncate",
                                        "bg-slate-50 text-slate-700 border-slate-200" // Default neutral style for all, since categories are diverse
                                    )}
                                    title={company.category} // Tooltip for full text
                                >
                                    {company.category}
                                </span>
                            </div>

                            {/* Body: Name & Growth */}
                            <div className="mb-4">
                                <div className="flex items-center justify-between gap-2">
                                    <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1 flex-1" title={company.name}>
                                        {company.name}
                                    </h3>
                                    {company.yoy_growth_rate && (
                                        <div className="flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded shrink-0 max-w-[80px]">
                                            <TrendingUp className="w-3 h-3 mr-1 shrink-0" />
                                            <span className="truncate">{company.yoy_growth_rate}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="mt-auto space-y-2.5">
                                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                                    <Users className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-400" />
                                    <span className="truncate">{company.employee_size}</span>
                                </div>

                                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                                    <Briefcase className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-400" />
                                    <span className="line-clamp-1" title={company.operating_countries}>
                                        Op: {company.operating_countries.split(';').slice(0, 3).join(', ')}
                                    </span>
                                </div>

                                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                                    <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-400" />
                                    <span className="line-clamp-1" title={company.office_locations}>
                                        Loc: {company.office_locations.split(';').slice(0, 2).join(', ')}
                                    </span>
                                </div>
                            </div>

                            {/* Footer Action */}
                            <div className="mt-5 pt-3 border-t border-border/50 flex w-full">
                                <div className="w-full flex items-center justify-center gap-2 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                    View Details
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
