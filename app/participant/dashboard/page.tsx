'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { setToken, setUser } from '@/app/lib/redux/slices/userSlice';
import { fetchTournaments, fetchMyRegistrations } from '@/app/lib/redux/slices/tournamentSlice';
import { fetchProfile } from '@/app/lib/redux/slices/profileSlice';
import { AppDispatch, RootState } from '@/app/lib/redux/store';
import { useAuth } from '@/app/providers/auth-provider';
import { mockMatches } from '@/app/lib/mock-data';
import { formatCurrency, formatDateTime, cn } from '@/app/lib/utils';
import {
  Trophy,
  Target,
  IndianRupee,
  Crosshair,
  Clock,
  ChevronRight,
  Zap,
  Gamepad2,
  Lock,
  Key,
  Play,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  ShieldCheck,
  Star,
  User,
  Users,
  Crown,
  History,
  TrendingUp,
  Wallet,
  Check
} from 'lucide-react';

function DashboardContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const { tournaments, myRegistrations, loading } = useSelector((state: RootState) => state.tournament);
  const { data: profile } = useSelector((state: any) => state.profile);
  const [isMounted, setIsMounted] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Handle token and user data from URL (Participant redirect)
    const token = searchParams.get('token');
    const urlUser = searchParams.get('user');
    const urlEmail = searchParams.get('email');
    const urlId = searchParams.get('id') || searchParams.get('userId');
    const urlName = searchParams.get('name') || searchParams.get('displayName');
    const urlRole = searchParams.get('role');

    if (token) {
      dispatch(setToken(token));
      
      const savedRole = localStorage.getItem('auth_selected_role');
      const finalRole = (urlRole?.toUpperCase() as any) || savedRole || 'PARTICIPANT';

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
          role: finalRole as any,
          avatarUrl: null,
          createdAt: new Date().toISOString(),
        };
        dispatch(setUser(partialUser));
      }

      // Redirect organizers to their correct dashboard AFTER capturing user data
      if (finalRole === 'ORGANIZER') {
        router.replace('/organizer/dashboard');
        return;
      }

      // Check if user intended to go to organizer or admin dashboard
      const intendedRedirect = localStorage.getItem('auth_redirect_path');
      if (intendedRedirect && (intendedRedirect.includes('/organizer') || intendedRedirect.includes('/admin'))) {
        localStorage.removeItem('auth_redirect_path');
        localStorage.removeItem('auth_selected_role');
        router.replace(intendedRedirect);
        return;
      }
      
      // Clean up URL parameters (remove ALL auth-related params)
      const params = new URLSearchParams(searchParams.toString());
      ['token', 'user', 'email', 'id', 'userId', 'name', 'displayName', 'role'].forEach(key => params.delete(key));
      const newQuery = params.toString();
      const newUrl = newQuery ? `${pathname}?${newQuery}` : pathname;
      router.replace(newUrl);
    }

    dispatch(fetchTournaments());
    dispatch(fetchMyRegistrations());
    dispatch(fetchProfile());
  }, [searchParams, dispatch, router, pathname]);

  const [copiedPass, setCopiedPass] = useState(false);

  // Use real data from Redux
  const myMatches = (myRegistrations || []).slice(0, 3);
  const liveTournaments = (tournaments || []).filter((t: any) => t.status === 'REGISTRATION_OPEN' || t.status === 'LIVE').slice(0, 4);
  const featuredTournament = liveTournaments[0];

  if (!isMounted || loading) {
    return (
      <div className="min-h-screen bg-[#fcfcfc] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-netflix-red border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Synchronizing Battle Intel...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#fcfcfc] pb-24">
      {/* Hero Section - Desktop Focus */}
      <div className="relative pt-12 sm:pt-20 pb-16 overflow-hidden">
        {/* Animated Background Element */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-netflix-red/5 rounded-full blur-[120px] -mr-64 -mt-64 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px] -ml-32 -mb-32" />

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white border border-zinc-100 rounded-full shadow-sm animate-bounce-subtle">
              <span className="flex h-2 w-2 rounded-full bg-netflix-red animate-ping" />
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-900">Battlegrounds Live</span>
            </div>
            
            <h1 className="text-[clamp(2.5rem,8vw,5.5rem)] font-black text-zinc-900 tracking-tight leading-[0.85] uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              COMMANDER <br />
              <span className="text-netflix-red italic drop-shadow-sm">{(profile?.fullName || user?.displayName || user?.name || 'VETERAN').split(' ')[0]}</span>
            </h1>

            <p className="text-zinc-400 font-bold uppercase tracking-[0.3em] text-[10px] sm:text-xs max-w-md mx-auto lg:mx-0 leading-relaxed">
              Your squads are ready. The battleground awaits your tactical supremacy. 
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <Link href="/tournaments">
                <button className="px-10 py-6 bg-netflix-red text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-red-500/20 hover:scale-105 transition-all active:scale-95 group flex items-center gap-3">
                  <Trophy className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  JOIN BATTLE
                </button>
              </Link>
              <div className="flex items-center gap-6 px-10 py-6 bg-white border border-zinc-100 rounded-2xl shadow-sm">
                <div className="text-center border-r border-zinc-100 pr-6">
                  <p className="text-[9px] font-black text-zinc-300 uppercase tracking-widest mb-1">RANK</p>
                  <p className="text-xl font-black text-zinc-900 uppercase tracking-wider">ACE</p>
                </div>
                <div className="text-center">
                  <p className="text-[9px] font-black text-zinc-300 uppercase tracking-widest mb-1">BALANCE</p>
                  <p className="text-xl font-black text-green-600 uppercase tracking-wider">₹850</p>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Room Card */}
          <div className="w-full lg:w-[450px] group">
            <div className="relative bg-zinc-900 rounded-[2.5rem] p-1 overflow-hidden transition-all duration-500 hover:rotate-1 shadow-2xl">
               {/* Glowing border effect */}
               <div className="absolute inset-0 bg-gradient-to-t from-netflix-red via-transparent to-transparent opacity-50" />
               
               <div className="relative bg-[#111] rounded-[2.3rem] overflow-hidden">
                 <div className="h-56 bg-zinc-800 relative group-hover:scale-110 transition-transform duration-3000">
                    <img 
                      src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800" 
                      alt="Battleground" 
                      className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent" />
                    <div className="absolute top-6 left-6 flex items-center gap-2">
                      <div className="px-3 py-1 bg-netflix-red text-[8px] font-black text-white rounded-md uppercase tracking-[0.2em] shadow-lg shadow-red-500/40">LIVE NOW</div>
                    </div>
                 </div>

                  <div className="p-8 space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-2xl font-black text-white uppercase tracking-widest line-clamp-1" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                          {featuredTournament?.title || "POCHINKI SHOWDOWN"}
                        </h3>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.2em] flex items-center gap-2 mt-2">
                          <Target className="w-3 h-3 text-netflix-red" /> 
                          {featuredTournament?.map || "ERANGEL"} • {featuredTournament?.format || "SQUAD"} • {featuredTournament?.perspective || "TPP"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">PRIZE POOL</p>
                        <p className="text-2xl font-black text-green-400 tracking-tighter" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                          {formatCurrency((featuredTournament?.prizePool || 10000) * 100)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                          <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">ENTRY FEE</p>
                          <p className="text-lg font-black text-white tracking-widest">
                            {formatCurrency((featuredTournament?.entryFee || 15000) * 100)}
                          </p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                          <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">DEPLOYED</p>
                          <p className="text-lg font-black text-white tracking-widest">
                            {featuredTournament?.currentParticipants || 0}/{featuredTournament?.maxParticipants || 100}
                          </p>
                        </div>
                    </div>

                    <Link href={featuredTournament ? `/tournaments/${featuredTournament.id}` : "/tournaments"}>
                      <button className="w-full py-5 bg-white text-zinc-900 text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-netflix-red hover:text-white transition-all transform active:scale-95 shadow-xl">
                        {featuredTournament ? "ENLIST IN MISSION" : "VIEW ALL MISSIONS"}
                      </button>
                    </Link>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 space-y-12 sm:space-y-20">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
           <StatCard icon={Zap} label="Win Rate" value={`${user?.stats?.winRate || 0}%`} color="text-amber-500" bg="bg-amber-50" border="border-amber-100" />
           <StatCard icon={Target} label="K/D Ratio" value={user?.stats?.avgPlacement || '0.0'} color="text-red-500" bg="bg-red-50" border="border-red-100" />
           <StatCard icon={TrendingUp} label="Total Earned" value={formatCurrency((user?.stats?.totalEarnings || 0) * 100)} color="text-green-500" bg="bg-green-50" border="border-green-100" />
           <StatCard icon={History} label="Matches" value={user?.stats?.matchesPlayed || '0'} color="text-blue-500" bg="bg-blue-50" border="border-blue-100" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-16">
          {/* Left: Active Intel (8 cols) */}
          <div className="lg:col-span-8 space-y-12 sm:space-y-20">
            {/* Active Tournaments */}
            <section className="space-y-8">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-4">
                   <div className="w-1.5 h-6 bg-netflix-red rounded-full" />
                   <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 uppercase tracking-widest" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>ACTIVE MISSIONS</h2>
                </div>
                <Link href="/tournaments" className="text-[10px] font-black text-zinc-400 hover:text-netflix-red uppercase tracking-widest flex items-center gap-2 group transition-colors">
                  VIEW ALL <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                {liveTournaments.length > 0 ? (
                  liveTournaments.map((tournament: any) => (
                    <Link key={tournament.id} href={`/tournaments/${tournament.id}`} className="group relative bg-white border border-zinc-100 rounded-4xl p-8 shadow-sm hover:shadow-2xl transition-all hover:-translate-y-2 overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-netflix-red/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                      
                      <div className="relative space-y-6">
                        <div className="flex justify-between items-start">
                          <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center border border-zinc-100 group-hover:bg-netflix-red group-hover:border-netflix-red transition-all duration-500">
                            <Gamepad2 className="w-6 h-6 text-zinc-400 group-hover:text-white transition-colors" />
                          </div>
                          <div className="text-right">
                             <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-1">STARTS AT</p>
                             <p className="text-xs font-black text-netflix-red uppercase tracking-widest">
                               {new Date(tournament.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                             </p>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-xl font-black text-zinc-900 uppercase tracking-widest group-hover:text-netflix-red transition-colors line-clamp-1">{tournament.title}</h3>
                          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">
                            {tournament.map} • {tournament.format} • {formatCurrency(tournament.entryFee * 100)} ENTRY
                          </p>
                        </div>

                        <div className="pt-6 border-t border-zinc-50 flex items-center justify-between">
                           <div className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                             <Users className="w-4 h-4 text-zinc-300" />
                             DEPLOYED: {tournament.currentParticipants}/{tournament.maxParticipants}
                           </div>
                           <div className="px-4 py-2 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl group-hover:bg-netflix-red transition-colors shadow-lg shadow-zinc-900/10">
                             JOIN
                           </div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="col-span-2 py-20 bg-white border border-zinc-100 rounded-4xl flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center border border-zinc-100">
                      <Trophy className="w-8 h-8 text-zinc-200" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-zinc-900 uppercase tracking-widest">No Active Missions</h4>
                      <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">Check back later for new deployments</p>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Room ID Cards - Only for active joined matches */}
            <section className="space-y-8">
               <div className="flex items-center gap-4 px-2">
                  <div className="w-1.5 h-6 bg-green-500 rounded-full" />
                  <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 uppercase tracking-widest" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>ROOM CLEARANCE</h2>
               </div>

               <div className="space-y-6">
                 {myMatches.slice(0, 2).map((match, idx) => (
                   <div key={match.id} className="bg-white border-2 border-zinc-100 rounded-4xl p-6 sm:p-10 shadow-sm relative overflow-hidden group hover:border-green-500/20 transition-all">
                      <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:rotate-12 transition-transform duration-700 pointer-events-none">
                        <Lock className="w-40 h-40" />
                      </div>

                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 relative z-10">
                        <div className="flex-1 space-y-4">
                           <div className="flex items-center gap-4">
                             <div className="px-3 py-1 bg-green-100 text-[8px] font-black text-green-700 rounded uppercase tracking-[0.2em]">ACCESS GRANTED</div>
                             <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">{formatDateTime(match.scheduledAt)}</span>
                           </div>
                           <h3 className="text-2xl font-black text-zinc-900 uppercase tracking-widest">{match.tournamentTitle}</h3>
                           <div className="flex items-center gap-4 text-xs">
                              <span className="flex items-center gap-2 font-bold text-zinc-400 uppercase tracking-widest"><Play className="w-3.5 h-3.5" /> MATCH #{idx + 1}</span>
                              <div className="w-1 h-1 bg-zinc-300 rounded-full" />
                              <span className="flex items-center gap-2 font-bold text-zinc-400 uppercase tracking-widest"><Target className="w-3.5 h-3.5" /> MIRAMAR</span>
                           </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:w-96">
                           <div className="p-5 bg-zinc-50 rounded-2xl border border-zinc-100 hover:border-green-500/20 transition-all group/box overflow-hidden relative">
                              <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-2 flex items-center justify-between">
                                ROOM ID {copiedId && <Check className="w-3.5 h-3.5 text-green-600 animate-in fade-in" />}
                              </p>
                              <div className="flex items-center justify-between gap-3">
                                <span className="text-xl font-black text-zinc-900 tracking-wider font-mono">2849103</span>
                                <button 
                                  onClick={() => { setCopiedId(true); setTimeout(() => setCopiedId(false), 2000); }} 
                                  className="w-10 h-10 bg-white border border-zinc-100 rounded-xl flex items-center justify-center hover:bg-green-500 hover:text-white transition-all shadow-sm active:scale-90"
                                >
                                  <Copy className="w-4.5 h-4.5" />
                                </button>
                              </div>
                           </div>
                           <div className="p-5 bg-zinc-50 rounded-2xl border border-zinc-100 hover:border-green-500/20 transition-all group/box">
                              <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-2 flex items-center justify-between">
                                PASSWORD {copiedPass && <Check className="w-3.5 h-3.5 text-green-600 animate-in fade-in" />}
                              </p>
                              <div className="flex items-center justify-between gap-3">
                                <span className="text-xl font-black text-zinc-900 tracking-wider font-mono">BGMI@99</span>
                                <button 
                                  onClick={() => { setCopiedPass(true); setTimeout(() => setCopiedPass(false), 2000); }} 
                                  className="w-10 h-10 bg-white border border-zinc-100 rounded-xl flex items-center justify-center hover:bg-green-500 hover:text-white transition-all shadow-sm active:scale-90"
                                >
                                  <Key className="w-4.5 h-4.5" />
                                </button>
                              </div>
                           </div>
                        </div>
                      </div>
                   </div>
                 ))}
               </div>
            </section>
          </div>

          {/* Right: Personal Archive (4 cols) */}
          <div className="lg:col-span-4 space-y-12 sm:space-y-16">
            {/* Mission Log Card */}
            <div className="bg-white border border-zinc-100 rounded-[2.5rem] p-8 sm:p-10 shadow-sm relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform pointer-events-none">
                 <History className="w-24 h-24" />
               </div>
               
               <h3 className="text-xl font-black text-zinc-900 uppercase tracking-widest mb-8 flex items-center gap-3">
                 <div className="w-1 h-5 bg-netflix-red rounded-full" />
                 BATTLE LOG
               </h3>

               <div className="space-y-6">
                  {[1, 2, 3].map((_, i) => (
                    <div key={i} className="flex items-center gap-5 p-4 bg-zinc-50 rounded-2xl border border-transparent hover:border-zinc-100 hover:bg-white transition-all group/item">
                       <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-zinc-100 flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform">
                          {i === 0 ? <Crown className="w-6 h-6 text-amber-500" /> : <Trophy className="w-6 h-6 text-zinc-300" />}
                       </div>
                       <div className="flex-1 min-w-0">
                          <p className="text-xs font-black text-zinc-900 truncate uppercase tracking-widest mb-1">MERCY REVENGE S4</p>
                          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">RANK #{i + 1} • ₹{500 - (i * 150)} WIN</p>
                       </div>
                    </div>
                  ))}
               </div>

               <Link href="/participant/history" className="block w-full text-center py-5 mt-8 border border-zinc-100 rounded-2xl text-[10px] font-black text-zinc-400 uppercase tracking-widest hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all">
                 VIEW DEPLOYMENT HISTORY
               </Link>
            </div>

            {/* Wallet Briefing */}
            <div className="bg-zinc-900 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-netflix-red/10 rounded-full blur-3xl -mr-16 -mt-16 animate-pulse" />
               
               <h3 className="text-xl font-black text-white uppercase tracking-widest mb-8 flex items-center gap-3 relative z-10">
                 <div className="w-1 h-5 bg-netflix-red rounded-full" />
                 WAR CHEST
               </h3>

               <div className="space-y-8 relative z-10">
                  <div>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-2">AVAILABLE LIQUIDITY</p>
                    <p className="text-5xl font-black text-white tracking-tighter" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>₹1,450</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <button className="py-4 bg-netflix-red hover:bg-white hover:text-zinc-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-95 shadow-lg shadow-red-500/20 flex items-center justify-center gap-2">
                       <Wallet className="w-3.5 h-3.5" /> RECHARGE
                     </button>
                     <button className="py-4 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-95 border border-white/10">
                       WITHDRAW
                     </button>
                  </div>
               </div>
            </div>

            {/* Platform Trust */}
            <div className="px-6 py-4 bg-[#fcfcfc] border border-zinc-100 rounded-2xl flex items-center justify-center gap-3">
               <ShieldCheck className="w-4 h-4 text-green-500" />
               <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Fair Play Verified Platform</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, bg, border }: any) {
  return (
    <div className={cn("bg-white p-6 sm:p-8 rounded-[2rem] border shadow-sm group hover:scale-105 transition-all overflow-hidden relative", border)}>
       <div className={cn("absolute -top-4 -right-4 w-20 h-20 rounded-full blur-2xl opacity-10", color.replace('text-', 'bg-'))} />
       <div className="relative z-10">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:rotate-12", bg)}>
            <Icon className={cn("w-5 h-5", color)} />
          </div>
          <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-1">{label}</p>
          <p className="text-2xl font-black text-zinc-900 tracking-wider uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{value}</p>
       </div>
    </div>
  );
}

export default function ParticipantDashboardPage() {
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
