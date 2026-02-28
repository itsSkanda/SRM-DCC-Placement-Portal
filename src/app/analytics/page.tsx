import { BarChart2 } from "lucide-react";
import { SkillAnalyticsClient } from "@/components/analytics/SkillAnalyticsClient";

export const metadata = {
    title: "Skill Analytics | SRM Placement Intelligence",
    description: "Cross-company skill level matrix powered by real Supabase data.",
};

export default function AnalyticsPage() {
    return (
        <div className="space-y-8 pb-12 fade-in">
            {/* Page header */}
            <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-950 to-slate-900 text-white p-8 md:p-12 shadow-xl">
                <div className="relative z-10 max-w-2xl">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                            <BarChart2 className="w-5 h-5 text-indigo-300" />
                        </div>
                        <span className="text-xs font-semibold uppercase tracking-widest text-indigo-300">
                            Skill Analytics
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-indigo-100 to-white">
                        Company Skill Matrix
                    </h1>
                    <p className="text-slate-300 text-base md:text-lg leading-relaxed">
                        Compare skill requirements across all companies at a glance. Each cell
                        shows the expected proficiency level — from Beginner to Expert.
                    </p>
                </div>

                {/* Decorative blobs */}
                <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />
            </section>

            {/* Data section */}
            <section>
                <SkillAnalyticsClient />
            </section>
        </div>
    );
}
