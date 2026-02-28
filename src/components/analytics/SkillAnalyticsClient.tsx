"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { SkillTable } from "./SkillTable";
import type { SkillMasterRow, CompanySkillLevelRow } from "@/lib/skill-analytics";
import { Search, RefreshCcw, AlertCircle, BarChart2 } from "lucide-react";

// ─── API response shape ─────────────────────────────────────────────────────

interface AnalyticsPayload {
    skills: SkillMasterRow[];
    rows: CompanySkillLevelRow[];
}

// ─── Component ──────────────────────────────────────────────────────────────

export function SkillAnalyticsClient() {
    const cache = useRef<AnalyticsPayload | null>(null);
    const [payload, setPayload] = useState<AnalyticsPayload | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filterQuery, setFilterQuery] = useState("");

    // ── Fetch ────────────────────────────────────────────────────────────────
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

    // ── Client-side company filter ────────────────────────────────────────────
    // Filter uses the `companies` column which is the actual company name field
    const filteredRows = useMemo(() => {
        if (!payload) return [];
        const q = filterQuery.trim().toLowerCase();
        if (!q) return payload.rows;
        return payload.rows.filter((r) =>
            (r.companies ?? "").toLowerCase().includes(q)
        );
    }, [payload, filterQuery]);

    // ── Loading ───────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
                <div className="relative w-12 h-12">
                    <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
                    <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin" />
                </div>
                <p className="text-muted-foreground text-sm font-medium">
                    Loading skill analytics…
                </p>
            </div>
        );
    }

    // ── Error ─────────────────────────────────────────────────────────────────
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
                <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center">
                    <AlertCircle className="w-7 h-7 text-destructive" />
                </div>
                <div className="text-center">
                    <p className="font-semibold text-foreground">Failed to load data</p>
                    <p className="text-sm text-muted-foreground mt-1">{error}</p>
                </div>
                <button
                    onClick={() => { cache.current = null; loadData(); }}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                    <RefreshCcw className="w-4 h-4" />
                    Retry
                </button>
            </div>
        );
    }

    // ── Empty ─────────────────────────────────────────────────────────────────
    if (!payload || payload.rows.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-32 gap-3">
                <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center">
                    <BarChart2 className="w-7 h-7 text-muted-foreground opacity-50" />
                </div>
                <p className="font-semibold text-foreground">No data yet</p>
                <p className="text-sm text-muted-foreground">
                    staging_company_skill_levels has no rows.
                </p>
            </div>
        );
    }

    const totalCompanies = payload.rows.length;
    const totalSkills = payload.skills.length;

    // ── Main render ───────────────────────────────────────────────────────────
    return (
        <div className="space-y-6">
            {/* Stats + Filter bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                    <div>
                        <p className="text-3xl font-bold text-foreground">{totalCompanies}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 uppercase tracking-wide">Companies</p>
                    </div>
                    <div className="w-px h-8 bg-border" />
                    <div>
                        <p className="text-3xl font-bold text-foreground">{totalSkills}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 uppercase tracking-wide">Skill Columns</p>
                    </div>
                    {filterQuery && (
                        <>
                            <div className="w-px h-8 bg-border" />
                            <div>
                                <p className="text-3xl font-bold text-primary">{filteredRows.length}</p>
                                <p className="text-xs text-muted-foreground mt-0.5 uppercase tracking-wide">Matching</p>
                            </div>
                        </>
                    )}
                </div>

                {/* Company filter */}
                <div className="relative max-w-xs w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Filter companies…"
                        value={filterQuery}
                        onChange={(e) => setFilterQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-secondary/50 border border-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/20 transition-all placeholder:text-muted-foreground/60"
                        aria-label="Filter companies by name"
                    />
                </div>
            </div>

            {/* Table */}
            {filteredRows.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                    <p className="font-medium">No companies match &ldquo;{filterQuery}&rdquo;</p>
                    <button
                        onClick={() => setFilterQuery("")}
                        className="mt-2 text-sm text-primary hover:underline"
                    >
                        Clear filter
                    </button>
                </div>
            ) : (
                <SkillTable skills={payload.skills} rows={filteredRows} />
            )}
        </div>
    );
}
