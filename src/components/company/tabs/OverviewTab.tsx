import { CompanyFullJson } from "@/types/schema";
import { Globe, TrendingUp } from "lucide-react";

interface OverviewTabProps {
    company: CompanyFullJson;
}

export function OverviewTab({ company }: OverviewTabProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <section className="space-y-4">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">About {company.short_name}</h2>
                    <p className="text-slate-600 text-xl leading-relaxed font-medium">{company.overview_text}</p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="card-3d p-8 border-blue-50/50 bg-blue-50/10 transition-all duration-300">
                        <h3 className="font-black text-xl text-slate-900 mb-4 flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-blue-50">
                                <Globe className="w-5 h-5 text-blue-600" />
                            </div>
                            Vision
                        </h3>
                        <p className="text-slate-600 text-lg leading-relaxed font-medium">{company.vision_statement}</p>
                    </div>
                    <div className="card-3d p-8 border-emerald-50/50 bg-emerald-50/10 transition-all duration-300">
                        <h3 className="font-black text-xl text-slate-900 mb-4 flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-emerald-50">
                                <TrendingUp className="w-5 h-5 text-emerald-600" />
                            </div>
                            Mission
                        </h3>
                        <p className="text-slate-600 text-lg leading-relaxed font-medium">{company.mission_statement}</p>
                    </div>
                </div>

                <section className="space-y-6">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Core Values</h2>
                    <div className="flex flex-wrap gap-4">
                        {company.core_values?.split(';').map((val, i) => (
                            <span key={i} className="px-6 py-3 bg-white border border-slate-100 rounded-2xl text-slate-700 font-bold shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-default">
                                {val.trim()}
                            </span>
                        ))}
                    </div>
                </section>

                <section className="space-y-6">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Recent Milestones</h2>
                    <ul className="space-y-6">
                        {company.recent_news?.split(';').map((news, i) => {
                            const [year, text] = news.split(',');
                            return (
                                <li key={news} className="flex gap-6 items-start group">
                                    <span className="font-black text-primary text-lg min-w-[4rem] p-3 rounded-xl bg-primary/5 text-center group-hover:scale-110 transition-transform duration-200">{year}</span>
                                    <span className="text-slate-600 text-lg font-medium leading-relaxed pt-2">{text}</span>
                                </li>
                            )
                        })}
                    </ul>
                </section>
            </div>

            <div className="space-y-6">
                <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-3d sticky top-32 transition-all duration-300">
                    <h3 className="font-black text-2xl text-slate-900 mb-8 border-b border-slate-50 pb-4">Quick Facts</h3>
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
