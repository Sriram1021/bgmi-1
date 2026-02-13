'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { formatCurrency, formatDateTime, cn } from '@/app/lib/utils';
import { EmptyState } from '@/app/components/ui/empty-state';
import { TournamentCard } from '@/app/components/tournaments/tournament-card';
import { useOptionalAuth } from '@/app/providers/auth-provider';
import { Trophy, Calendar, CheckCircle, Clock, Search, Filter, AlertCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/lib/redux/store';
import { fetchMyRegistrations } from '@/app/lib/redux/slices/tournamentSlice';
import Link from 'next/link';

type FilterTab = 'all' | 'upcoming' | 'live' | 'completed';

export default function MyTournamentsPage() {
  const auth = useOptionalAuth();
  const dispatch = useDispatch<AppDispatch>();
  const { myRegistrations, loading, error } = useSelector((state: RootState) => state.tournament);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  useEffect(() => {
    if (auth?.isAuthenticated) {
      dispatch(fetchMyRegistrations());
    }
  }, [auth?.isAuthenticated, dispatch]);

  // Filter by tab
  const filteredTournaments = (myRegistrations || []).filter((t) => {
    switch (activeTab) {
      case 'upcoming':
        return ['REGISTRATION_OPEN', 'REGISTRATION_CLOSED', 'APPROVED'].includes(t.status);
      case 'live':
        return ['LIVE', 'IN_PROGRESS'].includes(t.status);
      case 'completed':
        return t.status === 'COMPLETED';
      default:
        return true;
    }
  });

  const tabs: { key: FilterTab; label: string; icon: React.ReactNode }[] = [
    { key: 'all', label: 'ALL MATCHES', icon: <Trophy className="h-4 w-4" /> },
    { key: 'upcoming', label: 'UPCOMING', icon: <Calendar className="h-4 w-4" /> },
    { key: 'live', label: 'LIVE NOW', icon: <Clock className="h-4 w-4" /> },
    { key: 'completed', label: 'PAST MATCHES', icon: <CheckCircle className="h-4 w-4" /> },
  ];

  if (loading && myRegistrations.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-10 bg-white">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 border-4 border-netflix-red border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">Retrieving Battle Logs...</p>
        </div>
      </div>
    );
  }

  if (error && myRegistrations.length === 0) {
    return (
       <div className="min-h-screen flex items-center justify-center p-10">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-red-50 border border-red-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
            <AlertCircle className="w-10 h-10 text-netflix-red" />
          </div>
          <h2 className="text-3xl font-black text-zinc-900 uppercase tracking-widest" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>System Error</h2>
          <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs max-w-md mx-auto">{error}</p>
          <Button onClick={() => dispatch(fetchMyRegistrations())} variant="primary" className="px-10 py-6 rounded-2xl text-xs font-black uppercase tracking-widest mt-8 shadow-lg shadow-red-500/20">RETRY CONNECTION</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1240px] mx-auto px-6 py-12 space-y-12 sm:space-y-16 pb-32 pt-8 lg:pt-16">

      {/* Dynamic Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-zinc-100 pb-12">
        <div className="space-y-4">
          <h1 className="text-[clamp(2.5rem,8vw,5rem)] font-black text-zinc-900 tracking-tight leading-[0.85] uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            MY<br />
            <span className="text-netflix-red italic">MATCHES</span>
          </h1>
          <p className="text-zinc-400 font-bold uppercase tracking-[0.2em] text-[10px] sm:text-xs flex items-center gap-3">
            <span className="w-12 h-[2px] bg-netflix-red" />
            Match History & Status
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white border border-zinc-100 p-2 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 px-4 py-2 bg-zinc-50 rounded-xl border border-zinc-100">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="text-[10px] font-black text-zinc-900 uppercase tracking-widest">{myRegistrations.length} MATCHES</span>
          </div>
        </div>
      </div>

      {/* Advanced Filter Interface */}
      <div className="space-y-8">
        <div className="flex items-center gap-3 mb-2">
          <Filter className="w-4 h-4 text-netflix-red" />
          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">FILTER BY STATUS</span>
        </div>
        <div className="flex gap-2 sm:gap-4 overflow-x-auto pb-4 no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex items-center gap-2 sm:gap-4 px-4 sm:px-8 py-3.5 sm:py-5 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest sm:tracking-[0.2em] border transition-all duration-300 relative group overflow-hidden shadow-sm shrink-0",
                activeTab === tab.key
                  ? "bg-zinc-900 border-zinc-900 text-white shadow-xl shadow-zinc-900/10 active:scale-95"
                  : "bg-white border-zinc-100 text-zinc-400 hover:border-zinc-300 hover:text-zinc-900"
              )}
            >
              <div className="scale-75 sm:scale-100">{tab.icon}</div>
              {tab.label}
              {activeTab === tab.key && <span className="absolute bottom-0 left-0 w-full h-[3px] bg-netflix-red" />}
            </button>
          ))}
        </div>
      </div>

      {/* Deployment Intelligence Grid */}
      {filteredTournaments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 sm:gap-10">
          {filteredTournaments.map((tournament) => (
            <div key={tournament.id} className="group transition-all duration-500 hover:-translate-y-2">
              <TournamentCard
                tournament={tournament}
                disableNavigation={false}
                customHref={`/participant/my-tournaments/${tournament.id}`}
              />
            </div>
          ))}
        </div>
      ) : (
        /* Void Intelligence State */
        <div className="bg-white border-2 border-dashed border-zinc-200 rounded-4xl py-24 sm:py-32 text-center px-8 relative overflow-hidden group">
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-zinc-50/30 to-transparent pointer-events-none" />

          <div className="relative z-10">
            <div className="w-24 h-24 bg-zinc-50 rounded-4xl flex items-center justify-center mx-auto mb-10 shadow-inner group-hover:scale-110 group-hover:bg-netflix-red/5 transition-all duration-700">
              <Trophy className="h-10 w-10 text-zinc-200 group-hover:text-netflix-red transition-colors" />
            </div>

            <h3 className="text-4xl sm:text-5xl font-black text-zinc-900 uppercase tracking-tight mb-6 leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              {activeTab === 'all' ? "NO MATCHES JOINED" : `NO ${activeTab.toUpperCase()} MATCHES`}
            </h3>

            <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.3em] mb-12 max-w-sm mx-auto leading-relaxed">
              {activeTab === 'all'
                ? "YOU HAVEN'T JOINED ANY MATCHES YET. BROWSE TOURNAMENTS TO GET STARTED."
                : `NO MATCHES FOUND FOR THIS STATUS.`}
            </p>

            {activeTab === 'all' && (
              <Link href="/tournaments">
                <Button
                  className="px-12 py-6 bg-zinc-900 hover:bg-netflix-red text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl shadow-2xl shadow-zinc-200 hover:shadow-red-500/20 active:scale-95 transition-all"
                >
                  BROWSE TOURNAMENTS
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
