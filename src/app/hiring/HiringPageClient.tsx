"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import {
    Search, RefreshCcw, AlertCircle, Briefcase,
    DollarSign, ChevronDown, ChevronUp, Building2,
    Clock, Code, MessageSquare, CheckCircle2
} from "lucide-react";
import type { JobRoleDetail, HiringRound } from "@/types/schema";

// ─── Types ──────────────────────────────────────────────────────────────────

interface HiringCompanyEntry {
    id: number;
    company_id: number;
    company_name: string;
    roles: JobRoleDetail[];
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatCTC(role: JobRoleDetail): string {
    if (role.ctc_or_stipend) return `₹${(role.ctc_or_stipend / 100000).toFixed(1)} LPA`;
    if (role.compensation && role.compensation !== 'Not Available') return role.compensation;
    return 'Not disclosed';
}

const EVAL_COLOURS: Record<string, string> = {
    Technical: "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300",
    HR: "bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400",
    Aptitude: "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300",
    Coding: "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-300",
    Managerial: "bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-300",
};
function evalColour(type?: string) {
    if (!type) return "bg-secondary text-muted-foreground border-border";
    for (const [k, v] of Object.entries(EVAL_COLOURS)) {
        if (type.toLowerCase().includes(k.toLowerCase())) return v;
    }
    return "bg-secondary text-foreground";
}

// ─── Round pill component (small summary) ───────────────────────────────────

function RoundPills({ rounds }: { rounds: HiringRound[] }) {
    return (
        <div className="flex flex-wrap gap-1.5">
            {rounds.map((r, i) => (
                <span key={i} className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${evalColour(r.evaluation_type)}`}>
                    R{r.round_number ?? i + 1} · {r.round_name}
                </span>
            ))}
        </div>
    );
}

// ─── Expandable role card ────────────────────────────────────────────────────

function RoleCard({ role, companyName, companyId }: {
    role: JobRoleDetail;
    companyName: string;
    companyId: number;
}) {
    const [expanded, setExpanded] = useState(false);
    const rounds = role.hiring_rounds ?? [];

    return (
        <div className="bg-card border border-border rounded-2xl overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-md group">
            {/* Card header — always visible */}
            <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap gap-2 mb-2">
                            {role.opportunity_type && (
                                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-secondary text-muted-foreground uppercase tracking-wide">
                                    {role.opportunity_type}
                                </span>
                            )}
                            {role.role_category && (
                                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                    {role.role_category}
                                </span>
                            )}
                        </div>
                        <h3 className="font-bold text-foreground text-base leading-snug group-hover:text-primary transition-colors">
                            {role.role_title ?? 'Role Not Available'}
                        </h3>
                        {role.job_description && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                                {role.job_description}
                            </p>
                        )}
                    </div>

                    {/* CTC */}
                    <div className="text-right shrink-0">
                        <div className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                            <DollarSign className="w-3.5 h-3.5" />
                            {formatCTC(role)}
                        </div>
                        {role.bonus && (
                            <p className="text-[11px] text-muted-foreground truncate max-w-[140px]" title={role.bonus}>
                                + {role.bonus}
                            </p>
                        )}
                    </div>
                </div>

                {/* Round pills summary */}
                {rounds.length > 0 && (
                    <div className="mb-3">
                        <RoundPills rounds={rounds} />
                    </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-border/50">
                    <Link
                        href={`/companies/${companyId}`}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors group/link"
                    >
                        <Building2 className="w-3.5 h-3.5" />
                        <span className="font-medium group-hover/link:underline">{companyName}</span>
                    </Link>

                    {rounds.length > 0 && (
                        <button
                            onClick={() => setExpanded((p) => !p)}
                            className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                        >
                            {expanded ? (
                                <><ChevronUp className="w-4 h-4" /> Collapse</>
                            ) : (
                                <><ChevronDown className="w-4 h-4" /> {rounds.length} Round{rounds.length !== 1 ? 's' : ''}</>
                            )}
                        </button>
                    )}
                </div>
            </div>

            {/* Expanded round timeline */}
            {expanded && rounds.length > 0 && (
                <div className="border-t border-border bg-secondary/20 px-5 py-4 space-y-3">
                    {rounds.map((round, ri) => (
                        <div key={ri} className="flex gap-3">
                            {/* Step number */}
                            <div className="flex flex-col items-center">
                                <div className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center text-xs font-bold text-foreground shrink-0">
                                    {round.round_number ?? ri + 1}
                                </div>
                                {ri < rounds.length - 1 && (
                                    <div className="w-px flex-1 bg-border mt-1" />
                                )}
                            </div>

                            {/* Round details */}
                            <div className="flex-1 pb-3">
                                <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                                    <span className="font-semibold text-sm text-foreground">
                                        {round.round_name ?? 'Round'}
                                    </span>
                                    <div className="flex gap-1.5">
                                        {round.evaluation_type && (
                                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${evalColour(round.evaluation_type)}`}>
                                                {round.evaluation_type}
                                            </span>
                                        )}
                                        {round.assessment_mode && (
                                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-secondary text-muted-foreground">
                                                {round.assessment_mode}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Skill sets */}
                                {(round.skill_sets ?? []).length > 0 && (
                                    <div className="space-y-2">
                                        {round.skill_sets!.map((ss, si) => (
                                            <div key={si} className="bg-card rounded-lg p-3 border border-border text-xs">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Code className="w-3.5 h-3.5 text-primary shrink-0" />
                                                    <span className="font-bold uppercase text-foreground">{ss.skill_set_code}</span>
                                                </div>
                                                {ss.typical_questions && (
                                                    <div className="flex gap-2 items-start pl-5">
                                                        <MessageSquare className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
                                                        <p className="text-muted-foreground italic line-clamp-2">"{ss.typical_questions}"</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Legacy fields */}
                                {!round.skill_sets?.length && round.focus && (
                                    <div className="flex gap-2 items-start text-xs text-muted-foreground">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                                        <span><span className="font-semibold text-foreground">Focus:</span> {round.focus}</span>
                                    </div>
                                )}
                                {!round.skill_sets?.length && round.typical_questions && (
                                    <div className="flex gap-2 items-start text-xs text-muted-foreground mt-1">
                                        <MessageSquare className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
                                        <p className="italic">"{round.typical_questions}"</p>
                                    </div>
                                )}
                                {round.duration && (
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                                        <Clock className="w-3.5 h-3.5" />
                                        {round.duration}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Main client component ──────────────────────────────────────────────────

export default function HiringPageClient() {
    const cache = useRef<HiringCompanyEntry[] | null>(null);
    const [entries, setEntries] = useState<HiringCompanyEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [query, setQuery] = useState("");
    const [selectedCompany, setSelectedCompany] = useState("All Companies");
    const [selectedType, setSelectedType] = useState("All Types");

    // ── Fetch ────────────────────────────────────────────────────────────────
    const load = useCallback(async () => {
        if (cache.current) { setEntries(cache.current); setLoading(false); return; }
        setLoading(true); setError(null);
        try {
            const res = await fetch("/api/hiring-all");
            if (!res.ok) throw new Error(`Server error ${res.status}`);
            const data: HiringCompanyEntry[] = await res.json();
            cache.current = data;
            setEntries(data);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    // ── Derived data ─────────────────────────────────────────────────────────
    const companyOptions = useMemo(() =>
        ["All Companies", ...entries.map((e) => e.company_name)], [entries]);

    const opportunityTypes = useMemo(() => {
        const types = new Set<string>();
        entries.forEach((e) => e.roles.forEach((r) => r.opportunity_type && types.add(r.opportunity_type)));
        return ["All Types", ...Array.from(types).sort()];
    }, [entries]);

    const totalRoles = useMemo(() =>
        entries.reduce((s, e) => s + e.roles.length, 0), [entries]);

    const filteredRoles = useMemo(() => {
        const q = query.trim().toLowerCase();
        return entries.flatMap((entry) =>
            (selectedCompany === "All Companies" || entry.company_name === selectedCompany)
                ? entry.roles
                    .filter((r) =>
                        (selectedType === "All Types" || r.opportunity_type === selectedType) &&
                        (!q ||
                            r.role_title?.toLowerCase().includes(q) ||
                            r.role_category?.toLowerCase().includes(q) ||
                            r.job_description?.toLowerCase().includes(q))
                    )
                    .map((r) => ({ role: r, companyName: entry.company_name, companyId: entry.company_id }))
                : []
        );
    }, [entries, query, selectedCompany, selectedType]);

    // ── States ───────────────────────────────────────────────────────────────
    if (loading) return (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
            <div className="relative w-12 h-12">
                <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
                <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin" />
            </div>
            <p className="text-muted-foreground text-sm font-medium">Loading hiring data…</p>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
            <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="w-7 h-7 text-destructive" />
            </div>
            <p className="font-semibold text-foreground">Failed to load hiring data</p>
            <p className="text-sm text-muted-foreground">{error}</p>
            <button onClick={() => { cache.current = null; load(); }}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                <RefreshCcw className="w-4 h-4" /> Retry
            </button>
        </div>
    );

    if (entries.length === 0) return (
        <div className="flex flex-col items-center justify-center py-40 gap-3 text-muted-foreground">
            <Briefcase className="w-10 h-10 opacity-30" />
            <p className="font-medium text-foreground">No hiring data found</p>
            <p className="text-sm">Make sure job_role_details_json is populated.</p>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Stats + Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                    <div>
                        <p className="text-3xl font-bold text-foreground">{entries.length}</p>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mt-0.5">Companies</p>
                    </div>
                    <div className="w-px h-8 bg-border" />
                    <div>
                        <p className="text-3xl font-bold text-foreground">{totalRoles}</p>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mt-0.5">Roles</p>
                    </div>
                    {(query || selectedCompany !== "All Companies" || selectedType !== "All Types") && (
                        <>
                            <div className="w-px h-8 bg-border" />
                            <div>
                                <p className="text-3xl font-bold text-primary">{filteredRoles.length}</p>
                                <p className="text-xs text-muted-foreground uppercase tracking-wide mt-0.5">Matching</p>
                            </div>
                        </>
                    )}
                </div>

                <div className="flex gap-2 flex-wrap items-center">
                    <select value={selectedCompany} onChange={(e) => setSelectedCompany(e.target.value)}
                        className="bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer max-w-[200px] text-foreground">
                        {companyOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>

                    <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}
                        className="bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer text-foreground">
                        {opportunityTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        <input type="text" placeholder="Search roles…" value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-secondary/50 border border-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/20 transition-all placeholder:text-muted-foreground/60 w-44" />
                    </div>
                </div>
            </div>

            {/* Role cards */}
            {filteredRoles.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                    <p className="font-medium text-foreground">No roles match your filters</p>
                    <button onClick={() => { setQuery(""); setSelectedCompany("All Companies"); setSelectedType("All Types"); }}
                        className="mt-2 text-sm text-primary hover:underline">
                        Clear filters
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {filteredRoles.map(({ role, companyName, companyId }, i) => (
                        <RoleCard key={`${companyId}-${i}`} role={role} companyName={companyName} companyId={companyId} />
                    ))}
                </div>
            )}
        </div>
    );
}
