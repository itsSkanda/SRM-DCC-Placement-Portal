'use client';

import { Search, Bell, UserCircle } from 'lucide-react';

export default function TopBar() {
    return (
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
            <div className="flex-1 max-w-xl">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search companies (e.g. Accenture, Google)..."
                        className="w-full pl-10 pr-4 py-2 bg-secondary/50 border-transparent focus:bg-background focus:border-primary/20 rounded-full text-sm outline-none transition-all duration-200 placeholder:text-muted-foreground/70"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4 ml-6">
                <button className="relative p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-card"></span>
                </button>
                <div className="flex items-center gap-3 pl-4 border-l border-border/60">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium leading-none">Student User</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Computer Science</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-sm">
                        <UserCircle className="w-5 h-5" />
                    </div>
                </div>
            </div>
        </header>
    );
}
