import { CompanyFull, SkillEntry } from "@/types/schema";

interface SkillsMatrixProps {
    skills: SkillEntry[];
}

// Bloom's Levels for Dimension 1
const BLOOM_LEVELS = [
    { code: "CU", label: "Conceptual Understanding", p_min: 1, p_max: 3 },
    { code: "AP", label: "Application", p_min: 4, p_max: 6 },
    { code: "AN", label: "Analysis", p_min: 7, p_max: 8 },
    { code: "EV", label: "Evaluation", p_min: 9, p_max: 9 },
    { code: "CR", label: "Creation", p_min: 10, p_max: 10 },
];

export function SkillsMatrix({ skills }: SkillsMatrixProps) {
    if (!skills || skills.length === 0) return <div className="p-6 text-center text-slate-500 dark:text-slate-400">No skills analysis data available.</div>;

    return (
        <div className="space-y-6">
            <div className="bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 p-6 rounded-2xl">
                <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-300 mb-2">Skill Model (Bloom's Taxonomy × Proficiency)</h3>
                <p className="text-indigo-700 dark:text-indigo-400 text-sm">
                    This matrix maps required skills to their cognitive depth and proficiency level.
                    Hover over cells to see specific topics you need to master.
                </p>
            </div>

            <div className="overflow-x-auto pb-4">
                <table className="w-full min-w-[800px] border-collapse text-slate-900 dark:text-slate-200">
                    <thead>
                        <tr>
                            <th className="text-left py-4 px-4 text-sm font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 w-1/4">Skill Area</th>
                            {BLOOM_LEVELS.map(level => (
                                <th key={level.code} className="py-4 px-2 text-center border-b border-slate-200 dark:border-slate-800">
                                    <div className="flex flex-col items-center">
                                        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{level.code}</span>
                                        <span className="text-xs text-slate-600 dark:text-slate-300 font-medium px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-full">{level.label}</span>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {skills.map((skill, index) => (
                            <tr key={index} className="group hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                                <td className="py-4 px-4 border-b border-slate-100 dark:border-slate-800">
                                    <div className="font-bold text-slate-900 dark:text-white">{skill.skill_area}</div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="h-1.5 w-16 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary" style={{ width: `${(skill.rating / 10) * 100}%` }}></div>
                                        </div>
                                        <span className="text-xs font-bold text-primary">{skill.rating}/10</span>
                                    </div>
                                </td>
                                {BLOOM_LEVELS.map(level => {
                                    // Determine if this cell is active based on skill's bloom_level matching
                                    const isMatch = skill.bloom_level === level.code;

                                    return (
                                        <td key={level.code} className="py-4 px-2 text-center border-b border-slate-100 dark:border-slate-800 relative">
                                            {isMatch && (
                                                <div className="group/cell relative inline-flex">
                                                    <div className="px-3 py-1.5 bg-indigo-600 dark:bg-indigo-500 text-white font-bold text-xs rounded-lg shadow-sm cursor-help hover:scale-105 transition-transform">
                                                        {level.code} | L{Math.floor(skill.rating)}
                                                    </div>

                                                    {/* Hover Tooltip - High Z-Index, dark mode robust */}
                                                    <div className="absolute opacity-0 group-hover/cell:opacity-100 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-slate-900 dark:bg-black text-slate-100 text-xs p-3 rounded-xl shadow-xl z-50 pointer-events-none transition-opacity border border-slate-700">
                                                        <div className="font-bold text-white mb-1 border-b border-slate-700 pb-1">Required Topics</div>
                                                        <ul className="space-y-1 text-slate-300 list-disc list-inside">
                                                            {skill.topics.split(';').map((topic, i) => (
                                                                <li key={i}>{topic.trim()}</li>
                                                            ))}
                                                        </ul>
                                                        {/* Arrow */}
                                                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 dark:bg-black rotate-45 border-r border-b border-slate-700"></div>
                                                    </div>
                                                </div>
                                            )}
                                            {!isMatch && (
                                                <div className="w-2 h-2 rounded-full bg-slate-100 dark:bg-slate-800 mx-auto"></div>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
                {BLOOM_LEVELS.map(level => (
                    <div key={level.code} className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                        <div className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-1">{level.code}</div>
                        <div className="font-semibold text-slate-800 dark:text-slate-300 text-sm">{level.label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
