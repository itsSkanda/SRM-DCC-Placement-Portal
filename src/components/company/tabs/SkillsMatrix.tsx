"use client";

import { useState, useMemo } from "react";
import { JobRoleDetailsJsonData } from "@/types/schema";
import { Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SkillsMatrixProps {
    hiringData: JobRoleDetailsJsonData | null;
}

// Skill set code → friendly label mapping (from schema)
const SKILL_LABELS: Record<string, string> = {
    DSA: "Data Structures & Algorithms",
    OOD: "Object-Oriented Design",
    SYSD: "System Design",
    OS: "Operating Systems",
    SQL: "Databases & SQL",
    APTI: "Aptitude & Reasoning",
    COMM: "Communication & HR",
    COD: "Coding Proficiency",
    Netw: "Networking",
    SWE: "Software Engineering",
    AI: "AI & Machine Learning",
    Cloud: "Cloud Computing",
};

// Bloom's Taxonomy columns
const BLOOM_LEVELS = [
    { code: "CU", label: "Conceptual Understanding", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    { code: "AP", label: "Application", color: "bg-blue-50 text-blue-700 border-blue-200" },
    { code: "AN", label: "Analysis", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
    { code: "EV", label: "Evaluation", color: "bg-purple-50 text-purple-700 border-purple-200" },
    { code: "CR", label: "Creation", color: "bg-rose-50 text-rose-700 border-rose-200" },
];

// Map skill code to its cognitive level for visual positioning
const SKILL_BLOOM_MAP: Record<string, string> = {
    APTI: "CU",
    COMM: "CU",
    COD: "AP",
    DSA: "AP",
    SQL: "AP",
    OS: "AP",
    Netw: "AP",
    OOD: "AN",
    SWE: "AN",
    SYSD: "EV",
    AI: "EV",
    Cloud: "CR",
};

export function SkillsMatrix({ hiringData }: SkillsMatrixProps) {
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [selectedRounds, setSelectedRounds] = useState<string[]>([]);

    const roles = hiringData?.job_role_details ?? [];

    // Extract all unique skills and rounds for filter dropdowns
    const allAvailableSkills = useMemo(() => {
        const skills = new Set<string>();
        roles.forEach(role => {
            (role.hiring_rounds ?? []).forEach(round => {
                (round.skill_sets ?? []).forEach(ss => skills.add(ss.skill_set_code));
            });
        });
        return Array.from(skills).sort();
    }, [roles]);

    const allAvailableRounds = useMemo(() => {
        const rounds = new Set<string>();
        roles.forEach(role => {
            (role.hiring_rounds ?? []).forEach(round => {
                if (round.round_name) rounds.add(round.round_name);
            });
        });
        return Array.from(rounds).sort();
    }, [roles]);

    // Aggregate unique skill codes and their questions based on active filters
    const skills = useMemo(() => {
        const skillMap = new Map<string, string[]>();

        roles.forEach(role => {
            (role.hiring_rounds ?? []).forEach(round => {
                // If round filter is active and this round isn't in it, skip
                if (selectedRounds.length > 0 && round.round_name && !selectedRounds.includes(round.round_name)) {
                    return;
                }

                (round.skill_sets ?? []).forEach(ss => {
                    // If skill filter is active and this skill isn't in it, skip
                    if (selectedSkills.length > 0 && !selectedSkills.includes(ss.skill_set_code)) {
                        return;
                    }

                    if (!skillMap.has(ss.skill_set_code)) {
                        skillMap.set(ss.skill_set_code, []);
                    }
                    if (ss.typical_questions) {
                        skillMap.get(ss.skill_set_code)!.push(ss.typical_questions);
                    }
                });
            });
        });

        return Array.from(skillMap.entries()).map(([code, questions]) => ({
            code,
            label: SKILL_LABELS[code] ?? code,
            bloomLevel: SKILL_BLOOM_MAP[code] ?? "AP",
            questions,
        })).sort((a, b) => a.code.localeCompare(b.code));
    }, [roles, selectedSkills, selectedRounds]);

    const toggleFilter = (item: string, type: 'skill' | 'round') => {
        if (type === 'skill') {
            setSelectedSkills(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
        } else {
            setSelectedRounds(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
        }
    };

    if (roles.length === 0 || (allAvailableSkills.length === 0 && allAvailableRounds.length === 0)) {
        return (
            <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center shadow-sm">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                    <Filter className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">No Skills Data</h3>
                <p className="text-slate-500 text-sm">There are no documented skill requirements for this company yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Filters Section */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-6">

                {/* Skill Filter */}
                <div className="flex-1 space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                        <Filter className="w-3.5 h-3.5" /> Filter by Skill
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {allAvailableSkills.map(skill => (
                            <button
                                key={skill}
                                onClick={() => toggleFilter(skill, 'skill')}
                                className={cn(
                                    "px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all",
                                    selectedSkills.includes(skill)
                                        ? "bg-primary text-white border-primary shadow-sm"
                                        : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-100"
                                )}
                            >
                                {skill}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Round Filter */}
                <div className="flex-1 space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                        <Filter className="w-3.5 h-3.5" /> Filter by Round Phase
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {allAvailableRounds.map(round => (
                            <button
                                key={round}
                                onClick={() => toggleFilter(round, 'round')}
                                className={cn(
                                    "px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all",
                                    selectedRounds.includes(round)
                                        ? "bg-primary text-white border-primary shadow-sm"
                                        : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-100"
                                )}
                            >
                                {round}
                            </button>
                        ))}
                    </div>
                </div>

            </div>

            {/* Active Filters Clear Row */}
            {(selectedSkills.length > 0 || selectedRounds.length > 0) && (
                <div className="flex items-center gap-3 bg-slate-50 px-4 py-3 rounded-xl border border-slate-200">
                    <span className="text-sm font-semibold text-slate-700">Active Filters:</span>
                    <div className="flex flex-wrap gap-2 flex-1">
                        {selectedSkills.map(s => (
                            <span key={`active-${s}`} className="inline-flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded-md text-xs font-bold shadow-sm">
                                {s}
                                <button onClick={() => toggleFilter(s, 'skill')} className="text-slate-400 hover:text-rose-500 transition-colors"><X className="w-3 h-3" /></button>
                            </span>
                        ))}
                        {selectedRounds.map(r => (
                            <span key={`active-${r}`} className="inline-flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded-md text-xs font-bold shadow-sm">
                                {r}
                                <button onClick={() => toggleFilter(r, 'round')} className="text-slate-400 hover:text-rose-500 transition-colors"><X className="w-3 h-3" /></button>
                            </span>
                        ))}
                    </div>
                    <button
                        onClick={() => { setSelectedSkills([]); setSelectedRounds([]); }}
                        className="text-xs font-bold text-slate-500 hover:text-slate-900 uppercase tracking-widest transition-colors"
                    >
                        Clear All
                    </button>
                </div>
            )}

            {skills.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">No matching skills</h3>
                    <p className="text-slate-500">Try adjusting or clearing your filters to see the matrix.</p>
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto bg-white rounded-2xl border border-slate-200 shadow-sm relative pt-4">
                        <table className="w-full min-w-[800px] border-collapse text-slate-900">
                            <thead>
                                <tr>
                                    <th className="text-left py-4 px-6 text-sm font-bold text-slate-500 border-b border-slate-200 w-[20%] uppercase tracking-wider">
                                        Skill Area
                                    </th>
                                    {BLOOM_LEVELS.map(level => (
                                        <th key={level.code} className="py-4 px-2 text-center border-b border-slate-200">
                                            <div className="flex flex-col items-center">
                                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">{level.code}</span>
                                                <span className={cn("text-xs font-bold px-3 py-1 rounded-full border shadow-sm", level.color)}>
                                                    {level.label}
                                                </span>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {skills.map((skill) => (
                                    <tr key={skill.code} className="group hover:bg-slate-50/70 transition-colors">
                                        <td className="py-5 px-6 border-b border-slate-100">
                                            <div className="font-bold text-slate-900">{skill.label}</div>
                                            <div className="text-xs text-slate-500 font-mono mt-1 font-semibold">{skill.code}</div>
                                        </td>
                                        {BLOOM_LEVELS.map(level => {
                                            const isMatch = skill.bloomLevel === level.code;
                                            return (
                                                <td key={level.code} className="py-5 px-2 text-center border-b border-slate-100 relative">
                                                    {isMatch ? (
                                                        <div className="group/cell relative inline-flex">
                                                            <div className={cn("w-10 h-10 flex items-center justify-center font-bold text-sm rounded-xl shadow-sm cursor-help hover:-translate-y-1 transition-transform border", level.color)}>
                                                                {level.code}
                                                            </div>
                                                            {skill.questions.length > 0 && (
                                                                <div className="absolute opacity-0 group-hover/cell:opacity-100 bottom-full left-1/2 -translate-x-1/2 mb-3 w-80 bg-slate-900 text-slate-100 text-xs p-4 rounded-xl shadow-xl z-50 pointer-events-none transition-opacity border border-slate-800">
                                                                    <div className="font-bold text-white mb-3 flex items-center justify-between">
                                                                        <span>Typical Questions</span>
                                                                        <span className="px-2 py-0.5 bg-slate-800 rounded-md text-[10px] uppercase tracking-wider">{skill.code}</span>
                                                                    </div>
                                                                    <ul className="space-y-3">
                                                                        {skill.questions.slice(0, 3).map((q, qi) => (
                                                                            <li key={qi} className="flex gap-2 items-start bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/50">
                                                                                <span className="text-primary font-bold shrink-0 mt-0.5">{qi + 1}.</span>
                                                                                <span className="line-clamp-3 leading-relaxed text-slate-300 font-medium">{q.split(';')[0]?.trim()}</span>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900 rotate-45 border-r border-b border-slate-800"></div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-200 mx-auto"></div>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Updated Legend mapping mapping */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mt-8">
                        <h4 className="font-bold text-slate-900 mb-4 uppercase tracking-widest text-xs">Taxonomy Legend</h4>
                        <div className="flex flex-wrap gap-x-8 gap-y-4">
                            {BLOOM_LEVELS.map(level => (
                                <div key={level.code} className="flex items-center gap-3">
                                    <div className={cn("w-8 h-8 flex items-center justify-center rounded-lg border font-bold text-xs shadow-sm shadow-slate-200/50", level.color)}>
                                        {level.code}
                                    </div>
                                    <div className="text-sm font-semibold text-slate-700">{level.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
