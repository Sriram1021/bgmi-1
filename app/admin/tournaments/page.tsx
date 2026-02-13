'use client';

import { useState } from 'react';
import Link from 'next/link';
import { mockTournaments } from '@/app/lib/mock-data';
import { formatCurrency, formatDate, cn } from '@/app/lib/utils';
import type { TournamentStatus } from '@/app/types';
import {
  Trophy,
  Search,
  Eye,
  Edit,
  Ban,
  CheckCircle,
  Users,
  ChevronRight,
  Filter,
  Calendar,
  MoreVertical,
  Target
} from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'ALL', label: 'ALL STATUSES' },
  { value: 'PENDING_APPROVAL', label: 'PENDING APPROVAL' },
  { value: 'APPROVED', label: 'APPROVED' },
  { value: 'REGISTRATION_OPEN', label: 'REGISTRATION OPEN' },
  { value: 'LIVE', label: 'LIVE' },
  { value: 'COMPLETED', label: 'COMPLETED' },
];

export default function AdminTournamentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TournamentStatus | 'ALL'>('ALL');

  const filteredTournaments = mockTournaments.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.organizerId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: mockTournaments.length,
    pending: mockTournaments.filter(t => t.status === 'PENDING_APPROVAL').length,
    live: mockTournaments.filter(t => t.status === 'LIVE' || t.status === 'IN_PROGRESS').length,
    completed: mockTournaments.filter(t => t.status === 'COMPLETED').length,
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-12 sm:pt-20 pb-16 space-y-12">
      {/* 1. Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div>
          <h1 className="text-[clamp(2.5rem,8vw,4.5rem)] font-black text-zinc-900 tracking-wider leading-[0.8] uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            TOURNAMENT <span className="text-netflix-red italic">LIST</span>
          </h1>
          <p className="text-zinc-400 font-bold uppercase tracking-[0.3em] text-[10px] sm:text-xs mt-6 flex items-center gap-3">
            <span className="w-12 h-[2px] bg-netflix-red" />
            Manage and monitor all platform tournaments
          </p>
        </div>

        <div className="flex bg-white border border-zinc-100 p-1 rounded-2xl shadow-sm">
          <StatMini label="TOTAL" value={stats.total} />
          <div className="w-px h-8 bg-zinc-50 my-auto" />
          <StatMini label="PENDING" value={stats.pending} color="text-amber-600" />
          <div className="w-px h-8 bg-zinc-50 my-auto" />
          <StatMini label="LIVE" value={stats.live} color="text-netflix-red" />
        </div>
      </div>

      {/* 2. Tactical Filtering Interface */}
      <div className="bg-white border border-zinc-100 rounded-[2.5rem] p-3 sm:p-6 shadow-xl shadow-zinc-200/30 flex flex-col xl:flex-row gap-6 items-center">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-netflix-red transition-colors" />
          <input
            type="text"
            placeholder="SEARCH BY TITLE OR ORGANIZER..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-50 border  border-zinc-100 rounded-2xl py-5 pl-16 pr-6 text-[10px] font-black tracking-widest text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-netflix-red/20 focus:bg-white transition-all uppercase"
          />
        </div>

        <div className="w-full xl:w-auto">
          <FilterGroup label="STATUS" value={statusFilter} options={STATUS_OPTIONS} onChange={setStatusFilter} icon={Target} />
        </div>
      </div>

      {/* 3. Mission Matrix (Table) */}
      <div className="bg-white border border-zinc-100 rounded-[3rem] overflow-hidden shadow-2xl shadow-zinc-200/50">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 border-b border-zinc-100">
                <th className="px-8 py-6 text-left text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">TOURNAMENT INFO</th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">STATUS</th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">PRIZE POOL</th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">SLOTS FILL</th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">START DATE</th>
                <th className="px-8 py-6 text-right text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50 font-bold">
              {filteredTournaments.map((tournament) => (
                <tr key={tournament.id || (tournament as any)._id} className="hover:bg-zinc-50/30 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center text-white shadow-lg shadow-zinc-900/10 transition-transform group-hover:scale-110">
                        <Trophy className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-zinc-900 uppercase tracking-wider group-hover:text-netflix-red transition-colors">{tournament.title}</p>
                        <p className="text-[10px] text-zinc-400 uppercase tracking-widest flex items-center gap-2 mt-1">
                          {tournament.game} <span className="w-1 h-1 bg-zinc-200 rounded-full" /> ID: {(tournament.id || (tournament as any)._id || '').toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <StatusBadge status={tournament.status} />
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-black text-green-600 tabular-nums">
                      {formatCurrency(tournament.prizePool)}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2.5 text-zinc-500 text-[11px] font-black tabular-nums">
                      <Users className="w-4 h-4 opacity-40" />
                      {tournament.currentParticipants}/{tournament.maxParticipants}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2.5 text-zinc-500 text-[11px] uppercase tracking-wider font-bold">
                      <Calendar className="w-3.5 h-3.5 opacity-40" />
                      {formatDate(tournament.startsAt || (tournament as any).startTime)}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/tournaments/${tournament.id || (tournament as any)._id}`}>
                        <button className="p-3 text-zinc-400 hover:text-zinc-900 hover:bg-white rounded-xl border border-transparent hover:border-zinc-100 transition-all shadow-none hover:shadow-sm">
                          <Eye className="w-4 h-4" />
                        </button>
                      </Link>
                      <button className="p-3 text-zinc-400 hover:text-zinc-900 hover:bg-white rounded-xl border border-transparent hover:border-zinc-100 transition-all">
                        <Edit className="w-4 h-4" />
                      </button>
                      {tournament.status === 'PENDING_APPROVAL' && (
                        <button className="p-3 text-green-500 hover:bg-green-50 rounded-xl border border-transparent hover:border-green-100 transition-all">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button className="p-3 text-zinc-400 hover:text-netflix-red hover:bg-white rounded-xl border border-transparent hover:border-zinc-100 transition-all">
                        <Ban className="w-4 h-4" />
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
          {filteredTournaments.length === 0 && (
            <div className="py-24 text-center">
              <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-10 h-10 text-zinc-200" />
              </div>
              <p className="text-xl font-black text-zinc-900 uppercase tracking-widest" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>NO TOURNAMENTS FOUND</p>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-2">Try changing the filters</p>
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
        className="w-full pl-12 pr-10 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-[10px] font-black tracking-widest uppercase appearance-none cursor-pointer focus:outline-none focus:border-zinc-200 transition-all text-zinc-900"
      >
        {options.map((opt: any) => (
          <option key={opt.value} value={opt.value} className="text-black">{opt.label}</option>
        ))}
      </select>
      <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 rotate-90" />
    </div>
  );
}

function StatusBadge({ status }: { status: TournamentStatus }) {
  const config: any = {
    LIVE: { label: 'LIVE', bg: 'bg-netflix-red', text: 'text-white shadow-lg shadow-red-500/20' },
    IN_PROGRESS: { label: 'IN PROGRESS', bg: 'bg-netflix-red', text: 'text-white' },
    REGISTRATION_OPEN: { label: 'OPEN', bg: 'bg-green-100 text-green-700', text: '' },
    PENDING_APPROVAL: { label: 'PENDING', bg: 'bg-amber-100 text-amber-700', text: '' },
    COMPLETED: { label: 'DONE', bg: 'bg-zinc-100 text-zinc-600', text: '' },
    APPROVED: { label: 'APPROVED', bg: 'bg-blue-100 text-blue-700', text: '' },
  };
  const s = config[status] || { label: status, bg: 'bg-zinc-100 text-zinc-600', text: '' };
  return (
    <span className={cn("px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest whitespace-nowrap", s.bg, s.text)}>
      {s.label}
    </span>
  );
}
