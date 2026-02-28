"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import Image from "next/image";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CompanySearchResult {
    company_id: number;
    name: string;
    category: string;
    logo_url: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const MAX_RESULTS = 8;
const DEBOUNCE_MS = 200;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Case-insensitive filter against company name and category.
 * Trims whitespace and ignores special characters for robustness.
 */
function filterCompanies(
    companies: CompanySearchResult[],
    query: string
): CompanySearchResult[] {
    const q = query.trim().toLowerCase().replace(/[^a-z0-9\s]/gi, "");
    if (!q) return [];
    return companies
        .filter(
            (c) =>
                c.name.toLowerCase().includes(q) ||
                c.category.toLowerCase().includes(q)
        )
        .slice(0, MAX_RESULTS);
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SearchBar() {
    const router = useRouter();

    // All companies fetched once on mount
    const allCompanies = useRef<CompanySearchResult[]>([]);
    const [loading, setLoading] = useState(true);

    // Search state
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<CompanySearchResult[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);

    // Refs for DOM interaction
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // ── Fetch companies once ───────────────────────────────────────────────────
    useEffect(() => {
        let cancelled = false;
        async function load() {
            try {
                const res = await fetch("/api/search-companies");
                if (!res.ok) throw new Error("Failed to fetch companies");
                const data: CompanySearchResult[] = await res.json();
                if (!cancelled) {
                    allCompanies.current = data;
                }
            } catch (err) {
                console.error("[SearchBar] error loading companies:", err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();
        return () => { cancelled = true; };
    }, []);

    // ── Click-outside handler ─────────────────────────────────────────────────
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
                setActiveIndex(-1);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // ── Debounced filtering ───────────────────────────────────────────────────
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        setActiveIndex(-1);

        if (debounceTimer.current) clearTimeout(debounceTimer.current);

        debounceTimer.current = setTimeout(() => {
            const filtered = filterCompanies(allCompanies.current, value);
            setResults(filtered);
            // Only open the dropdown if there is a non-empty query
            setIsOpen(value.trim().length > 0);
        }, DEBOUNCE_MS);
    }, []);

    // ── Navigation ────────────────────────────────────────────────────────────
    const navigateTo = useCallback(
        (company: CompanySearchResult) => {
            router.push(`/companies/${company.company_id}`);
            setQuery("");
            setResults([]);
            setIsOpen(false);
            setActiveIndex(-1);
        },
        [router]
    );

    // ── Keyboard navigation ───────────────────────────────────────────────────
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (!isOpen) return;

            if (e.key === "ArrowDown") {
                e.preventDefault();
                setActiveIndex((prev) => Math.min(prev + 1, results.length - 1));
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActiveIndex((prev) => Math.max(prev - 1, -1));
            } else if (e.key === "Enter") {
                e.preventDefault();
                if (activeIndex >= 0 && results[activeIndex]) {
                    navigateTo(results[activeIndex]);
                }
            } else if (e.key === "Escape") {
                setIsOpen(false);
                setActiveIndex(-1);
                inputRef.current?.blur();
            }
        },
        [isOpen, results, activeIndex, navigateTo]
    );

    // ── Clear ─────────────────────────────────────────────────────────────────
    const handleClear = useCallback(() => {
        setQuery("");
        setResults([]);
        setIsOpen(false);
        setActiveIndex(-1);
        inputRef.current?.focus();
    }, []);

    // ─── Render ───────────────────────────────────────────────────────────────
    return (
        <div
            ref={containerRef}
            className="relative group w-full max-w-[320px]"
        >
            {/* ── Input ── */}
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none z-10" />

            <input
                ref={inputRef}
                id="navbar-search"
                type="text"
                role="combobox"
                aria-label="Search companies"
                aria-expanded={isOpen}
                aria-haspopup="listbox"
                aria-autocomplete="list"
                aria-controls="search-listbox"
                aria-activedescendant={
                    activeIndex >= 0 ? `search-option-${activeIndex}` : undefined
                }
                placeholder={loading ? "Loading…" : "Search companies…"}
                disabled={loading}
                value={query}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className="w-full pl-10 pr-8 py-2 bg-secondary/50 border border-transparent focus:bg-background focus:border-primary/20 rounded-full text-sm outline-none transition-all duration-200 placeholder:text-muted-foreground/70 disabled:opacity-50"
                autoComplete="off"
                spellCheck={false}
            />

            {/* Clear button */}
            {query && (
                <button
                    type="button"
                    aria-label="Clear search"
                    onClick={handleClear}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            )}

            {/* ── Dropdown ── */}
            {isOpen && (
                <div
                    id="search-listbox"
                    role="listbox"
                    aria-label="Company search results"
                    className="
                        absolute top-[calc(100%+6px)] left-0 right-0
                        bg-card border border-border rounded-xl shadow-xl
                        overflow-hidden z-50
                        animate-in fade-in slide-in-from-top-2 duration-150
                    "
                >
                    {results.length === 0 ? (
                        /* ── Empty state ── */
                        <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                            No companies found
                        </div>
                    ) : (
                        /* ── Results ── */
                        <ul className="py-1">
                            {results.map((company, index) => {
                                const isActive = index === activeIndex;
                                const logoSrc =
                                    company.logo_url && company.logo_url.startsWith("http")
                                        ? company.logo_url
                                        : `https://placehold.co/40x40?text=${encodeURIComponent(
                                            company.name.charAt(0)
                                        )}`;

                                return (
                                    <li
                                        key={company.company_id}
                                        id={`search-option-${index}`}
                                        role="option"
                                        aria-selected={isActive}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => navigateTo(company)}
                                            onMouseEnter={() => setActiveIndex(index)}
                                            className={`
                                                w-full flex items-center gap-3 px-3 py-2.5 text-left
                                                transition-colors duration-100 cursor-pointer
                                                ${isActive
                                                    ? "bg-primary/10 text-primary"
                                                    : "hover:bg-accent text-foreground"
                                                }
                                            `}
                                        >
                                            {/* Logo */}
                                            <div className="relative w-8 h-8 shrink-0 rounded-lg bg-white border border-border/50 overflow-hidden">
                                                <Image
                                                    src={logoSrc}
                                                    alt={company.name}
                                                    fill
                                                    className="object-contain p-1"
                                                    unoptimized
                                                    onError={(e) => {
                                                        const t = e.target as HTMLImageElement;
                                                        t.srcset = "";
                                                        t.src = `https://placehold.co/40x40?text=${encodeURIComponent(
                                                            company.name.charAt(0)
                                                        )}`;
                                                    }}
                                                />
                                            </div>

                                            {/* Text */}
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium leading-tight truncate">
                                                    {company.name}
                                                </p>
                                                {company.category && (
                                                    <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                                                        {company.category}
                                                    </p>
                                                )}
                                            </div>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}
