import type { SkillMasterRow, CompanySkillLevelRow } from '@/lib/skill-analytics';

// ─── Bloom's Taxonomy level config ──────────────────────────────────────────────

const LEVEL_CONFIG: Array<{
    keys: string[];   // substrings / exact codes to match against lower-cased raw value
    code: string;
    full: string;
    badge: string;    // coloured badge classes for cells AND legend
    dot: string;
    text: string;     // readable label
}> = [
        {
            // EV — highest cognitive level
            keys: ['ev', 'evaluation', 'expert', 'advanced+', 'advanced +'],
            code: 'EV',
            text: 'Evaluation',
            full: 'Can the candidate justify trade-offs and evaluate competing solutions?',
            badge: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200 border-purple-200 dark:border-purple-700',
            dot: 'bg-purple-500',
        },
        {
            // AS — analysis
            keys: ['as', 'analysis', 'advanced', 'upper intermediate', 'upper-intermediate', 'high'],
            code: 'AS',
            text: 'Analysis',
            full: 'Can the candidate compare approaches and identify components / relationships?',
            badge: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200 border-orange-200 dark:border-orange-700',
            dot: 'bg-orange-500',
        },
        {
            // AP — application
            keys: ['ap', 'application', 'intermediate', 'medium', 'moderate'],
            code: 'AP',
            text: 'Application',
            full: 'Can the candidate implement code directly in a standard scenario?',
            badge: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200 border-green-200 dark:border-green-700',
            dot: 'bg-green-500',
        },
        {
            // CU — lowest: conceptual / recall
            keys: ['cu', 'conceptual', 'beginner', 'basic', 'low', 'foundational'],
            code: 'CU',
            text: 'Conceptual',
            full: 'Can the candidate define and explain concepts? (Recall / Understand)',
            badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 border-blue-200 dark:border-blue-700',
            dot: 'bg-blue-500',
        },
    ];

/** Legend items in ascending cognitive order */
const LEGEND = LEVEL_CONFIG.slice().reverse(); // CU → AP → AS → EV

// ─── Helpers ────────────────────────────────────────────────────────────────────

/**
 * Match raw cell value to a Bloom's level.
 * Uses includes() for all keys — lenient enough to handle full words,
 * short codes ("CU", "AP", "AS", "EV"), or mixed-format DB values.
 */
function getLevelConfig(raw: string | null | undefined) {
    if (!raw) return null;
    const n = raw.trim().toLowerCase();
    for (const cfg of LEVEL_CONFIG) {
        if (cfg.keys.some((k) => n.includes(k))) return cfg;
    }
    return null;
}

