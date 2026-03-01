import { useState } from 'react';
import type { SkillMasterRow, CompanySkillLevelRow } from '@/lib/skill-analytics';
import { HelpCircle, ChevronUp, ChevronDown } from 'lucide-react';

// ─── Bloom's Taxonomy level config ──────────────────────────────────────────────

const LEVEL_CONFIG: Array<{
    keys: string[];
    code: string;
    text: string;
    full: string;
    badge: string;
    dot: string;
    score: number; // 1 to 10 mapped for the Strength Meter
}> = [
        {
            keys: ['ev', 'evaluation', 'expert', 'advanced+', 'advanced +'],
            code: 'EV',
            text: 'Evaluation',
            full: 'Justify trade-offs and evaluate competing solutions.',
            badge: 'bg-amber-50 text-amber-900 border-amber-200/50',
            dot: 'bg-amber-500',
            score: 10,
        },
        {
            keys: ['as', 'analysis', 'advanced', 'upper intermediate', 'upper-intermediate', 'high'],
            code: 'AS',
            text: 'Analysis',
            full: 'Compare approaches and identify components.',
            badge: 'bg-rose-50 text-rose-900 border-rose-200/50',
            dot: 'bg-rose-500',
            score: 8,
        },
        {
            keys: ['ap', 'application', 'intermediate', 'medium', 'moderate'],
            code: 'AP',
            text: 'Application',
            full: 'Implement code directly in standard scenarios.',
            badge: 'bg-emerald-50 text-emerald-900 border-emerald-200/50',
            dot: 'bg-emerald-500',
            score: 5,
        },
        {
            keys: ['cu', 'conceptual', 'beginner', 'basic', 'low', 'foundational'],
            code: 'CU',
            text: 'Conceptual',
            full: 'Define and explain foundational concepts.',
            badge: 'bg-blue-50 text-blue-900 border-blue-200/50',
            dot: 'bg-blue-500',
            score: 3,
        },
    ];

const LEGEND = LEVEL_CONFIG.slice().reverse();

function getLevelConfig(raw: string | null | undefined) {
    if (!raw) return null;
    const n = raw.trim().toLowerCase();
    for (const cfg of LEVEL_CONFIG) {
        if (cfg.keys.some((k) => n.includes(k))) return cfg;
    }
    return null;
}

export interface SkillTableProps {
    skills: SkillMasterRow[];
    companies: CompanySkillLevelRow[];
}

