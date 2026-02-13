import { InnovXProject } from "@/types/schema";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Code2, Layers, Award } from "lucide-react";

interface InnovXCardProps {
    projects: InnovXProject[];
}

export function InnovXTab({ projects }: InnovXCardProps) {
    if (!projects || projects.length === 0) return <div className="p-6 text-center text-slate-500 dark:text-slate-400">No InnovX projects available.</div>;

    return (
        <div className="space-y-8">
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/50 p-6 rounded-2xl">
                <h3 className="text-lg font-bold text-amber-900 dark:text-amber-300 mb-2">InnovX: Build What Matters</h3>
                <p className="text-amber-800 dark:text-amber-400 text-sm">
                    These projects are designed to simulate real-world challenges faced by this company.
                    Completing these will give you a significant advantage in technical interviews.
                </p>
            </div>

            <div className="grid gap-6">
                {projects.map((project, index) => (
                    <div key={index} className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 hover:shadow-md dark:hover:shadow-slate-900/50 transition-shadow relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                            <Lightbulb className="w-32 h-32 dark:text-white" />
                        </div>

                        <div className="relative z-10">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${project.difficulty === 'Hard' ? 'bg-red-50 text-red-700 border-red-100 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900' :
                                                project.difficulty === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900' :
                                                    'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900'
                                            }`}>
                                            {project.difficulty} Difficulty
                                        </span>
                                        {project.tier_level && (
                                            <span className="flex items-center gap-1 text-xs font-bold text-purple-600 dark:text-purple-400">
                                                <Award className="w-3.5 h-3.5" /> {project.tier_level} Tier
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{project.project_name}</h3>
                                    <p className="text-slate-600 dark:text-slate-300 mt-2 max-w-3xl leading-relaxed">{project.description}</p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-100 dark:border-slate-800">
                                        <h4 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-3">
                                            <Layers className="w-4 h-4 text-primary" /> Real World Context
                                        </h4>
                                        <div className="space-y-3 text-sm">
                                            <div>
                                                <span className="text-slate-500 dark:text-slate-400 block text-xs font-bold uppercase mb-1">Problem Statement</span>
                                                <p className="text-slate-700 dark:text-slate-300 italic">"{project.problem_statement}"</p>
                                            </div>
                                            <div>
                                                <span className="text-slate-500 dark:text-slate-400 block text-xs font-bold uppercase mb-1">Relevance</span>
                                                <p className="text-slate-700 dark:text-slate-300">{project.real_world_relevance}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-100 dark:border-slate-800">
                                        <h4 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-3">
                                            <Code2 className="w-4 h-4 text-primary" /> Tech Stack & Skills
                                        </h4>

                                        <div className="mb-4">
                                            <span className="text-slate-500 dark:text-slate-400 block text-xs font-bold uppercase mb-2">Recommended Stack</span>
                                            <div className="flex flex-wrap gap-2">
                                                {[...(project.backend_technologies || []), ...(project.frontend_technologies || []), ...(project.ai_ml_technologies || [])].map(tech => (
                                                    <span key={tech} className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-700 dark:text-slate-200 text-xs font-medium">
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <span className="text-slate-500 dark:text-slate-400 block text-xs font-bold uppercase mb-2">Skills Mapped</span>
                                            <p className="text-sm text-slate-700 dark:text-slate-300">{project.skill_mapping}</p>
                                        </div>
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
