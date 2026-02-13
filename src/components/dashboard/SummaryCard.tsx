import { cn } from "@/lib/utils";

interface SummaryCardProps {
    title: string;
    value: string | number;
    icon: React.ComponentType<{ className?: string }>;
    trend?: string;
    colorClass?: string;
}

export function SummaryCard({ title, value, icon: Icon, trend, colorClass = "text-blue-600" }: SummaryCardProps) {
    return (
        <div className="bg-card p-6 rounded-2xl border border-border/60 shadow-sm hover:shadow-md transition-shadow duration-300 group">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
                    <h3 className="text-3xl font-bold tracking-tight text-foreground">{value}</h3>
                </div>
                <div className={cn("p-3 rounded-xl bg-secondary/50 group-hover:bg-white group-hover:shadow-sm transition-all duration-300", colorClass)}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
            {trend && (
                <div className="mt-4 flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 w-fit px-2 py-1 rounded-full">
                    <span>{trend}</span>
                </div>
            )}
        </div>
    );
}
