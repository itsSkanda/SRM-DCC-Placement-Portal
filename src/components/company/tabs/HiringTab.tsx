import { RoleHiringDetails } from "@/types/schema";
import { CheckCircle2, Clock, MessageSquare, Code } from "lucide-react";

interface HiringTabProps {
    hiringRoles: RoleHiringDetails[];
}

export function HiringTab({ hiringRoles }: HiringTabProps) {
    if (!hiringRoles || hiringRoles.length === 0) return <div className="p-6 text-center text-slate-500 dark:text-slate-400">No hiring details available.</div>;

    return (
        <div className="space-y-12">
            {hiringRoles.map((role, roleIndex) => (
                <div key={roleIndex} className="space-y-8">
                    {/* Role Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{role.role_title}</h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-1">Standard Recruitment Process</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{role.compensation}</span>
                            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wide">Estimated Package</span>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 dark:before:via-slate-700 before:to-transparent">
                        {role.hiring_rounds.map((round, index) => (
                            <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                {/* Icon/Dot */}
                                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white dark:border-slate-800 bg-slate-50 dark:bg-slate-900 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{round.round_number}</span>
                                </div>

                                {/* Card */}
                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-bold text-slate-900 dark:text-white">{round.round_name}</h3>
                                        <span className={`text-xs font-bold px-2 py-1 rounded-md ${round.evaluation_type === 'Elimination' ? 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400' : 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400'
                                            }`}>
                                            {round.evaluation_type}
                                        </span>
                                    </div>

                                    <div className="space-y-3 mb-4">
                                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                            <Clock className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                                            <span>{round.duration} • {round.assessment_mode}</span>
                                        </div>
                                        <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                                            <span className="font-semibold text-slate-900 dark:text-white">Focus:</span> {round.focus}
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3 text-sm border border-slate-100 dark:border-slate-800">
                                        <div className="flex gap-2 items-start">
                                            <MessageSquare className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                                            <div>
                                                <span className="font-bold text-slate-900 dark:text-white block text-xs uppercase mb-1">Typical Questions</span>
                                                <p className="text-slate-600 dark:text-slate-400 italic">"{round.typical_questions}"</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
