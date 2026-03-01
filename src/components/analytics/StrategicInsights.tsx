"use client";

import { useMemo } from "react";
import type { SkillMasterRow, CompanySkillLevelRow } from "@/lib/skill-analytics";
import { Zap, Target, Award, Info } from "lucide-react";

interface StrategicInsightsProps {
    skills: SkillMasterRow[];
    companies: CompanySkillLevelRow[];
}

const LEVEL_WEIGHTS: Record<string, number> = {
    "ev": 4, "evaluation": 4, "expert": 4,
    "as": 3, "analysis": 3, "advanced": 3,
    "ap": 2, "application": 2, "intermediate": 2,
    "cu": 1, "conceptual": 1, "beginner": 1
};

function getWeight(raw: string | null | undefined): number {
    if (!raw) return 0;
    const n = raw.toLowerCase();
    for (const [key, weight] of Object.entries(LEVEL_WEIGHTS)) {
        if (n.includes(key)) return weight;
    }
    return 0;
}

export function StrategicInsights({ skills, companies }: StrategicInsightsProps) {
    const analysis = useMemo(() => {
        if (companies.length < 2) return null;

        const highStakes: SkillMasterRow[] = [];
        const mustHaves: { skill: SkillMasterRow; intensity: number }[] = [];
        const niches: { skill: SkillMasterRow; company: string }[] = [];

        // Helper to find skill value with fuzzy key matching
        const getSkillValue = (company: CompanySkillLevelRow, skill: SkillMasterRow) => {
            const key = skill.short_name;
            if (company[key]) return company[key] as string;

            // Try lowercase/clean variant
            const cleanKey = key.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
            if (company[cleanKey]) return company[cleanKey] as string;

            // Try case-insensitive original
            const foundKey = Object.keys(company).find(k => k.toLowerCase() === key.toLowerCase());
            if (foundKey) return company[foundKey] as string;

            return undefined;
        };

        skills.forEach(skill => {
            const levels = companies.map(c => getSkillValue(c, skill));
            const weights = levels.map(getWeight);
            const activeCount = weights.filter(w => w > 0).length;
            const avgWeight = weights.reduce((a, b) => a + b, 0) / activeCount;

            // 1. High Stakes: Required by ALL selected companies
            if (activeCount === companies.length) {
                highStakes.push(skill);
            }

            // 2. Must-Haves: High intensity (Analysis or Evaluation) in 50%+ of companies
            const highIntensityCount = weights.filter(w => w >= 3).length;
            if (highIntensityCount >= Math.ceil(companies.length / 2)) {
                mustHaves.push({ skill, intensity: highIntensityCount });
            }

            // 3. Niche: High intensity, but only required by ONE company
            if (activeCount === 1) {
                const weight = weights.find(w => w >= 3);
                if (weight) {
                    const companyIdx = weights.findIndex(w => w === weight);
                    niches.push({ skill, company: companies[companyIdx].companies });
                }
            }
        });

        return {
            highStakes: highStakes.slice(0, 4),
            mustHaves: mustHaves.sort((a, b) => b.intensity - a.intensity).slice(0, 4),
            niches: niches.slice(0, 4)
        };
    }, [skills, companies]);

    if (!analysis) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
            {/* High Stakes */}
            <div className="card-3d p-6 relative overflow-hidden group border-blue-100/50">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Target className="w-12 h-12 text-blue-500" />
                </div>
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100">
                        <Target className="w-4 h-4 text-blue-500" />
                    </div>
                    <h3 className="font-bold text-slate-900">High Stakes</h3>
                </div>
                <p className="text-xs text-slate-500 mb-4 font-medium leading-relaxed">
                    Required by ALL targets. These are non-negotiable foundations for your roster.
                </p>
                <div className="flex flex-wrap gap-2">
                    {analysis.highStakes.length > 0 ? analysis.highStakes.map(s => (
                        <span key={s.short_name} className="px-2 py-1 bg-blue-50 border border-blue-100 rounded-md text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                            {s.skill_set_name}
                        </span>
                    )) : <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">No common ground found</span>}
                </div>
            </div>

            {/* Must Haves */}
            <div className="card-3d p-6 relative overflow-hidden group border-orange-100/50">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Zap className="w-12 h-12 text-orange-500" />
                </div>
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center border border-orange-100">
                        <Zap className="w-4 h-4 text-orange-500" />
                    </div>
                    <h3 className="font-bold text-slate-900">Must-Haves</h3>
                </div>
                <p className="text-xs text-slate-500 mb-4 font-medium leading-relaxed">
                    High-intensity requirements where <span className="text-orange-600 font-bold underline decoration-orange-200">Analysis</span> is mandatory.
                </p>
                <div className="flex flex-wrap gap-2">
                    {analysis.mustHaves.length > 0 ? analysis.mustHaves.map(item => (
                        <span key={item.skill.short_name} className="px-2 py-1 bg-orange-50 border border-orange-100 rounded-md text-[10px] font-bold text-orange-600 uppercase tracking-wider">
                            {item.skill.skill_set_name}
                        </span>
                    )) : <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">No high-intensity overlaps</span>}
                </div>
            </div>

            {/* Strategic Niche */}
            <div className="card-3d p-6 relative overflow-hidden group border-purple-100/50">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Award className="w-12 h-12 text-purple-500" />
                </div>
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center border border-purple-100">
                        <Award className="w-4 h-4 text-purple-500" />
                    </div>
                    <h3 className="font-bold text-slate-900">Strategic Niche</h3>
                </div>
                <p className="text-xs text-slate-500 mb-4 font-medium leading-relaxed">
                    Rare, high-intensity skills that set specific companies apart.
                </p>
                <div className="space-y-2">
                    {analysis.niches.length > 0 ? analysis.niches.map(item => (
                        <div key={item.skill.short_name} className="flex items-center justify-between gap-2 p-1.5 bg-slate-50 rounded-lg border border-slate-100">
                            <span className="text-[10px] font-bold text-purple-600 truncate tracking-wide">
                                {item.skill.skill_set_name}
                            </span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.1em] shrink-0">
                                {item.company.split(' ')[0]}
                            </span>
                        </div>
                    )) : <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">No unique high-intensity skills</span>}
                </div>
            </div>
        </div>
    );
}
