'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTournaments } from '@/app/lib/redux/slices/tournamentSlice';
import { AppDispatch, RootState } from '@/app/lib/redux/store';
import { cn, formatCurrency } from '@/app/lib/utils';
import { useOptionalAuth } from '@/app/providers/auth-provider';
import { Modal, ModalContent } from '@/app/components/ui/modal';
import { 
  Zap, 
  Gamepad2, 
  Users, 
  Timer, 
  ChevronRight, 
  Play, 
  FastForward,
  Flame,
  Target,
  ShieldCheck,
  CreditCard,
  Check,
  Info
} from 'lucide-react';
import Link from 'next/link';

export default function QuickPlayPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const auth = useOptionalAuth();
  const { tournaments, loading: tournamentsLoading } = useSelector((state: RootState) => state.tournament);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Modal State
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinStep, setJoinStep] = useState<'CONFIRM' | 'PAYMENT' | 'SUCCESS'>('CONFIRM');
  const [isProcessing, setIsSubmitting] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchTournaments());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [dispatch]);

  const sortedMatches = [...(tournaments || [])]
    .filter(t => ['LIVE', 'REGISTRATION_OPEN', 'IN_PROGRESS'].includes(t.status))
    .sort((a, b) => 
      new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
    );

  const handleJoinClick = (match: any) => {
    if (!auth?.isAuthenticated) {
      router.push(`/login?redirect=/quick-play`);
      return;
    }
    // Check profile completion if needed, similar to tournament details
    // if (!auth?.user?.gamingProfile?.onboardingCompleted) { ... }

    setSelectedMatch(match);
    setJoinStep('CONFIRM');
    setShowJoinModal(true);
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
    <div className="min-h-screen bg-white text-neutral-900 py-12 px-4 sm:px-6 overflow-hidden relative">

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Hero Section */}
        <div className="text-center mb-12 space-y-6">
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-red-50 border border-red-100 rounded-full text-xs font-black text-netflix-red uppercase tracking-[0.2em] shadow-sm">
            <Zap className="w-4 h-4 fill-current" />
            Instant Action Mode
          </div>
          <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-wider leading-[0.8] text-zinc-900" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            QUICK <span className="text-netflix-red">PLAY</span>
          </h1>
          <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-xs sm:text-sm max-w-2xl mx-auto">
            Skip the lobby wait. Find available slots in matches starting within minutes.
          </p>
        </div>

        {/* Live / Starting Now Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedMatches.map((match) => {
            const startsAt = new Date(match.startsAt);
            const isLive = match.status === 'LIVE' || startsAt <= currentTime;
            const timeDiff = Math.max(0, startsAt.getTime() - currentTime.getTime());
            const mins = Math.floor(timeDiff / 60000);
            const secs = Math.floor((timeDiff % 60000) / 1000);

            return (
              <div key={match.id} className={cn(
                "relative group overflow-hidden rounded-[3rem] border transition-all duration-700 hover:scale-[1.02]",
                isLive ? "bg-white border-red-200 shadow-xl shadow-red-500/5" : "bg-white border-zinc-100 shadow-xl shadow-zinc-200/50"
              )}>
                {/* Visual Accent */}
                <div className={cn(
                  "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700",
                  isLive ? "bg-linear-to-tr from-red-50 to-transparent" : "bg-linear-to-tr from-zinc-50 to-transparent"
                )} />

                <div className="p-6 sm:p-8 relative z-10 space-y-6">
                  {/* Card Header */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-zinc-50 rounded-2xl flex items-center justify-center border border-zinc-100 group-hover:border-red-200 transition-all">
                          <Gamepad2 className="w-5 h-5 text-netflix-red" />
                        </div>
                        <div>
                          <h3 className="text-xl font-black uppercase tracking-wider" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                            {match.title}
                          </h3>
                          <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">{match.map} • {match.perspective}</p>
                        </div>
                      </div>
                    </div>
                    
                    {isLive ? (
                      <div className="flex items-center gap-2 bg-netflix-red px-3 py-1.5 rounded-xl shadow-lg shadow-red-500/20">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-white">LIVE</span>
                      </div>
                    ) : (
                      <div className="bg-zinc-50 border border-zinc-100 px-3 py-1.5 rounded-xl">
                        <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">
                          <span className="text-zinc-900">{mins}m</span>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Match Info Grid */}
                  <div className="grid grid-cols-2 gap-4 py-4 border-y border-zinc-50">
                    <InfoItem icon={<Target className="w-3.5 h-3.5" />} label="ENTRY" value={match.entryFee === 0 ? 'FREE' : `₹${match.entryFee}`} color="text-zinc-900" />
                    <InfoItem icon={<Flame className="w-3.5 h-3.5" />} label="PRIZE" value={`₹${match.prizePool}`} color="text-amber-600" />
                    <InfoItem icon={<Users className="w-3.5 h-3.5" />} label="PLAYERS" value={`${match.currentParticipants}/${match.maxParticipants}`} />
                    <InfoItem icon={<Zap className="w-3.5 h-3.5" />} label="MODE" value={match.format || match.mode} />
                  </div>

                  {/* Progressive Bar */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-zinc-400">
                      <span>Lobby Filling</span>
                      <span>{Math.round(((match.currentParticipants || 0) / (match.maxParticipants || 1)) * 100)}%</span>
                    </div>
                    <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-linear-to-r from-netflix-red to-red-500 transition-all duration-1000" 
                        style={{ width: `${((match.currentParticipants || 0) / (match.maxParticipants || 1)) * 100}%` }} 
                      />
                    </div>
                  </div>

                  {/* CTAs */}
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => handleJoinClick(match)}
                      className={cn(
                        "flex-1 py-3.5 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3",
                        isLive 
                          ? "bg-netflix-red hover:bg-red-700 text-white shadow-xl shadow-red-200" 
                          : "bg-zinc-900 text-white hover:bg-black shadow-xl shadow-zinc-200"
                      )}
                    >
                      {isLive ? <Play className="w-3.5 h-3.5 fill-current text-white" /> : <Zap className="w-3.5 h-3.5 fill-current text-white" />}
                      JOIN MATCH
                    </button>
                    <button 
                      onClick={() => handleJoinClick(match)}
                      className="w-11 h-11 bg-zinc-50 hover:bg-zinc-100 rounded-xl flex items-center justify-center border border-zinc-100 transition-all group/btn"
                    >
                      <ChevronRight className="w-4 h-4 text-zinc-400 group-hover/btn:text-zinc-900 transition-colors" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Join Modal */}
      {selectedMatch && (
        <Modal isOpen={showJoinModal} onClose={() => !isProcessing && setShowJoinModal(false)} size="md" className="bg-transparent border-none shadow-none">
          <ModalContent className="p-0 overflow-hidden bg-white border border-zinc-100 rounded-3xl sm:rounded-[2.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.1)]">
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
                      <span className="text-xs sm:text-sm font-black text-zinc-900 uppercase tracking-widest">{selectedMatch.title}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <p className="text-[7px] sm:text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-1">INGAME NAME</p>
                        <p className="text-xs sm:text-sm font-black text-zinc-900 truncate uppercase">{auth?.user?.gamingProfile?.bgmiUsername || auth?.user?.gamingProfile?.pubgUsername || 'NOT SET'}</p>
                      </div>
                      <div>
                        <p className="text-[7px] sm:text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-1">CHARACTER ID</p>
                        <p className="text-xs sm:text-sm font-black text-zinc-900 truncate uppercase">{auth?.user?.gamingProfile?.bgmiId || auth?.user?.gamingProfile?.pubgId || 'NOT SET'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 sm:p-6 bg-zinc-50 border border-zinc-100 rounded-xl sm:rounded-2xl shadow-sm">
                    <span className="text-[9px] sm:text-[10px] font-black text-zinc-400 uppercase tracking-widest">DUE FOR ENTRY</span>
                    <span className="text-2xl sm:text-3xl font-black text-zinc-900" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{selectedMatch.entryFee === 0 ? 'FREE' : formatCurrency(selectedMatch.entryFee || 0)}</span>
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
                  <div className="absolute inset-0 border-4 sm:border-[5px] border-zinc-100 rounded-full" />
                  <div className="absolute inset-0 border-4 sm:border-[5px] border-netflix-red border-t-transparent rounded-full animate-spin" />
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
      )}
    </div>
  );
}

function InfoItem({ icon, label, value, color = "text-zinc-900" }: any) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-zinc-500">
        {icon}
        <span className="text-[8px] font-black uppercase tracking-widest">{label}</span>
      </div>
      <p className={cn("text-sm font-black uppercase", color)}>{value}</p>
    </div>
  );
}