export function SkillTable({ skills, companies }: SkillTableProps) {
    const [sortCompanyId, setSortCompanyId] = useState<number | null>(null);
    const [sortDesc, setSortDesc] = useState<boolean>(true);

    if (companies.length === 0) return null;

    // Helper to find skill value with fuzzy key matching
    const getSkillValue = (company: CompanySkillLevelRow, skill: SkillMasterRow) => {
        const key = skill.short_name;
        if (company[key]) return company[key] as string;

        // Try lowercase/clean variant
        const cleanKey = key.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
        if (company[cleanKey]) return company[cleanKey] as string;

        // Try case-insensitive original
        const foundKey = Object.keys(company).find(k => k.toLowerCase() === key.toLowerCase());
        if (foundKey) return company[foundKey] as string;

        return undefined;
    };

    // Filter out rows (skills) that have NO data in ANY selected company to keep matrix clean
    const activeSkills = skills.filter(skill => {
        return companies.some(c => !!getSkillValue(c, skill));
    });

    // If sorting is active, sort the activeSkills
    const displaySkills = [...activeSkills];
    if (sortCompanyId) {
        const sortCompany = companies.find(c => c.id === sortCompanyId);
        if (sortCompany) {
            displaySkills.sort((a, b) => {
                const valA = getSkillValue(sortCompany, a);
                const valB = getSkillValue(sortCompany, b);

                const scoreA = getLevelConfig(valA)?.score ?? 0;
                const scoreB = getLevelConfig(valB)?.score ?? 0;

                if (scoreA === scoreB) return a.skill_set_name.localeCompare(b.skill_set_name);
                return sortDesc ? scoreB - scoreA : scoreA - scoreB;
            });
        }
    }

    const handleSort = (companyId: number) => {
        if (sortCompanyId === companyId) {
            if (!sortDesc) {
                setSortCompanyId(null); // default reset
            } else {
                setSortDesc(false);
            }
        } else {
            setSortCompanyId(companyId);
            setSortDesc(true);
        }
    };

    return (
        <div className="space-y-6 pt-6">

            {/* Legend (Vercel Style) */}
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-3d flex flex-col lg:flex-row lg:items-center gap-6">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">
                        Analysis Legend
                    </p>
                    <p className="text-sm font-medium text-slate-700">
                        Cognitive Depth (Bloom&apos;s Taxonomy)
                    </p>
                </div>
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3">
                    {LEGEND.map((item) => (
                        <div key={item.code} className="flex flex-col p-3 rounded-xl bg-slate-50/50 border border-slate-100 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${item.badge}`}>
                                    {item.code}
                                </span>
                                <span className="text-xs font-bold text-slate-500">{item.text}</span>
                            </div>
                            <p className="text-[10px] text-slate-400 leading-snug">{item.full}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* The Heatmap Matrix */}
            <div className="relative rounded-3xl border border-slate-100 bg-white shadow-3d overflow-x-auto overflow-y-auto max-h-[800px] custom-scrollbar">
                <table className="border-collapse text-sm w-full text-left">
                    <thead>
                        <tr>
                            {/* Sticky Top-Left Corner */}
                            <th
                                className="sticky top-0 left-0 z-40 bg-slate-50/95 backdrop-blur-xl px-6 py-4 border-b border-r border-slate-200 min-w-[280px]"
                                style={{ boxShadow: '2px 2px 10px rgba(0,0,0,0.05)' }}
                            >
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">Required Skills</span>
                                <span className="text-sm font-medium text-slate-700 mt-0.5 block">{displaySkills.length} Core Requirements</span>
                            </th>

                            {/* Sticky Top Vanguard Companies */}
                            {companies.map(company => (
                                <th
                                    key={company.id}
                                    className="sticky top-0 z-30 bg-slate-50/95 backdrop-blur-xl px-4 py-4 border-b border-r border-slate-200 min-w-[200px] align-bottom group cursor-pointer hover:bg-white transition-colors"
                                    onClick={() => handleSort(company.id!)}
                                >
                                    <div className="flex flex-col items-center justify-center relative">
                                        <div className="flex items-center justify-center w-8 h-8 rounded bg-white border border-slate-200 shadow-sm mb-3">
                                            <span className="text-xs font-bold text-slate-600">{company.companies?.substring(0, 1)}</span>
                                        </div>
                                        <span className="text-sm font-bold text-slate-800 truncate w-full text-center">
                                            {company.companies}
                                        </span>
                                        <div className="mt-2 text-slate-400 h-4 flex items-center justify-center">
                                            {sortCompanyId === company.id ? (
                                                sortDesc ? <ChevronDown className="w-4 h-4 text-primary" /> : <ChevronUp className="w-4 h-4 text-primary" />
                                            ) : (
                                                <span className="text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">Sort</span>
                                            )}
                                        </div>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {displaySkills.map(skill => (
                            <tr key={skill.short_name} className="group/row hover:bg-slate-50/50 transition-colors">

                                {/* Sticky Left Skill Column */}
                                <td
                                    className="sticky left-0 z-20 bg-white/95 backdrop-blur-xl px-6 py-4 border-r border-slate-200 group-hover/row:bg-slate-50 transition-colors"
                                    style={{ boxShadow: '2px 0 10px rgba(0,0,0,0.03)' }}
                                >
                                    <div className="flex flex-col gap-1">
                                        <span className="font-semibold text-slate-800">{skill.skill_set_name}</span>
                                        <span className="text-[10px] font-mono text-slate-400">{skill.short_name}</span>
                                    </div>
                                </td>

                                {companies.map(company => {
                                    const raw = getSkillValue(company, skill);
                                    const cfg = getLevelConfig(raw);

                                    return (
                                        <td
                                            key={`${company.id}-${skill.short_name}`}
                                            className="px-4 py-4 border-r border-slate-100 relative group/cell"
                                        >
                                            {cfg ? (
                                                <div className="flex flex-col gap-3">
                                                    {/* Badge and Text */}
                                                    <div className="flex items-center justify-between">
                                                        <span className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider ${cfg.badge}`}>
                                                            {cfg.code}
                                                        </span>
                                                        <span className="text-xs font-medium text-slate-600">{cfg.text}</span>
                                                    </div>

                                                    {/* Strength Meter Bar */}
                                                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner flex">
                                                        <div
                                                            className={`h-full ${cfg.dot} transition-all duration-1000 ease-out`}
                                                            style={{ width: `${(cfg.score / 10) * 100}%` }}
                                                        />
                                                    </div>

                                                    {/* Glassmorphic Deep-Dive Tooltip (Hover) */}
                                                    <div className="absolute top-1/2 left-full -translate-y-1/2 ml-4 w-64 p-4 rounded-xl bg-white backdrop-blur-xl border border-slate-200 shadow-2xl opacity-0 invisible group-hover/cell:opacity-100 group-hover/cell:visible transition-all z-50 pointer-events-none scale-95 group-hover/cell:scale-100 origin-left">
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <HelpCircle className="w-4 h-4 text-slate-400" />
                                                            <span className="text-xs font-bold text-slate-900 tracking-widest uppercase">Target Level</span>
                                                        </div>
                                                        <p className="text-sm text-slate-600 font-medium mb-4 leading-relaxed">
                                                            {cfg.full}
                                                        </p>
                                                        <div className="space-y-2">
                                                            <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                                                <span>Intensity</span>
                                                                <span>{cfg.score}/10</span>
                                                            </div>
                                                            <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden">
                                                                <div className={`h-full ${cfg.dot}`} style={{ width: `${(cfg.score / 10) * 100}%` }} />
                                                            </div>
                                                        </div>
                                                        {/* Little left triangle */}
                                                        <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 bg-white border-b border-l border-slate-200 rotate-45" />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center h-full opacity-20">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                                </div>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #cbd5e1;
                }
            `}</style>
        </div>
    );
}
