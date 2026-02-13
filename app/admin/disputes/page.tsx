'use client';

import { useState } from 'react';
import { mockTournaments, mockUsers } from '@/app/lib/mock-data';
import { formatDateTime, cn } from '@/app/lib/utils';
import {
  AlertTriangle,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  MessageSquare,
  Trophy,
  User,
  Clock,
  Scale,
  Filter,
  AlertCircle,
  ShieldAlert,
  ChevronRight,
  MoreVertical,
  Flag
} from 'lucide-react';

type DisputeStatus = 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'DISMISSED';
type DisputeType = 'RESULT_DISPUTE' | 'PAYMENT_ISSUE' | 'CHEATING_REPORT' | 'ORGANIZER_COMPLAINT';

interface Dispute {
  id: string;
  type: DisputeType;
  status: DisputeStatus;
  title: string;
  description: string;
  tournamentId: string;
  reporterId: string;
  reportedAt: string;
  updatedAt: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

// Mock disputes data
const mockDisputes: Dispute[] = [
  {
    id: 'DIS-552-A',
    type: 'RESULT_DISPUTE',
    status: 'OPEN',
    title: 'INCORRECT PLACEMENT RECORDED',
    description: 'My team finished 2nd place but the results show 5th place. I have screenshots as proof.',
    tournamentId: 'tournament-1',
    reporterId: 'user-1',
    reportedAt: '2025-01-02T14:30:00Z',
    updatedAt: '2025-01-02T14:30:00Z',
    priority: 'HIGH',
  },
  {
    id: 'REP-901-X',
    type: 'CHEATING_REPORT',
    status: 'UNDER_REVIEW',
    title: 'SUSPECTED USE OF HACKS',
    description: 'Player "XYZ_Pro" was using aimbot during match. Video evidence attached.',
    tournamentId: 'tournament-2',
    reporterId: 'user-3',
    reportedAt: '2025-01-01T10:15:00Z',
    updatedAt: '2025-01-02T09:00:00Z',
    priority: 'CRITICAL',
  },
  {
    id: 'PAY-112-Q',
    type: 'PAYMENT_ISSUE',
    status: 'RESOLVED',
    title: 'PRIZE NOT RECEIVED',
    description: 'Won 1st place 5 days ago but haven\'t received prize money yet.',
    tournamentId: 'tournament-3',
    reporterId: 'user-2',
    reportedAt: '2024-12-28T16:45:00Z',
    updatedAt: '2025-01-01T11:30:00Z',
    priority: 'MEDIUM',
  },
];

const STATUS_OPTIONS = [
  { value: 'ALL', label: 'ALL DISPUTES' },
  { value: 'OPEN', label: 'PENDING' },
  { value: 'UNDER_REVIEW', label: 'UNDER REVIEW' },
  { value: 'RESOLVED', label: 'RESOLVED' },
  { value: 'DISMISSED', label: 'DISMISSED' },
];

const TYPE_OPTIONS = [
  { value: 'ALL', label: 'ALL CATEGORIES' },
  { value: 'RESULT_DISPUTE', label: 'MATCH RESULT' },
  { value: 'PAYMENT_ISSUE', label: 'PAYMENT' },
  { value: 'CHEATING_REPORT', label: 'CHEATING' },
];

export default function AdminDisputesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<DisputeStatus | 'ALL'>('ALL');
  const [typeFilter, setTypeFilter] = useState<DisputeType | 'ALL'>('ALL');

