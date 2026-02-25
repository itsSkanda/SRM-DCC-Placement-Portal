import { JobRoleDetailsJsonData } from "@/types/schema";

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
    { code: "CU", label: "Conceptual Understanding" },
    { code: "AP", label: "Application" },
    { code: "AN", label: "Analysis" },
    { code: "EV", label: "Evaluation" },
    { code: "CR", label: "Creation" },
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
    if (!hiringData || !hiringData.job_role_details?.length) {
        return (
            <div className="p-6 text-center text-slate-500 dark:text-slate-400">
                No skills analysis data available.
            </div>
        );
    }

    // Aggregate unique skill codes and their questions across all roles & rounds
    const skillMap = new Map<string, string[]>();

    hiringData.job_role_details.forEach(role => {
        (role.hiring_rounds ?? []).forEach(round => {
            (round.skill_sets ?? []).forEach(ss => {
                if (!skillMap.has(ss.skill_set_code)) {
                    skillMap.set(ss.skill_set_code, []);
                }
                if (ss.typical_questions) {
                    skillMap.get(ss.skill_set_code)!.push(ss.typical_questions);
                }
            });
        });
    });

    const skills = Array.from(skillMap.entries()).map(([code, questions]) => ({
        code,
        label: SKILL_LABELS[code] ?? code,
        bloomLevel: SKILL_BLOOM_MAP[code] ?? "AP",
        questions,
    }));

    if (skills.length === 0) {
        return (
            <div className="p-6 text-center text-slate-500 dark:text-slate-400">
                No skill sets data found in hiring rounds.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 p-6 rounded-2xl">
                <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-300 mb-2">
                    Skill Model (Bloom's Taxonomy × Proficiency)
                </h3>
                <p className="text-indigo-700 dark:text-indigo-400 text-sm">
                    This matrix maps required skills to their cognitive depth.
                    Hover over cells to see typical interview questions.
                </p>
            </div>

            <div className="overflow-x-auto pb-4">
                <table className="w-full min-w-[800px] border-collapse text-slate-900 dark:text-slate-200">
                    <thead>
                        <tr>
                            <th className="text-left py-4 px-4 text-sm font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 w-1/4">
                                Skill Area
                            </th>
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
                                    <div className="font-bold text-slate-900 dark:text-white">{skill.label}</div>
                                    <div className="text-xs text-slate-400 dark:text-slate-500 font-mono mt-0.5">{skill.code}</div>
                                </td>
                                {BLOOM_LEVELS.map(level => {
                                    const isMatch = skill.bloomLevel === level.code;
                                    return (
                                        <td key={level.code} className="py-4 px-2 text-center border-b border-slate-100 dark:border-slate-800 relative">
                                            {isMatch ? (
                                                <div className="group/cell relative inline-flex">
                                                    <div className="px-3 py-1.5 bg-indigo-600 dark:bg-indigo-500 text-white font-bold text-xs rounded-lg shadow-sm cursor-help hover:scale-105 transition-transform">
                                                        {level.code}
                                                    </div>
                                                    {skill.questions.length > 0 && (
                                                        <div className="absolute opacity-0 group-hover/cell:opacity-100 bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 bg-slate-900 dark:bg-black text-slate-100 text-xs p-3 rounded-xl shadow-xl z-50 pointer-events-none transition-opacity border border-slate-700">
                                                            <div className="font-bold text-white mb-2 border-b border-slate-700 pb-1">Typical Questions</div>
                                                            <ul className="space-y-2 text-slate-300">
                                                                {skill.questions.slice(0, 2).map((q, qi) => (
                                                                    <li key={qi} className="flex gap-1.5 items-start">
                                                                        <span className="text-indigo-400 shrink-0">•</span>
                                                                        <span className="line-clamp-3">{q.split(';')[0]?.trim()}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 dark:bg-black rotate-45 border-r border-b border-slate-700"></div>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
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
