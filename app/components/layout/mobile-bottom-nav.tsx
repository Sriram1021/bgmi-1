'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/app/lib/utils';
import { useOptionalAuth } from '@/app/providers/auth-provider';
import {
    LayoutGrid,
    Trophy,
    Gamepad2,
    User,
    Award,
    Home,
    PlusCircle,
    LayoutDashboard,
    ShieldAlert,
    Building,
    MessageSquare
} from 'lucide-react';

export function MobileBottomNav() {
    const pathname = usePathname();
    const auth = useOptionalAuth();
    const user = auth?.user;
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const getNavItems = () => {
        const effectiveRole = (pathname.startsWith('/organizer') ? 'ORGANIZER' : pathname.startsWith('/admin') ? 'ADMIN' : user?.role || 'PARTICIPANT');
        
        if (effectiveRole === 'ORGANIZER') {
            return [
                { label: 'DASHBOARD', icon: <LayoutDashboard className="w-5 h-5" />, href: '/organizer/dashboard' },
                { label: 'MY TOURNY', icon: <Trophy className="w-5 h-5" />, href: '/organizer/tournaments' },
                { label: 'CREATE', icon: <PlusCircle className="w-5 h-5" />, href: '/organizer/tournaments/create' },
                { label: 'PROFILE', icon: <User className="w-5 h-5" />, href: '/organizer/profile' },
            ];
        }

        if (effectiveRole === 'ADMIN') {
            return [
                { label: 'DASHBOARD', icon: <LayoutDashboard className="w-5 h-5" />, href: '/admin/dashboard' },
                { label: 'APPROVE', icon: <ShieldAlert className="w-5 h-5" />, href: '/admin/tournaments/pending' },
                { label: 'MATCHES', icon: <Trophy className="w-5 h-5" />, href: '/tournaments' },
                { label: 'SETTINGS', icon: <User className="w-5 h-5" />, href: '/admin/settings' },
            ];
        }

        // Default Participant / Public
        const items = [
            { label: 'HOME', icon: <Home className="w-5 h-5" />, href: '/' },
            { label: 'LOBBY', icon: <Gamepad2 className="w-5 h-5" />, href: '/tournaments' },
        ];

        if (user) {
            items.push({ label: 'MY MATCHES', icon: <Trophy className="w-5 h-5" />, href: '/participant/dashboard' });

            const appStatus = user?.organizerApplication?.status;
            if (appStatus === 'PENDING') {
                items.push({ label: 'APP STATUS', icon: <MessageSquare className="w-5 h-5" />, href: '/participant/apply-organizer' });
            } else if (effectiveRole === 'PARTICIPANT' && (!appStatus || appStatus === 'REJECTED')) {
                items.push({ label: 'BE AN ORG', icon: <Building className="w-5 h-5" />, href: '/participant/apply-organizer' });
            }

            items.push({ label: 'PROFILE', icon: <User className="w-5 h-5" />, href: '/participant/profile' });
        } else {
            items.push({ label: 'PROFILE', icon: <User className="w-5 h-5" />, href: '/login' });
        }

        return items;
    };

    const navItems = getNavItems();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-xl border-t border-zinc-100 px-2 py-3 md:hidden flex justify-around items-center shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
            {mounted && navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex flex-col items-center gap-1.5 transition-all duration-300 relative px-3 py-1 rounded-xl",
                            isActive ? "text-netflix-red" : "text-zinc-400"
                        )}
                    >
                        <div className={cn(
                            "transition-transform duration-300",
                            isActive && "scale-110"
                        )}>
                            {item.icon}
                        </div>
                        <span className={cn(
                            "text-[8px] font-black uppercase tracking-[0.1em] transition-all duration-300",
                            isActive ? "opacity-100" : "opacity-60"
                        )}>
                            {item.label}
                        </span>
                        {isActive && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-1 bg-netflix-red rounded-full shadow-[0_0_10px_rgba(229,9,20,0.4)]" />
                        )}
                    </Link>
                );
            })}
        </nav>
    );
}
