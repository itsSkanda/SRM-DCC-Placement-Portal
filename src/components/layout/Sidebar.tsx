'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Building2,
    BarChart2,
    Briefcase,
    Lightbulb,
    Settings
} from 'lucide-react';

const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Companies', href: '/companies', icon: Building2 },
    { name: 'Skill Analytics', href: '/analytics', icon: BarChart2 },
    { name: 'Hiring Rounds', href: '/hiring', icon: Briefcase },
    { name: 'Insights', href: '/insights', icon: Lightbulb },
];

export default function Sidebar({ mobile = false }: { mobile?: boolean }) {
    const pathname = usePathname();

    return (
        <aside className={cn(
            "w-64 bg-card border-r border-border h-full flex flex-col shadow-sm",
            mobile ? "flex" : "hidden md:flex"
        )}>
            <div className="p-6 border-b border-border/50">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    SRM Placements
                </h1>
                <p className="text-xs text-muted-foreground mt-1 tracking-wide uppercase">
                    Intelligence Portal
                </p>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                                isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                            )}
                        >
                            <Icon className={cn("w-5 h-5 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-border/50">
                <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground w-full transition-colors">
                    <Settings className="w-5 h-5" />
                    Settings
                </button>
            </div>
        </aside>
    );
}
