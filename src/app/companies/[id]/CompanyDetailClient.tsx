"use client";

import { useState } from "react";
import { CompanyFullJson, InnovXJsonData, JobRoleDetailsJsonData } from "@/types/schema";
import { HeroSection } from "@/components/company/HeroSection";
import { TabNavigation } from "@/components/company/CompanyTabNav";
import { OverviewTab } from "@/components/company/tabs/OverviewTab";
import { InnovXTab } from "@/components/company/tabs/InnovXTab";
import { HiringTab } from "@/components/company/tabs/HiringTab";
import { FinancialsTab } from "@/components/company/tabs/FinancialsTab";
import { GenericContentTab } from "@/components/company/tabs/GenericContentTab";
import { SkillsMatrix } from "@/components/company/tabs/SkillsMatrix";

interface CompanyDetailClientProps {
    fullJson: CompanyFullJson;
    innovxData: InnovXJsonData | null;
    hiringData: JobRoleDetailsJsonData | null;
}

const tabs = [
    { id: "overview", label: "Overview" },
    { id: "business", label: "Business & Market" },
    { id: "financials", label: "Financials" },
    { id: "skills", label: "Skills Analysis" },
    { id: "innovx", label: "InnovX Projects" },
    { id: "hiring", label: "Hiring Rounds" },
    { id: "culture", label: "Culture & Life" },
    { id: "strategy", label: "Strategy & Future" },
];

export function CompanyDetailClient({ fullJson, innovxData, hiringData }: CompanyDetailClientProps) {
    const [activeTab, setActiveTab] = useState("overview");

    const handleActionClick = (section: string) => {
        setActiveTab(section);
        const content = document.getElementById('tab-content');
        if (content) content.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const company = fullJson;

    // Derive InnovX projects from innovx_json.json_data.innovx_projects
    const innovxProjects = innovxData?.innovx_projects ?? [];

    // Derive hiring roles from job_role_details_json.job_role_json.job_role_details
    const hiringRoles = hiringData?.job_role_details ?? [];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 fade-in transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
                <HeroSection company={company} onActionClick={handleActionClick} />

                <section id="tab-content" className="scroll-mt-24">
                    <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

                    <div className="py-8 min-h-[500px]">
                        {activeTab === "overview" && <OverviewTab company={company} />}

                        {activeTab === "skills" && <SkillsMatrix hiringData={hiringData} />}

                        {activeTab === "innovx" && <InnovXTab projects={innovxProjects} />}

                        {activeTab === "hiring" && <HiringTab hiringData={hiringData} />}

                        {activeTab === "financials" && <FinancialsTab company={company} />}

                        {activeTab === "business" && (
                            <GenericContentTab
                                title="Business Model & Market Position"
                                description="Understanding where the company fits in the global ecosystem."
                                sections={[
                                    { title: "Core Offerings", content: company.offerings_description },
                                    {
                                        title: "Target Market (TAM/SAM/SOM)",
                                        items: [
                                            `TAM: ${company.tam ?? 'Not Available'}`,
                                            `SAM: ${company.sam ?? 'Not Available'}`,
                                            `SOM: ${company.som != null ? (company.som * 100).toFixed(1) + '%' : 'Not Available'}`,
                                        ]
                                    },
                                    { title: "Key Customers", content: company.top_customers },
                                    { title: "Competitors", items: company.key_competitors?.split(';') },
                                    { title: "Value Proposition", content: company.core_value_proposition },
                                ]}
                            />
                        )}

                        {activeTab === "culture" && (
                            <GenericContentTab
                                title="Culture, Work Life & Benefits"
                                description="What it's really like to work here."
                                sections={[
                                    { title: "Work Culture", content: company.work_culture_summary },
                                    { title: "Diversity & Inclusion", content: company.diversity_metrics },
                                    {
                                        title: "Benefits & Perks",
                                        items: [
                                            `Leave: ${company.leave_policy ?? 'Not Available'}`,
                                            `Health: ${company.health_support ?? 'Not Available'}`,
                                            `Relocation: ${company.relocation_support ?? 'Not Available'}`,
                                            `Lifestyle: ${company.lifestyle_benefits ?? 'Not Available'}`,
                                        ]
                                    },
                                    {
                                        title: "Work Environment",
                                        items: [
                                            `Remote Policy: ${company.remote_policy_details ?? 'Not Available'}`,
                                            `Typical Hours: ${company.typical_hours ?? 'Not Available'}`,
                                            `Burnout Risk: ${company.burnout_risk ?? 'Not Available'}`,
                                        ]
                                    },
                                ]}
                            />
                        )}

                        {activeTab === "strategy" && (
                            <GenericContentTab
                                title="Strategy & Future Outlook"
                                description="Where the company is heading in the next 3–5 years."
                                sections={[
                                    { title: "Strategic Priorities", content: company.strategic_priorities },
                                    { title: "Innovation Roadmap", content: company.innovation_roadmap },
                                    { title: "Recent Acquisitions/Milestones", items: company.recent_news?.split(';') },
                                    { title: "Future Projections", content: company.future_projections },
                                ]}
                            />
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}
