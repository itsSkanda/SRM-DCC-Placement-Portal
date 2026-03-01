import { Rocket, Shield } from "lucide-react";
import { SkillAnalyticsClient } from "@/components/analytics/SkillAnalyticsClient";

export const metadata = {
    title: "Intelligence Portal | Directorate of Career Center",
    description: "Official Skill Matrix and Strategic Analysis powered by real Supabase data.",
};

export default function AnalyticsPage() {
    return (
        <div className="min-h-screen bg-white text-slate-900">
            <div className="max-w-[1600px] mx-auto space-y-12 p-4 sm:p-6 lg:p-8 pb-32 fade-in">

                {/* Page header - Professional White Style */}
                <section className="relative rounded-3xl overflow-hidden border border-slate-200 bg-white p-10 md:p-12 shadow-3d">
                    <div className="relative z-10 max-w-3xl flex flex-col gap-4">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 flex items-center justify-center p-2 shadow-3d overflow-hidden">
                                <img src="/brand/srmicon.png" alt="SRM Logo" className="w-full h-full object-contain" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-primary/60">
                                        Strategic Intelligence
                                    </span>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 uppercase">
                                    Directorate of Career Center
                                </h1>
                            </div>
                        </div>
                        <p className="text-slate-500 text-base md:text-lg leading-relaxed max-w-2xl mt-2 font-medium">
                            Select up to 5 target companies to populate the vanguard matrix. Discover overlapping requirements, pinpoint critical skill gaps, and optimize your preparation priority for the toughest interviews.
                        </p>
                    </div>
                </section>

                <section>
                    <SkillAnalyticsClient />
                </section>

            </div >
        </div >
    );
}

