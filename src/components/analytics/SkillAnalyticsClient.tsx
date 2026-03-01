"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { SkillTable } from "./SkillTable";
import { StrategicInsights } from "./StrategicInsights";
import type { SkillMasterRow, CompanySkillLevelRow } from "@/lib/skill-analytics";
import { Search, RefreshCcw, AlertCircle, Plus, X, Command, BarChart2, Keyboard } from "lucide-react";

interface AnalyticsPayload {
    skills: SkillMasterRow[];
    rows: CompanySkillLevelRow[];
}

export function SkillAnalyticsClient() {
    const cache = useRef<AnalyticsPayload | null>(null);
    const [payload, setPayload] = useState<AnalyticsPayload | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Vanguard Selector State
    const [selectedCompanies, setSelectedCompanies] = useState<CompanySkillLevelRow[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    const loadData = useCallback(async () => {
        if (cache.current) {
            setPayload(cache.current);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/skill-analytics");
            if (!res.ok) throw new Error(`Server error: ${res.status}`);
            const data: AnalyticsPayload = await res.json();
            cache.current = data;
            setPayload(data);
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Unknown error";
            console.error("[SkillAnalyticsClient]", msg);
            setError(msg);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const availableCompanies = useMemo(() => {
        if (!payload) return [];
        const q = searchQuery.trim().toLowerCase();

        // Exclude already selected
        const unselected = payload.rows.filter(r =>
            !selectedCompanies.some(s => s.id === r.id)
        );

        if (!q) return unselected.slice(0, 10); // Show top 10 default

        // Custom abbreviation mapping
        const abbreviations: Record<string, string[]> = {
            "tcs": ["tata consultancy services"],
            "cts": ["cognizant"],
            "wipro": ["wipro"],
            "ms": ["microsoft"],
            "fb": ["facebook"],
            "google": ["google", "alphabet"],
            "amzn": ["amazon"],
        };

        return unselected.filter(r => {
            const name = (r.companies ?? "").toLowerCase();
            // Check direct match
            if (name.includes(q)) return true;
            // Check abbreviation match
            if (abbreviations[q]?.some(full => name.includes(full))) return true;
            return false;
        }).slice(0, 10);
    }, [payload, searchQuery, selectedCompanies]);

    const MAX_SLOTS = 5;

    const addCompany = (company: CompanySkillLevelRow) => {
        if (selectedCompanies.length >= MAX_SLOTS) return;
        setSelectedCompanies(prev => [...prev, company]);
        setSearchQuery("");
        setIsSearching(false);
    };

    const removeCompany = (id: number) => {
        setSelectedCompanies(prev => prev.filter(c => c.id !== id));
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-40 gap-4">
                <div className="relative w-12 h-12">
                    <div className="absolute inset-0 rounded-full border-4 border-slate-200" />
                    <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin" />
                </div>
                <p className="text-slate-500 text-sm font-medium tracking-wide">
                    Initializing Vanguard Engine...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-32 gap-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center border border-rose-100">
                    <AlertCircle className="w-6 h-6 text-rose-500" />
                </div>
                <div className="text-center">
                    <p className="font-semibold text-slate-900">System Malfunction</p>
                    <p className="text-sm text-slate-500 mt-1">{error}</p>
                </div>
                <button
                    onClick={() => { cache.current = null; loadData(); }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm"
                >
                    <RefreshCcw className="w-4 h-4" /> Reboot Connection
                </button>
            </div>
        );
    }

    if (!payload || payload.rows.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-32 gap-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <Command className="w-8 h-8 text-slate-300 mb-2" />
                <p className="font-semibold text-slate-900">Database Empty</p>
                <p className="text-sm text-slate-500">No skill mappings available in the central repository.</p>
            </div>
        );
    }

    // Generate slots
    const slots = Array.from({ length: MAX_SLOTS }).map((_, i) => selectedCompanies[i] || null);

    return (
        <div className="space-y-8 fade-in">
            {/* Vanguard Selector Bench */}
            <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-3d relative z-20 transition-all duration-300">
                <div className="flex flex-col md:flex-row gap-6 items-start lg:items-center justify-between mb-8">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <Command className="w-5 h-5 text-primary" /> Vanguard Roster
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">Select targets to benchmark your skills ({selectedCompanies.length}/{MAX_SLOTS})</p>
                    </div>

                    {/* Magnetic Search Input */}
                    {selectedCompanies.length < MAX_SLOTS && (
                        <div className="relative w-full md:w-80">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                <Search className="w-4 h-4 text-slate-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Add company to roster..."
                                value={searchQuery}
                                onFocus={() => setIsSearching(true)}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setIsSearching(true);
                                }}
                                onBlur={() => setIsSearching(false)}
                                className="w-full pl-9 pr-4 py-2.5 bg-blue-50 border border-blue-100 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200/50 focus:border-blue-400/50 transition-all font-medium"
                            />

                            {/* Fuzzy Search Popover */}
                            {isSearching && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50">
                                    <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 bg-slate-50/50">
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Select Target</span>
                                        <div className="flex items-center gap-1.5 opacity-40">
                                            <Keyboard className="w-3 h-3 text-slate-400" />
                                            <span className="text-[9px] font-bold text-slate-400">ESC to close</span>
                                        </div>
                                    </div>
                                    {availableCompanies.length > 0 ? (
                                        <div className="p-1 max-h-[300px] overflow-y-auto custom-scrollbar">
                                            {availableCompanies.map(c => (
                                                <button
                                                    key={c.id}
                                                    onMouseDown={(e) => {
                                                        e.preventDefault(); // Prevent onBlur from triggering before selection
                                                        addCompany(c);
                                                    }}
                                                    className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-slate-700 hover:bg-slate-50 hover:text-primary flex items-center justify-between group transition-colors"
                                                >
                                                    <span className="font-medium truncate">{c.companies}</span>
                                                    <Plus className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-4 text-center text-sm text-slate-400">No targets found</div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Grid Bench */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 lg:gap-6">
                    {slots.map((c, i) => (
                        <div key={i} className="relative group perspective-1000">
                            {c ? (
                                // Filled Slot
                                <div className="h-28 bg-white border border-slate-200 rounded-xl flex flex-col items-center justify-center p-4 relative overflow-hidden transition-all duration-300 hover:border-blue-400/50 hover:shadow-md animate-in zoom-in-95">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />

                                    <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center mb-2">
                                        <span className="text-sm font-bold text-slate-900 uppercase">{c.companies?.substring(0, 2)}</span>
                                    </div>
                                    <span className="text-xs font-bold text-center text-slate-700 truncate w-full px-2" title={c.companies ?? ""}>
                                        {c.companies}
                                    </span>

                                    <button
                                        onClick={() => removeCompany(c.id!)}
                                        className="absolute top-2 right-2 w-6 h-6 bg-white text-slate-400 hover:text-rose-500 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-slate-200 hover:border-rose-200"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ) : (
                                // Empty Slot
                                <div className="h-28 rounded-xl border-2 border-dashed border-slate-100 bg-slate-50/30 flex flex-col items-center justify-center transition-all duration-300 hover:bg-blue-50/30 hover:border-blue-200">
                                    <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mb-2 transition-colors group-hover:bg-white group-hover:border-blue-100">
                                        <Plus className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
                                    </div>
                                    <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 group-hover:text-blue-500/70">Empty Slot</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Strategic Insights Analysis */}
            <StrategicInsights skills={payload.skills} companies={selectedCompanies} />

            {/* Matrix Heatmap */}
            <div className="relative z-10 transition-all duration-500 ease-out">
                {selectedCompanies.length === 0 ? (
                    <div className="h-[400px] bg-white border border-slate-100 rounded-3xl flex flex-col items-center justify-center text-slate-400 border-dashed shadow-3d transition-all duration-500">
                        <BarChart2 className="w-10 h-10 mb-4 opacity-20 text-slate-600" />
                        <p className="font-semibold text-slate-500">Awaiting Target Selection</p>
                        <p className="text-sm">Add companies to the Vanguard roster above to construct the skill matrix.</p>
                    </div>
                ) : (
                    <SkillTable skills={payload.skills} companies={selectedCompanies} />
                )}
            </div>
        </div>
    );
}
