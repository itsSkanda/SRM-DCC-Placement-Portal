import MobileSidebar from './MobileSidebar';
import SearchBar from './SearchBar';


export default function TopBar() {
    return (
        <header className="h-16 bg-white border-b border-border flex items-center justify-between px-4 md:px-6 sticky top-0 z-20 shadow-sm/50">
            <div className="flex items-center flex-1 max-w-xl gap-3">
                {/* Mobile Menu Trigger */}
                <MobileSidebar />

                {/* Live company search – wired to all 116 companies via /api/search-companies */}
                <SearchBar />
            </div>

            <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                    A
                </div>
            </div>
        </header>
    );
}

