'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { cn, formatCurrency } from '@/app/lib/utils';
import {
  Users,
  Trophy,
  Plus,
  Trash2,
  ChevronRight,
  Gamepad2,
  Crosshair,
  Shield,
  Clock,
  AlertCircle,
  Loader2,
  MapPin,
  Calendar
} from 'lucide-react';
import { AppDispatch, RootState } from '@/app/lib/redux/store';
import { joinTournament, resetJoinState } from '@/app/lib/redux/slices/joinTournamentSlice';
import { fetchTournamentById } from '@/app/lib/redux/slices/tournamentSlice';
import { fetchPaymentConfig, resetPaymentState, setRegistrationId } from '@/app/lib/redux/slices/paymentSlice';
import { fetchProfile, createProfile } from '@/app/lib/redux/slices/profileSlice';
import { useRazorpay } from '@/app/lib/hooks/useRazorpay';
import { useAuth } from '@/app/providers/auth-provider';

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useAuth();
  const { openRazorpay } = useRazorpay();
  
  const tournamentId = searchParams.get('tournamentId');

  const { loading: joinLoading, success: joinSuccess, error: joinError } = useSelector((state: RootState) => state.joinTournament);
  const { config: paymentConfig, loading: paymentLoading, paymentSuccess, error: paymentError, registrationId } = useSelector((state: RootState) => state.payment);
  const { currentTournament, loading: tournamentLoading, error: tournamentError } = useSelector((state: RootState) => state.tournament);
  const { data: profile, loading: profileLoading, hasProfile } = useSelector((state: RootState) => (state as any).profile);

  // Form State
  const [teamName, setTeamName] = useState('');
  const [teammates, setTeammates] = useState([
    { userId: '', pubgId: '', pubgName: '' }
  ]);

  // Fetch Tournament Details
  useEffect(() => {
    if (tournamentId) {
      dispatch(fetchTournamentById(tournamentId));
    }
  }, [tournamentId, dispatch]);

  // Fetch User Profile
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchProfile());
    }
  }, [isAuthenticated, dispatch]);

  // Sync user profile to first teammate slot
  useEffect(() => {
    if (user && teammates[0].userId === '' && teammates.length === 1) {
      setTeammates([{
        userId: user.id,
        pubgId: user.gamingProfile?.bgmiId || user.gamingProfile?.pubgId || '',
        pubgName: user.gamingProfile?.bgmiUsername || user.gamingProfile?.pubgUsername || user.name || ''
      }]);
    }
  }, [user, teammates]);

  // Timer State (10 Minutes Expiry) - Starts only after join
  const [timeLeft, setTimeLeft] = useState(600); // 600 seconds = 10 minutes
  const [isExpired, setIsExpired] = useState(false);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    if (!timerActive || timeLeft <= 0) {
      if (timerActive && timeLeft <= 0) setIsExpired(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, timerActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Add a new empty teammate slot
  const addTeammate = () => {
    // Check max team size based on tournament format if available
    const maxSize = currentTournament?.format === 'DUO' ? 2 : currentTournament?.format === 'SOLO' ? 1 : 4;
    
    if (teammates.length >= maxSize) return;

    setTeammates([
      ...teammates,
      { userId: `user-${Date.now() + Math.random()}`, pubgId: '', pubgName: '' }
    ]);
  };

  // Remove a teammate slot
  const removeTeammate = (index: number) => {
    const newTeammates = [...teammates];
    newTeammates.splice(index, 1);
    setTeammates(newTeammates);
  };

  // Handle input changes for teammates
  const handleTeammateChange = (index: number, field: 'pubgId' | 'pubgName', value: string) => {
    const newTeammates = [...teammates];
    newTeammates[index][field] = value;
    setTeammates(newTeammates);
  };

  // Handle successful payment
  useEffect(() => {
    if (paymentSuccess) {
      router.push('/participant/dashboard?success=true');
    }
  }, [paymentSuccess, router]);

  // Handle Payment Trigger when config is fetched
  useEffect(() => {
    if (paymentConfig) {
      // Map to fields expected by Razorpay SDK
      const options = {
        ...paymentConfig,
        key: paymentConfig.keyId,
        order_id: paymentConfig.orderId
      };
      console.log("💳 Opening Razorpay with options:", options, "Registration ID:", registrationId);
      openRazorpay(options, registrationId);
    }
  }, [paymentConfig, openRazorpay, registrationId]);


  // Submit Logic
  const handleNext = async () => {
    if (isExpired || !tournamentId) return;

    // 0. Ensure Profile Exists (Gaming Passport)
    if (!hasProfile) {
      console.log("📝 Profile missing. Creating profile before joining...");
      const leader = teammates[0];
      const profilePayload = {
        fullName: user?.name || leader.pubgName,
        phoneNumber: user?.phone || '',
        bgmiId: leader.pubgId,
        pubgId: leader.pubgId
      };
      
      try {
        await dispatch(createProfile(profilePayload)).unwrap();
      } catch (err: any) {
        console.error("❌ Failed to create profile:", err);
        // We continue if error isn't fatal, but usually join will fail soon
      }
    }

    const payload = {
      tournamentId,
      teamName,
      teamMembers: teammates.map((t, idx) => ({
        userId: t.userId || `user-${Date.now()}-${idx}`,
        name: t.pubgName,
        role: (idx === 0 ? 'LEADER' : 'MEMBER') as 'LEADER' | 'MEMBER',
        bgmiId: t.pubgId, // Sending as part of member info
        pubgId: t.pubgId
      }))
    };

    console.log("🚀 Joining Tournament:", tournamentId, "Payload:", payload);
    
    // 1. Join Tournament
    const resultAction = await dispatch(joinTournament(payload));
    
    if (joinTournament.fulfilled.match(resultAction)) {
      const regId = resultAction.payload.registrationId || resultAction.payload.data?.registrationId;
      console.log("✅ Joined successfully. Registration ID:", regId);
      
      if (regId) {
        dispatch(setRegistrationId(regId));
      }

      console.log("🚀 Starting timer and fetching payment config...");
      // 2. Start Timer
      setTimerActive(true);
      // 3. Fetch Payment Config
      dispatch(fetchPaymentConfig(tournamentId));
    }

  };

  // Validation to enable button
  const isValid = teamName.length > 2 && teammates.every(t => t.pubgId.length > 3 && t.pubgName.length > 2);
  const isProcessing = joinLoading || paymentLoading;

  // Retrieve max team size
  const maxTeamSize = currentTournament?.format === 'DUO' ? 2 : currentTournament?.format === 'SOLO' ? 1 : 4;

  if (tournamentLoading) {
    return (
      <div className="min-h-screen bg-netflix-black text-white flex flex-col items-center justify-center p-4">
        <Loader2 className="w-12 h-12 text-netflix-red animate-spin mb-4" />
        <p className="text-netflix-gray-500 font-bold uppercase tracking-widest">Loading Tournament Details...</p>
      </div>
    );
  }

  if (!tournamentId || (!currentTournament && !tournamentLoading) || tournamentError) {
    return (
      <div className="min-h-screen bg-netflix-black text-white flex flex-col items-center justify-center p-4">
        <div className="glass-panel p-12 text-center max-w-md rounded-3xl space-y-6 border border-white/10 bg-black/40 backdrop-blur-xl">
          <AlertCircle className="w-20 h-20 text-netflix-red mx-auto" />
          <h1 className="text-3xl font-black uppercase">Tournament Not Found</h1>
          <p className="text-netflix-gray-500">
            {tournamentError || "We couldn't find the tournament you are trying to join. Please select a valid tournament from the list."}
          </p>
          <button 
            onClick={() => router.push('/tournaments')}
            className="w-full py-4 bg-netflix-red rounded-xl font-bold uppercase tracking-widest hover:bg-red-700 transition-colors"
          >
            Go to Tournaments
          </button>
        </div>
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className="min-h-screen bg-netflix-black text-white flex flex-col items-center justify-center p-4">
        <div className="glass-panel p-12 text-center max-w-md rounded-3xl space-y-6 border border-white/10 bg-black/40 backdrop-blur-xl">
          <AlertCircle className="w-20 h-20 text-netflix-red mx-auto animate-pulse" />
          <h1 className="text-3xl font-black uppercase">Session Expired</h1>
          <p className="text-netflix-gray-500">The 10-minute registration window has closed. Please go back and restart the process.</p>
          <button 
            onClick={() => {
              dispatch(resetJoinState());
              dispatch(resetPaymentState());
              setTimerActive(false);
              setTimeLeft(600);
              setIsExpired(false);
            }}
            className="w-full py-4 bg-netflix-red rounded-xl font-bold uppercase tracking-widest hover:bg-red-700 transition-colors"
          >
            Retry Registration
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-netflix-black text-white font-sans selection:bg-netflix-red selection:text-white flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-x-hidden">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-netflix-red/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[150px]" />
      </div>

      <div className="w-full max-w-3xl relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Header & Tournament Info */}
        <div className="mb-8 md:mb-10 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="p-3 bg-netflix-red/20 rounded-xl border border-netflix-red/30 shadow-glow-red">
                  <Trophy className="w-6 h-6 text-netflix-red" />
                </div>
                <span className="text-sm font-bold tracking-[0.2em] text-netflix-gray-400 uppercase">
                  Registration
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black italic uppercase leading-none mb-2">
                Assemble Your <span className="text-transparent bg-clip-text bg-linear-to-r from-netflix-red to-rose-600">Squad</span>
              </h1>
            </div>

            {/* 10-Min Timer UI - Show only if active */}
            {timerActive && (
              <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 flex items-center gap-4 backdrop-blur-md animate-in fade-in zoom-in duration-300">
                <div className={timeLeft < 60 ? "text-netflix-red animate-pulse" : "text-netflix-blue"}>
                  <Clock className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <div className="text-[10px] font-black text-netflix-gray-500 uppercase tracking-widest leading-none mb-1">Expires In</div>
                  <div className={cn(
                    "text-2xl font-black font-mono tabular-nums leading-none",
                    timeLeft < 60 ? "text-netflix-red" : "text-white"
                  )}>
                    {formatTime(timeLeft)}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tournament Summary Card */}
          {currentTournament && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-center gap-6 backdrop-blur-md">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden shrink-0 border border-white/10 bg-zinc-900">
                <img 
                  src={currentTournament.thumbnailUrl || '/games/bgmi_classic.png'} 
                  alt={currentTournament.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center md:text-left flex-1">
                <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white mb-2">
                  {currentTournament.title}
                </h3>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-4">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-netflix-gray-400 uppercase tracking-wider">
                    <Gamepad2 className="w-4 h-4 text-netflix-red" />
                    {currentTournament.game}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-netflix-gray-400 uppercase tracking-wider">
                    <Users className="w-4 h-4 text-blue-500" />
                    {currentTournament.format}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-netflix-gray-400 uppercase tracking-wider">
                    <MapPin className="w-4 h-4 text-green-500" />
                    {currentTournament.map}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-netflix-gray-400 uppercase tracking-wider">
                    <Calendar className="w-4 h-4 text-yellow-500" />
                    {new Date(currentTournament.startsAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="text-center md:text-right border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6 w-full md:w-auto mt-2 md:mt-0">
                <div className="text-[10px] font-black text-netflix-gray-500 uppercase tracking-widest mb-1">Entry Fee</div>
                <div className="text-3xl font-black text-white leading-none">
                  {currentTournament.entryFee === 0 ? 'FREE' : formatCurrency(currentTournament.entryFee)}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Errors */}
        {(joinError || paymentError) && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-4 text-red-500 text-sm font-bold animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{joinError || paymentError}</span>
          </div>
        )}

        {/* Main Form Card */}
        <div className="space-y-6">
          
          {/* Section 1: Team Identity */}
          <div className="bg-netflix-gray-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
              <Shield className="w-5 h-5 text-netflix-red" />
              <h2 className="text-lg font-bold uppercase tracking-wider">Team Identity</h2>
            </div>
            
            <div className="space-y-3">
              <label className="text-[11px] font-black text-netflix-gray-500 uppercase tracking-widest ml-1">
                Team Name
              </label>
              <div className="relative group">
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="e.g. Phoenix Esports"
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-5 text-lg md:text-xl font-bold text-white placeholder:text-white/20 focus:outline-none focus:border-netflix-red focus:ring-1 focus:ring-netflix-red transition-all"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Roster */}
          <div className="bg-netflix-gray-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-bold uppercase tracking-wider">Active Roster</h2>
              </div>
              <span className="bg-white/5 px-3 py-1 rounded-full text-[10px] font-bold text-netflix-gray-400 border border-white/5">
                {teammates.length} / {maxTeamSize} PLAYERS
              </span>
            </div>

            <div className="space-y-4">
              {teammates.map((teammate, index) => (
                <div 
                  key={index} 
                  className="group relative bg-black/40 border border-white/5 rounded-2xl p-4 md:p-5 hover:border-white/20 transition-all duration-300"
                >
                  <div className="absolute -left-2 top-6 w-1 h-8 bg-netflix-gray-800 rounded-r-full group-hover:bg-netflix-red transition-colors" />
                  
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* PUBG ID */}
                    <div className="flex-1 space-y-2">
                      <label className="flex items-center gap-2 text-[10px] font-bold text-netflix-gray-500 uppercase tracking-widest">
                        <Gamepad2 className="w-3 h-3" /> PUBG ID
                      </label>
                      <input
                        type="text"
                        value={teammate.pubgId}
                        onChange={(e) => handleTeammateChange(index, 'pubgId', e.target.value)}
                        placeholder="512345678"
                        className="w-full bg-white/5 border border-white/5 rounded-lg py-3 px-4 text-sm font-medium focus:bg-black focus:border-blue-500 focus:outline-none transition-all"
                      />
                    </div>

                    {/* PUBG Name */}
                    <div className="flex-1 space-y-2">
                      <label className="flex items-center gap-2 text-[10px] font-bold text-netflix-gray-500 uppercase tracking-widest">
                        <Crosshair className="w-3 h-3" /> In-Game Name
                      </label>
                      <input
                        type="text"
                        value={teammate.pubgName}
                        onChange={(e) => handleTeammateChange(index, 'pubgName', e.target.value)}
                        placeholder="Sniper_God"
                        className="w-full bg-white/5 border border-white/5 rounded-lg py-3 px-4 text-sm font-medium focus:bg-black focus:border-blue-500 focus:outline-none transition-all"
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex items-end justify-end md:pb-1">
                      {teammates.length > 1 && (
                        <button
                          onClick={() => removeTeammate(index)}
                          className="p-3 rounded-lg text-netflix-gray-600 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                          title="Remove Player"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Player Button */}
            {teammates.length < maxTeamSize && (
              <button
                onClick={addTeammate}
                className="mt-6 w-full py-4 rounded-xl border border-dashed border-white/20 text-netflix-gray-400 hover:text-white hover:border-white/40 hover:bg-white/5 transition-all flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest group"
              >
                <Plus className="w-4 h-4" /> Add Teammate
              </button>
            )}
            
            {teammates.length >= maxTeamSize && (
              <div className="mt-4 text-center text-[10px] text-netflix-gray-500 uppercase tracking-widest">
                Max team size reached for {currentTournament?.format || 'this'} format
              </div>
            )}
          </div>

        </div>

        {/* Footer Action */}
        <div className="mt-8 md:mt-12 sticky bottom-4 z-20">
          <button
            onClick={handleNext}
            disabled={!isValid || isProcessing}
            className={cn(
              "w-full py-5 rounded-2xl text-lg font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-300 shadow-xl",
              isValid && !isProcessing
                ? "bg-netflix-red hover:bg-red-700 text-white shadow-glow-red hover:scale-[1.02]"
                : "bg-netflix-gray-800 text-netflix-gray-600 cursor-not-allowed border border-white/5"
            )}
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              <>
                Confirm & Pay Now <ChevronRight className="w-6 h-6" />
              </>
            )}
          </button>
          
          <p className="text-center text-[10px] text-netflix-gray-600 mt-4 uppercase tracking-widest font-medium">
            Secure Encryption Enabled &middot; Verified Esports Environment
          </p>
        </div>

      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-netflix-black">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-200 border-t-netflix-red" />
      </div>
    }>
      <OnboardingContent />
    </Suspense>
  );
}
