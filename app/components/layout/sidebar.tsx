'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/app/lib/utils';
import { useOptionalAuth } from '@/app/providers/auth-provider';
import {
  LayoutDashboard,
  Trophy,
  PlusCircle,
  User,
  Clock,
  ClipboardCheck,
  Wallet,
  Users,
  Building,
  AlertTriangle,
  LogOut,
  ArrowLeft,
  Gamepad2,
  Menu,
  X,
} from 'lucide-react';

interface SidebarProps {
  variant: 'participant' | 'organizer' | 'admin';
}

const navigationConfig = {
  participant: [
    { href: '/participant/dashboard', label: 'My Page', icon: LayoutDashboard },
    { href: '/participant/my-tournaments', label: 'Joined Matches', icon: Trophy },
    { href: '/participant/profile', label: 'My Info', icon: User },
  ],
  organizer: [
    { href: '/organizer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/organizer/tournaments', label: 'My Tournaments', icon: Trophy },
    { href: '/organizer/tournaments/create', label: 'Create Tournament', icon: PlusCircle },
    { href: '/organizer/profile', label: 'My Info', icon: User },
  ],
  admin: [
    { href: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/admin/tournaments', label: 'Tournaments', icon: Trophy },
    { href: '/admin/tournaments/pending', label: 'Pending', icon: Clock },
    { href: '/admin/results', label: 'Results', icon: ClipboardCheck },
    { href: '/admin/payouts', label: 'Payouts', icon: Wallet },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/organizers', label: 'Organizers', icon: Building },
    { href: '/admin/disputes', label: 'Disputes', icon: AlertTriangle },
  ],
};

export function Sidebar({ variant }: SidebarProps) {
  const pathname = usePathname();
  const auth = useOptionalAuth();
  const navigation = navigationConfig[variant];
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const isActive = (href: string) => pathname === href;

  const SidebarContent = () => (
    <>
      {/* Back Link */}
      <Link
        href="/"
        className="flex items-center gap-3 px-6 py-5 text-zinc-400 hover:text-zinc-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-bold uppercase tracking-widest text-[10px]">Back to Home</span>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-2 overflow-y-auto space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-4 px-3 py-3 transition-all rounded-xl relative group',
                active
                  ? 'text-white bg-netflix-red shadow-lg shadow-red-500/20'
                  : 'text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50'
              )}
            >
              <Icon className={cn(
                'w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110',
                active ? 'text-white' : 'text-zinc-300 group-hover:text-zinc-900'
              )} />
              <span className={cn(
                'text-[11px] font-black uppercase tracking-widest',
                active ? 'text-white' : 'text-zinc-400'
              )}>
                {item.label}
              </span>
              {active && (
                <div className="absolute right-3 w-1.5 h-1.5 bg-white rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User & Logout */}
      <div className="px-4 py-6 border-t border-zinc-100">
        {auth?.user && (
          <div className="flex items-center gap-3 px-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center flex-shrink-0 border border-zinc-100">
              <Gamepad2 className="w-5 h-5 text-zinc-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-black text-zinc-900 uppercase tracking-widest truncate">{auth.user.displayName}</p>
              <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">{auth.user.role}</p>
            </div>
          </div>
        )}
        <button
          onClick={() => auth?.logout()}
          className="flex items-center gap-4 px-3 py-3 w-full text-zinc-400 hover:text-netflix-red transition-all rounded-xl hover:bg-red-50 group"
        >
          <LogOut className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          <span className="text-[11px] font-black uppercase tracking-widest">Sign out</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b border-zinc-100 flex items-center justify-between px-6 shadow-sm">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-netflix-red rounded-xl flex items-center justify-center shadow-lg shadow-red-500/20">
            <Gamepad2 className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-black text-zinc-900 uppercase tracking-widest" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{variant}</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-zinc-400 hover:text-zinc-900 transition-colors"
        >
          {mobileOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={cn(
          'lg:hidden fixed top-16 left-0 bottom-0 z-50 w-72 bg-white border-r border-zinc-100 flex flex-col transition-transform duration-300 shadow-2xl',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 bg-white border-r border-zinc-100 flex-col shadow-sm">
        <SidebarContent />
      </aside>
    </>
  );
}