  const filteredDisputes = mockDisputes.filter((dispute) => {
    const matchesSearch = dispute.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dispute.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || dispute.status === statusFilter;
    const matchesType = typeFilter === 'ALL' || dispute.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    open: mockDisputes.filter(d => d.status === 'OPEN').length,
    underReview: mockDisputes.filter(d => d.status === 'UNDER_REVIEW').length,
    resolved: mockDisputes.filter(d => d.status === 'RESOLVED').length,
    critical: mockDisputes.filter(d => d.priority === 'CRITICAL' && d.status !== 'RESOLVED').length,
  };

  const getTournamentTitle = (tournamentId: string) => {
    return mockTournaments.find(t => t.id === tournamentId)?.title || 'Unknown';
  };

  const getReporterName = (reporterId: string) => {
    return mockUsers.find(u => u.id === reporterId)?.displayName || 'Unknown';
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-12 sm:pt-20 pb-16 space-y-12">
      {/* 1. Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div>
          <h1 className="text-[clamp(2.5rem,8vw,4.5rem)] font-black text-zinc-900 tracking-tight leading-[0.8] uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            PLAYER <span className="text-netflix-red italic">DISPUTES</span>
          </h1>
          <p className="text-zinc-400 font-bold uppercase tracking-[0.3em] text-[10px] sm:text-xs mt-6 flex items-center gap-3">
            <span className="w-12 h-[2px] bg-netflix-red" />
            Resolve match conflicts and player reports
          </p>
        </div>

        <div className="flex bg-white border border-zinc-100 p-1 rounded-2xl shadow-sm">
          <StatMini label="OPEN" value={stats.open} color="text-amber-600" />
          <div className="w-px h-8 bg-zinc-50 my-auto" />
          <StatMini label="CRITICAL" value={stats.critical} color="text-netflix-red" ripple />
          <div className="w-px h-8 bg-zinc-50 my-auto" />
          <StatMini label="SOLVED" value={stats.resolved} color="text-green-600" />
        </div>
      </div>

      {/* 2. Tactical Filtering Interface */}
      <div className="bg-white border border-zinc-100 rounded-[2.5rem] p-3 sm:p-6 shadow-xl shadow-zinc-200/30 flex flex-col xl:flex-row gap-6 items-center">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-netflix-red transition-colors" />
          <input
            type="text"
            placeholder="SEARCH BY DISPUTE TITLE OR ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-5 pl-16 pr-6 text-[10px] font-black tracking-widest text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-netflix-red/20 focus:bg-white transition-all uppercase"
          />
        </div>

        <div className="flex gap-4 w-full xl:w-auto overflow-x-auto no-scrollbar">
          <FilterGroup label="STATUS" value={statusFilter} options={STATUS_OPTIONS} onChange={setStatusFilter} icon={Scale} />
          <FilterGroup label="CATEGORY" value={typeFilter} options={TYPE_OPTIONS} onChange={setTypeFilter} icon={Flag} />
        </div>
      </div>

      {/* 3. Dispute Matrix (Cards) */}
      <div className="grid grid-cols-1 gap-6 sm:gap-8">
        {filteredDisputes.length > 0 ? (
          filteredDisputes.map((dispute) => (
            <div key={dispute.id} className="bg-white border border-zinc-100 rounded-[3rem] overflow-hidden shadow-2xl shadow-zinc-200/30 group hover:scale-[1.005] transition-all">
              <div className="p-8 sm:p-10 flex flex-col lg:flex-row gap-8 lg:items-center">

                {/* 1. Identifier & Status */}
                <div className="lg:w-64 space-y-4 flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <PriorityBadge priority={dispute.priority} />
                    <StatusBadge status={dispute.status} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">DISPUTE ID</p>
                    <p className="text-sm font-black text-zinc-900 uppercase tracking-tight">{dispute.id}</p>
                  </div>
                </div>

                {/* 2. Content & Intel */}
                <div className="flex-1 space-y-6">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-netflix-red uppercase tracking-widest">{dispute.type.replace('_', ' ')}</p>
                    <h3 className="text-2xl font-black text-zinc-900 uppercase tracking-tight" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{dispute.title}</h3>
                    <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-wide leading-relaxed line-clamp-2">{dispute.description}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
                    <IntelItem icon={Trophy} label="TOURNAMENT" value={getTournamentTitle(dispute.tournamentId)} />
                    <IntelItem icon={User} label="REPORTED BY" value={getReporterName(dispute.reporterId)} />
                    <IntelItem icon={Clock} label="DATE" value={formatDateTime(dispute.reportedAt)} />
                  </div>
                </div>

                {/* 3. Authorization Actions */}
                <div className="lg:w-80 flex gap-3 lg:border-l border-zinc-100 lg:pl-8 pt-8 lg:pt-0">
                  <button className="flex-1 py-4 bg-zinc-900 hover:bg-netflix-red text-white text-[10px] font-black rounded-2xl uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
                    <Eye className="w-4 h-4" />
                    VIEW DETAILS
                  </button>
                  <button className="p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-zinc-400 hover:text-zinc-900 hover:bg-white transition-all shadow-none hover:shadow-sm flex items-center justify-center">
                    <MessageSquare className="w-5 h-5" />
                  </button>
                  <button className="p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-zinc-400 hover:text-zinc-900 hover:bg-white transition-all shadow-none hover:shadow-sm flex items-center justify-center">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-32 text-center bg-white border border-zinc-100 rounded-[3rem] shadow-xl shadow-zinc-200/20">
            <div className="w-24 h-24 bg-green-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
              <ShieldAlert className="w-12 h-12 text-green-500" />
            </div>
            <h3 className="text-3xl font-black text-zinc-900 uppercase tracking-tight" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>CLEAR</h3>
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.3em] mt-2">No player disputes at the moment</p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatMini({ label, value, color = "text-zinc-900", ripple }: any) {
  return (
    <div className="px-8 py-4 text-center relative overflow-hidden group">
      {ripple && (
        <div className="absolute inset-0 bg-red-500/5 rounded-full blur-xl scale-150 animate-pulse" />
      )}
      <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1 relative z-10">{label}</p>
      <p className={cn("text-xl font-black relative z-10", color)} style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{value}</p>
    </div>
  );
}

function FilterGroup({ label, value, options, onChange, icon: Icon }: any) {
  return (
    <div className="relative group min-w-[180px]">
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

function IntelItem({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-center gap-2.5">
      <Icon className="w-3.5 h-3.5 text-zinc-300" />
      <div className="flex items-center gap-1.5">
        <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">{label}:</span>
        <span className="text-[10px] font-black text-zinc-900 uppercase tracking-tight">{value}</span>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: DisputeStatus }) {
  const config: any = {
    OPEN: { label: 'PENDING', bg: 'bg-amber-100 text-amber-700' },
    UNDER_REVIEW: { label: 'UNDER REVIEW', bg: 'bg-blue-100 text-blue-700' },
    RESOLVED: { label: 'RESOLVED', bg: 'bg-green-100 text-green-700' },
    DISMISSED: { label: 'DISMISSED', bg: 'bg-zinc-100 text-zinc-500' },
  };
  const s = config[status];
  return (
    <span className={cn("px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest", s.bg)}>
      {s.label}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: Dispute['priority'] }) {
  const styles: any = {
    LOW: 'bg-zinc-100 text-zinc-500',
    MEDIUM: 'bg-zinc-900 text-white',
    HIGH: 'bg-orange-600 text-white',
    CRITICAL: 'bg-netflix-red text-white animate-pulse',
  };
  return (
    <span className={cn("px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest", styles[priority])}>
      {priority}
    </span>
  );
}
