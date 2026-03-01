import { cn } from "@/lib/utils";

interface TabNavigationProps {
    tabs: { id: string, label: string }[];
    activeTab: string;
    onTabChange: (id: string) => void;
}

export function TabNavigation({ tabs, activeTab, onTabChange }: TabNavigationProps) {
    return (
        <div className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-slate-100 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="-mb-px flex space-x-10 overflow-x-auto no-scrollbar" aria-label="Tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={cn(
                                "whitespace-nowrap py-5 px-1 border-b-2 font-bold text-sm transition-all duration-200 tracking-wide uppercase",
                                activeTab === tab.id
                                    ? "border-primary text-primary scale-105"
                                    : "border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-200"
                            )}
                            aria-current={activeTab === tab.id ? 'page' : undefined}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>
        </div>
    );
}
