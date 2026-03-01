import { cn } from "@/lib/utils";
import { JobRoleDetailsJsonData } from "@/types/schema";
import { CheckCircle2, Clock, MessageSquare, Code, DollarSign } from "lucide-react";

interface HiringTabProps {
    hiringData: JobRoleDetailsJsonData | null;
    companyId: number;
}

export function HiringTab({ hiringData, companyId }: HiringTabProps) {
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
                                <span className="h-6 px-2.5 rounded-full bg-blue-50 text-slate-950 text-[10px] font-black uppercase tracking-wider flex items-center justify-center shadow-sm border border-blue-200/50">
                                    {role.opportunity_type ?? 'Employment'}
                                </span>
                                {role.role_category && (
                                    <span className="h-6 px-2.5 rounded-full bg-blue-50 text-slate-950 text-[10px] font-black uppercase tracking-wider flex items-center justify-center shadow-sm border border-blue-200/50">
                                        {role.role_category}
                                    </span>
                                )}
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 leading-tight">{role.role_title ?? 'Not Available'}</h2>
                            {role.job_description && (
                                <p className="text-slate-600 mt-1 text-sm max-w-2xl line-clamp-2 leading-relaxed">{role.job_description}</p>
                            )}
                        </div>
                        <div className="flex flex-col items-end gap-0.5 shrink-0">
                            <div className="flex items-center gap-1 text-xl font-black text-slate-950">
                                <DollarSign className="w-5 h-5" />
                                {role.ctc_or_stipend
                                    ? `₹${(role.ctc_or_stipend / 100000).toFixed(1)} LPA`
                                    : role.compensation ?? 'Not Available'}
                            </div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                {role.compensation === 'Stipend' ? 'Monthly Stipend' : 'Annual CTC'}
                            </span>
                            {role.bonus && (
                                <p className="text-[10px] text-slate-400 text-right max-w-[200px] line-clamp-1" title={role.bonus}>
                                    + {role.bonus}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Benefits */}
                    {role.benefits_summary && (
                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-sm text-slate-600 shadow-sm">
                            <span className="font-bold text-slate-950 uppercase text-[10px] tracking-widest mr-3">Benefits</span>
                            {role.benefits_summary}
                        </div>
                    )}

                    {/* Hiring Rounds Index */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                        {(role.hiring_rounds ?? []).map((round, index) => (
                            <div key={index} className="card-3d p-6 flex flex-col h-full group">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-8 h-8 rounded-full bg-blue-50 text-slate-950 border border-blue-200 flex items-center justify-center text-xs font-black shadow-sm">
                                        {round.round_number ?? index + 1}
                                    </div>
                                    <div className="flex gap-2 flex-wrap justify-end">
                                        {round.evaluation_type && (
                                            <span className="h-6 px-2.5 rounded-md bg-blue-50 text-slate-950 text-[10px] uppercase font-black tracking-wider flex items-center shadow-sm border border-blue-200/50">
                                                {round.evaluation_type}
                                            </span>
                                        )}
                                        {round.assessment_mode && (
                                            <span className="h-6 px-2.5 rounded-md bg-slate-100 text-slate-950 text-[10px] uppercase font-black tracking-wider flex items-center shadow-sm border border-slate-200/50">
                                                {round.assessment_mode}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <h3 className="font-bold text-lg text-slate-950 mb-3 line-clamp-2 leading-snug">
                                    {round.round_name ?? 'Not Available'}
                                </h3>

                                <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100">
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                        {round.skill_sets?.length || 0} skill sets
                                    </span>
                                    {/* The unique identifier for rounds here will be roleIndex-roundIndex */}
                                    <a
                                        href={`/companies/${companyId}/hiring-round/${roleIndex}-${index}`}
                                        className="text-xs font-black text-primary hover:text-primary/80 flex items-center gap-1 group-hover:translate-x-1 transition-transform uppercase tracking-wider"
                                    >
                                        View Details
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