function humanize(key: string) {
    return key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

const EXCLUDED_KEYS = new Set([
    'id', 'companies', 'processed', 'processed_at',
    'error_message', 'created_at', 'updated_at',
]);

// ─── Props ──────────────────────────────────────────────────────────────────────

export interface SkillTableProps {
    skills: SkillMasterRow[];
    rows: CompanySkillLevelRow[];
}

// ─── Component ──────────────────────────────────────────────────────────────────

export function SkillTable({ skills, rows }: SkillTableProps) {
    if (rows.length === 0) {
        return (
            <div className="text-center py-20 text-muted-foreground">
                <p className="text-lg font-medium">No skill data available.</p>
                <p className="text-sm mt-1 opacity-70">
                    staging_company_skill_levels has no rows.
                </p>
            </div>
        );
    }

    // Build column list from skill_set_master (ordered) + any extras from data
    const firstRow = rows[0];
    const dataKeys = Object.keys(firstRow).filter((k) => !EXCLUDED_KEYS.has(k));
    const masterShortNames = new Set(skills.map((s) => s.short_name));

    const displayColumns: Array<{ key: string; label: string; description: string | null }> = [
        ...skills
            .filter((s) => dataKeys.includes(s.short_name))
            .map((s) => ({ key: s.short_name, label: s.skill_set_name, description: s.skill_set_description })),
        ...dataKeys
            .filter((k) => !masterShortNames.has(k))
            .map((k) => ({ key: k, label: humanize(k), description: null })),
    ];

    const columns = displayColumns.length > 0
        ? displayColumns
        : dataKeys.map((k) => ({ key: k, label: humanize(k), description: null }));

    return (
        <div className="space-y-6">

            {/* ── 1. Bloom's Legend — TOP ───────────────────────────────────────── */}
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                    Bloom&apos;s Taxonomy — Proficiency Legend
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {LEGEND.map((item) => (
                        <div key={item.code} className="flex gap-3 items-start p-3 rounded-xl bg-secondary/40 border border-border">
                            <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-[11px] font-bold border shrink-0 mt-0.5 ${item.badge}`}>
                                {item.code}
                            </span>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-foreground leading-tight">{item.text}</p>
                                <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">{item.full}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── 2. Sticky table ───────────────────────────────────────────────── */}
            {/*
                KEY sticky-fix notes:
                - The scroll container MUST have overflow-x-auto and a defined height/width
                - Sticky cells MUST have an explicit opaque background — NOT bg-inherit from a
                  semi-transparent parent row — otherwise scrolled content bleeds through
                - The sticky header uses z-30; sticky body cells use z-20; all other cells z-0
                - A right box-shadow on the sticky cell creates the "divider" illusion
            */}
            <div className="overflow-x-auto rounded-2xl border border-border shadow-sm">
                <table
                    className="border-collapse text-sm"
                    style={{ width: 'max-content', minWidth: '100%' }}
                >
                    <thead>
                        <tr>
                            {/* Sticky company th */}
                            <th
                                scope="col"
                                style={{ boxShadow: '2px 0 8px -2px rgba(0,0,0,0.12)' }}
                                className="
                                    sticky left-0 z-30
                                    bg-card
                                    px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider
                                    text-muted-foreground border-b border-r border-border
                                    w-48 min-w-[192px]
                                "
                            >
                                Company
                            </th>

                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    scope="col"
                                    title={col.description ?? col.label}
                                    className="
                                        px-3 py-3.5 border-b border-border
                                        bg-secondary/50 dark:bg-secondary/30
                                        w-36 min-w-[140px] max-w-[140px]
                                        align-bottom
                                    "
                                >
                                    <div className="flex flex-col items-center gap-0.5 text-center">
                                        {/* Wrapped label — no whitespace-nowrap, fixed width forces wrap */}
                                        <span className="text-foreground font-semibold text-[11px] leading-snug w-full break-words">
                                            {col.label}
                                        </span>
                                        <span className="font-mono text-[9px] text-muted-foreground/50 w-full text-center truncate">
                                            {col.key}
                                        </span>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {rows.map((row, rowIdx) => (
                            <tr
                                key={row.id ?? rowIdx}
                                className="group transition-colors"
                            >
                                {/*
                                    Sticky company td.
                                    CRITICAL: both normal AND hover backgrounds must be fully
                                    OPAQUE (no opacity fraction like /10 or /20). Any transparency
                                    lets scrolled content bleed through the sticky column.
                                    bg-card  →  opaque base
                                    group-hover:bg-secondary  →  opaque hover (no trailing /N)
                                */}
                                <td
                                    style={{ boxShadow: '2px 0 8px -2px rgba(0,0,0,0.10)' }}
                                    className="
                                        sticky left-0 z-20
                                        bg-card group-hover:bg-secondary
                                        px-4 py-3 border-b border-r border-border
                                        font-semibold text-foreground text-sm
                                        w-48 min-w-[192px] max-w-[192px] truncate
                                        transition-colors
                                    "
                                    title={row.companies ?? ''}
                                >
                                    {row.companies ?? '—'}
                                </td>

                                {columns.map((col) => {
                                    const raw = row[col.key] as string | null | undefined;
                                    const cfg = getLevelConfig(raw);

                                    return (
                                        <td
                                            key={col.key}
                                            className="px-3 py-3 text-center border-b border-border w-36 min-w-[140px] max-w-[140px] group-hover:bg-secondary/30 transition-colors"
                                            title={cfg ? `${cfg.code} – ${cfg.text}: ${cfg.full}` : (raw ?? 'No data')}
                                        >
                                            {cfg ? (
                                                /* ✅ Coloured Bloom's badge — always visible in the cell */
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${cfg.badge}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
                                                    {cfg.code}
                                                </span>
                                            ) : raw ? (
                                                /* Unrecognised value — show raw text in muted pill */
                                                <span className="text-[11px] text-muted-foreground px-2 py-0.5 bg-secondary rounded-full border border-border">
                                                    {String(raw).slice(0, 18)}
                                                </span>
                                            ) : (
                                                /* No data */
                                                <span className="block w-2 h-2 rounded-full bg-border/50 mx-auto" aria-label="No data" />
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
