'use client';

import { useState } from 'react';
import { mockUsers, mockTournaments } from '@/app/lib/mock-data';
import { formatDate, formatCurrency, cn } from '@/app/lib/utils';
import type { KYCStatus } from '@/app/types';
import {
  Building2,
  Search,
  Eye,
  Ban,
  CheckCircle,
  Trophy,
  Mail,
  Calendar,
  Filter,
  Shield,
  Clock,
  ChevronRight,
  IndianRupee,
  MoreVertical
} from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'ALL', label: 'ALL STATUSES' },
  { value: 'APPROVED', label: 'VERIFIED ORGANIZERS' },
  { value: 'PENDING', label: 'PENDING APPROVAL' },
  { value: 'NOT_STARTED', label: 'INACTIVE' },
  { value: 'REJECTED', label: 'REJECTED' },
];

export default function AdminOrganizersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<KYCStatus | 'ALL'>('ALL');

  // Filter only organizers
  const organizers = mockUsers.filter(u => u.role === 'ORGANIZER');

  const filteredOrganizers = organizers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.displayName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || user.kycStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate stats for each organizer
  const getOrganizerStats = (organizerId: string) => {
    const tournaments = mockTournaments.filter(t => t.organizerId === organizerId);
    const totalPrizePool = tournaments.reduce((sum, t) => sum + t.prizePool, 0);
    return {
      tournamentCount: tournaments.length,
      totalPrizePool,
    };
  };

  const stats = {
    total: organizers.length,
    verified: organizers.filter(u => u.kycStatus === 'APPROVED').length,
    pending: organizers.filter(u => u.kycStatus === 'PENDING').length,
    activeTournaments: mockTournaments.filter(t =>
      ['REGISTRATION_OPEN', 'LIVE', 'IN_PROGRESS'].includes(t.status)
    ).length,
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-12 sm:pt-20 pb-16 space-y-12">
      {/* 1. Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div>
          <h1 className="text-[clamp(2.5rem,8vw,4.5rem)] font-black text-zinc-900 tracking-tight leading-[0.8] uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            ORGANIZER <span className="text-netflix-red italic">LIST</span>
          </h1>
          <p className="text-zinc-400 font-bold uppercase tracking-[0.3em] text-[10px] sm:text-xs mt-6 flex items-center gap-3">
            <span className="w-12 h-[2px] bg-netflix-red" />
            Manage and approve tournament organizers
          </p>
        </div>

        <div className="flex bg-white border border-zinc-100 p-1 rounded-2xl shadow-sm">
          <StatMini label="TOTAL" value={stats.total} />
          <div className="w-px h-8 bg-zinc-50 my-auto" />
          <StatMini label="PENDING" value={stats.pending} color="text-amber-600" />
          <div className="w-px h-8 bg-zinc-50 my-auto" />
          <StatMini label="ACTIVE" value={stats.activeTournaments} color="text-netflix-red" />
        </div>
      </div>

      {/* 2. Tactical Filtering Interface */}
      <div className="bg-white border border-zinc-100 rounded-[2.5rem] p-3 sm:p-6 shadow-xl shadow-zinc-200/30 flex flex-col xl:flex-row gap-6 items-center">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-netflix-red transition-colors" />
          <input
            type="text"
            placeholder="SEARCH BY ORGANIZER NAME..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-5 pl-16 pr-6 text-[10px] font-black tracking-widest text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-netflix-red/20 focus:bg-white transition-all uppercase"
          />
        </div>

        <div className="w-full xl:w-auto">
          <FilterGroup label="STATUS" value={statusFilter} options={STATUS_OPTIONS} onChange={setStatusFilter} icon={Shield} />
        </div>
      </div>

      {/* 3. Operational Matrix (Table) */}
      <div className="bg-white border border-zinc-100 rounded-[3rem] overflow-hidden shadow-2xl shadow-zinc-200/50">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 border-b border-zinc-100">
                <th className="px-8 py-6 text-left text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">ORGANIZER</th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">APPROVAL STATUS</th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">TOURNAMENTS</th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">TOTAL PRIZES</th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">JOINED ON</th>
                <th className="px-8 py-6 text-right text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50 font-bold">
              {filteredOrganizers.map((organizer) => {
                const orgStats = getOrganizerStats(organizer.id);
                return (
                  <tr key={organizer.id} className="hover:bg-zinc-50/30 transition-all group border-b border-transparent last:border-0">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-sm font-black shadow-lg shadow-indigo-500/10 transition-transform group-hover:scale-110">
                          {getInitials(organizer.name)}
                        </div>
                        <div>
                          <p className="text-sm font-black text-zinc-900 uppercase tracking-tight">{organizer.displayName}</p>
                          <p className="text-[10px] text-zinc-400 lowercase tracking-tight flex items-center gap-1.5 mt-0.5">
                            <Mail className="w-3 h-3" />
                            {organizer.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <KycBadge status={organizer.kycStatus} />
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center">
                          <Trophy className="w-4 h-4 text-zinc-400" />
                        </div>
                        <span className="text-sm text-zinc-900 font-black">{orgStats.tournamentCount}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-black text-green-600 tabular-nums">
                        {formatCurrency(orgStats.totalPrizePool)}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2.5 text-zinc-500 text-[11px] uppercase tracking-wider font-bold">
                        <Calendar className="w-3.5 h-3.5 opacity-40" />
                        {formatDate(organizer.createdAt)}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-3 text-zinc-400 hover:text-zinc-900 hover:bg-white rounded-xl border border-transparent hover:border-zinc-100 transition-all shadow-none hover:shadow-sm">
                          <Eye className="w-4 h-4" />
                        </button>
                        {organizer.kycStatus === 'PENDING' && (
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
                );
              })}
            </tbody>
          </table>
          {filteredOrganizers.length === 0 && (
            <div className="py-24 text-center">
              <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Building2 className="w-10 h-10 text-zinc-200" />
              </div>
              <p className="text-xl font-black text-zinc-900 uppercase tracking-widest" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>NO ORGANIZERS FOUND</p>
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

function KycBadge({ status }: { status: KYCStatus }) {
  const config: any = {
    APPROVED: { label: 'VERIFIED', bg: 'bg-green-100 text-green-700' },
    PENDING: { label: 'PENDING APPROVAL', bg: 'bg-amber-100 text-amber-700' },
    REJECTED: { label: 'REJECTED', bg: 'bg-red-50 text-red-700' },
    NOT_SUBMITTED: { label: 'INACTIVE', bg: 'bg-zinc-100 text-zinc-500' },
  };
  const s = config[status] || config.NOT_SUBMITTED;
  return (
    <div className="flex items-center gap-2">
      <div className={cn("w-2 h-2 rounded-full", s.label === 'VERIFIED' ? 'bg-green-500' : s.label === 'DENIED' ? 'bg-red-500' : 'bg-zinc-300')} />
      <span className={cn("px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest", s.bg)}>
        {s.label}
      </span>
    </div>
  );
}
