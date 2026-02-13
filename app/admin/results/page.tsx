'use client';

import { useState } from 'react';
import { mockMatches, mockTournaments } from '@/app/lib/mock-data';
import { formatDateTime, cn } from '@/app/lib/utils';
import type { MatchStatus } from '@/app/types';
import {
  ClipboardCheck,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Image,
  Trophy,
  Play,
  DoorOpen,
  Filter,
  BarChart3,
  Video,
  ChevronRight,
  MoreVertical,
  ShieldCheck
} from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'ALL', label: 'ALL MATCHES' },
  { value: 'SCHEDULED', label: 'SCHEDULED' },
  { value: 'ROOM_OPEN', label: 'ROOM OPEN' },
  { value: 'IN_PROGRESS', label: 'LIVE MATCHES' },
  { value: 'COMPLETED', label: 'COMPLETED' },
  { value: 'CANCELLED', label: 'CANCELLED' },
];

export default function AdminResultsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<MatchStatus | 'ALL'>('ALL');

  // Filter matches that need result review
  const reviewableMatches = mockMatches.filter((match) => {
    const tournament = mockTournaments.find(t => t.id === match.tournamentId);
    const matchesSearch = tournament?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || match.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    scheduled: mockMatches.filter(m => m.status === 'SCHEDULED').length,
    roomOpen: mockMatches.filter(m => m.status === 'ROOM_OPEN').length,
    inProgress: mockMatches.filter(m => m.status === 'IN_PROGRESS').length,
    completed: mockMatches.filter(m => m.status === 'COMPLETED').length,
  };

  const getTournamentTitle = (tournamentId: string) => {
    return mockTournaments.find(t => t.id === tournamentId)?.title || 'Unknown';
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-12 sm:pt-20 pb-16 space-y-12">
      {/* 1. Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div>
          <h1 className="text-[clamp(2.5rem,8vw,4.5rem)] font-black text-zinc-900 tracking-tight leading-[0.8] uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            MATCH <span className="text-netflix-red italic">RESULTS</span>
          </h1>
          <p className="text-zinc-400 font-bold uppercase tracking-[0.3em] text-[10px] sm:text-xs mt-6 flex items-center gap-3">
            <span className="w-12 h-[2px] bg-netflix-red" />
            Verify match winners and screenshots
          </p>
        </div>

        <div className="flex bg-white border border-zinc-100 p-1 rounded-2xl shadow-sm">
          <StatMini label="ROOMS OPEN" value={stats.roomOpen} color="text-blue-600" />
          <div className="w-px h-8 bg-zinc-50 my-auto" />
          <StatMini label="LIVE" value={stats.inProgress} color="text-amber-600" />
          <div className="w-px h-8 bg-zinc-50 my-auto" />
          <StatMini label="COMPLETED" value={stats.completed} color="text-green-600" />
        </div>
      </div>

      {/* 2. Tactical Filtering Interface */}
      <div className="bg-white border border-zinc-100 rounded-[2.5rem] p-3 sm:p-6 shadow-xl shadow-zinc-200/30 flex flex-col xl:flex-row gap-6 items-center">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-netflix-red transition-colors" />
          <input
            type="text"
            placeholder="SEARCH BY MATCH OR TOURNAMENT NAME..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-5 pl-16 pr-6 text-[10px] font-black tracking-widest text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-netflix-red/20 focus:bg-white transition-all uppercase"
          />
        </div>

        <div className="w-full xl:w-auto">
          <FilterGroup label="STATUS" value={statusFilter} options={STATUS_OPTIONS} onChange={setStatusFilter} icon={BarChart3} />
        </div>
      </div>

      {/* 3. Engagement Matrix (Table) */}
      <div className="bg-white border border-zinc-100 rounded-[3rem] overflow-hidden shadow-2xl shadow-zinc-200/50">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 border-b border-zinc-100">
                <th className="px-8 py-6 text-left text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">MATCH</th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">TOURNAMENT</th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">STATUS</th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">TIME</th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">SCREENSHOT</th>
                <th className="px-8 py-6 text-right text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50 font-bold">
              {reviewableMatches.map((match) => (
                <tr key={match.id} className="hover:bg-zinc-50/30 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center text-white shadow-lg shadow-zinc-900/10">
                        <Play className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-zinc-900 uppercase tracking-tight group-hover:text-netflix-red transition-colors">MATCH #{match.matchNumber}</p>
                        <p className="text-[10px] text-zinc-400 uppercase tracking-widest mt-0.5">ID: {match.id.toUpperCase().slice(0, 12)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center">
                        <Trophy className="w-4 h-4 text-zinc-400" />
                      </div>
                      <span className="text-[11px] font-black text-zinc-900 uppercase tracking-tight line-clamp-1 max-w-[150px]">{getTournamentTitle(match.tournamentId)}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <StatusBadge status={match.status} />
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2.5 text-zinc-500 text-[11px] uppercase tracking-wider font-bold whitespace-nowrap">
                      <Clock className="w-3.5 h-3.5 opacity-40" />
                      {formatDateTime(match.scheduledAt)}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    {match.resultsSubmitted ? (
                      <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-green-100">
                        <Image className="w-3 h-3" />
                        SUBMITTED
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 px-3 py-1 bg-zinc-50 text-zinc-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-zinc-100">
                        <Image className="w-3 h-3" />
                        MISSING
                      </div>
                    )}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-3 text-zinc-400 hover:text-zinc-900 hover:bg-white rounded-xl border border-transparent hover:border-zinc-100 transition-all shadow-none hover:shadow-sm">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-3 text-zinc-300 hover:text-zinc-900 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {reviewableMatches.length === 0 && (
            <div className="py-24 text-center">
              <div className="w-20 h-20 bg-zinc-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
                <ShieldCheck className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-xl font-black text-zinc-900 uppercase tracking-tight" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>NO RESULTS PENDING</h3>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-2">All match results have been verified</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatMini({ label, value, color = "text-zinc-900" }: any) {
  return (
    <div className="px-8 py-4 text-center">
      <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">{label}</p>
      <p className={cn("text-xl font-black", color)} style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{value}</p>
    </div>
  );
}

function FilterGroup({ label, value, options, onChange, icon: Icon }: any) {
  return (
    <div className="relative group min-w-[200px]">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 group-hover:text-netflix-red transition-colors z-10">
        <Icon className="w-full h-full" />
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-12 pr-10 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-[10px] font-black tracking-widest uppercase appearance-none cursor-pointer focus:outline-none focus:border-zinc-200 transition-all"
      >
        {options.map((opt: any) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 rotate-90" />
    </div>
  );
}

function StatusBadge({ status }: { status: MatchStatus }) {
  const config: any = {
    SCHEDULED: { label: 'SCHEDULED', bg: 'bg-zinc-100 text-zinc-600' },
    ROOM_OPEN: { label: 'ROOM OPEN', bg: 'bg-blue-100 text-blue-700' },
    IN_PROGRESS: { label: 'LIVE', bg: 'bg-amber-100 text-amber-700' },
    COMPLETED: { label: 'VERIFIED', bg: 'bg-green-100 text-green-700' },
    CANCELLED: { label: 'CANCELLED', bg: 'bg-red-50 text-red-700' },
  };
  const s = config[status] || { label: status, bg: 'bg-zinc-100 text-zinc-500' };
  return (
    <span className={cn("px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest whitespace-nowrap", s.bg)}>
      {s.label}
    </span>
  );
}
