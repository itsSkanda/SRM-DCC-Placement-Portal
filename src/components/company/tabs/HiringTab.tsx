import { JobRoleDetailsJsonData } from "@/types/schema";
import { CheckCircle2, Clock, MessageSquare, Code, DollarSign } from "lucide-react";

interface HiringTabProps {
    hiringData: JobRoleDetailsJsonData | null;
}

export function HiringTab({ hiringData }: HiringTabProps) {
    const roles = hiringData?.job_role_details ?? [];

    if (roles.length === 0) {
        return (
            <div className="p-6 text-center text-slate-500 dark:text-slate-400">
                No hiring details available.
            </div>
        );
    }

    return (
        <div className="space-y-12">
            {roles.map((role, roleIndex) => (
                <div key={roleIndex} className="space-y-8">
                    {/* Role Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase tracking-wide">
                                    {role.opportunity_type ?? 'Employment'}
                                </span>
                                {role.role_category && (
                                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-300">
                                        {role.role_category}
                                    </span>
                                )}
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{role.role_title ?? 'Not Available'}</h2>
                            {role.job_description && (
                                <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm max-w-2xl line-clamp-2">{role.job_description}</p>
                            )}
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                            <div className="flex items-center gap-1 text-xl font-bold text-emerald-600 dark:text-emerald-400">
                                <DollarSign className="w-5 h-5" />
                                {role.ctc_or_stipend
                                    ? `₹${(role.ctc_or_stipend / 100000).toFixed(1)} LPA`
                                    : role.compensation ?? 'Not Available'}
                            </div>
                            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wide">
                                {role.compensation === 'Stipend' ? 'Monthly Stipend' : 'Annual CTC'}
                            </span>
                            {role.bonus && (
                                <p className="text-xs text-slate-500 dark:text-slate-400 text-right max-w-[200px] line-clamp-1" title={role.bonus}>
                                    + {role.bonus}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Benefits */}
                    {role.benefits_summary && (
                        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-100 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300">
                            <span className="font-semibold text-slate-900 dark:text-white mr-2">Benefits:</span>
                            {role.benefits_summary}
                        </div>
                    )}

                    {/* Timeline */}
                    <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 dark:before:via-slate-700 before:to-transparent">
                        {(role.hiring_rounds ?? []).map((round, index) => (
                            <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                {/* Icon/Dot */}
                                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white dark:border-slate-800 bg-slate-50 dark:bg-slate-900 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{round.round_number ?? index + 1}</span>
                                </div>

                                {/* Card */}
                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-bold text-slate-900 dark:text-white">{round.round_name ?? 'Not Available'}</h3>
                                        <div className="flex gap-2">
                                            {round.evaluation_type && (
                                                <span className={`text-xs font-bold px-2 py-1 rounded-md ${round.evaluation_type === 'HR' ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400' : 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400'}`}>
                                                    {round.evaluation_type}
                                                </span>
                                            )}
                                            {round.assessment_mode && (
                                                <span className="text-xs font-bold px-2 py-1 rounded-md bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                                    {round.assessment_mode}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Skill Sets */}
                                    {(round.skill_sets ?? []).length > 0 && (
                                        <div className="space-y-3 mt-3">
                                            {round.skill_sets!.map((skillSet, si) => (
                                                <div key={si} className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3 border border-slate-100 dark:border-slate-800">
                                                    <div className="flex gap-2 items-start">
                                                        <Code className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                                                        <div>
                                                            <span className="font-bold text-slate-900 dark:text-white text-xs uppercase block mb-1">
                                                                {skillSet.skill_set_code}
                                                            </span>
                                                            <div className="flex gap-2 items-start">
                                                                <MessageSquare className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                                                                <p className="text-slate-600 dark:text-slate-400 text-xs italic">
                                                                    "{skillSet.typical_questions ?? 'Not Available'}"
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Legacy: focus / typical_questions */}
                                    {!round.skill_sets?.length && round.focus && (
                                        <div className="text-sm text-slate-700 dark:text-slate-300 mt-2">
                                            <span className="font-semibold text-slate-900 dark:text-white">Focus:</span> {round.focus}
                                        </div>
                                    )}
                                    {!round.skill_sets?.length && round.typical_questions && (
                                        <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3 text-sm border border-slate-100 dark:border-slate-800 mt-2">
                                            <div className="flex gap-2 items-start">
                                                <MessageSquare className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                                                <p className="text-slate-600 dark:text-slate-400 italic">"{round.typical_questions}"</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
