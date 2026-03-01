import { fetchHiringData, fetchCompanyFull } from "@/lib/queries";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Building2, Clock, CheckCircle2, MessageSquare, Code, Award, Target } from "lucide-react";

export default async function HiringRoundPage(props: { params: Promise<{ id: string, roundId: string }> }) {
    const params = await props.params;
    const companyId = parseInt(params.id, 10);
    const roundIdParams = params.roundId.split('-'); // Format: "roleIndex-roundIndex"

    if (isNaN(companyId) || roundIdParams.length !== 2) {
        notFound();
    }

    const roleIndex = parseInt(roundIdParams[0], 10);
    const roundIndex = parseInt(roundIdParams[1], 10);

    const [hiringData, companyData] = await Promise.all([
        fetchHiringData(companyId),
        fetchCompanyFull(companyId)
    ]);

    if (!hiringData || !companyData) {
        notFound();
    }

    const companyName = companyData.full_json.name;
    const role = hiringData.job_role_json.job_role_details?.[roleIndex];
    if (!role) notFound();

    const round = role.hiring_rounds?.[roundIndex];
    if (!round) notFound();

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20 fade-in">
            {/* Top Navigation Bar */}
            <div className="flex items-center gap-4 text-sm font-medium text-slate-500 mb-8 pt-4">
                <Link href={`/companies/${companyId}#hiring`} className="hover:text-slate-900 transition-colors flex items-center gap-1">
                    <ChevronLeft className="w-4 h-4" />
                    Back to {companyName} Hiring
                </Link>
            </div>

            {/* Header Section */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 uppercase tracking-wide flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5" />
                        Round {round.round_number ?? roundIndex + 1}
                    </span>
                    {round.evaluation_type && (
                        <span className={`text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide ${round.evaluation_type === 'HR' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'}`}>
                            {round.evaluation_type}
                        </span>
                    )}
                    {round.assessment_mode && (
                        <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 uppercase tracking-wide">
                            {round.assessment_mode}
                        </span>
                    )}
                </div>

                <h1 className="text-3xl font-bold text-slate-900 mb-2">{round.round_name ?? 'Interview Round'}</h1>
                <p className="text-slate-500 font-medium">For the role of <span className="text-slate-900">{role.role_title}</span></p>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-100">
                    <div className="space-y-1">
                        <div className="text-slate-400 text-xs uppercase font-bold tracking-wider flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Duration</div>
                        <div className="font-semibold text-slate-900">{round.duration ?? 'Not Specified'}</div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-slate-400 text-xs uppercase font-bold tracking-wider flex items-center gap-1.5"><Award className="w-3.5 h-3.5" /> Difficulty</div>
                        <div className="font-semibold text-slate-900">Moderate</div> {/* Placeholder as schema lacks direct difficulty */}
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="grid md:grid-cols-3 gap-8">

                {/* Left Column: Topics / Focus */}
                <div className="md:col-span-2 space-y-8">
                    {/* Primary Focus Area */}
                    {round.focus && (
                        <section className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
                                <Target className="w-5 h-5 text-primary" />
                                Primary Focus
                            </h2>
                            <p className="text-slate-600 leading-relaxed font-medium">
                                {round.focus}
                            </p>
                        </section>
                    )}

                    {/* Skill Sets & Topics Covered */}
                    {round.skill_sets && round.skill_sets.length > 0 && (
                        <section className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6">
                                <Code className="w-5 h-5 text-primary" />
                                Topics & Technical Requirements
                            </h2>
                            <div className="space-y-6">
                                {round.skill_sets.map((skill, idx) => (
                                    <div key={idx} className="bg-slate-50 p-5 rounded-xl border border-slate-100 relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-primary/20"></div>
                                        <div className="font-bold text-sm tracking-wide text-slate-900 uppercase mb-3 inline-block px-2.5 py-1 bg-white border border-slate-200 rounded-md shadow-sm">
                                            {skill.skill_set_code}
                                        </div>
                                        {skill.typical_questions && (
                                            <div className="mt-2 text-slate-600 font-medium">
                                                <div className="flex gap-2">
                                                    <MessageSquare className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                                                    <p className="italic leading-relaxed">{skill.typical_questions}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Typical Questions (Legacy Fallback) */}
                    {!round.skill_sets?.length && round.typical_questions && (
                        <section className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6">
                                <MessageSquare className="w-5 h-5 text-primary" />
                                Experience Shared
                            </h2>
                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 text-slate-700 italic leading-relaxed font-medium">
                                "{round.typical_questions}"
                            </div>
                        </section>
                    )}
                </div>

                {/* Right Column: Tips & Context */}
                <div className="space-y-6">
                    <div className="bg-blue-50/50 rounded-2xl border border-blue-100 p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl -mr-4 -mt-4"></div>
                        <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-blue-600" />
                            Preparation Context
                        </h3>
                        <ul className="space-y-3 text-sm text-blue-800 font-medium">
                            <li className="flex gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0"></div>
                                Make sure to revise core concepts thoroughly.
                            </li>
                            <li className="flex gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0"></div>
                                Expect deep-dive questions based on your resume.
                            </li>
                            <li className="flex gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0"></div>
                                Practice articulating past project challenges clearly.
                            </li>
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    );
}
