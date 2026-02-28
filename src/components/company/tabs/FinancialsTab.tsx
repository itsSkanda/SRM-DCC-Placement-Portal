import { CompanyFullJson } from "@/types/schema";
import { DollarSign, PieChart, TrendingUp, Briefcase } from "lucide-react";

interface FinancialsTabProps {
    company: CompanyFullJson;
}

export function FinancialsTab({ company }: FinancialsTabProps) {
    return (
        <div className="space-y-8">
            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 p-6 rounded-2xl">
                <h2 className="text-xl font-bold text-emerald-900 dark:text-emerald-400 mb-2">Financial Performance</h2>
                <p className="text-emerald-800 dark:text-emerald-300">
                    Key financial metrics indicating the company's stability and growth trajectory.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard icon={DollarSign} label="Annual Revenue" value={company.annual_revenue} color="text-emerald-600 dark:text-emerald-400" bg="bg-emerald-50 dark:bg-emerald-950/30" />
                <MetricCard icon={TrendingUp} label="Net Profit" value={company.annual_profit} color="text-indigo-600 dark:text-indigo-400" bg="bg-indigo-50 dark:bg-indigo-950/30" />
                <MetricCard icon={PieChart} label="Valuation/Market Cap" value={company.valuation} color="text-purple-600 dark:text-purple-400" bg="bg-purple-50 dark:bg-purple-950/30" />
                <MetricCard icon={Briefcase} label="Profitability Status" value={company.profitability_status} color="text-blue-600 dark:text-blue-400" bg="bg-blue-50 dark:bg-blue-950/30" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-card border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-4">Revenue Mix</h3>
                    <div className="space-y-4">
                        {company.revenue_mix?.split(';').map((mix, i) => {
                            // simplistic parsing
                            const match = mix.match(/(.+?)(\d+%)/);
                            const label = match ? match[1] : mix;
                            const percent = match ? match[2] : '';
                            return (
                                <div key={i}>
                                    <div className="flex justify-between text-sm font-medium mb-1">
                                        <span className="text-slate-700 dark:text-slate-300">{label}</span>
                                        <span className="text-slate-900 dark:text-white">{percent}</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-500" style={{ width: percent || '50%' }}></div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div className="bg-white dark:bg-card border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-4">Investment & Funding</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between border-b border-slate-50 dark:border-slate-800 py-2">
                            <span className="text-slate-500 dark:text-slate-400">Total Capital Raised</span>
                            <span className="font-semibold text-slate-900 dark:text-slate-200">{company.total_capital_raised}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-50 dark:border-slate-800 py-2">
                            <span className="text-slate-500 dark:text-slate-400">Key Investors</span>
                            <span className="font-semibold text-right max-w-[200px] text-slate-900 dark:text-slate-200">{company.key_investors}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-50 dark:border-slate-800 py-2">
                            <span className="text-slate-500 dark:text-slate-400">Future Projections</span>
                            <span className="font-semibold text-right max-w-[200px] text-slate-900 dark:text-slate-200">{company.future_projections}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MetricCard({ icon: Icon, label, value, color, bg }: any) {
    if (!value) return null;
    return (
        <div className="bg-white dark:bg-card border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
            <div className={`w-12 h-12 rounded-xl ${bg} ${color} flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6" />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{label}</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</p>
        </div>
    )
}
