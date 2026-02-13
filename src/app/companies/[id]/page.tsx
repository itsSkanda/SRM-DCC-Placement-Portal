"use client";

import { MOCK_COMPANIES } from "@/data/mock";
import { notFound } from "next/navigation";
import { useState } from "react";
import { HeroSection } from "@/components/company/HeroSection";
import { TabNavigation } from "@/components/company/CompanyTabNav";
import { OverviewTab } from "@/components/company/tabs/OverviewTab";
import { SkillsMatrix } from "@/components/company/tabs/SkillsMatrix";
import { InnovXTab } from "@/components/company/tabs/InnovXTab";
import { HiringTab } from "@/components/company/tabs/HiringTab";
import { FinancialsTab } from "@/components/company/tabs/FinancialsTab";
import { GenericContentTab } from "@/components/company/tabs/GenericContentTab";

import { use } from "react";

// ... imports

interface CompanyDetailProps {
    params: Promise<{
        id: string;
    }>;
}

export default function CompanyDetail({ params }: CompanyDetailProps) {
    const { id } = use(params);
    const company = MOCK_COMPANIES.find((c) => c.company_id.toString() === id);

    const [activeTab, setActiveTab] = useState("overview");

    if (!company) {
        notFound();
    }

    const tabs = [
        { id: "overview", label: "Overview" },
        { id: "business", label: "Business & Market" },
        { id: "financials", label: "Financials" },
        { id: "skills", label: "Skills Analysis" }, // High Impact
        { id: "innovx", label: "InnovX Projects" },
        { id: "hiring", label: "Hiring Rounds" },
        { id: "culture", label: "Culture & Life" },
        { id: "strategy", label: "Strategy & Future" },
    ];

    const handleActionClick = (section: string) => {
        setActiveTab(section);
        // smooth scroll to content (optional, but good UX)
        const content = document.getElementById('tab-content');
        if (content) {
            content.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 fade-in transition-colors">
            {/* Nav Padding Spacer if main nav exists */}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
                <HeroSection company={company} onActionClick={handleActionClick} />

                <section id="tab-content" className="scroll-mt-24">
                    <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

                    <div className="py-8 min-h-[500px]">
                        {activeTab === "overview" && <OverviewTab company={company} />}

                        {activeTab === "skills" && <SkillsMatrix skills={company.skills_analysis || []} />}

                        {activeTab === "innovx" && <InnovXTab projects={company.innovx_projects || []} />}

                        {activeTab === "hiring" && <HiringTab hiringRoles={company.hiring_roles || []} />}

                        {activeTab === "financials" && <FinancialsTab company={company} />}

                        {activeTab === "business" && (
                            <GenericContentTab
                                title="Business Model & Market Position"
                                description="Understanding where the company fits in the global ecosystem."
                                sections={[
                                    { title: "Core Offerings", content: company.offerings_description },
                                    { title: "Target Market (TAM/SAM)", items: [`TAM: ${company.tam}`, `SAM: ${company.sam}`, `SOM: ${(company.som || 0) * 100}%`] },
                                    { title: "Key Customers", content: company.top_customers },
                                    { title: "Competitors", items: company.key_competitors?.split(';') },
                                    { title: "Value Proposition", content: company.core_value_proposition }
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
                                        title: "Benefits & Perks", items: [
                                            `Leave: ${company.leave_policy}`,
                                            `Health: ${company.health_support}`,
                                            `Relocation: ${company.relocation_support}`,
                                            `Lifestyle: ${company.lifestyle_benefits}`
                                        ]
                                    },
                                    {
                                        title: "Work Environment", items: [
                                            `Remote Policy: ${company.remote_policy_details}`,
                                            `Typical Hours: ${company.typical_hours}`,
                                            `Burnout Risk: ${company.burnout_risk}`
                                        ]
                                    }
                                ]}
                            />
                        )}

                        {activeTab === "strategy" && (
                            <GenericContentTab
                                title="Strategy & Future Outlook"
                                description="Where the company is heading in the next 3-5 years."
                                sections={[
                                    { title: "Strategic Priorities", content: company.strategic_priorities },
                                    { title: "Innovation Roadmap", content: company.innovation_roadmap },
                                    { title: "Recent Acquisitions/Milestones", items: company.recent_news?.split(';') },
                                    { title: "Future Projections", content: company.future_projections }
                                ]}
                            />
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}
