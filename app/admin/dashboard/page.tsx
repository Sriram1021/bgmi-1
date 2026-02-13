'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { mockTournaments, mockPayouts, mockUsers } from '@/app/lib/mock-data';
import { formatCurrency, cn } from '@/app/lib/utils';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setToken, setUser } from '@/app/lib/redux/slices/userSlice';
import { AppDispatch } from '@/app/lib/redux/store';
import {
  Trophy,
  Users,
  IndianRupee,
  Clock,
  AlertTriangle,
  ChevronRight,
  Wallet,
  Gamepad2,
  ClipboardCheck,
  Building,
  Zap,
  ArrowRight,
  ShieldAlert,
  BarChart3
} from 'lucide-react';

function AdminDashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const token = searchParams.get('token');
    const urlUser = searchParams.get('user');
    const urlEmail = searchParams.get('email');
    const urlId = searchParams.get('id') || searchParams.get('userId');
    const urlName = searchParams.get('name') || searchParams.get('displayName');
    const urlRole = searchParams.get('role');

    if (token) {
      dispatch(setToken(token));
      
      if (urlUser) {
        try {
          const parsedUser = JSON.parse(decodeURIComponent(urlUser));
          dispatch(setUser(parsedUser));
        } catch (e) {
          console.error('Failed to parse user from URL', e);
        }
      } else if (urlEmail || urlId) {
        const partialUser: any = {
          id: urlId || 'unknown',
          email: urlEmail || '',
          name: urlName || '',
          displayName: urlName || urlEmail?.split('@')[0] || 'User',
          role: (urlRole?.toUpperCase() as any) || 'ADMIN',
          avatarUrl: null,
          createdAt: new Date().toISOString(),
        };
        dispatch(setUser(partialUser));
      }

      // Check if user intended to go to organizer or admin dashboard
      const intendedRedirect = localStorage.getItem('auth_redirect_path');
      if (intendedRedirect && (intendedRedirect.includes('/organizer') || intendedRedirect.includes('/admin'))) {
        localStorage.removeItem('auth_redirect_path');
        router.replace(intendedRedirect);
        return;
      }
      
      const params = new URLSearchParams(searchParams.toString());
      ['token', 'user', 'email', 'id', 'userId', 'name', 'displayName', 'role'].forEach(key => params.delete(key));
      const newQuery = params.toString();
      const newUrl = newQuery ? `${pathname}?${newQuery}` : pathname;
      router.replace(newUrl);
    }
  }, [searchParams, dispatch, router, pathname]);

  const pendingTournaments = mockTournaments.filter(t => t.status === 'PENDING_APPROVAL');
  const pendingPayouts = mockPayouts.filter(p => p.status === 'PENDING');
  const activeUsers = mockUsers.filter(u => u.role === 'PARTICIPANT').length;
  const totalPrizePool = mockTournaments.reduce((sum, t) => sum + t.prizePool, 0);
  const liveTournaments = mockTournaments.filter(t => t.status === 'LIVE' || t.status === 'IN_PROGRESS');

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-12 sm:pt-20 pb-16 space-y-12 sm:space-y-20">
      {/* 1. High Tech Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-6">
          <h1 className="text-[clamp(3.5rem,10vw,6rem)] font-black text-zinc-900 tracking-wider leading-[0.8] uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            ADMIN <br className="sm:hidden" />
            <span className="text-netflix-red italic">DASHBOARD</span>
          </h1>
          <p className="text-zinc-400 font-bold uppercase tracking-[0.3em] text-[10px] sm:text-xs flex items-center gap-3">
            <span className="w-12 h-[2px] bg-netflix-red" />
            Platform Management & Monitoring
          </p>
        </div>
        <div className="flex items-center gap-4 bg-white border border-zinc-100 p-2 rounded-2xl shadow-sm">
          <div className="px-6 py-3 bg-zinc-50 rounded-xl">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">SYSTEM STATUS</p>
            <p className="text-sm font-black text-green-600 uppercase flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Optimal
            </p>
          </div>
          <button className="p-4 bg-zinc-900 text-white rounded-xl hover:bg-netflix-red transition-all group">
            <ShieldAlert className="w-5 h-5 group-active:scale-95 transition-transform" />
          </button>
        </div>
      </div>

      {/* 2. Platform Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
        <StatCard label="TOTAL TOURNAMENTS" value={mockTournaments.length} icon={Trophy} color="text-netflix-red" suffix="TOTAL" />
        <StatCard label="REGISTERED PLAYERS" value={activeUsers} icon={Users} color="text-zinc-900" suffix="USERS" />
        <StatCard label="TOTAL PRIZE POOL" value={`₹${(totalPrizePool / 100000).toFixed(1)}L`} icon={IndianRupee} color="text-green-600" suffix="POOL" />
        <StatCard label="LIVE MATCHES" value={liveTournaments.length} icon={Zap} color="text-amber-500" suffix="LIVE" ripple />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 sm:gap-16">
        {/* LEFT: Operational Tasks (8 cols) */}
        <div className="xl:col-span-8 space-y-12 sm:space-y-16">
          {/* Critical Alerts / Pending actions */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-1 h-6 bg-amber-500 rounded-full" />
              <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 uppercase tracking-wider" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                PENDING <span className="text-amber-600">TASKS</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingTournaments.length > 0 && (
                <ActionCard
                  href="/admin/tournaments/pending"
                  title={`${pendingTournaments.length} TOURNAMENTS`}
                  desc="PENDING APPROVAL"
                  icon={Clock}
                  color="amber"
                />
              )}
              {pendingPayouts.length > 0 && (
                <ActionCard
                  href="/admin/payouts"
                  title={`${pendingPayouts.length} PAYOUTS`}
                  desc="AWAITING APPROVAL"
                  icon={Wallet}
                  color="green"
                />
              )}
              {/* Mocking a dispute alert */}
              <ActionCard
                href="/admin/disputes"
                title="2 ACTIVE DISPUTES"
                desc="PLAYER REPORTS"
                icon={AlertTriangle}
                color="red"
              />
              <ActionCard
                href="/admin/results"
                title="14 MATCH RESULTS"
                desc="VERIFICATION REQUIRED"
                icon={ClipboardCheck}
                color="zinc"
              />
            </div>
          </div>

          {/* Core Command Links */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-1 h-6 bg-zinc-900 rounded-full" />
              <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 uppercase tracking-wider" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                QUICK <span className="text-netflix-red">LINKS</span>
              </h2>
            </div>

            <div className="bg-white border border-zinc-100 rounded-[3rem] p-4 sm:p-8 shadow-xl shadow-zinc-200/30 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DirectoryLink href="/admin/users" label="PLAYER LIST" icon={Users} desc="Manage all players and accounts" />
              <DirectoryLink href="/admin/organizers" label="ORGANIZER LIST" icon={Building} desc="Manage and approve tournament hosts" />
              <DirectoryLink href="/admin/tournaments" label="TOURNAMENT LIST" icon={Trophy} desc="All matches on the platform" />
              <DirectoryLink href="/leaderboards" label="LEADERBOARD" icon={BarChart3} desc="Global player rankings" />
            </div>
          </div>
        </div>

        {/* RIGHT: Deployment Briefing (4 cols) */}
        <div className="xl:col-span-4 space-y-12">
          <div className="space-y-8">
            <h2 className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.4em] px-2">RECENT TOURNAMENTS</h2>
            <div className="bg-white border border-zinc-100 rounded-[2.5rem] overflow-hidden shadow-xl shadow-zinc-200/30 divide-y divide-zinc-50">
              {mockTournaments.slice(0, 5).map((tournament) => (
                <Link
                  key={tournament.id}
                  href={`/admin/tournaments/${tournament.id}`}
                  className="p-6 flex items-center justify-between hover:bg-zinc-50 transition-all group"
                >
                  <div className="space-y-1.5 flex-1 min-w-0 mr-4">
                    <p className="text-xs font-black text-zinc-900 uppercase tracking-wide truncate group-hover:text-netflix-red transition-colors">{tournament.title}</p>
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{tournament.game}</span>
                      <div className="w-1 h-1 bg-zinc-200 rounded-full" />
                      <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">₹{(tournament.prizePool / 1000).toFixed(0)}K POOL</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={tournament.status} />
                    <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-zinc-900 group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              ))}
              <Link href="/admin/tournaments" className="p-6 block text-center text-[10px] font-black text-netflix-red uppercase tracking-widest hover:bg-zinc-900 hover:text-white transition-all">
                VIEW ALL TOURNAMENTS
              </Link>
            </div>
          </div>

          <div className="p-10 bg-zinc-900 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-netflix-red opacity-10 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="relative z-10 space-y-6">
              <h3 className="text-xl font-black text-white uppercase tracking-widest" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Security Info</h3>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-loose">
                All admin actions are recorded for security. Any suspicious activity will lead to immediate account suspension.
              </p>
              <button className="w-full py-4 bg-white/10 hover:bg-white text-white hover:text-zinc-900 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10">
                View Activity Logs
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color, suffix, ripple }: any) {
  return (
    <div className="bg-white border border-zinc-100 rounded-[2.5rem] p-8 sm:p-10 shadow-xl shadow-zinc-200/20 relative overflow-hidden group hover:scale-[1.02] transition-all">
      {ripple && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-netflix-red/5 rounded-full blur-3xl -mr-16 -mt-16 animate-pulse" />
      )}
      <div className="flex items-center justify-between mb-8">
        <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center group-hover:bg-zinc-900 transition-colors">
          <Icon className={cn("w-6 h-6", color, "group-hover:text-white transition-colors")} />
        </div>
        <span className="text-[9px] font-black text-zinc-300 uppercase tracking-[0.2em]">{suffix}</span>
      </div>
      <p className="text-4xl sm:text-6xl font-black text-zinc-900 leading-none tracking-wider mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{value}</p>
      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{label}</p>
    </div>
  );
}

