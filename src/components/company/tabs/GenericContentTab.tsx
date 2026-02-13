import { LucideIcon, Briefcase, Users, Target, Zap, ShieldCheck, Heart, TrendingUp, Globe, CheckCircle2 } from "lucide-react";

interface Section {
    title: string;
    content?: string;
    items?: string[];
    icon?: string; // Optional icon name to map
}

interface GenericContentTabProps {
    title: string;
    description: string;
    sections: Section[];
}

// Map logical names to Lucide icons
const ICON_MAP: Record<string, LucideIcon> = {
    "offerings": Briefcase,
    "market": Globe,
    "customers": Users,
    "competitors": Target,
    "value": Zap,
    "culture": Heart,
    "diversity": Users,
    "benefits": CheckCircle2,
    "environment": Briefcase,
    "strategy": TrendingUp,
    "innovation": Zap,
    "risk": ShieldCheck
};

export function GenericContentTab({ title, description, sections }: GenericContentTabProps) {
    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 p-8 rounded-3xl text-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{title}</h2>
                <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">{description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sections.map((section, index) => {
                    if (!section.content && (!section.items || section.items.length === 0)) return null;

                    // Auto-select icon based on title keywords if not provided
                    const Icon = getIconForTitle(section.title);

                    return (
                        <div key={index} className={`bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group ${
                            // Make the first item span full width if it's content-heavy
                            (index === 0 && section.content && section.content.length > 200) ? 'md:col-span-2' : ''
                            }`}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                                    <Icon className="w-5 h-5 text-primary" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{section.title}</h3>
                            </div>

                            {section.content && (
                                <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{section.content}</p>
                            )}

                            {section.items && (
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                                    {section.items.map((item, i) => (
                                        <li key={i} className="flex gap-2.5 items-start text-slate-700 dark:text-slate-300 text-sm bg-slate-50 dark:bg-slate-900 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800/50">
                                            <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0"></div>
                                            <span>{item.trim()}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function getIconForTitle(title: string): LucideIcon {
    const lower = title.toLowerCase();
    if (lower.includes("offering") || lower.includes("product")) return Briefcase;
    if (lower.includes("market") || lower.includes("global")) return Globe;
    if (lower.includes("customer")) return Users;
    if (lower.includes("competitor")) return Target;
    if (lower.includes("value") || lower.includes("proposition")) return Zap;
    if (lower.includes("culture") || lower.includes("inclusion")) return Heart;
    if (lower.includes("benefit") || lower.includes("perk")) return CheckCircle2;
    if (lower.includes("strategy") || lower.includes("future")) return TrendingUp;
    if (lower.includes("risk") || lower.includes("compliance")) return ShieldCheck;
    return Briefcase; // Default
}
