'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/app/lib/utils';
import { useOptionalAuth } from '@/app/providers/auth-provider';
import {
  Gamepad2,
  Trophy,
  Zap,
  BarChart3,
  LayoutDashboard,
  PlusCircle,
  Building,
  Settings,
  ShieldAlert,
  Home,
  MessageSquare,
  LifeBuoy
} from 'lucide-react';

export function SlimSidebar() {
  const pathname = usePathname();
  const auth = useOptionalAuth();
  const user = auth?.user;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getSidebarItems = () => {
    // Determine role from pathname if user role is not yet loaded
    const effectiveRole = user?.role || (pathname.startsWith('/organizer') ? 'ORGANIZER' : pathname.startsWith('/admin') ? 'ADMIN' : 'PARTICIPANT');
    
    if (effectiveRole === 'ORGANIZER') {
      return [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/organizer/dashboard' },
        { icon: Trophy, label: 'My Tournaments', href: '/organizer/tournaments' },
        { icon: PlusCircle, label: 'Create Tournament', href: '/organizer/tournaments/create' },
      ];
    }

    if (effectiveRole === 'ADMIN') {
      return [
        { icon: LayoutDashboard, label: 'Admin Dashboard', href: '/admin/dashboard' },
        { icon: ShieldAlert, label: 'Approve Matches', href: '/admin/tournaments/pending' },
        { icon: Trophy, label: 'All Matches', href: '/tournaments' },
      ];
    }

    // Participant Default
    const items: { icon: any; label: string; href: string }[] = [
      { icon: LayoutDashboard, label: 'My Page', href: '/participant/dashboard' },
      // { icon: Zap, label: 'Quick Join', href: '/quick-play' },
      { icon: Trophy, label: 'Tournaments', href: '/tournaments' },
      // { icon: BarChart3, label: 'Leaderboards', href: '/leaderboards' },
    ];

    const appStatus = user?.organizerApplication?.status;
    if (effectiveRole === 'PARTICIPANT' && auth?.isAuthenticated) {
      if (appStatus === 'PENDING') {
        items.push({ icon: MessageSquare, label: 'App Status', href: '/participant/apply-organizer' });
      } else if (!appStatus || appStatus === 'REJECTED') {
        items.push({ icon: Building, label: 'Be an Organizer', href: '/participant/apply-organizer' });
      }
    }

    return items;
  };

  const sidebarItems = getSidebarItems();

  if (!mounted) return null;

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-20 bg-white border-r border-zinc-100 flex-col items-center py-8 z-50 shadow-sm">
      {/* 1. Game Selection (Top) */}
      <div className="flex flex-col gap-6 mb-10">
        <GameIcon icon={Gamepad2} label="BGMI" active color="text-netflix-red" />
        <div className="w-10 h-px bg-zinc-100 mx-auto" />
      </div>

      {/* 2. Core App Navigation (Middle) */}
      <nav className="flex-1 flex flex-col gap-5">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "relative group p-3.5 rounded-2xl transition-all duration-300 border border-transparent",
                isActive
                  ? "bg-netflix-red text-white shadow-lg shadow-red-500/20"
                  : "text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50"
              )}
            >
              <item.icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", isActive ? "scale-100" : "scale-90")} />

              {/* Tooltip */}
              <div className="absolute left-full ml-4 px-3 py-2 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-2xl">
                {item.label}
              </div>

              {/* Active Glow Bar */}
              {isActive && (
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-netflix-red rounded-r-full shadow-glow-red" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* 3. Bottom Actions */}
      {/* <div className="flex flex-col gap-4 mt-auto">
        <Link href="/support" className="p-3.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 rounded-2xl transition-all border border-transparent group relative">
          <LifeBuoy className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <div className="absolute left-full ml-4 px-3 py-2 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">Support</div>
        </Link>
        <Link href="/settings" className="p-3.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 rounded-2xl transition-all border border-transparent group relative">
          <Settings className="w-5 h-5 group-hover:rotate-45 transition-transform" />
          <div className="absolute left-full ml-4 px-3 py-2 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">Settings</div>
        </Link>
      </div> */}
    </aside>
  );
}

function GameIcon({ icon: Icon, label, active = false, color }: { icon: any, label: string, active?: boolean, color?: string }) {
  return (
    <div className="relative group cursor-pointer">
      <div className={cn(
        "w-12 h-12 rounded-2xl flex items-center justify-center transition-all border",
        active
          ? "bg-white border-netflix-red shadow-lg shadow-red-500/10"
          : "bg-zinc-50 border-zinc-100 hover:border-zinc-200"
      )}>
        <Icon className={cn("w-6 h-6", active ? color : "text-zinc-300")} />
      </div>

      {/* Tooltip */}
      <div className="absolute left-full ml-4 px-3 py-2 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-2xl">
        {label}
      </div>
    </div>
  );
}