function ActionCard({ href, title, desc, icon: Icon, color }: any) {
  const styles: any = {
    amber: "bg-amber-50 border-amber-100 hover:border-amber-300 text-amber-600 icon-bg-white shadow-amber-500/5",
    green: "bg-green-50 border-green-100 hover:border-green-300 text-green-600 icon-bg-white shadow-green-500/5",
    red: "bg-red-50 border-red-100 hover:border-red-300 text-netflix-red icon-bg-white shadow-red-500/5",
    zinc: "bg-zinc-50 border-zinc-100 hover:border-zinc-300 text-zinc-600 icon-bg-white shadow-zinc-500/5",
  };

  return (
    <Link href={href} className={cn("p-8 rounded-[2rem] border transition-all hover:scale-[1.03] shadow-lg group relative", styles[color])}>
      <div className="flex items-start justify-between">
        <div className="space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-transparent group-hover:rotate-12 transition-transform">
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xl font-black uppercase tracking-wider leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{title}</p>
            <p className="text-[9px] font-bold opacity-70 uppercase tracking-widest mt-1">{desc}</p>
          </div>
        </div>
        <ArrowRight className="w-5 h-5 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
      </div>
    </Link>
  );
}

function DirectoryLink({ href, label, icon: Icon, desc }: any) {
  return (
    <Link href={href} className="p-6 rounded-2xl bg-zinc-50/50 hover:bg-zinc-900 hover:text-white transition-all group flex items-start gap-5 border border-transparent hover:border-zinc-900">
      <div className="w-10 h-10 rounded-xl bg-white border border-zinc-100 flex items-center justify-center flex-shrink-0 group-hover:bg-zinc-800 group-hover:border-zinc-700 transition-colors">
        <Icon className="w-5 h-5 text-zinc-400 group-hover:text-netflix-red" />
      </div>
      <div>
        <p className="text-xs font-black uppercase tracking-widest mb-1 text-black group-hover:text-white">{label}</p>
        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider group-hover:text-zinc-500">{desc}</p>
      </div>
    </Link>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: any = {
    LIVE: { bg: 'bg-netflix-red', text: 'text-white' },
    IN_PROGRESS: { bg: 'bg-netflix-red', text: 'text-white' },
    REGISTRATION_OPEN: { bg: 'bg-green-100 text-green-700', text: '' },
    PENDING_APPROVAL: { bg: 'bg-amber-100 text-amber-700', text: '' },
    COMPLETED: { bg: 'bg-zinc-100 text-zinc-600', text: '' },
  };
  const s = config[status] || { bg: 'bg-zinc-100 text-zinc-600', text: '' };
  return (
    <span className={cn("px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest whitespace-nowrap", s.bg, s.text)}>
      {status === 'REGISTRATION_OPEN' ? 'OPEN' : status.split('_')[0]}
    </span>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-200 border-t-netflix-red" />
      </div>
    }>
      <AdminDashboardContent />
    </Suspense>
  );
}
