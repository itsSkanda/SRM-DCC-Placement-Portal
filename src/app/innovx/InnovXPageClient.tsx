"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import {
    Lightbulb, Search, RefreshCcw, AlertCircle,
    Code2, Layers, Award, ChevronRight, Building2
} from "lucide-react";
import type { InnovXProject } from "@/types/schema";

// ─── Types ──────────────────────────────────────────────────────────────────

interface InnovXCompanyEntry {
    id: number;
    company_id: number;
    company_name: string;
    projects: InnovXProject[];
}

// ─── Helpers ────────────────────────────────────────────────────────────────

const TIER_STYLES: Record<string, string> = {
    "Tier 1": "text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800",
    "Tier 2": "text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800",
    "Tier 3": "text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-950/40 border-green-200 dark:border-green-800",
};

function tierStyle(tier?: string) {
    if (!tier) return "text-slate-600 dark:text-slate-400 bg-secondary border-border";
    for (const [k, v] of Object.entries(TIER_STYLES)) {
        if (tier.toLowerCase().includes(k.toLowerCase())) return v;
    }
    return "text-slate-600 dark:text-slate-400 bg-secondary border-border";
}

// ─── Project Card ────────────────────────────────────────────────────────────

function ProjectCard({
    project,
    companyName,
    companyId,
}: {
    project: InnovXProject;
    companyName: string;
    companyId: number;
}) {
    const allTechs = [
        ...(project.backend_technologies ?? []),
        ...(project.frontend_technologies ?? []),
        ...(project.ai_ml_technologies ?? []),
    ].slice(0, 6);

    return (
        <div className="group bg-card border border-border rounded-2xl p-5 hover:shadow-lg hover:border-primary/30 transition-all duration-300 flex flex-col relative overflow-hidden">
            {/* Decorative glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 rounded-full blur-2xl group-hover:bg-amber-400/10 transition-all duration-500 pointer-events-none" />

            {/* Header row */}
            <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex flex-wrap gap-2 items-center">
                    {project.tier_level && (
                        <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${tierStyle(project.tier_level)}`}>
                            <Award className="w-3 h-3" />
                            {project.tier_level}
                        </span>
                    )}
                    {project.aligned_pillar_names?.slice(0, 2).map((p, i) => (
                        <span key={i} className="text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">
                            {p}
                        </span>
                    ))}
                </div>
            </div>

            {/* Project name */}
            <h3 className="font-bold text-foreground text-base leading-snug mb-1 group-hover:text-primary transition-colors line-clamp-2">
                {project.project_name}
            </h3>
            {project.innovation_objective && (
                <p className="text-xs text-primary font-medium mb-3 line-clamp-1">
                    {project.innovation_objective}
                </p>
            )}

            {/* Problem statement */}
            {project.problem_statement && (
                <div className="flex-1 mb-4">
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 italic">
                        &ldquo;{project.problem_statement}&rdquo;
                    </p>
                </div>
            )}

            {/* Tech badges */}
            {allTechs.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                    {allTechs.map((tech, i) => (
                        <span key={i} className="text-[11px] px-2 py-0.5 bg-secondary border border-border rounded-md font-medium text-muted-foreground">
                            {tech}
                        </span>
                    ))}
                </div>
            )}

            {/* Footer: company link */}
            <div className="mt-auto pt-3 border-t border-border/50 flex items-center justify-between">
                <Link
                    href={`/companies/${companyId}`}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors group/link"
                >
                    <Building2 className="w-3.5 h-3.5" />
                    <span className="font-medium group-hover/link:underline line-clamp-1 max-w-[160px]">{companyName}</span>
                </Link>
                <Link
                    href={`/companies/${companyId}#innovx`}
                    className="flex items-center gap-1 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    View full <ChevronRight className="w-3.5 h-3.5" />
                </Link>
            </div>
        </div>
    );
}

// ─── Main client component ─────────────────────────────────────────────────

export default function InnovXPageClient() {
    const cache = useRef<InnovXCompanyEntry[] | null>(null);
    const [entries, setEntries] = useState<InnovXCompanyEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [query, setQuery] = useState("");
    const [selectedCompany, setSelectedCompany] = useState("All Companies");

    // ── Fetch ────────────────────────────────────────────────────────────────
    const load = useCallback(async () => {
        if (cache.current) { setEntries(cache.current); setLoading(false); return; }
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/innovx-all");
            if (!res.ok) throw new Error(`Server error ${res.status}`);
            const data: InnovXCompanyEntry[] = await res.json();
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

    const totalProjects = useMemo(() =>
        entries.reduce((s, e) => s + e.projects.length, 0), [entries]);

    // Flatten all projects with company context, then filter
    const filteredProjects = useMemo(() => {
        const q = query.trim().toLowerCase();
        return entries.flatMap((entry) =>
            (selectedCompany === "All Companies" || entry.company_name === selectedCompany)
                ? entry.projects
                    .filter((p) =>
                        !q ||
                        p.project_name.toLowerCase().includes(q) ||
                        p.innovation_objective?.toLowerCase().includes(q) ||
                        p.problem_statement?.toLowerCase().includes(q) ||
                        p.aligned_pillar_names?.some((pl) => pl.toLowerCase().includes(q))
                    )
                    .map((p) => ({ project: p, companyName: entry.company_name, companyId: entry.company_id }))
                : []
        );
    }, [entries, query, selectedCompany]);

    // ── States ───────────────────────────────────────────────────────────────
    if (loading) return (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
            <div className="relative w-12 h-12">
                <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
                <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin" />
            </div>
            <p className="text-muted-foreground text-sm font-medium">Loading InnovX projects…</p>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
            <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="w-7 h-7 text-destructive" />
            </div>
            <p className="font-semibold text-foreground">Failed to load projects</p>
            <p className="text-sm text-muted-foreground">{error}</p>
            <button
                onClick={() => { cache.current = null; load(); }}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
                <RefreshCcw className="w-4 h-4" /> Retry
            </button>
        </div>
    );

    if (entries.length === 0) return (
        <div className="flex flex-col items-center justify-center py-40 gap-3 text-muted-foreground">
            <Lightbulb className="w-10 h-10 opacity-30" />
            <p className="font-medium text-foreground">No InnovX data found</p>
            <p className="text-sm">Make sure the innovx_json table is populated.</p>
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
                        <p className="text-3xl font-bold text-foreground">{totalProjects}</p>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mt-0.5">Projects</p>
                    </div>
                    {(query || selectedCompany !== "All Companies") && (
                        <>
                            <div className="w-px h-8 bg-border" />
                            <div>
                                <p className="text-3xl font-bold text-primary">{filteredProjects.length}</p>
                                <p className="text-xs text-muted-foreground uppercase tracking-wide mt-0.5">Matching</p>
                            </div>
                        </>
                    )}
                </div>

                <div className="flex gap-2 items-center flex-wrap">
                    {/* Company filter */}
                    <select
                        value={selectedCompany}
                        onChange={(e) => setSelectedCompany(e.target.value)}
                        className="bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer max-w-[220px] text-foreground"
                    >
                        {companyOptions.map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>

                    {/* Text search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search projects…"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-secondary/50 border border-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/20 transition-all placeholder:text-muted-foreground/60 w-52"
                        />
                    </div>
                </div>
            </div>

            {/* Grid of project cards */}
            {filteredProjects.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                    <p className="font-medium text-foreground">No projects match your filters</p>
                    <button
                        onClick={() => { setQuery(""); setSelectedCompany("All Companies"); }}
                        className="mt-2 text-sm text-primary hover:underline"
                    >
                        Clear filters
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {filteredProjects.map(({ project, companyName, companyId }, i) => (
                        <ProjectCard
                            key={`${companyId}-${i}`}
                            project={project}
                            companyName={companyName}
                            companyId={companyId}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
