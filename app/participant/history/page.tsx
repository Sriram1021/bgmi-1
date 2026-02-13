'use client';

import { useAuth } from '@/app/providers/auth-provider';
import { mockMatches, mockResults, mockTournaments } from '@/app/lib/mock-data';
import { formatCurrency, formatDateTime, cn } from '@/app/lib/utils';
import { 
  History, 
  Trophy, 
  Target, 
  IndianRupee, 
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Skull,
  Award,
  Calendar
} from 'lucide-react';
import Link from 'next/link';

export default function MatchHistoryPage() {
  const { user } = useAuth();
  
  // Connect results with match and tournament details
  const myResults = mockResults
    .filter(r => r.userId === user?.id)
    .map(result => {
      const match = mockMatches.find(m => m.id === result.matchId);
      const tournament = mockTournaments.find(t => t.id === match?.tournamentId);
      return { ...result, match, tournament };
    })
    .sort((a, b) => {
      const dateA = a.match?.endedAt || a.match?.scheduledAt || '';
      const dateB = b.match?.endedAt || b.match?.scheduledAt || '';
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });

  const totalEarnings = myResults.reduce((acc, curr) => acc + curr.prizeAmount, 0);
  const totalKills = myResults.reduce((acc, curr) => acc + curr.kills, 0);
  const avgPlacement = myResults.length > 0 
    ? (myResults.reduce((acc, curr) => acc + curr.placement, 0) / myResults.length).toFixed(1)
    : '0.0';

  return (
    <div className="min-h-screen bg-white py-12 px-6">
      <div className="max-w-[1240px] mx-auto space-y-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-blue-600 text-[10px] font-black uppercase tracking-widest">
              <History className="w-4 h-4" />
              Operational Log
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-zinc-900 uppercase tracking-wider leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              MATCH <span className="text-netflix-red italic">HISTORY</span>
            </h1>
            <p className="text-zinc-400 font-bold uppercase tracking-[0.2em] text-[10px] flex items-center gap-3">
              <span className="w-12 h-[2px] bg-netflix-red" />
              Track your performance across all operations
            </p>
          </div>

          {/* Career Stats Summary */}
          <div className="grid grid-cols-3 gap-1 bg-white border border-zinc-100 p-1 rounded-3xl shadow-sm">
            <StatBox label="EARNINGS" value={formatCurrency(totalEarnings)} color="text-green-600" />
            <StatBox label="TOTAL KILLS" value={totalKills} />
            <StatBox label="AVG RANK" value={`#${avgPlacement}`} />
          </div>
        </div>

        {/* History List */}
        <div className="space-y-6">
          {myResults.length > 0 ? (
            myResults.map((entry) => (
              <div key={entry.id} className="bg-white border border-zinc-100 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 group shadow-sm">
                <div className="p-6 sm:p-8 flex flex-col lg:flex-row items-center gap-8">
                  
                  {/* Placement Badge */}
                  <div className="relative shrink-0">
                    <div className={cn(
                      "w-24 h-24 rounded-4xl flex items-center justify-center text-3xl font-black italic shadow-xl transition-transform group-hover:scale-110 duration-500",
                      entry.placement === 1 ? "bg-amber-400 text-white shadow-amber-400/20" : 
                      entry.placement <= 3 ? "bg-zinc-800 text-white shadow-zinc-800/20" : "bg-zinc-50 text-zinc-300 border border-zinc-100 shadow-none"
                    )} style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                      #{entry.placement}
                    </div>
                    {entry.placement === 1 && (
                      <div className="absolute -top-3 -right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg border border-amber-100">
                        <Award className="w-6 h-6 text-amber-500" />
                      </div>
                    )}
                  </div>

                  {/* Tournament Info */}
                  <div className="flex-1 text-center lg:text-left space-y-2">
                    <h3 className="text-2xl font-black text-zinc-900 uppercase tracking-wider leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                      {entry.tournament?.title || 'Unknown Tournament'}
                    </h3>
                    <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4 text-[10px] text-zinc-400 font-black uppercase tracking-widest">
                      <span className="flex items-center gap-2">
                         <Calendar className="w-3.5 h-3.5" />
                         {formatDateTime(entry.match?.endedAt || entry.match?.scheduledAt || '')}
                      </span>
                      <div className="w-1 h-1 bg-zinc-100 rounded-full" />
                      <span>{entry.match?.map} • {entry.match?.mode}</span>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="flex items-center gap-6 px-8 border-x border-zinc-50 py-2">
                    <div className="text-center">
                      <div className="flex items-center gap-2 mb-1">
                        <Skull className="w-4 h-4 text-netflix-red" />
                        <span className="text-xl font-black text-zinc-900" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{entry.kills}</span>
                      </div>
                      <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">KILLS</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-2 mb-1">
                        <Target className="w-4 h-4 text-blue-500" />
                        <span className="text-xl font-black text-zinc-900" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{entry.totalPoints}</span>
                      </div>
                      <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">PTS</p>
                    </div>
                  </div>

                  {/* Prize */}
                  <div className="text-center lg:text-right min-w-[120px]">
                    <p className="text-2xl font-black text-green-600 leading-none mb-1" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                      {formatCurrency(entry.prizeAmount)}
                    </p>
                    <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest border-t border-zinc-50 pt-1">TOTAL PRIZE</p>
                  </div>

                  {/* Action */}
                  <Link href={`/tournaments/${entry.tournament?.id}`} className="shrink-0">
                    <button className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-300 hover:text-netflix-red hover:bg-white border border-transparent hover:border-zinc-100 transition-all shadow-none hover:shadow-lg">
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white border-2 border-dashed border-zinc-200 rounded-3xl py-20 text-center px-10 shadow-sm">
              <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <History className="w-10 h-10 text-zinc-200" />
              </div>
              <h3 className="text-3xl font-black text-zinc-900 uppercase tracking-wider mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>NO HISTORY FOUND</h3>
              <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em] mb-10 max-w-sm mx-auto leading-relaxed">
                Complete your first match to start tracking your performance history and earnings.
              </p>
              <Link href="/tournaments">
                 <button className="bg-zinc-900 hover:bg-netflix-red text-white text-[10px] font-black px-12 py-5 rounded-2xl uppercase tracking-widest transition-all shadow-xl shadow-zinc-300 hover:shadow-red-500/20">
                   JOIN A TOURNAMENT
                 </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value, color = "text-zinc-900" }: { label: string, value: string | number, color?: string }) {
  return (
    <div className="px-8 py-5 text-center min-w-[120px]">
      <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{label}</p>
      <p className={cn("text-2xl font-black leading-none", color)} style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{value}</p>
    </div>
  );
}
