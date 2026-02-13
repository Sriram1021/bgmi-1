'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useOptionalAuth } from '@/app/providers/auth-provider';
import { APP_NAME } from '@/app/lib/constants';
import { cn } from '@/app/lib/utils';
import {
  Menu,
  X,
  Trophy,
  User,
  LogOut,
  ChevronDown,
  Bell,
  Search,
  Gamepad2,
  LayoutDashboard,
} from 'lucide-react';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Tournaments', href: '/tournaments' },
  { name: 'How It Works', href: '/skill-declaration' },
];

export function Header() {
  const pathname = usePathname();
  const auth = useOptionalAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setProfileMenuOpen(false);
    };
    if (profileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [profileMenuOpen]);

  const getDashboardLink = () => {
    if (!auth?.user) return '/login';
    switch (auth.user.role) {
      case 'ADMIN':
        return '/admin/dashboard';
      case 'ORGANIZER':
        return '/organizer/dashboard';
      default:
        return '/participant/dashboard';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled 
          ? 'bg-netflix-black/95 backdrop-blur-md shadow-lg' 
          : 'bg-gradient-to-b from-netflix-black via-netflix-black/80 to-transparent'
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-8 h-8 bg-netflix-red rounded flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight hidden sm:block">
              {APP_NAME}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                  pathname === item.href
                    ? 'text-white bg-netflix-gray-800'
                    : 'text-netflix-gray-300 hover:text-white hover:bg-netflix-gray-800/50'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <button className="hidden md:flex p-2.5 text-netflix-gray-400 hover:text-white hover:bg-netflix-gray-800 rounded-md transition-colors">
              <Search className="w-5 h-5" />
            </button>

            {auth?.user ? (
              <>
                {/* Notifications */}
                <button className="hidden md:flex p-2.5 text-netflix-gray-400 hover:text-white hover:bg-netflix-gray-800 rounded-md transition-colors relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-netflix-red rounded-full" />
                </button>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setProfileMenuOpen(!profileMenuOpen);
                    }}
                    className="flex items-center gap-2 p-1.5 rounded-md hover:bg-netflix-gray-800 transition-colors"
                  >
                    <div className="w-8 h-8 rounded bg-netflix-red flex items-center justify-center text-white text-sm font-medium">
                      {getInitials(auth.user.name)}
                    </div>
                    <ChevronDown
                      className={cn(
                        'w-4 h-4 text-netflix-gray-400 transition-transform hidden sm:block',
                        profileMenuOpen && 'rotate-180'
                      )}
                    />
                  </button>

                  {profileMenuOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-56 bg-netflix-gray-900 border border-netflix-gray-700 rounded-lg shadow-2xl overflow-hidden"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* User Info */}
                      <div className="p-4 border-b border-netflix-gray-800">
                        <p className="font-medium text-white">{auth.user.displayName}</p>
                        <p className="text-sm text-netflix-gray-500 mt-0.5">{auth.user.email}</p>
                        <span className="inline-block mt-2 px-2 py-0.5 text-xs font-medium bg-netflix-red/20 text-netflix-red rounded">
                          {auth.user.role}
                        </span>
                      </div>

                      {/* Navigation Links */}
                      <div className="py-2">
                        <Link
                          href={getDashboardLink()}
                          onClick={() => setProfileMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-netflix-gray-300 hover:bg-netflix-gray-800 hover:text-white transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Dashboard
                        </Link>
                        <Link
                          href={`/${auth.user.role.toLowerCase()}/profile`}
                          onClick={() => setProfileMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-netflix-gray-300 hover:bg-netflix-gray-800 hover:text-white transition-colors"
                        >
                          <User className="w-4 h-4" />
                          Profile
                        </Link>
                        <Link
                          href="/participant/my-tournaments"
                          onClick={() => setProfileMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-netflix-gray-300 hover:bg-netflix-gray-800 hover:text-white transition-colors"
                        >
                          <Trophy className="w-4 h-4" />
                          My Tournaments
                        </Link>
                      </div>

                      {/* Dev: Role Switcher */}
                      <div className="py-2 border-t border-netflix-gray-800">
                        <p className="px-4 py-1.5 text-xs text-netflix-gray-600 uppercase tracking-wide">
                          Dev: Switch Role
                        </p>
                        <div className="px-2">
                          {['PARTICIPANT', 'ORGANIZER', 'ADMIN'].map((role) => (
                            <button
                              key={role}
                              onClick={() => {
                                auth.switchRole?.(role as 'PARTICIPANT' | 'ORGANIZER' | 'ADMIN');
                                setProfileMenuOpen(false);
                              }}
                              className={cn(
                                'w-full text-left px-3 py-2 text-sm rounded-md transition-colors',
                                auth.user?.role === role
                                  ? 'text-netflix-red bg-netflix-gray-800'
                                  : 'text-netflix-gray-400 hover:bg-netflix-gray-800 hover:text-white'
                              )}
                            >
                              {role}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Sign Out */}
                      <div className="py-2 border-t border-netflix-gray-800">
                        <button
                          onMouseDown={(e) => {
                            e.preventDefault(); // Prevent onBlur if any
                            auth.logout();
                            setProfileMenuOpen(false);
                          }}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-netflix-gray-300 hover:bg-netflix-gray-800 hover:text-white transition-colors"
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
              <div className="hidden md:flex items-center gap-3">
                <Link 
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-netflix-gray-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  href="/register"
                  className="px-5 py-2 text-sm font-medium text-white bg-netflix-red hover:bg-red-700 rounded-md transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-white hover:bg-netflix-gray-800 rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-netflix-gray-800">
            <div className="flex flex-col gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'px-4 py-3 text-base font-medium rounded-md transition-colors',
                    pathname === item.href
                      ? 'bg-netflix-gray-800 text-white'
                      : 'text-netflix-gray-300 hover:bg-netflix-gray-800 hover:text-white'
                  )}
                >
                  {item.name}
                </Link>
              ))}

              {auth?.user ? (
                <div className="mt-4 pt-4 border-t border-netflix-gray-800">
                  <Link
                    href={getDashboardLink()}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-base font-medium text-netflix-gray-300 hover:bg-netflix-gray-800 hover:text-white rounded-md transition-colors"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    Dashboard
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-netflix-gray-800">
                  <Link 
                    href="/login" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 text-base font-medium text-center text-white border border-netflix-gray-600 hover:bg-netflix-gray-800 rounded-md transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link 
                    href="/register" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 text-base font-medium text-center text-white bg-netflix-red hover:bg-red-700 rounded-md transition-colors"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
