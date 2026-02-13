'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useOptionalAuth } from '@/app/providers/auth-provider';
import { cn } from '@/app/lib/utils';
import {
  Bell,
  Search,
  ChevronDown,
  Wallet,
  Coins,
  Gamepad2,
  User,
  Settings,
  LogOut,
  HelpCircle,
  Trophy,
  BarChart3,
  Users,
  LayoutDashboard,
  PlusCircle
} from 'lucide-react';
import { formatCurrency } from '@/app/lib/utils';

export function ModernHeader() {
  const auth = useOptionalAuth();
  const user = auth?.user;
  const { data: profile } = useSelector((state: any) => state.profile);
  const pathname = usePathname();
  const router = useRouter();
  const [isGameMenuOpen, setIsGameMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const gameMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (gameMenuRef.current && !gameMenuRef.current.contains(event.target as Node)) {
        setIsGameMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsUserMenuOpen(false);
    setIsGameMenuOpen(false);
  }, [pathname]);

  const games = [
    { id: 'bgmi', name: 'BGMI', icon: '/images/games/bgmi-icon.png', active: true, comingSoon: false },
    // { id: 'pubg', name: 'PUBG Mobile', icon: '/images/games/pubg-icon.png', active: false },
    // { id: 'codm', name: 'CODM', icon: '/images/games/codm-icon.png', active: false, comingSoon: true },
  ];

  const effectiveRole = (pathname.startsWith('/organizer') ? 'ORGANIZER' : pathname.startsWith('/admin') ? 'ADMIN' : user?.role || 'PARTICIPANT');

  const getMainNav = () => {
    if (effectiveRole === 'ORGANIZER') {
      return [
        { label: 'Dashboard', href: '/organizer/dashboard', icon: LayoutDashboard },
        { label: 'My Tournaments', href: '/organizer/tournaments', icon: Trophy },
        { label: 'Host Tournament', href: '/organizer/tournaments/create', icon: PlusCircle },
        { label: 'Support', href: '/support', icon: HelpCircle },
      ];
    }

    // Default / Participant Nav
    return [
      { label: 'Tournaments', href: '/tournaments', icon: Trophy },
      // { label: 'Leaderboards', href: '/leaderboards', icon: BarChart3 },
      { label: 'Rules & Info', href: '/skill-declaration', icon: HelpCircle },
    ];
  };

  const mainNav = getMainNav();

  return (
    <header className="fixed top-0 lg:left-20 left-0 right-0 h-16 bg-white/80 border-b border-zinc-100 z-40 px-4 sm:px-6 flex items-center justify-between backdrop-blur-xl transition-all duration-300">
      {/* 1. Left Section: Logo & Primary Nav */}
      <div className="flex items-center gap-4 sm:gap-8">
        {/* Game Selector Dropdown */}
        <div className="relative" ref={gameMenuRef}>
          <button
            onClick={() => setIsGameMenuOpen(!isGameMenuOpen)}
            className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 rounded-xl bg-zinc-50 hover:bg-zinc-100 text-[10px] sm:text-xs font-black text-zinc-900 uppercase tracking-widest transition-all border border-zinc-100 group"
          >
            <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5 text-netflix-red group-hover:scale-110 transition-transform" />
            <span className="hidden xs:inline">Games</span>
            <ChevronDown className={cn("w-3 h-3 sm:w-4 sm:h-4 text-zinc-400 transition-transform", isGameMenuOpen && "rotate-180")} />
          </button>

          {isGameMenuOpen && (
            <div className="absolute top-full left-0 mt-3 w-64 bg-white border border-zinc-100 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] px-3 mb-3">Select Game</p>
              <div className="space-y-1">
                {games.map((game) => (
                  <button
                    key={game.id}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-bold transition-all",
                      game.active
                        ? "bg-red-50 text-netflix-red border border-red-100"
                        : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 border border-transparent"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", game.active ? "bg-netflix-red" : "bg-zinc-100")}>
                        <Gamepad2 className="w-5 h-5 text-white" />
                      </div>
                      <span>{game.name}</span>
                    </div>
                    {game.comingSoon && (
                      <span className="text-[8px] font-black bg-zinc-100 px-2 py-0.5 rounded text-zinc-400 uppercase">Soon</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {mounted && mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-4 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all",
                pathname === item.href
                  ? "text-zinc-900 bg-zinc-100"
                  : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* 2. Center Section: Global Search */}
      <div className="hidden md:flex flex-1 max-w-lg mx-8 sm:mx-12">
        <div className="relative w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-netflix-red transition-colors" />
          <input
            type="text"
            placeholder="Search matches..."
            className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-3 pl-12 pr-4 text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-200 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* 3. Right Section: User & Economy */}
      <div className="flex items-center gap-2 sm:gap-3">
        {(mounted && auth?.isAuthenticated) ? (
          <>
            {/* Wallet Group */}
            <div className="hidden sm:flex items-center gap-1 bg-white border border-zinc-100 rounded-2xl p-1">
              <div className="flex items-center gap-2 px-4 py-2 hover:bg-zinc-50 rounded-xl transition-all cursor-pointer group">
                <Wallet className="w-4 h-4 text-green-600 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-black text-zinc-900 tabular-nums">
                  {formatCurrency((user?.wallet?.cash || 0) / 100)}
                </span>
              </div>
            </div>

            {/* Notification Bell */}
            <button className="relative p-2.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 rounded-xl transition-all">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-netflix-red rounded-full border-2 border-white" />
            </button>

            {/* User Dropdown */}
            <div className="relative ml-1 sm:ml-2" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-zinc-50 transition-all border border-transparent hover:border-zinc-100"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-netflix-red flex items-center justify-center text-white text-sm font-black shadow-lg shadow-red-500/20 group-hover:scale-105 transition-all">
                  {(profile?.fullName || user?.displayName || user?.name || 'U').charAt(0)}
                </div>
                <ChevronDown className={cn("w-3 h-3 sm:w-4 sm:h-4 text-zinc-400 transition-transform", isUserMenuOpen && "rotate-180")} />
              </button>

              {isUserMenuOpen && (
                <div className="absolute top-full right-0 mt-3 w-64 bg-white border border-zinc-100 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-3 py-3 border-b border-zinc-50 mb-2">
                    <p className="text-sm font-black text-zinc-900 uppercase">{profile?.fullName || user?.displayName || user?.name || 'User'}</p>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase truncate">{user?.email || 'Loading...'}</p>
                  </div>

                  <div className="space-y-1">
                    <UserDropdownItem 
                      icon={User} 
                      label="My Profile" 
                      href={effectiveRole === 'ORGANIZER' ? '/organizer/profile' : '/participant/profile'} 
                    />
                    <UserDropdownItem 
                      icon={Trophy} 
                      label="My Matches" 
                      href={effectiveRole === 'ORGANIZER' ? '/organizer/tournaments' : '/participant/my-tournaments'} 
                    />
                    <UserDropdownItem icon={Wallet} label="Wallet" href="/wallet" />
                    <div className="h-px bg-zinc-50 my-2" />
                    <UserDropdownItem icon={Settings} label="Settings" href="/settings" />
                    <button
                      onMouseDown={(e) => {
                        e.preventDefault();
                        auth.logout();
                      }}
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-[10px] font-black text-netflix-red uppercase tracking-widest hover:bg-red-50 transition-all"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-6 sm:gap-4 md:gap-5 px-2">
            <Link href="/login" className="text-[11px] font-black text-zinc-500 hover:text-zinc-900 uppercase tracking-widest transition-all">
              Sign In
            </Link>
            <Link href="/register" className="bg-netflix-red hover:bg-[#b00710] text-white px-5 sm:px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-red-500/20 active:scale-95">
              Join Now
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

function UserDropdownItem({ icon: Icon, label, href }: { icon: any, label: string, href: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-3 rounded-xl text-[10px] font-black text-zinc-500 uppercase tracking-widest hover:text-zinc-900 hover:bg-zinc-50 transition-all"
    >
      <Icon className="w-4 h-4" />
      {label}
    </Link>
  );
}
