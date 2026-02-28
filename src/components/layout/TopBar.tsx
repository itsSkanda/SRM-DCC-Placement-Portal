import MobileSidebar from './MobileSidebar';
import SearchBar from './SearchBar';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function TopBar() {
    return (
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 md:px-6 sticky top-0 z-20 shadow-sm/50 backdrop-blur-sm/80 supports-[backdrop-filter]:bg-card/60">
            <div className="flex items-center flex-1 max-w-xl gap-3">
                {/* Mobile Menu Trigger */}
                <MobileSidebar />

                {/* Live company search – wired to all 116 companies via /api/search-companies */}
                <SearchBar />
            </div>

            <div className="flex items-center pl-4">
                <ThemeToggle />
            </div>
        </header>
    );
}

