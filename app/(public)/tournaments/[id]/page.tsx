'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTournamentById } from '@/app/lib/redux/slices/tournamentSlice';
import { AppDispatch, RootState } from '@/app/lib/redux/store';
import { useOptionalAuth } from '@/app/providers/auth-provider';
import { formatCurrency, formatDateTime, cn } from '@/app/lib/utils';
import { Modal, ModalContent } from '@/app/components/ui/modal';
import {
  Trophy,
  Calendar,
  MapPin,
  Users,
  Gamepad2,
  Eye,
  Clock,
  CheckCircle,
  Award,
  ChevronRight,
  Share2,
  AlertCircle,
  Info,
  ArrowLeft,
  Crosshair,
  Smartphone,
  ShieldCheck,
  Zap,
  DollarSign,
  Timer,
  ArrowRight,
  Lock,
  CreditCard,
  UserCheck,
  Loader2,
  Check,
  Flame,
  Target,
  Shield,
  Layers,
  Table as TableIcon
} from 'lucide-react';



interface TournamentDetailsPageProps {
  params: Promise<{ id: string }>;
}



export default function TournamentDetailsPage({ params }: TournamentDetailsPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const auth = useOptionalAuth();

  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinStep, setJoinStep] = useState<'CONFIRM' | 'PAYMENT' | 'SUCCESS'>('CONFIRM');
  const [isProcessing, setIsSubmitting] = useState(false);

  const { currentTournament: tournament, loading: fetchLoading, error: fetchError } = useSelector((state: RootState) => state.tournament);

  useEffect(() => {
    if (id) {
      dispatch(fetchTournamentById(id));
    }
  }, [id, dispatch]);

  if (fetchLoading || (!tournament && !fetchError)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="w-16 h-16 border-4 border-netflix-red border-t-transparent rounded-full animate-spin mb-6" />
        <h2 className="text-2xl font-black text-zinc-900 uppercase tracking-widest" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>RETRIEVING MISSION INTEL</h2>
      </div>
    );
  }

  if (!tournament && !fetchLoading) {
    notFound();
  }

  const slotsRemaining = tournament.maxParticipants - tournament.currentParticipants;
  const isFull = slotsRemaining <= 0;
  const canJoin = ['APPROVED', 'REGISTRATION_OPEN'].includes(tournament.status as string) && !isFull;
  const isLive = tournament.status === 'LIVE' || tournament.status === 'IN_PROGRESS';
  const fillPercentage = (tournament.currentParticipants / tournament.maxParticipants) * 100;

  const isProfileComplete = auth?.user?.gamingProfile?.onboardingCompleted;

  const handleJoinClick = () => {
    if (!auth?.isAuthenticated) {
      router.push(`/login?redirect=/tournaments/${tournament.id}`);
      return;
    }
    
    // Always redirect to the new onboarding/join flow to ensure squad setup and payment logic
    router.push(`/onboarding?tournamentId=${tournament.id}`);
  };

  const handleProcessPayment = async () => {
    setJoinStep('PAYMENT');
    setIsSubmitting(true);
    // Simulate payment
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setJoinStep('SUCCESS');
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-zinc-900 pb-40 overflow-x-hidden">

      {/* 1. Feature Hero Section (Redesigned for Netflix White) */}
      <section className="relative pt-10 pb-20 overflow-hidden">
        <div className="max-w-[1240px] mx-auto px-6">
          {/* Breadcrumb HUD */}
          <Link
            href="/tournaments"
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-white border border-zinc-100 text-[9px] sm:text-[10px] font-black text-zinc-400 hover:text-zinc-900 shadow-sm hover:shadow-md uppercase tracking-[0.2em] mb-8 sm:mb-12 transition-all group w-fit"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:-translate-x-1 transition-transform" />
            ALL TOURNAMENTS
          </Link>

          <div className="flex flex-col lg:flex-row bg-white rounded-2xl sm:rounded-[2.5rem] overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.04)] border border-zinc-100 min-h-[500px] sm:min-h-[600px]">
            {/* Left: Immersive Visual Split */}
            <div className="lg:w-[60%] relative aspect-video lg:aspect-auto overflow-hidden min-h-[300px] sm:min-h-[400px]">
              <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/60 via-zinc-900/20 to-transparent z-10" />
              <img
                src={tournament.thumbnailUrl || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop'}
                alt={tournament.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-zinc-900/20 to-transparent z-10" />

              <div className="absolute bottom-8 left-8 sm:bottom-16 sm:left-16 z-20 max-w-xl">
                <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
                  <div className={cn(
                    "px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 sm:gap-2 shadow-lg",
                    isLive ? "bg-netflix-red text-white" : "bg-white text-zinc-900"
                  )}>
                    {isLive && <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse shadow-[0_0_10px_white]" />}
                    {tournament.status === 'REGISTRATION_OPEN' ? 'OPEN' : (tournament.status || 'ACTIVE').replace('_', ' ')}
                  </div>
                  <div className="px-3 sm:px-4 py-1 sm:py-1.5 bg-black/40 backdrop-blur-md border border-white/20 text-white rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-widest">
                    {(tournament.game || 'BGMI').split('_')[0]} • {tournament.format || 'SQUAD'}
                  </div>
                </div>

                <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-[7.5rem] font-black text-white leading-[0.85] tracking-tight uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                  {tournament.title.split(' ').slice(0, -1).join(' ')} <br />
                  <span className="text-netflix-red">{tournament.title.split(' ').slice(-1)}</span>
                </h1>
              </div>
            </div>

            {/* Right: Operational Hub */}
            <div className="lg:w-[40%] p-8 sm:p-12 lg:p-16 flex flex-col justify-between bg-zinc-50/30 border-l border-zinc-100 min-h-[400px] sm:min-h-[500px]">
              <div className="space-y-8 sm:space-y-12 text-center lg:text-left">
                <div className="space-y-3">
                  <h3 className="text-[9px] sm:text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em]">ORGANIZER</h3>
                  <div className="flex items-center justify-center lg:justify-start gap-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-white shadow-sm flex items-center justify-center border border-zinc-100">
                      <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8 text-netflix-red" />
                    </div>
                    <div className="text-left">
                      <p className="text-xl sm:text-2xl font-black text-zinc-900 uppercase tracking-wide" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{tournament.organizerName}</p>
                      <p className="text-[8px] sm:text-[9px] font-black text-green-600 uppercase tracking-widest flex items-center gap-1.5">
                        <CheckCircle className="w-3 h-3" /> VERIFIED
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-[9px] sm:text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em]">MATCH STARTS</h3>
                  <div className="flex items-center justify-center lg:justify-start gap-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-white shadow-sm flex items-center justify-center border border-zinc-100">
                      <Timer className="w-6 h-6 sm:w-8 sm:h-8 text-zinc-800" />
                    </div>
                    <div className="text-left">
                      <p className="text-xl sm:text-2xl font-black text-zinc-900 uppercase tracking-wide" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{formatDateTime(tournament.startsAt || tournament.startTime)}</p>
                      <p className="text-[8px] sm:text-[9px] font-black text-zinc-400 uppercase tracking-widest">LOCAL IST TIME</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 sm:pt-8 border-t border-zinc-100">
                  <div className="flex justify-between items-end mb-4">
                    <div className="text-left">
                      <p className="text-[9px] sm:text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em] mb-1 sm:mb-2">TOTAL PRIZE</p>
                      <p className="text-4xl sm:text-5xl font-black text-zinc-900 leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{formatCurrency(tournament.prizePool * 100)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] sm:text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em] mb-1 sm:mb-2">ENTRY FEE</p>
                      <p className="text-2xl sm:text-3xl font-black text-zinc-900 leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{tournament.entryFee === 0 ? 'FREE' : formatCurrency(tournament.entryFee * 100)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mt-10 sm:mt-12 hidden lg:block">
                {canJoin ? (
                  <button
                    onClick={handleJoinClick}
                    className="w-full py-6 bg-netflix-red hover:bg-[#b00710] text-white text-[11px] font-black rounded-2xl transition-all uppercase tracking-widest shadow-xl shadow-red-500/10 active:scale-95 flex items-center justify-center gap-3"
                  >
                    {!auth?.isAuthenticated ? 'SIGN IN TO JOIN' :
                      !isProfileComplete ? 'COMPLETE PROFILE' :
                        <>JOIN TOURNAMENT <ChevronRight className="w-5 h-5" /></>}
                  </button>
                ) : (
                  <button className="w-full py-6 bg-zinc-100 text-zinc-400 text-[10px] font-black rounded-2xl uppercase tracking-widest cursor-not-allowed border border-zinc-200" disabled>
                    {isFull ? 'MATCH FULL' : 'ENTRY CLOSED'}
                  </button>
                )}
                <button className="w-full py-5 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-600 text-[10px] font-black rounded-2xl transition-all uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95">
                  <Share2 className="w-5 h-5" /> SHARE TOURNAMENT
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Content Briefing Sections */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-16 mt-8 sm:mt-12">
        {/* Main Intelligence */}
        <div className="lg:col-span-8 space-y-12 sm:space-y-20">
          {/* Technical Specifications Overlay */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <SpecCard icon={<MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-netflix-red" />} label="MAP" value={tournament.map} color="bg-red-50 text-red-600 border-red-100" />
            <SpecCard icon={<Target className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-700" />} label="VIEW" value={tournament.perspective} color="bg-zinc-50 text-zinc-900 border-zinc-100" />
            <SpecCard icon={<Users className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-700" />} label="SQUAD" value={tournament.format} color="bg-zinc-50 text-zinc-900 border-zinc-100" />
            <SpecCard icon={<Layers className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-700" />} label="TIER" value="ELITE" color="bg-zinc-50 text-zinc-900 border-zinc-100" />
          </div>

          {/* Detailed Objective */}
          <div className="space-y-6 sm:space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-1 h-6 sm:w-1.5 sm:h-8 bg-netflix-red rounded-full" />
              <h2 className="text-2xl sm:text-4xl font-black text-zinc-900 uppercase tracking-tight" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                ABOUT <span className="text-netflix-red">TOURNAMENT</span>
              </h2>
            </div>
            <div className="bg-white border border-zinc-100 rounded-3xl sm:rounded-[2.5rem] p-8 sm:p-12 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-zinc-50 rounded-full blur-3xl -mr-24 -mt-24 sm:-mr-32 sm:-mt-32" />
              <p className="relative z-10 text-zinc-500 text-sm sm:text-lg font-medium leading-relaxed tracking-wide whitespace-pre-line">
                {tournament.description}
              </p>
            </div>
          </div>

          {/* Rewards Architecture */}
          <div className="space-y-6 sm:space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-1 h-6 sm:w-1.5 sm:h-8 bg-green-500 rounded-full" />
              <h2 className="text-2xl sm:text-4xl font-black text-zinc-900 uppercase tracking-tight" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                REWARDS <span className="text-green-600">DISTRIBUTION</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
              {/* Detailed Rank Payouts */}
              <div className="bg-white border border-zinc-100 rounded-3xl sm:rounded-[2.5rem] overflow-hidden shadow-sm">
                <div className="px-6 py-5 sm:px-10 sm:py-8 bg-zinc-50 border-b border-zinc-100 flex justify-between items-center">
                  <span className="text-[8px] sm:text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em]">RANKING</span>
                  <span className="text-[8px] sm:text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em]">PRIZE</span>
                </div>
                <div className="divide-y divide-zinc-50">
                  {tournament.prizeDistribution.map((prize: any, idx: number) => (
                    <div key={idx} className="px-6 py-5 sm:px-10 sm:py-7 flex justify-between items-center group hover:bg-zinc-50 transition-colors">
                      <div className="flex items-center gap-4 sm:gap-6">
                        <div className={cn(
                          "w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-xs sm:text-sm font-black shadow-sm",
                          idx === 0 ? "bg-amber-100 text-amber-600 border border-amber-200" :
                            idx === 1 ? "bg-zinc-100 text-zinc-600 border border-zinc-200" :
                              idx === 2 ? "bg-orange-50 text-orange-600 border border-orange-100" : "bg-white border border-zinc-100 text-zinc-300"
                        )}>
                          {prize.position}
                        </div>
                        <span className="text-[11px] sm:text-sm font-black text-zinc-900 uppercase tracking-widest">{prize.label}</span>
                      </div>
                      <span className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                        {formatCurrency(
                          (idx === 0 && tournament.firstPrice > 0 ? tournament.firstPrice :
                          idx === 1 && tournament.secondPrice > 0 ? tournament.secondPrice :
                          idx === 2 && tournament.thirdPrice > 0 ? tournament.thirdPrice :
                          prize.amount) * 100
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tactical Multipliers */}
              <div className="space-y-6 sm:space-y-8">
                {tournament.prizePerKill > 0 && (
                  <div className="bg-zinc-900 rounded-3xl sm:rounded-[2.5rem] p-8 sm:p-10 flex flex-col justify-between h-[180px] sm:h-[220px] shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-netflix-red opacity-10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:opacity-20 transition-opacity" />
                    <div className="flex justify-between items-start">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/10 rounded-xl sm:rounded-2xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                        <Crosshair className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                      </div>
                      <div className="text-right">
                        <p className="text-[8px] sm:text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] mb-1">ELIMINATION</p>
                        <p className="text-4xl sm:text-5xl font-black text-white tracking-tight" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{formatCurrency(tournament.prizePerKill * 100)}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wide leading-none mb-1" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>KILL PRIZE</h4>
                      <p className="text-[8px] sm:text-[9px] font-black text-zinc-500 uppercase tracking-widest">CASH PER KILL</p>
                    </div>
                  </div>
                )}

                <div className="bg-white border border-zinc-100 rounded-3xl sm:rounded-[2.5rem] p-8 sm:p-10 shadow-sm">
                  <div className="flex items-center gap-3 mb-6 sm:mb-8">
                    <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-netflix-red" />
                    <h4 className="text-[9px] sm:text-[10px] font-black text-zinc-900 uppercase tracking-[0.4em]">FAIR PLAY</h4>
                  </div>
                  <ul className="grid grid-cols-1 gap-4 sm:gap-5">
                    {['ID VERIFICATION DONE', 'ANTI-CHEAT SYSTEM', 'INSTANT WITHDRAWALS', '24/7 HELP & SUPPORT'].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 sm:gap-4 text-[8px] sm:text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                        <div className="w-1.5 h-1.5 bg-zinc-200 rounded-full" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Engagement Regulations */}
          <div className="space-y-6 sm:space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-1 h-6 sm:w-1.5 sm:h-8 bg-zinc-900 rounded-full" />
              <h2 className="text-2xl sm:text-4xl font-black text-zinc-900 uppercase tracking-tight" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                MATCH <span className="text-zinc-500">RULES</span>
              </h2>
            </div>
            <div className="bg-white border border-zinc-100 rounded-3xl sm:rounded-[2.5rem] p-8 sm:p-12 shadow-sm">
              <div className="space-y-4 sm:space-y-6">
                {tournament.rules.split('\n').map((rule: string, i: number) => (
                  <div key={i} className="flex gap-4 sm:gap-6 items-start">
                    <span className="text-[8px] sm:text-[10px] font-black text-zinc-300 mt-1 sm:mt-2 tracking-[0.2em]">{(i + 1).toString().padStart(2, '0')}</span>
                    <p className="text-zinc-500 text-xs sm:text-sm font-semibold uppercase tracking-widest leading-loose">{rule}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Right Panel - Strategic HUD (Hidden on mobile, sticky on desktop) */}
        <div className="lg:col-span-4 hidden lg:block">
          <div className="sticky top-24 space-y-10">
            {/* Deployment Status Card */}
            <div className="bg-zinc-900 rounded-[3rem] p-12 shadow-[0_40px_80px_rgba(0,0,0,0.15)] text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-40 h-40 bg-netflix-red opacity-10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:opacity-20 transition-opacity" />

              <div className="relative z-10 space-y-10">
                <div className="flex justify-between items-start">
                  <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center border border-white/10 backdrop-blur-md">
                    <Zap className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] mb-2 text-right">TOTAL SPOTS</p>
                    <p className="text-4xl font-black text-white leading-none tracking-tight" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{fillPercentage.toFixed(0)}% FULL</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-zinc-500">PLAYERS JOINED</span>
                    <span>{tournament.currentParticipants} / {tournament.maxParticipants}</span>
                  </div>
                  <div className="h-3 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/10 shadow-inner">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-1000",
                        fillPercentage >= 90 ? "bg-netflix-red" : "bg-white"
                      )}
                      style={{ width: `${fillPercentage}%` }}
                    />
                  </div>
                </div>

                <div className="pt-8 border-t border-white/5 grid grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2">PLAYERS JOINED</h4>
                    <p className="text-3xl font-black text-white" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{tournament.currentParticipants}</p>
                  </div>
                  <div>
                    <h4 className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2">SPOTS REMAINING</h4>
                    <p className="text-3xl font-black text-white" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{slotsRemaining}</p>
                  </div>
                </div>

                <button
                  onClick={handleJoinClick}
                  className="w-full py-6 bg-white text-zinc-900 hover:bg-zinc-200 transition-all text-sm font-black rounded-2xl uppercase tracking-widest shadow-2xl active:scale-95 flex items-center justify-center gap-3"
                >
                  JOIN NOW <ChevronRight className="w-6 h-6 text-zinc-400" />
                </button>
              </div>
            </div>

            {/* Operational Support Center */}
            <div className="bg-white border border-zinc-100 rounded-[2.5rem] p-10 shadow-sm space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-zinc-50 rounded-xl flex items-center justify-center border border-zinc-100">
                  <AlertCircle className="w-6 h-6 text-zinc-400" />
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-zinc-900 uppercase tracking-[0.4em]">HELP & SUPPORT</h4>
                  <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">ACTIVE 24/7</p>
                </div>
              </div>
              <p className="text-[11px] font-black text-zinc-400 uppercase tracking-widest leading-loose">
                HAVE ISSUES WITH TOURNAMENT CODES OR PAYMENTS? OUR SUPPORT TEAM IS READY TO ASSIST YOU.
              </p>
              <button className="text-[11px] font-bold text-zinc-900 uppercase tracking-widest border-b-2 border-zinc-900 pb-1 hover:text-netflix-red hover:border-netflix-red transition-all">
                OPEN SUPPORT TICKET
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Mobile Sticky HUD (Visible only on mobile) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[120] bg-white border-t border-zinc-100 p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] backdrop-blur-xl bg-white/90">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black text-zinc-900 tracking-tight" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{formatCurrency(tournament.entryFee * 100)}</span>
              <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">• {slotsRemaining} SPOTS LEFT</span>
            </div>
            <div className="h-1 bg-zinc-100 rounded-full overflow-hidden">
              <div
                className={cn("h-full transition-all duration-1000", fillPercentage >= 90 ? "bg-netflix-red" : "bg-zinc-800")}
                style={{ width: `${fillPercentage}%` }}
              />
            </div>
          </div>
          {canJoin ? (
            <button
              onClick={handleJoinClick}
              className="px-8 py-3.5 bg-netflix-red text-white text-[10px] font-black rounded-xl uppercase tracking-widest shadow-lg shadow-red-500/20 active:scale-95"
            >
              JOIN MATCH
            </button>
          ) : (
            <button className="px-8 py-3.5 bg-zinc-100 text-zinc-400 text-[10px] font-black rounded-xl uppercase tracking-widest cursor-not-allowed" disabled>
              FULL
            </button>
          )}
        </div>
      </div>

      {/* Join Modal - Redesigned */}
      <Modal isOpen={showJoinModal} onClose={() => !isProcessing && setShowJoinModal(false)} size="md" className="bg-transparent border-none shadow-none">
        <ModalContent className="p-0 overflow-hidden bg-white border border-zinc-100 rounded-3xl sm:rounded-[2.5rem] ">
          {joinStep === 'CONFIRM' && (
            <div className="p-6 sm:p-10 space-y-6 sm:space-y-8">
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-zinc-50 border border-zinc-100 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-sm overflow-hidden group">
                  <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8 text-netflix-red group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-2xl sm:text-4xl font-black text-zinc-900 uppercase tracking-tight" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>JOIN <span className="text-netflix-red">CONFIRMATION</span></h3>
                <p className="text-zinc-400 text-[8px] sm:text-[9px] font-black uppercase tracking-[0.3em] mt-1.5">VERIFYING YOUR PLAYER DETAILS</p>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="bg-zinc-50 border border-zinc-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-3 sm:space-y-4">
                  <div className="flex justify-between items-center border-b border-zinc-200 pb-3 sm:pb-4">
                    <span className="text-[8px] sm:text-[9px] font-black text-zinc-400 uppercase tracking-widest">SELECTED MATCH</span>
                    <span className="text-xs sm:text-sm font-black text-zinc-900 uppercase tracking-widest">{tournament.title}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <p className="text-[7px] sm:text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-1">INGAME NAME</p>
                      <p className="text-xs sm:text-sm font-black text-zinc-900 truncate uppercase">{auth?.user?.gamingProfile?.bgmiUsername || auth?.user?.gamingProfile?.pubgUsername}</p>
                    </div>
                    <div>
                      <p className="text-[7px] sm:text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-1">CHARACTER ID</p>
                      <p className="text-xs sm:text-sm font-black text-zinc-900 truncate uppercase">{auth?.user?.gamingProfile?.bgmiId || auth?.user?.gamingProfile?.pubgId}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 sm:p-6 bg-zinc-50 border border-zinc-100 rounded-xl sm:rounded-2xl shadow-sm">
                  <span className="text-[9px] sm:text-[10px] font-black text-zinc-400 uppercase tracking-widest">DUE FOR ENTRY</span>
                  <span className="text-2xl sm:text-3xl font-black text-zinc-900" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{tournament.entryFee === 0 ? 'FREE' : formatCurrency(tournament.entryFee * 100)}</span>
                </div>
              </div>

              <button
                onClick={handleProcessPayment}
                className="w-full py-4 sm:py-5 bg-netflix-red text-white text-[10px] sm:text-[11px] font-black rounded-xl sm:rounded-2xl uppercase tracking-widest shadow-xl shadow-red-500/10 active:scale-95 flex items-center justify-center gap-2 sm:gap-3"
              >
                JOIN MATCH <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-white/50" />
              </button>
            </div>
          )}

          {joinStep === 'PAYMENT' && (
            <div className="p-12 sm:p-16 text-center space-y-6 sm:space-y-8">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto">
                <div className="absolute inset-0 border-[4px] sm:border-[5px] border-zinc-100 rounded-full" />
                <div className="absolute inset-0 border-[4px] sm:border-[5px] border-netflix-red border-t-transparent rounded-full animate-spin" />
                <CreditCard className="absolute inset-0 m-auto w-6 h-6 sm:w-8 sm:h-8 text-zinc-900" />
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-zinc-900 uppercase tracking-tight" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>PROCESSING...</h3>
                <p className="text-zinc-400 text-[8px] sm:text-[9px] font-black uppercase tracking-[0.3em] mt-2">JOINING TOURNAMENT...</p>
              </div>
            </div>
          )}

          {joinStep === 'SUCCESS' && (
            <div className="p-6 sm:p-10 space-y-6 sm:space-y-8 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto shadow-xl shadow-green-500/20">
                <Check className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>
              <div className="space-y-2 sm:space-y-3">
                <h3 className="text-3xl sm:text-4xl font-black text-zinc-900 uppercase tracking-tight leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>JOINED <br /> <span className="text-green-600">SUCCESSFULLY</span></h3>
                <p className="text-zinc-500 text-[8px] sm:text-[9px] font-black uppercase tracking-widest">YOUR SLOT HAS BEEN RESERVED IN THE MATCH</p>
              </div>

              <div className="bg-zinc-50 border border-zinc-100 rounded-2xl sm:rounded-4xl p-5 sm:p-8 text-left space-y-3 sm:space-y-4 relative overflow-hidden">
                <div className="flex items-start gap-4 sm:gap-5">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg sm:rounded-xl flex items-center justify-center border border-zinc-100 shadow-sm shrink-0">
                    <Info className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-900" />
                  </div>
                  <div>
                    <h4 className="text-[9px] sm:text-[10px] font-black text-zinc-900 uppercase tracking-widest mb-1 sm:mb-1.5">ACCESS CODES</h4>
                    <p className="text-[9px] sm:text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-relaxed">
                      ROOM ID AND PASSWORD WILL BE AVAILABLE IN YOUR <span className="text-zinc-900 underline underline-offset-4">DASHBOARD</span> 10-15 MINUTES BEFORE MATCH START.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => router.push('/participant/dashboard')}
                className="w-full py-4 sm:py-5 bg-zinc-900 text-white text-[10px] sm:text-[11px] font-black rounded-xl sm:rounded-2xl uppercase tracking-widest shadow-xl active:scale-95 flex items-center justify-center gap-2 sm:gap-3"
              >
                GO TO DASHBOARD <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-white/50" />
              </button>
            </div>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

function SpecCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className={cn("rounded-xl sm:rounded-2xl p-4 sm:p-6 border transition-all hover:shadow-md", color)}>
      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white shadow-sm flex items-center justify-center mb-3 sm:mb-5 border border-inherit">
        {icon}
      </div>
      <p className="text-[7px] sm:text-[8px] font-black uppercase tracking-[0.3em] mb-0.5 sm:mb-1 opacity-60">{label}</p>
      <p className="text-xs sm:text-sm font-black uppercase tracking-widest">{value}</p>
    </div>
  );
}

