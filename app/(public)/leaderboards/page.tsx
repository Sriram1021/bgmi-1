'use client';

import { useState } from 'react';
import { mockLeaderboard } from '@/app/lib/mock-data';
import { formatCurrency, cn } from '@/app/lib/utils';
import { 
  Trophy, 
  Target, 
  Zap, 
  Crown, 
  Medal, 
  Star, 
  TrendingUp, 
  Search,
  Filter
} from 'lucide-react';

const TIER_COLORS: Record<string, string> = {
  CONQUEROR: 'text-amber-500 bg-amber-50 border-amber-100',
  ACE: 'text-purple-600 bg-purple-50 border-purple-100',
  DIAMOND: 'text-blue-600 bg-blue-50 border-blue-100',
  PLATINUM: 'text-emerald-600 bg-emerald-50 border-emerald-100',
};

export default function LeaderboardsPage() {
  const [activeTab, setActiveTab] = useState<'ALL_TIME' | 'MONTHLY' | 'WEEKLY'>('ALL_TIME');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLeaderboard = mockLeaderboard.filter(entry => 
    entry.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-50 border border-amber-100 rounded-full text-[10px] font-black text-amber-600 uppercase tracking-widest">
            <Trophy className="w-3.5 h-3.5" />
            Global Rankings
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-zinc-900 uppercase tracking-wider leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            PLAYER <span className="text-netflix-red italic">LEADERBOARDS</span>
          </h1>
          <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-[10px] sm:text-xs">
            Showcasing the most elite players across the platform
          </p>
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 items-end">
          {/* Rank 2 */}
          <PodiumCard 
            entry={mockLeaderboard[1]} 
            rank={2} 
            color="text-zinc-400" 
            icon={<Medal className="w-8 h-8 text-zinc-300" />} 
          />
          
          {/* Rank 1 */}
          <PodiumCard 
            entry={mockLeaderboard[0]} 
            rank={1} 
            isMain 
            color="text-amber-500" 
            icon={<Crown className="w-12 h-12 text-amber-400" />} 
          />
          
          {/* Rank 3 */}
          <PodiumCard 
            entry={mockLeaderboard[2]} 
            rank={3} 
            color="text-amber-700" 
            icon={<Medal className="w-8 h-8 text-amber-600" />} 
          />
        </div>

        {/* Actions & Filters */}
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between mb-10">
          <div className="flex bg-white border border-neutral-200 p-1 rounded-2xl shadow-sm">
            {(['ALL_TIME', 'MONTHLY', 'WEEKLY'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  activeTab === tab ? "bg-zinc-900 text-white shadow-lg shadow-zinc-900/10" : "text-zinc-400 hover:text-zinc-900"
                )}
              >
                {tab.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 group-focus-within:text-netflix-red transition-colors" />
            <input 
              type="text" 
              placeholder="SEARCH PLAYER..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-white border border-neutral-200 rounded-2xl text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-netflix-red/30 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-white border border-neutral-100 rounded-4xl overflow-hidden shadow-xl shadow-zinc-200/30">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-zinc-50/50 border-b border-zinc-100 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                  <th className="px-8 py-6 text-left">RANK</th>
                  <th className="px-8 py-6 text-left">PLAYER</th>
                  <th className="px-8 py-6 text-center">TIER</th>
                  <th className="px-8 py-6 text-center">TOTAL KILLS</th>
                  <th className="px-8 py-6 text-center">WINS</th>
                  <th className="px-8 py-6 text-center">WIN RATE</th>
                  <th className="px-8 py-6 text-right">TOTAL EARNINGS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {filteredLeaderboard.map((entry) => (
                  <tr key={entry.userId} className="group hover:bg-zinc-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <span className={cn(
                        "text-2xl font-black italic tabular-nums leading-none",
                        entry.rank === 1 ? "text-amber-500" : entry.rank === 2 ? "text-zinc-400" : entry.rank === 3 ? "text-amber-700" : "text-zinc-200"
                      )} style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                        #{entry.rank}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-zinc-900 text-white flex items-center justify-center font-black text-sm overflow-hidden border-2 border-white shadow-sm">
                          {entry.avatarUrl ? (
                            <img src={entry.avatarUrl} alt={entry.displayName} className="w-full h-full object-cover" />
                          ) : (
                            entry.displayName.slice(0, 1)
                          )}
                        </div>
                        <span className="text-sm font-black text-zinc-900 uppercase tracking-wider">{entry.displayName}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border",
                        TIER_COLORS[entry.tier] || "text-zinc-500 bg-zinc-50 border-zinc-100"
                      )}>
                        {entry.tier}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center text-sm font-black text-zinc-900 tabular-nums">
                      {entry.totalKills}
                    </td>
                    <td className="px-8 py-6 text-center text-sm font-black text-zinc-900 tabular-nums">
                      {entry.totalWins}
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-sm font-black text-zinc-900">{entry.winRate}%</span>
                        <div className="w-16 h-1 bg-zinc-100 rounded-full overflow-hidden">
                          <div className="h-full bg-netflix-red" style={{ width: `${entry.winRate}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <span className="text-sm font-black text-green-600 tabular-nums">
                        {formatCurrency(entry.totalEarnings / 100)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function PodiumCard({ entry, rank, isMain, color, icon }: any) {
  if (!entry) return null;
  
  return (
    <div className={cn(
      "relative bg-white border border-neutral-100 rounded-[2.5rem] p-8 flex flex-col items-center text-center shadow-xl transition-all hover:scale-105 duration-500 overflow-hidden group",
      isMain ? "h-80 border-red-500/10 shadow-red-500/5 mt-0 lg:-mt-6 pt-12" : "h-72 shadow-zinc-200/50"
    )}>
      {isMain && (
        <div className="absolute top-0 inset-x-0 h-32 bg-linear-to-b from-amber-50 to-transparent" />
      )}
      
      <div className="relative mb-6">
        <div className={cn(
          "rounded-4xl bg-zinc-900 flex items-center justify-center text-white font-black overflow-hidden border-4 border-white shadow-2xl transition-transform group-hover:rotate-6",
          isMain ? "w-28 h-28 text-4xl" : "w-20 h-20 text-2xl"
        )}>
          {entry.displayName.slice(0, 1)}
        </div>
        <div className="absolute -bottom-2 -right-2 transform group-hover:scale-125 transition-transform duration-500">
          {icon}
        </div>
      </div>
      
      <div className="space-y-1 mb-6">
        <h3 className={cn("font-black uppercase tracking-wider leading-none", isMain ? "text-2xl" : "text-xl")} style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
          {entry.displayName}
        </h3>
        <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">{entry.tier}</p>
      </div>
      
      <div className="grid grid-cols-2 gap-8 w-full border-t border-zinc-50 pt-6">
        <div>
          <p className="text-lg font-black text-zinc-900 leading-none mb-1" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{entry.totalWins}</p>
          <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">WINS</p>
        </div>
        <div>
          <p className="text-lg font-black text-netflix-red leading-none mb-1" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{entry.totalKills}</p>
          <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">KILLS</p>
        </div>
      </div>
    </div>
  );
}
