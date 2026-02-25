import { InnovXProject } from "@/types/schema";
import { Lightbulb, Code2, Layers, Award, Target, CheckCircle2 } from "lucide-react";

interface InnovXTabProps {
    projects: InnovXProject[];
}

export function InnovXTab({ projects }: InnovXTabProps) {
    if (!projects || projects.length === 0) {
        return (
            <div className="p-6 text-center text-slate-500 dark:text-slate-400">
                No InnovX projects available.
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/50 p-6 rounded-2xl">
                <h3 className="text-lg font-bold text-amber-900 dark:text-amber-300 mb-2">InnovX: Build What Matters</h3>
                <p className="text-amber-800 dark:text-amber-400 text-sm">
                    These projects simulate real-world challenges faced by this company.
                    Completing them gives you a significant advantage in technical interviews.
                </p>
            </div>

            <div className="grid gap-6">
                {projects.map((project, index) => (
                    <div key={index} className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 hover:shadow-md dark:hover:shadow-slate-900/50 transition-shadow relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                            <Lightbulb className="w-32 h-32 dark:text-white" />
                        </div>

                        <div className="relative z-10">
                            {/* Header */}
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                                <div>
                                    <div className="flex flex-wrap items-center gap-3 mb-2">
                                        {project.tier_level && (
                                            <span className="flex items-center gap-1 text-xs font-bold text-purple-600 dark:text-purple-400">
                                                <Award className="w-3.5 h-3.5" /> {project.tier_level}
                                            </span>
                                        )}
                                        {project.aligned_pillar_names?.map((pillar, pi) => (
                                            <span key={pi} className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/50">
                                                {pillar}
                                            </span>
                                        ))}
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{project.project_name ?? 'Not Available'}</h3>
                                    {project.innovation_objective && (
                                        <p className="text-primary font-medium mt-1 text-sm">{project.innovation_objective}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Left: Real World Context */}
                                <div className="space-y-4">
                                    <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-100 dark:border-slate-800">
                                        <h4 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-3">
                                            <Layers className="w-4 h-4 text-primary" /> Real World Context
                                        </h4>
                                        <div className="space-y-3 text-sm">
                                            {project.problem_statement && (
                                                <div>
                                                    <span className="text-slate-500 dark:text-slate-400 block text-xs font-bold uppercase mb-1">Problem Statement</span>
                                                    <p className="text-slate-700 dark:text-slate-300 italic">"{project.problem_statement}"</p>
                                                </div>
                                            )}
                                            {project.target_users && (
                                                <div>
                                                    <span className="text-slate-500 dark:text-slate-400 block text-xs font-bold uppercase mb-1">Target Users</span>
                                                    <p className="text-slate-700 dark:text-slate-300">{project.target_users}</p>
                                                </div>
                                            )}
                                            {project.differentiation_factor && (
                                                <div>
                                                    <span className="text-slate-500 dark:text-slate-400 block text-xs font-bold uppercase mb-1">Differentiation</span>
                                                    <p className="text-slate-700 dark:text-slate-300">{project.differentiation_factor}</p>
                                                </div>
                                            )}
                                            {project.business_value && (
                                                <div>
                                                    <span className="text-slate-500 dark:text-slate-400 block text-xs font-bold uppercase mb-1">Business Value</span>
                                                    <p className="text-slate-700 dark:text-slate-300">{project.business_value}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Success Metrics */}
                                    {(project.success_metrics ?? []).length > 0 && (
                                        <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-xl p-4 border border-emerald-100 dark:border-emerald-900/50">
                                            <h4 className="flex items-center gap-2 font-bold text-emerald-900 dark:text-emerald-300 mb-3 text-sm">
                                                <Target className="w-4 h-4" /> Success Metrics
                                            </h4>
                                            <ul className="space-y-1.5">
                                                {project.success_metrics!.map((metric, mi) => (
                                                    <li key={mi} className="flex items-center gap-2 text-sm text-emerald-800 dark:text-emerald-400">
                                                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> {metric}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                {/* Right: Tech Stack */}
                                <div className="space-y-4">
                                    <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-100 dark:border-slate-800">
                                        <h4 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-3">
                                            <Code2 className="w-4 h-4 text-primary" /> Tech Stack
                                        </h4>

                                        {(project.backend_technologies ?? []).length > 0 && (
                                            <div className="mb-3">
                                                <span className="text-slate-500 dark:text-slate-400 block text-xs font-bold uppercase mb-2">Backend</span>
                                                <div className="flex flex-wrap gap-2">
                                                    {project.backend_technologies!.map(tech => (
                                                        <TechBadge key={tech} tech={tech} />
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {(project.frontend_technologies ?? []).length > 0 && (
                                            <div className="mb-3">
                                                <span className="text-slate-500 dark:text-slate-400 block text-xs font-bold uppercase mb-2">Frontend</span>
                                                <div className="flex flex-wrap gap-2">
                                                    {project.frontend_technologies!.map(tech => (
                                                        <TechBadge key={tech} tech={tech} />
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {(project.ai_ml_technologies ?? []).length > 0 && (
                                            <div className="mb-3">
                                                <span className="text-slate-500 dark:text-slate-400 block text-xs font-bold uppercase mb-2">AI / ML</span>
                                                <div className="flex flex-wrap gap-2">
                                                    {project.ai_ml_technologies!.map(tech => (
                                                        <TechBadge key={tech} tech={tech} />
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Legacy field support */}
                                        {!project.backend_technologies?.length && !project.frontend_technologies?.length && project.skill_mapping && (
                                            <div>
                                                <span className="text-slate-500 dark:text-slate-400 block text-xs font-bold uppercase mb-2">Skills Mapped</span>
                                                <p className="text-sm text-slate-700 dark:text-slate-300">{project.skill_mapping}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end">
                                <button className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-semibold text-sm hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-lg shadow-slate-900/10 dark:shadow-white/5 active:scale-95 transform duration-100">
                                    Start Project
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function TechBadge({ tech }: { tech: string }) {
    return (
        <span className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-700 dark:text-slate-200 text-xs font-medium">
            {tech}
        </span>
    );
}
