import { Lightbulb } from "lucide-react";
import InnovXPageClient from "./InnovXPageClient";

export const metadata = {
    title: "InnovX Projects | SRM Placement Intelligence",
    description: "Browse real-world project challenges across all companies, powered by InnovX.",
};

export default function InnovXPage() {
    return (
        <div className="space-y-8 pb-12 fade-in">
            {/* Hero */}
            <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-amber-950 to-slate-900 text-white p-8 md:p-12 shadow-xl">
                <div className="relative z-10 max-w-2xl">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                            <Lightbulb className="w-5 h-5 text-amber-300" />
                        </div>
                        <span className="text-xs font-semibold uppercase tracking-widest text-amber-300">
                            InnovX
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-amber-100 to-white">
                        Build What Matters
                    </h1>
                    <p className="text-slate-300 text-base md:text-lg leading-relaxed">
                        Real-world project challenges curated for each company. Completing them
                        gives you a decisive edge in technical interviews — and proves you can
                        solve the problems these companies actually face.
                    </p>
                </div>

                {/* Decorative blobs */}
                <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-500/15 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />
            </section>

            {/* Dynamic content */}
            <section>
                <InnovXPageClient />
            </section>
        </div>
    );
}
