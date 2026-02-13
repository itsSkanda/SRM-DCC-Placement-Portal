import { CompanyFull } from "@/types/schema";
import { Building2, Globe, TrendingUp, Users } from "lucide-react";

interface OverviewTabProps {
    company: CompanyFull;
}

export function OverviewTab({ company }: OverviewTabProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <section>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">About {company.short_name}</h2>
                    <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed">{company.overview_text}</p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                            <Globe className="w-4 h-4 text-primary" /> Vision
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400">{company.vision_statement}</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-primary" /> Mission
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400">{company.mission_statement}</p>
                    </div>
                </div>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Core Values</h2>
                    <div className="flex flex-wrap gap-3">
                        {company.core_values?.split(';').map((val, i) => (
                            <span key={i} className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-slate-700 dark:text-slate-200 font-medium shadow-sm">
                                {val.trim()}
                            </span>
                        ))}
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Recent Milestones</h2>
                    <ul className="space-y-4">
                        {company.recent_news?.split(';').map((news, i) => {
                            const [year, text] = news.split(',');
                            return (
                                <li key={i} className="flex gap-4 items-start">
                                    <span className="font-bold text-slate-900 dark:text-white min-w-[3rem]">{year}</span>
                                    <span className="text-slate-600 dark:text-slate-400">{text}</span>
                                </li>
                            )
                        })}
                    </ul>
                </section>
            </div>

            <div className="space-y-6">
                <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm sticky top-24">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-4">Quick Facts</h3>
                    <div className="space-y-4">
                        <Fact label="CEO" value={company.ceo_name} />
                        <Fact label="Founded" value={company.incorporation_year?.toString()} />
                        <Fact label="Type" value={company.nature_of_company} />
                        <Fact label="Revenue" value={company.annual_revenue} />
                        <Fact label="Market Cap" value={company.valuation} />
                        <Fact label="Glassdoor" value={`${company.glassdoor_rating}/5`} />
                    </div>
                </div>
            </div>
        </div>
    );
}

function Fact({ label, value }: { label: string, value?: string }) {
    if (!value) return null;
    return (
        <div className="flex justify-between py-2 border-b border-slate-50 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-900 px-2 rounded transition-colors">
            <span className="text-slate-500 dark:text-slate-400 font-medium">{label}</span>
            <span className="text-slate-900 dark:text-slate-100 font-semibold text-right">{value}</span>
        </div>
    )
}
