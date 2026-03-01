import { fetchAllCompaniesShort } from "@/lib/queries";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { Building2, Trophy, Star, Briefcase, TrendingUp, Globe } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default async function Home() {
  const companies = await fetchAllCompaniesShort();

  const totalCompanies = companies.length;
  const enterprise = companies.filter(c => c.short_json?.category?.includes('Enterprise')).length;
  const startup = companies.filter(c => c.short_json?.category?.includes('Startup')).length;
  const publicCo = companies.filter(c => c.short_json?.category?.includes('Public')).length;
  const privateCo = companies.filter(c => c.short_json?.category?.includes('Private')).length;
  const fintech = companies.filter(c => c.short_json?.category?.includes('FinTech')).length;

  const featured = companies.slice(0, 3);

  return (
    <div className="space-y-8 pb-10 fade-in">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 md:p-14 shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-white border border-white/20 flex items-center justify-center p-3 shadow-2xl overflow-hidden shrink-0 backdrop-blur-md">
              <img src="/brand/srmicon.png" alt="SRM Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-100 to-white uppercase tracking-tight leading-tight">
                Directorate of Career Center
              </h1>
              <p className="text-sm md:text-lg text-blue-200/80 font-bold uppercase tracking-[0.2em] mt-1">
                SRM Placement Portal
              </p>
            </div>
          </div>
          <p className="text-base md:text-xl text-slate-300 mb-8 leading-relaxed max-w-2xl">
            Explore premium insights, crack placement interviews, and master the skills required for top-tier companies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/companies" className="px-6 py-3 bg-white text-slate-900 rounded-full font-semibold hover:bg-blue-50 transition-colors shadow-lg active:scale-95 duration-200 text-center">
              Browse Companies
            </Link>
            <Link href="/analytics" className="px-6 py-3 bg-blue-50/10 text-white border border-white/20 rounded-full font-semibold hover:bg-blue-50/20 transition-all shadow-lg active:scale-95 duration-200 text-center backdrop-blur-sm">
              View Analytics
            </Link>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 md:w-64 h-48 md:h-64 bg-indigo-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 md:gap-6">
        <SummaryCard title="Total Companies" value={totalCompanies} icon={Building2} />
        <SummaryCard title="Enterprise" value={enterprise} icon={Globe} colorClass="text-indigo-600" />
        <SummaryCard title="Startups" value={startup} icon={Star} colorClass="text-amber-500" />
        <SummaryCard title="Public" value={publicCo} icon={TrendingUp} colorClass="text-purple-600" />
        <SummaryCard title="Private" value={privateCo} icon={Briefcase} colorClass="text-pink-600" />
        <SummaryCard title="FinTech" value={fintech} icon={Trophy} colorClass="text-emerald-600" />
      </section>

      {/* Featured Companies */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Featured Companies</h2>
          <Link href="/companies" className="text-sm font-medium text-primary hover:underline">View All</Link>
        </div>

        {featured.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Building2 className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No companies available yet.</p>
            <p className="text-sm mt-1">Data will appear once the database is populated.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((row) => {
              const company = row.short_json;
              if (!company) return null;
              return (
                <Link href={`/companies/${row.company_id}`} key={row.company_id} className="group block h-full">
                  <div className="bg-card rounded-2xl border border-border/60 p-6 h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative w-12 h-12 rounded-lg bg-white p-1 border border-border/40 overflow-hidden shrink-0">
                        <Image
                          src={(company.logo_url && company.logo_url.startsWith('http')) ? company.logo_url : `https://placehold.co/100x100?text=${encodeURIComponent(company.name?.charAt(0) ?? '?')}`}
                          alt={company.name ?? 'Company'}
                          fill
                          className="object-contain p-1"
                          unoptimized
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">{company.name ?? 'Not Available'}</h3>
                        <div className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded-full w-fit mt-1">
                          {company.category ?? 'Not Available'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-auto pt-4 border-t border-border/40">
                      <Building2 className="w-3 h-3" />
                      <span className="truncate">{company.employee_size ?? 'Not Available'}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
