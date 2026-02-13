'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { setToken, setUser } from '@/app/lib/redux/slices/userSlice';
import { fetchTournaments, fetchOrganizedTournaments } from '@/app/lib/redux/slices/tournamentSlice';
import { fetchProfile } from '@/app/lib/redux/slices/profileSlice';
import { AppDispatch, RootState } from '@/app/lib/redux/store';
import { TournamentStatusBadge } from '@/app/components/tournaments/tournament-status-badge';
import { useOptionalAuth } from '@/app/providers/auth-provider';
import { mockPayouts } from '@/app/lib/mock-data';
import { formatCurrency, formatDateTime, cn } from '@/app/lib/utils';
import { Button } from '@/app/components/ui/button';
import {
  Trophy,
  Users,
  Wallet,
  PlusCircle,
  ChevronRight,
  Clock,
  TrendingUp,
  Gamepad2,
  Calendar,
  CheckCircle,
  AlertCircle,
  Zap
} from 'lucide-react';

function DashboardContent() {
  const auth = useOptionalAuth();
  const user = auth?.user;
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const [isMounted, setIsMounted] = useState(false);
  const { organizedTournaments, loading: tournamentsLoading, error: tournamentsError } = useSelector((state: RootState) => state.tournament);
  const { data: profile } = useSelector((state: any) => state.profile);

  useEffect(() => {
    setIsMounted(true);

    // Handle token and user data from URL
    const token = searchParams.get('token');
    const urlUser = searchParams.get('user');
    const urlEmail = searchParams.get('email');
    const urlId = searchParams.get('id') || searchParams.get('userId');
    const urlName = searchParams.get('name') || searchParams.get('displayName');
    const urlRole = searchParams.get('role');

    if (token) {
      dispatch(setToken(token));
      
      const savedRole = localStorage.getItem('auth_selected_role');
      const finalRole = (urlRole?.toUpperCase() as any) || savedRole || 'ORGANIZER';

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
          role: finalRole,
          avatarUrl: null,
          createdAt: new Date().toISOString(),
        };
        dispatch(setUser(partialUser));
      }

      // Check if user intended to go to participant or admin dashboard
      const intendedRedirect = localStorage.getItem('auth_redirect_path');
      if (intendedRedirect && !intendedRedirect.includes('/organizer')) {
        localStorage.removeItem('auth_redirect_path');
        localStorage.removeItem('auth_selected_role');
        router.replace(intendedRedirect);
        return;
      }
      
      // Clean up URL parameters
      const params = new URLSearchParams(searchParams.toString());
      ['token', 'user', 'email', 'id', 'userId', 'name', 'displayName', 'role'].forEach(key => params.delete(key));
      const newQuery = params.toString();
      const newUrl = newQuery ? `${pathname}?${newQuery}` : pathname;
      router.replace(newUrl);
    }

    // Wait for auth to load
    if (auth?.isLoading) return;

    if (!auth?.isAuthenticated) {
      return;
    }

    dispatch(fetchOrganizedTournaments());
    dispatch(fetchProfile());
  }, [dispatch, auth?.isAuthenticated, auth?.isLoading, searchParams, router, pathname]);


  const myTournaments = organizedTournaments;
  const activeTournaments = myTournaments.filter((t: any) =>
    ['REGISTRATION_OPEN', 'LIVE', 'IN_PROGRESS', 'APPROVED'].includes(t.status)
  );
  const pendingApproval = myTournaments.filter((t: any) => t.status === 'PENDING_APPROVAL');
  const completedTournaments = myTournaments.filter((t: any) => t.status === 'COMPLETED');

  const pendingPayouts = mockPayouts.filter((p) =>
    myTournaments.some((t: any) => t.id === p.tournamentId) && p.status === 'PENDING'
  );

  const totalParticipants = myTournaments.reduce((acc, t: any) => acc + (t.currentParticipants || 0), 0);
  const totalPrizePool = myTournaments.reduce((acc, t: any) => acc + (t.prizePool || 0), 0);
  const totalEntryFees = myTournaments.reduce((acc, t: any) => acc + ((t.entryFee || 0) * (t.currentParticipants || 0)), 0);

  return (
    <div className="min-h-screen bg-[#fcfcfc] pb-24">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-12 sm:pt-20 pb-16 space-y-10 sm:space-y-16">
        {/* Header - Netflix White Style */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-10">
          <div>
            <h1 className="text-[clamp(2.5rem,10vw,5rem)] font-black text-zinc-900 tracking-widest leading-[0.85] uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              WELCOME BACK,<br />
              <span className="text-netflix-red">
                {isMounted ? (profile?.fullName || user?.displayName || user?.name || 'COMMANDER').split(' ')[0] : 'COMMANDER'}
              </span>
            </h1>
            <p className="text-zinc-400 font-bold uppercase tracking-[0.2em] text-[10px] sm:text-xs mt-4 sm:mt-6 flex items-center gap-2 sm:gap-3">
              <span className="w-10 sm:w-12 h-[2px] bg-netflix-red" />
              Strategic Operations Dashboard
            </p>
          </div>
          <Link href="/organizer/tournaments/create" className="w-full sm:w-auto">
            <Button variant="primary" className="w-full sm:w-auto px-8 sm:px-12 py-7 sm:py-8 text-xs sm:text-sm font-black uppercase tracking-[0.2em] shadow-lg shadow-red-500/20 rounded-2xl sm:rounded-3xl hover:scale-105 transition-transform">
              <PlusCircle className="h-5 w-5 sm:h-6 sm:w-6" />
              INITIATE NEW EVENT
            </Button>
          </Link>
        </div>

        {/* Stats - Premium Steam-style Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard
            label="Total Tournaments"
            value={myTournaments.length.toString()}
            icon={Trophy}
            color="text-red-500"
            bg="bg-red-50"
            loading={tournamentsLoading}
          />
          <StatCard
            label="Active Participants"
            value={totalParticipants.toString()}
            icon={Users}
            color="text-green-500"
            bg="bg-green-50"
            loading={tournamentsLoading}
          />
          <StatCard
            label="Total Revenue"
            value={formatCurrency(totalEntryFees * 100).replace('.00', '')}
            icon={TrendingUp}
            color="text-blue-500"
            bg="bg-blue-50"
            loading={tournamentsLoading}
          />
          <StatCard
            label="Prize Liquidity"
            value={formatCurrency(totalPrizePool * 100).replace('.00', '')}
            icon={Wallet}
            color="text-purple-500"
            bg="bg-purple-50"
            loading={tournamentsLoading}
          />
        </div>

        {/* Pending Approval Alert */}
        {pendingApproval.length > 0 && (
          <div className="flex items-center gap-6 p-6 sm:p-8 bg-amber-50 border border-amber-100 rounded-4xl shadow-sm">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white border border-amber-100 flex items-center justify-center shrink-0">
              <Clock className="h-7 w-7 sm:h-8 sm:w-8 text-amber-500 animate-pulse" />
            </div>
            <div className="flex-1">
              <p className="text-zinc-900 font-black uppercase tracking-widest text-sm sm:text-base">{pendingApproval.length} tournament{pendingApproval.length > 1 ? 's' : ''} awaiting deployment</p>
              <p className="text-xs sm:text-sm text-zinc-400 font-bold uppercase tracking-widest mt-1">Awaiting high-command verification before going live</p>
            </div>
            <Link href="/organizer/tournaments?status=PENDING_APPROVAL">
              <button className="px-6 sm:px-8 py-3 sm:py-4 bg-white border border-amber-200 hover:bg-amber-100 text-amber-600 text-[10px] sm:text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-sm">
                REVIEW ORDERS
              </button>
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-8 sm:space-y-10">
            <div className="bg-white border border-zinc-100 rounded-[2.5rem] shadow-sm overflow-hidden">
              <div className="flex items-center justify-between p-8 sm:p-10 border-b border-zinc-100">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-8 bg-netflix-red rounded-full" />
                  <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 uppercase tracking-widest" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                    MISSION STATUS
                  </h2>
                </div>
                <Link href="/organizer/tournaments" className="flex items-center gap-2 text-[10px] font-black text-zinc-400 hover:text-netflix-red uppercase tracking-[0.2em] transition-colors group">
                  VIEW FULL ARCHIVE <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="p-8 sm:p-10">
                {tournamentsLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <div className="w-10 h-10 border-4 border-netflix-red border-t-transparent rounded-full animate-spin" />
                    <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">Updating Intel...</p>
                  </div>
                ) : activeTournaments.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6 sm:gap-8">
                    {activeTournaments.map((tournament: any) => {
                      const fillPercentage = ((tournament.currentParticipants || 0) / (tournament.maxParticipants || 1)) * 100;
                      return (
                        <Link
                          key={tournament.id}
                          href={`/tournaments/${tournament.id}`}
                          className="block p-6 sm:p-8 rounded-[2rem] bg-zinc-50 border border-zinc-100 hover:bg-white hover:border-netflix-red/20 transition-all hover:scale-[1.01] group shadow-sm hover:shadow-xl"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-black text-zinc-900 text-xl sm:text-2xl group-hover:text-netflix-red transition-colors truncate uppercase tracking-widest">
                                {tournament.title}
                              </h3>
                              <div className="flex items-center gap-3 text-[10px] text-zinc-400 font-black uppercase tracking-widest mt-2">
                                <span className="px-2 py-0.5 bg-white border border-zinc-100 rounded text-zinc-500">{tournament.format}</span>
                                <div className="w-1 h-1 bg-zinc-200 rounded-full" />
                                <span className="flex items-center gap-1.5"><Gamepad2 className="w-3.5 h-3.5" /> {tournament.game}</span>
                              </div>
                            </div>
                            <TournamentStatusBadge status={tournament.status} />
                          </div>

                          {/* Progress Micro-interactions */}
                          <div className="mb-6 space-y-3">
                            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                              <span className="text-zinc-400">TROOP DEPLOYMENT</span>
                              <span className="text-zinc-900 font-extrabold flex items-center gap-2">
                                <span className="text-netflix-red">{tournament.currentParticipants}</span>
                                <span className="text-zinc-300">/</span>
                                {tournament.maxParticipants}
                              </span>
                            </div>
                            <div className="h-3 bg-zinc-100 rounded-full overflow-hidden border border-zinc-200/50 p-[2px]">
                              <div
                                className="h-full bg-netflix-red rounded-full transition-all shadow-[0_0_10px_rgba(229,9,20,0.3)]"
                                style={{ width: `${fillPercentage}%` }}
                              />
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-6 border-t border-zinc-100">
                            <div className="flex items-center gap-4">
                              <span className="text-[10px] text-zinc-400 font-black uppercase tracking-widest flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-zinc-300" />
                                {formatDateTime(tournament.startsAt)}
                              </span>
                            </div>
                            <div className="text-right">
                              <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">PRIZE POOL</p>
                              <span className="text-2xl sm:text-3xl font-black text-green-600 uppercase tracking-widest" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                                {formatCurrency(tournament.prizePool * 100).replace('.00', '')}
                              </span>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-20 px-10">
                    <div className="w-24 h-24 rounded-3xl bg-zinc-50 border border-zinc-100 flex items-center justify-center mx-auto mb-6">
                      <Trophy className="h-12 w-12 text-zinc-200" />
                    </div>
                    <h3 className="text-xl font-black text-zinc-900 uppercase tracking-widest mb-2">NO MISSIONS ACTIVE</h3>
                    <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-8">Ready to dominate? Start your first tournament deployment now.</p>
                    <Link href="/organizer/tournaments/create">
                      <Button variant="primary" className="px-10 py-6 rounded-2xl text-xs font-black uppercase tracking-widest">
                        COMMENCE OPERATIONS
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Premium Light Theme */}
          <div className="lg:col-span-4 space-y-8 sm:space-y-10">
            {/* Status Overview Card */}
            <div className="bg-white border border-zinc-100 shadow-sm rounded-[2rem] p-8 sm:p-10">
              <h3 className="text-lg font-black text-zinc-900 mb-8 uppercase tracking-widest leading-none flex items-center gap-3">
                <div className="w-1 h-5 bg-netflix-red rounded-full" />
                DASHBOARD INTEL
              </h3>
              <div className="space-y-8">
                <StatusItem label="ACTIVE OPERATIONS" count={activeTournaments.length} color="bg-green-500" />
                <StatusItem label="PENDING VERIFICATION" count={pendingApproval.length} color="bg-amber-500" />
                <StatusItem label="COMPLETED MISSIONS" count={completedTournaments.length} color="bg-zinc-200" />
              </div>
            </div>

            {/* Pending Payouts Card */}
            <div className="bg-white border border-zinc-100 shadow-sm rounded-[2rem] p-8 sm:p-10">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-black text-zinc-900 uppercase tracking-widest leading-none flex items-center gap-3">
                  <div className="w-1 h-5 bg-green-500 rounded-full" />
                  PENDING PAYOUTS
                </h3>
              </div>
              {pendingPayouts.length > 0 ? (
                <div className="space-y-4">
                  {pendingPayouts.slice(0, 4).map((payout) => (
                    <div key={payout.id} className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100 hover:border-green-500/20 transition-colors">
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-black text-zinc-900 uppercase tracking-widest truncate">{payout.userName}</p>
                        <p className="text-[8px] text-zinc-400 font-bold uppercase tracking-[0.2em] truncate mt-1">{payout.tournamentTitle}</p>
                      </div>
                      <span className="text-base font-black text-green-600 ml-4 tracking-tighter" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                        {formatCurrency(payout.amount).replace('.00', '')}
                      </span>
                    </div>
                  ))}
                  <div className="pt-6 text-center border-t border-zinc-100 mt-4">
                    <p className="text-[9px] text-zinc-300 font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                      <AlertCircle className="h-3.5 w-3.5" />
                      HQ CLEARANCE REQUIRED
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-green-50 border border-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                  <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">SECURE: NO PENDING CLAIMS</p>
                </div>
              )}
            </div>

            {/* Strategic Quick Actions - Netflix White Refined */}
            <div className="bg-white border border-zinc-100 rounded-[2.5rem] p-8 sm:p-10 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform pointer-events-none">
                <Zap className="w-24 h-24 text-netflix-red" />
              </div>
              <h3 className="text-xl font-black mb-8 uppercase tracking-widest relative z-10 text-zinc-900" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>COMMAND CENTER</h3>
              <div className="space-y-4 relative z-10">
                <QuickActionLink href="/organizer/tournaments/create" icon={PlusCircle} label="Initiate Deployment" primary />
                <QuickActionLink href="/organizer/tournaments" icon={Trophy} label="Tactical Oversight" />
                <QuickActionLink href="/organizer/profile" icon={Users} label="Identity Profile" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-components
function StatCard({ label, value, icon: Icon, color, bg, loading = false }: { label: string; value: string; icon: any; color: string; bg: string; loading?: boolean }) {
  return (
    <div className="bg-white border border-zinc-100 shadow-sm rounded-4xl p-8 relative overflow-hidden group hover:shadow-xl transition-all hover:-translate-y-1 min-h-[160px]">
      <div className={cn("absolute -top-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-20", bg)} />
      <div className="relative z-10">
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-6 border border-zinc-100 shadow-sm", bg)}>
          <Icon className={cn("h-6 w-6", color)} />
        </div>
        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-3">{label}</p>
        {loading ? (
          <div className="h-10 w-24 bg-zinc-100 rounded-lg animate-pulse" />
        ) : (
          <p className="text-4xl sm:text-5xl font-black text-zinc-900 uppercase tracking-widest leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            {value}
          </p>
        )}
      </div>
    </div>
  );
}

function StatusItem({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-4">
        <div className={cn("w-2 h-2 rounded-full shadow-sm group-hover:scale-125 transition-transform", color)} />
        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest group-hover:text-zinc-900 transition-colors">{label}</span>
      </div>
      <span className="text-2xl font-black text-zinc-900 uppercase tracking-widest" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{count}</span>
    </div>
  );
}

function QuickActionLink({ href, icon: Icon, label, primary = false }: { href: string; icon: any; label: string; primary?: boolean }) {
  return (
    <Link href={href} className="block">
      <button className={cn(
        "w-full px-6 py-4 rounded-xl sm:rounded-2xl transition-all flex items-center justify-between group",
        primary
          ? "bg-netflix-red hover:bg-zinc-900 text-white shadow-lg shadow-red-500/20"
          : "bg-zinc-50 hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 border border-zinc-100"
      )}>
        <div className="flex items-center gap-4">
          <Icon className="h-5 w-5" />
          <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest">{label}</span>
        </div>
        <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform opacity-50" />
      </button>
    </Link>
  );
}

export default function OrganizerDashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-200 border-t-netflix-red" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
