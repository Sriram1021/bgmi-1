'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTournaments } from '@/app/lib/redux/slices/tournamentSlice';
import { AppDispatch, RootState } from '@/app/lib/redux/store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useOptionalAuth } from '@/app/providers/auth-provider';
import { mockTournaments } from '@/app/lib/mock-data';
import { formatCurrency, cn } from '@/app/lib/utils';
import type { QuickMatch, Tournament } from '@/app/types';
import {
  Trophy,
  Zap,
  Users,
  Award,
  ArrowRight,
  Gamepad2,
  Building,
  Smartphone,
  Star,
  ZapOff,
  Link as LinkIcon,
  ShieldCheck,
  ChevronRight,
  Users2,
  Target,
  Flame,
  LayoutGrid,
  BarChart3,
  Lock
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const auth = useOptionalAuth();
  const { tournaments, loading: tournamentsLoading } = useSelector((state: RootState) => state.tournament);
  const isAuthenticated = auth?.isAuthenticated ?? false;

  useEffect(() => {
    dispatch(fetchTournaments());
  }, [dispatch]);

  // Use real tournaments for the marketplace, filter for live/open matches
  const marketplaceMatches = (tournaments || [])
    .filter(t => ['LIVE', 'REGISTRATION_OPEN', 'IN_PROGRESS'].includes(t.status))
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-zinc-900 selection:bg-netflix-red selection:text-white pb-20 font-sans relative overflow-x-hidden">
      {/* 1. Feature Hero Section (Light Mode) */}
      <section className="relative z-10 pt-10 pb-16">
        <div className="max-w-[1240px] mx-auto px-6">
          <h2 className="text-zinc-500 text-sm font-bold uppercase tracking-[0.2em] mb-6">Featured & Recommended</h2>

          <div className="relative bg-white rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-zinc-100 group min-h-[500px] lg:min-h-[700px] flex items-end">
            {/* Background Image */}
            <div className="absolute inset-0 bg-[url('/hero-squad.png')] bg-cover bg-center" />

            {/* Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/60 via-transparent to-transparent z-10" />

            {/* Content Overlay */}
            <div className="relative z-20 w-full p-8 sm:p-12 lg:p-20 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
              <div className="max-w-2xl">
                <div className="px-4 py-1.5 bg-netflix-red rounded-full text-[10px] font-bold text-white uppercase tracking-widest mb-6 inline-block shadow-lg shadow-red-500/20">INDIA&apos;S #1 PLATFORM</div>
                <h1 className="text-5xl sm:text-7xl lg:text-[8rem] font-black text-white leading-[0.85] tracking-[0.02em] uppercase mb-8" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                  PLAY BGMI & WIN <br /> <span className="text-netflix-red text-6xl sm:text-8xl lg:text-[9rem]">REAL CASH</span>
                </h1>

                <div className="flex flex-wrap gap-8">
                  <HeroStat icon={<Trophy className="w-5 h-5 text-netflix-red" />} label="PRIZES DISTRIBUTED" value="₹50L+" light />
                  <HeroStat icon={<Users className="w-5 h-5 text-white/70" />} label="TOTAL PLAYERS" value="150K+" light />
                  <HeroStat icon={<Zap className="w-5 h-5 text-amber-500" />} label="DAILY MATCHES" value="1200+" light />
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl lg:w-80 space-y-6">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-white/50 uppercase tracking-[0.1em]">LATEST TOURNAMENT ENTRY</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-4xl font-black text-white">{formatCurrency(Math.min(...tournaments.map(t => t.entryFee).filter(f => f > 0), 1000))}</span>
                    <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">LIVE NOW</span>
                  </div>
                </div>
                <Link href="/register" className="block">
                  <button className="w-full py-5 bg-netflix-red hover:bg-[#b00710] text-white font-bold uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-red-500/20 active:scale-95 text-sm">
                    JOIN THE BATTLE
                  </button>
                </Link>
                <p className="text-[10px] text-white/40 text-center leading-relaxed font-medium uppercase tracking-widest">
                  Automatic prizes • 100% Secure
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Centered Content Grid */}
      <div className="max-w-[1240px] mx-auto px-6 space-y-24 relative z-10">

        {/* 2. Choose Your Game Row */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-zinc-600 text-sm font-bold uppercase tracking-[0.2em] flex items-center gap-3">
              <span className="w-8 h-[2px] bg-netflix-red" />
              CHOOSE YOUR GAME
            </h2>
            <Link href="/games" className="text-[11px] text-zinc-400 hover:text-netflix-red font-bold uppercase tracking-[0.1em] flex items-center gap-1 group transition-colors">
              BROWSE ALL <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:flex lg:gap-6 gap-3 sm:gap-6 pb-6">
            <GamePoster game="MOBILE" title="BGMI" color="bg-orange-500" badge="POPULAR" image="/games/bgmi.png" />
            <GamePoster game="MOBILE" title="PUBG MOBILE" color="bg-blue-600" badge="GLOBAL" image="/games/pubg.png" />
            <GamePoster game="ARENA" title="TDM BATTLES" color="bg-red-500" badge="HOT" image="/games/tdm.png" />
            <GamePoster game="ELITE" title="ARENA MASTER" color="bg-indigo-600" badge="HIGH STAKES" image="/games/arena_master.png" />
          </div>
        </section>

        {/* 3. Live Match Marketplace Grid (Light Theme) */}
        <section className="bg-white rounded-2xl p-10 border border-zinc-100 relative overflow-hidden shadow-[0_15px_60px_rgba(0,0,0,0.05)]">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-netflix-red via-red-300 to-transparent" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-xl bg-red-50 flex items-center justify-center border border-red-100">
                <Zap className="w-7 h-7 text-netflix-red animate-pulse" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-zinc-900 uppercase tracking-wide" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>LIVE MATCH <span className="text-netflix-red">MARKETPLACE</span></h2>
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.1em] mt-1">REAL-TIME TOURNAMENT UPDATES • JOIN LOBBIES</p>
              </div>
            </div>
            <Link href="/quick-play" className="px-8 py-4 bg-zinc-900 hover:bg-black text-white text-[11px] font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg active:scale-95">VIEW ALL LOBBIES</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {marketplaceMatches.map((match: any) => (
              <LiveMatchCard key={match.id} match={match} router={router} isAuthenticated={isAuthenticated} />
            ))}
          </div>
        </section>

        {/* 4. Secondary Discovery Grid (How to Play & Stats) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 bg-zinc-900 rounded-2xl p-6 sm:p-12 relative group overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-netflix-red/20 to-transparent pointer-events-none opacity-50" />
            <div className="flex flex-col md:flex-row items-center gap-8 sm:gap-12 relative z-10">
              <div className="w-20 h-20 sm:w-28 sm:h-28 bg-white/10 rounded-2xl border border-white/20 flex items-center justify-center shadow-2xl group-hover:bg-netflix-red/20 transition-all backdrop-blur-md">
                <ShieldCheck className="w-10 h-10 sm:w-14 sm:h-14 text-white" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-wide mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>SECURE ACCOUNT LINKING</h3>
                <p className="text-sm sm:text-base text-zinc-400 leading-relaxed mb-6 sm:mb-8">Connect your BGMI ID once to unlock <span className="text-white">automatic prize withdrawals</span> and career tracking.</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-3 sm:gap-4">
                  <Badge text="INSTANT PAYOUTS" color="bg-green-500" light />
                  <Badge text="ANTI-CHEAT V3" color="bg-blue-500" light />
                </div>
              </div>
              <Link href="/onboarding" className="w-full md:w-auto">
                <button className="w-full px-8 sm:px-12 py-4 sm:py-5 bg-white hover:bg-zinc-200 text-zinc-900 font-bold uppercase tracking-widest rounded-xl shadow-xl transition-all active:scale-95 text-sm sm:text-base">LINK ID NOW</button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white rounded-2xl p-8 sm:p-12 border border-zinc-100 shadow-xl flex flex-col justify-center">
            <h3 className="text-[10px] sm:text-sm font-black text-zinc-900 uppercase tracking-[0.1em] mb-8 sm:mb-10 border-b border-zinc-100 pb-5">TOURNAMENT STEPS</h3>
            <ul className="grid grid-cols-2 sm:grid-cols-1 gap-6 sm:space-y-8">
              <ListStep num="01" title="Create" color="bg-netflix-red" />
              <ListStep num="02" title="Connect" color="bg-zinc-900" />
              <ListStep num="03" title="Join" color="bg-zinc-400" />
              <ListStep num="04" title="Win" color="bg-green-600" />
            </ul>
          </div>
        </div>

        {/* 5. Organizer/Community Block */}
        <section className="bg-zinc-50 rounded-2xl border border-zinc-100 p-8 sm:p-14 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/5 blur-[120px] -z-10" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-20 items-center">
            <div className="space-y-8 sm:space-y-10">
              <div className="inline-flex items-center gap-3 px-5 py-2 bg-white rounded-full border border-zinc-200 shadow-sm">
                <Building className="w-4 h-4 text-netflix-red" />
                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em]">PARTNER PROGRAM</span>
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-[5.5rem] font-black text-zinc-900 uppercase tracking-wide leading-[0.9]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                HOST YOUR OWN <span className="text-netflix-red">EVENTS</span>
              </h2>
              <p className="text-sm sm:text-lg text-zinc-500 font-medium leading-relaxed max-w-xl">
                We provide the complete infrastructure: automatic lobby creation, results tracking, and prize management.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-4">
                <Link href="/register"><button className="w-full sm:w-auto px-10 sm:px-14 py-4 sm:py-5 bg-zinc-900 hover:bg-black text-white font-bold uppercase tracking-widest rounded-xl transition-all shadow-xl active:scale-95 text-sm sm:text-base">START HOSTING</button></Link>
                <Link href="/rules"><button className="w-full sm:w-auto px-10 sm:px-14 py-4 sm:py-5 bg-white border border-zinc-200 hover:border-zinc-400 text-zinc-900 font-bold uppercase tracking-widest rounded-xl transition-all active:scale-95 text-sm sm:text-base">VIEW RULES</button></Link>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl p-6 sm:p-10 border border-zinc-100 shadow-[0_30px_70px_rgba(0,0,0,0.08)] transform group-hover:rotate-0 transition-all duration-700">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-6 sm:pb-8 mb-6 sm:mb-10">
                  <span className="text-[10px] sm:text-[11px] font-black text-zinc-900 tracking-[0.1em] uppercase">HOST DASHBOARD</span>
                  <div className="flex gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-lg shadow-green-500/20" />
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-200" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 sm:space-y-6">
                  <MockStat label="ACTIVE MATCHES" value="12" icon={<LayoutGrid className="w-4 h-4 sm:w-5 sm:h-5 text-netflix-red" />} />
                  <MockStat label="HOST STATUS" value="VERIFIED" icon={<ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />} />
                  <MockStat label="EARNINGS" value="15.0%" icon={<BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-900" />} />
                </div>
                <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-zinc-100">
                  <div className="flex justify-between text-[9px] sm:text-[10px] font-bold text-zinc-400 uppercase mb-3"><span>SYSTEMS LOAD</span><span className="text-green-600">OPTIMAL</span></div>
                  <div className="w-full h-1.5 sm:h-2 bg-zinc-100 rounded-full overflow-hidden"><div className="h-full w-[35%] bg-netflix-red" /></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Footer Call to Action (Light Mode Banner) */}
        <section className="text-center py-16 sm:py-28 border-t border-zinc-100 space-y-10 sm:space-y-14">
          <div className="space-y-6">
            <h2 className="text-4xl sm:text-6xl md:text-[6rem] font-black text-zinc-900 uppercase tracking-wide leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              READY TO <br className="sm:hidden" /> <span className="text-netflix-red underline decoration-netflix-red/10 underline-offset-[16px]">DROP IN?</span>
            </h2>
            <p className="text-zinc-500 text-[10px] sm:text-sm uppercase tracking-[0.2em] font-bold px-4">JOIN THOUSANDS OF PLAYERS COMPETING EVERY DAY</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 max-w-3xl mx-auto px-6">
            <Link href="/register" className="w-full"><button className="w-full py-5 sm:py-7 bg-netflix-red hover:bg-[#b00710] text-white font-bold uppercase tracking-widest rounded-xl shadow-[0_20px_40px_rgba(229,9,20,0.2)] transition-all active:scale-95 text-lg sm:text-xl">JOIN AS PLAYER</button></Link>
            <Link href="/register" className="w-full"><button className="w-full py-5 sm:py-7 bg-white border-2 border-zinc-100 hover:border-zinc-300 text-zinc-900 font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg active:scale-95 text-lg sm:text-xl">AS ORGANIZER</button></Link>
          </div>
          <p className="text-[10px] sm:text-xs text-zinc-400 uppercase tracking-[0.2em] font-bold px-4">ALREADY REGISTERED? <Link href="/login" className="text-netflix-red hover:text-red-700 transition-colors ml-3 border-b-2 border-red-500/20 pb-1">LOGIN NOW</Link></p>
        </section>

      </div>
    </div>
  );
}

