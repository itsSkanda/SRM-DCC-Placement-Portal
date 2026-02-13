'use client';

import { Menu } from 'lucide-react';
import { useState } from 'react';
import Sidebar from './Sidebar';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function MobileSidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    // Close sidebar on route change
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="md:hidden p-2 -ml-2 text-muted-foreground hover:bg-secondary rounded-lg mr-2"
            >
                <Menu className="w-6 h-6" />
            </button>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Drawer */}
            <div className={`fixed top-0 left-0 h-full w-64 bg-card z-50 transform transition-transform duration-300 ease-in-out md:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-full overflow-y-auto">
                    <Sidebar mobile={true} />
                </div>
            </div>
        </>
    );
}
