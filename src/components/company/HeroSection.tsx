import { CompanyFullJson } from "@/types/schema";
import Image from "next/image";
import { Globe, Linkedin, Twitter, Facebook, Instagram, Building2, MapPin, Users, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCompanyTier } from "@/../lib/tier-mappings";
import { Award } from "lucide-react";

interface HeroSectionProps {
    company: CompanyFullJson;
    onActionClick: (section: string) => void;
}

export function HeroSection({ company, onActionClick }: HeroSectionProps) {
    let hostname = 'Not Available';
    try {
        if (company.website_url) hostname = new URL(company.website_url).hostname;
    } catch { }

    return (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-3d overflow-hidden p-8 md:p-10 flex flex-col lg:flex-row gap-10 relative">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            {/* Left: Company Identity & Info */}
            <div className="flex-1 space-y-6 z-10">
                <div className="flex gap-8 items-start">
                    <div className="w-28 h-28 md:w-36 md:h-36 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center justify-center shrink-0">
                        <div className="relative w-full h-full">
                            <Image
                                src={(company.logo_url && company.logo_url.startsWith('http')) ? company.logo_url : `https://placehold.co/100x100?text=${encodeURIComponent(company.name?.charAt(0) ?? '?')}`}
                                alt={company.name ?? 'Company'}
                                fill
                                className="object-contain"
                                unoptimized
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.srcset = "";
                                    target.src = `https://placehold.co/100x100?text=${encodeURIComponent(company.name?.charAt(0) ?? '?')}`;
                                }}
                            />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="h-7 px-3.5 rounded-full bg-blue-50 text-slate-950 text-[10px] font-black uppercase tracking-[0.15em] flex items-center justify-center shadow-sm border border-blue-200/60">
                                {company.category ?? 'Not Available'}
                            </span>
                            {(() => {
                                const displayTier = getCompanyTier(company.name, company.tier_level);
                                return displayTier && (
                                    <span className="h-7 px-3.5 rounded-full bg-blue-50 text-slate-950 text-[10px] font-black flex items-center gap-1.5 uppercase tracking-[0.15em] shadow-sm border border-blue-200/60">
                                        <Award className="w-3.5 h-3.5" />
                                        {displayTier}
                                    </span>
                                );
                            })()}
                            {company.yoy_growth_rate && (
                                <span className="h-7 px-3.5 rounded-full bg-blue-50 text-slate-950 text-[10px] font-black flex items-center justify-center uppercase tracking-[0.15em] shadow-sm border border-blue-200/60">
                                    {company.yoy_growth_rate} Growth
                                </span>
                            )}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">{company.name ?? 'Not Available'}</h1>
                        <p className="text-slate-500 text-xl mt-2 font-medium">{company.short_name ?? ''} • {company.nature_of_company ?? 'Not Available'}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-2">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-sm font-medium">
                            <Building2 className="w-4 h-4" /> Headquarters
                        </div>
                        <p className="text-slate-900 font-bold text-base">
                            {company.headquarters_address ? company.headquarters_address.split(',')[0] : 'Not Available'}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-sm font-medium">
                            <Users className="w-4 h-4" /> Global Size
                        </div>
                        <p className="text-slate-900 font-bold text-base">{company.employee_size ?? 'Not Available'}</p>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-sm font-medium">
                            <MapPin className="w-4 h-4" /> Locations
                        </div>
                        <p className="text-slate-900 font-bold text-base">
                            {company.office_locations ? `${company.office_locations.split(';').length} Offices` : 'Not Available'}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-sm font-medium">
                            <Globe className="w-4 h-4" /> Website
                        </div>
                        {company.website_url ? (
                            <a href={company.website_url} target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:underline truncate block">
                                {hostname}
                            </a>
                        ) : (
                            <p className="text-slate-900 font-bold text-base">Not Available</p>
                        )}
                    </div>
                </div>

                {/* Social Links & Contact */}
                <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex gap-2">
                        {company.linkedin_url && <SocialLink href={company.linkedin_url} icon={Linkedin} label="LinkedIn" />}
                        {company.twitter_handle && <SocialLink href={`https://twitter.com/${company.twitter_handle.replace('@', '')}`} icon={Twitter} label="Twitter" />}
                        {company.instagram_url && <SocialLink href={company.instagram_url} icon={Instagram} label="Instagram" />}
                        {company.facebook_url && <SocialLink href={company.facebook_url} icon={Facebook} label="Facebook" />}
                    </div>
                    <div className="h-5 w-px bg-slate-200 hidden sm:block"></div>
                    <div className="flex gap-6 text-sm text-slate-500 font-medium">
                        {company.primary_contact_email && (
                            <a href={`mailto:${company.primary_contact_email}`} className="flex items-center gap-1.5 hover:text-primary transition-colors">
                                <Mail className="w-3.5 h-3.5" /> Contact
                            </a>
                        )}
                        {company.primary_phone_number && company.primary_phone_number !== 'NA' && (
                            <span className="flex items-center gap-1.5">
                                <Phone className="w-3.5 h-3.5" /> {company.primary_phone_number}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Right: Quick Action Cards */}
            <div className="flex flex-col gap-4 min-w-[280px] z-10">
                <ActionCard title="Skills Matrix" subtitle="Bloom's Taxonomy Map" color="bg-indigo-50/50 hover:bg-indigo-50" textColor="text-indigo-700" borderColor="border-indigo-100" icon="📊" onClick={() => onActionClick("skills")} />
                <ActionCard title="InnovX Projects" subtitle="Real-world Scenarios" color="bg-amber-50/50 hover:bg-amber-50" textColor="text-amber-700" borderColor="border-amber-100" icon="💡" onClick={() => onActionClick("innovx")} />
                <ActionCard title="Hiring Rounds" subtitle="Process & Prep" color="bg-emerald-50/50 hover:bg-emerald-50" textColor="text-emerald-700" borderColor="border-emerald-100" icon="🎯" onClick={() => onActionClick("hiring")} />
            </div>
        </div>
    );
}

function SocialLink({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string }) {
    return (
        <a href={href} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-slate-50 text-slate-500 rounded-xl hover:bg-white hover:shadow-md hover:text-primary transition-all border border-transparent hover:border-slate-100" title={label}>
            <Icon className="w-5 h-5" />
        </a>
    );
}

function ActionCard({ title, subtitle, color, textColor, borderColor, icon, onClick }: { title: string; subtitle: string; color: string; textColor: string; borderColor?: string; icon: string; onClick: () => void }) {
    return (
        <button onClick={onClick} className={`card-3d text-left p-6 ${color} ${borderColor ?? 'border-slate-100'} flex items-center justify-between group h-full`}>
            <div className="space-y-1">
                <h3 className={`font-black text-lg ${textColor}`}>{title}</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{subtitle}</p>
            </div>
            <div className="text-3xl group-hover:scale-125 group-hover:-rotate-12 transition-all duration-300 ease-out">{icon}</div>
        </button>
    );
}
