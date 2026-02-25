import { CompanyFullJson } from "@/types/schema";
import Image from "next/image";
import { Globe, Linkedin, Twitter, Facebook, Instagram, Building2, MapPin, Users, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

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
        <div className="bg-white dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-6 md:p-8 flex flex-col lg:flex-row gap-8 relative transition-colors duration-300">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            {/* Left: Company Identity & Info */}
            <div className="flex-1 space-y-6 z-10">
                <div className="flex gap-6 items-start">
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 shadow-sm flex items-center justify-center shrink-0">
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
                            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-bold uppercase tracking-wider border border-slate-200 dark:border-slate-800">
                                {company.category ?? 'Not Available'}
                            </span>
                            {company.yoy_growth_rate && (
                                <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-100 dark:border-emerald-900/50">
                                    {company.yoy_growth_rate} Growth
                                </span>
                            )}
                        </div>
                        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">{company.name ?? 'Not Available'}</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-lg mt-1">{company.short_name ?? ''} • {company.nature_of_company ?? 'Not Available'}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-2">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-sm font-medium">
                            <Building2 className="w-4 h-4" /> Headquarters
                        </div>
                        <p className="text-slate-900 dark:text-slate-200 font-semibold">
                            {company.headquarters_address ? company.headquarters_address.split(',')[0] : 'Not Available'}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-sm font-medium">
                            <Users className="w-4 h-4" /> Global Size
                        </div>
                        <p className="text-slate-900 dark:text-slate-200 font-semibold">{company.employee_size ?? 'Not Available'}</p>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-sm font-medium">
                            <MapPin className="w-4 h-4" /> Locations
                        </div>
                        <p className="text-slate-900 dark:text-slate-200 font-semibold">
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
                            <p className="text-slate-900 dark:text-slate-200 font-semibold">Not Available</p>
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
                    <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>
                    <div className="flex gap-4 text-sm text-slate-500 dark:text-slate-400">
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
            <div className="flex flex-col gap-3 min-w-[240px] z-10">
                <ActionCard title="Skills Matrix" subtitle="Bloom's Taxonomy Map" color="bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/30 dark:hover:bg-indigo-900/40" textColor="text-indigo-700 dark:text-indigo-300" borderColor="dark:border-indigo-900/50" icon="📊" onClick={() => onActionClick("skills")} />
                <ActionCard title="InnovX Projects" subtitle="Real-world Scenarios" color="bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/30 dark:hover:bg-amber-900/40" textColor="text-amber-700 dark:text-amber-300" borderColor="dark:border-amber-900/50" icon="💡" onClick={() => onActionClick("innovx")} />
                <ActionCard title="Hiring Rounds" subtitle="Process & Prep" color="bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:hover:bg-emerald-900/40" textColor="text-emerald-700 dark:text-emerald-300" borderColor="dark:border-emerald-900/50" icon="🎯" onClick={() => onActionClick("hiring")} />
            </div>
        </div>
    );
}

function SocialLink({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string }) {
    return (
        <a href={href} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary transition-colors" title={label}>
            <Icon className="w-4 h-4" />
        </a>
    );
}

function ActionCard({ title, subtitle, color, textColor, borderColor, icon, onClick }: { title: string; subtitle: string; color: string; textColor: string; borderColor?: string; icon: string; onClick: () => void }) {
    return (
        <button onClick={onClick} className={`text-left p-4 rounded-xl ${color} ${borderColor ?? ''} transition-all duration-200 border border-transparent hover:border-black/5 dark:hover:border-white/10 flex items-center justify-between group h-full`}>
            <div>
                <h3 className={`font-bold ${textColor}`}>{title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">{subtitle}</p>
            </div>
            <div className="text-2xl group-hover:scale-110 transition-transform">{icon}</div>
        </button>
    );
}