// Internal Helper Components
function HeroStat({ icon, label, value, light }: { icon: React.ReactNode; label: string; value: string; light?: boolean }) {
  return (
    <div className="flex items-center gap-3 sm:gap-4">
      <div className={cn(
        "w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shadow-sm border",
        light ? "bg-white/10 border-white/10" : "bg-white border-zinc-100"
      )}>{icon}</div>
      <div>
        <p className={cn(
          "text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.1em] mb-0.5 sm:mb-1",
          light ? "text-white/40" : "text-zinc-400"
        )}>{label}</p>
        <p
          className={cn(
            "text-base sm:text-xl font-black leading-tight uppercase tracking-wide",
            light ? "text-white" : "text-zinc-900"
          )}
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >{value}</p>
      </div>
    </div>
  );
}

function GamePoster({ game, title, color, badge, image }: { game: string; title: string; color: string; badge?: string; image?: string }) {
  return (
    <div className="group cursor-pointer relative w-full">
      <div
        className={cn("relative aspect-[3/4] sm:aspect-[16/22] rounded-2xl overflow-hidden mb-3 sm:mb-5 shadow-2xl transition-all duration-500 hover:scale-[1.02]", !image && color)}
        style={image ? { backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      >
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-all duration-500" />
        {!image && (
          <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 group-hover:scale-125 transition-all duration-1000">
            <Gamepad2 className="w-20 h-20 sm:w-40 sm:h-40 text-white" />
          </div>
        )}
        {badge && (
          <div className="absolute top-3 left-3 sm:top-6 sm:left-6 z-10">
            <div className="px-2 py-1 sm:px-4 sm:py-1.5 bg-white/95 backdrop-blur-md rounded-lg text-[7px] sm:text-[10px] font-black text-zinc-900 uppercase tracking-[0.1em] shadow-xl">{badge}</div>
          </div>
        )}
        <div className="absolute bottom-0 left-0 w-full p-4 sm:p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          <p className="text-[7px] sm:text-[10px] font-bold text-white/70 uppercase tracking-[0.1em] mb-1 sm:mb-2">{game}</p>
          <h3 className="text-xl sm:text-3xl font-black text-white uppercase tracking-wide leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{title}</h3>
        </div>
      </div>
    </div>
  );
}

function LiveMatchCard({ match, router, isAuthenticated }: { match: any; router: ReturnType<typeof useRouter>; isAuthenticated: boolean }) {
  const isLive = match.status === 'LIVE' || match.status === 'IN_PROGRESS';
  const fillPercentage = ((match.currentParticipants || 0) / (match.maxParticipants || 1)) * 100;

  const handleJoinMatch = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    router.push(`/tournaments/${match.id}`);
  };

  return (
    <div className="bg-white border border-zinc-100 rounded-2xl p-5 sm:p-8 hover:border-netflix-red/30 transition-all group relative overflow-hidden shadow-sm hover:shadow-xl">
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        {isLive ? (
          <div className="flex items-center gap-2 px-2 py-1 sm:px-3 sm:py-1.5 bg-red-50 border border-red-100 rounded-lg">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-netflix-red animate-pulse" />
            <span className="text-[9px] sm:text-[11px] font-black text-netflix-red uppercase tracking-widest">LIVE</span>
          </div>
        ) : (
          <div className="px-2 py-1 sm:px-3 sm:py-1.5 bg-zinc-50 border border-zinc-100 rounded-lg">
            <span className="text-[9px] sm:text-[11px] font-black text-zinc-500 uppercase tracking-widest">{Math.max(0, (match.maxParticipants || 0) - (match.currentParticipants || 0))} OPEN</span>
          </div>
        )}
        <span className="text-[9px] sm:text-[11px] font-black text-zinc-400 uppercase tracking-[0.1em]">{match.format || match.mode}</span>
      </div>
    
      <h4 className="text-2xl sm:text-3xl font-black text-zinc-900 mb-3 sm:mb-4 group-hover:text-netflix-red transition-colors uppercase tracking-[1px] line-clamp-1" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{match.title}</h4>
      <div className="flex items-center gap-4 sm:gap-6 text-[10px] sm:text-[12px] font-bold text-zinc-400 uppercase tracking-widest mb-6 sm:mb-10 border-b border-zinc-50 pb-4 sm:pb-6">
        <span className="flex items-center gap-2 text-zinc-600 truncate"><Smartphone className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-400" /> {(match.game || '').split('_')[0]}</span>
        <span className="flex items-center gap-2 text-zinc-600"><Target className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-400" /> {match.map || 'ERANGEL'}</span>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-10">
        <div className="space-y-2 sm:space-y-3">
          <p className="text-[8px] sm:text-[10px] text-zinc-400 font-bold uppercase tracking-widest">PRIZE POOL</p>
          <p className="text-2xl sm:text-4xl font-black text-green-600 tracking-wide" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{formatCurrency((match.prizePool || 0) * 100)}</p>
        </div>
        <div className="space-y-2 sm:space-y-3 text-right">
          <p className="text-[8px] sm:text-[10px] text-zinc-400 font-bold uppercase tracking-widest">ENTRY</p>
          <p className="text-2xl sm:text-4xl font-black text-zinc-900 tracking-wide" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{match.entryFee === 0 ? 'FREE' : formatCurrency(match.entryFee * 100)}</p>
        </div>
      </div>

      <div className="mb-6 sm:mb-8 space-y-3 sm:space-y-4">
        <div className="flex justify-between text-[9px] sm:text-[11px] font-black text-zinc-400 uppercase tracking-widest"><span>CAPACITY</span> <span>{match.currentParticipants}/{match.maxParticipants}</span></div>
        <div className="h-2 bg-zinc-100 rounded-full overflow-hidden p-0.5">
          <div className={cn("h-full rounded-full transition-all duration-1000", isLive ? "bg-netflix-red" : "bg-zinc-800")} style={{ width: `${fillPercentage}%` }} />
        </div>
      </div>

      <button 
        onClick={handleJoinMatch}
        disabled={match.status === 'COMPLETED'}
        className={cn("w-full py-4 sm:py-5 text-[10px] sm:text-[12px] font-black uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95", match.status === 'COMPLETED' ? "bg-zinc-100 text-zinc-400 cursor-not-allowed border border-zinc-200" : "bg-netflix-red hover:bg-[#b00710] text-white")}
      >
        {match.status === 'COMPLETED' ? 'FINISHED' : 'JOIN MATCH'}
      </button>
    </div>
  );
}

function Badge({ text, color, light }: { text: string; color: string; light?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2.5 px-4 py-2 bg-white/10 rounded-xl border border-white/20 text-[10px] font-black text-white uppercase tracking-widest shadow-xl", light && "bg-zinc-800")}>
      <div className={cn("w-2 h-2 rounded-full", color)} /> {text}
    </div>
  );
}

function ListStep({ num, title, color }: { num: string; title: string; color: string }) {
  return (
    <li className="flex items-center gap-3 sm:gap-6 group cursor-default">
      <span className="text-xl sm:text-2xl font-black text-zinc-100 group-hover:text-netflix-red transition-all uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{num}</span>
      <div className={cn("w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full shrink-0", color)} />
      <span className="text-[10px] sm:text-xs font-black text-zinc-400 uppercase tracking-[0.2em] group-hover:text-zinc-900 transition-colors truncate">{title}</span>
    </li>
  );
}

function MockStat({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="h-16 bg-zinc-50 rounded-xl p-5 flex items-center justify-between border border-zinc-100 group-hover:bg-white transition-all shadow-sm">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center border border-zinc-100 shadow-sm">{icon}</div>
        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{label}</span>
      </div>
      <span className="text-sm font-black text-zinc-900 tracking-widest">{value}</span>
    </div>
  );
}
