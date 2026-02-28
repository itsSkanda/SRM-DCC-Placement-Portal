import { Briefcase } from "lucide-react";
import HiringPageClient from "./HiringPageClient";

export const metadata = {
    title: "Hiring Rounds | SRM Placement Intelligence",
    description: "Browse hiring processes, role details, and interview rounds across all companies.",
};

export default function HiringPage() {
    return (
        <div className="space-y-8 pb-12 fade-in">
            {/* Hero */}
            <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-950 to-slate-900 text-white p-8 md:p-12 shadow-xl">
                <div className="relative z-10 max-w-2xl">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                            <Briefcase className="w-5 h-5 text-blue-300" />
                        </div>
                        <span className="text-xs font-semibold uppercase tracking-widest text-blue-300">
                            Hiring Intelligence
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-100 to-white">
                        Hiring Rounds & Roles
                    </h1>
                    <p className="text-slate-300 text-base md:text-lg leading-relaxed">
                        Explore every company&apos;s hiring process — role titles, compensation,
                        interview rounds, and the skill sets tested at each stage.
                    </p>
                </div>
                <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/15 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />
            </section>

            <section>
                <HiringPageClient />
            </section>
        </div>
    );
}
