'use client';

import { Search, Bell, UserCircle } from 'lucide-react';
import MobileSidebar from './MobileSidebar';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function TopBar() {
    return (
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 md:px-6 sticky top-0 z-20 shadow-sm/50 backdrop-blur-sm/80 supports-[backdrop-filter]:bg-card/60">
            <div className="flex items-center flex-1 max-w-xl gap-3">
                {/* Mobile Menu Trigger */}
                <MobileSidebar />

                <div className="relative group w-full max-w-[320px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full pl-10 pr-4 py-2 bg-secondary/50 border-transparent focus:bg-background focus:border-primary/20 rounded-full text-sm outline-none transition-all duration-200 placeholder:text-muted-foreground/70"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4 pl-4">
                <ThemeToggle />
                <button className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-card"></span>
                </button>
                <div className="h-8 w-[1px] bg-border mx-1 hidden sm:block"></div>
                <div className="flex items-center gap-3 cursor-pointer hover:bg-secondary/50 p-1.5 rounded-full pr-3 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center text-white font-medium text-sm shadow-sm">
                        JD
                    </div>
                    <div className="hidden md:block">
                        <p className="text-sm font-medium leading-none">John Doe</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Student</p>
                    </div>
                </div>
            </div>
        </header>
    );
}
