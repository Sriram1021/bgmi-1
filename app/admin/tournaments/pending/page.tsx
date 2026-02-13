'use client';

import { useState } from 'react';
import { mockTournaments } from '@/app/lib/mock-data';
import { formatCurrency, formatDateTime, cn } from '@/app/lib/utils';
import {
  Trophy,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Calendar,
  Users,
  IndianRupee,
  Gamepad2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Building,
  ExternalLink,
  ChevronRight,
  Zap,
  Target
} from 'lucide-react';
import Link from 'next/link';

export default function AdminTournamentsPendingPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter tournaments that are in PENDING_APPROVAL status
  const pendingTournaments = mockTournaments.filter(t =>
    t.status === 'PENDING_APPROVAL' || t.status === 'APPROVED' // Showing approved too for demo
  );

  const filteredTournaments = pendingTournaments.filter(t =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.organizerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApprove = (id: string) => {
    alert(`TOURNAMENT APPROVED: ${id}`);
  };

  const handleReject = (id: string) => {
    const reason = prompt('Enter reason for rejection:');
    if (reason) {
      alert(`TOURNAMENT REJECTED: ${id}. Reason: ${reason}`);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-12 sm:pt-20 pb-16 space-y-12">
      {/* 1. Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div>
          <h1 className="text-[clamp(2.5rem,8vw,4.5rem)] font-black text-zinc-900 tracking-wider leading-[0.8] uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            TOURNAMENT <span className="text-netflix-red italic">APPROVAL</span>
          </h1>
          <p className="text-zinc-400 font-bold uppercase tracking-[0.3em] text-[10px] sm:text-xs mt-6 flex items-center gap-3">
            <span className="w-12 h-[2px] bg-netflix-red" />
            Review and approve new tournaments
          </p>
        </div>

        <div className="flex bg-white border border-zinc-100 p-1 rounded-2xl shadow-sm">
          <StatMini label="PENDING REVIEW" value={pendingTournaments.length} color="text-amber-600" />
          <div className="w-px h-8 bg-zinc-50 my-auto" />
          <div className="px-8 py-4 bg-zinc-900 text-white rounded-xl flex items-center gap-3">
            <div className="w-2 h-2 bg-netflix-red rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest">QUEUE ACTIVE</span>
          </div>
        </div>
      </div>

      {/* 2. Tactical Filtering Interface */}
      <div className="bg-white border border-zinc-100 rounded-[2.5rem] p-3 sm:p-6 shadow-xl shadow-zinc-200/30 flex flex-col xl:flex-row gap-6 items-center">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-netflix-red transition-colors" />
          <input
            type="text"
            placeholder="SEARCH BY TOURNAMENT NAME OR ORGANIZER..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-5 pl-16 pr-6 text-[10px] font-black tracking-widest text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-netflix-red/20 focus:bg-white transition-all uppercase"
          />
        </div>

        <div className="w-full xl:w-auto">
          <button className="w-full xl:w-auto px-10 py-5 bg-white border border-zinc-100 rounded-2xl text-[10px] font-black text-zinc-900 uppercase tracking-widest hover:bg-zinc-900 hover:text-white transition-all flex items-center justify-center gap-3">
            <Filter className="w-4 h-4" />
            FILTER LIST
          </button>
        </div>
      </div>

      {/* 3. Pending Mission Queue */}
      <div className="space-y-8 sm:space-y-12">
        {filteredTournaments.length > 0 ? (
          filteredTournaments.map((tournament) => (
            <div key={tournament.id} className="bg-white border border-zinc-100 rounded-[3rem] overflow-hidden shadow-2xl shadow-zinc-200/30 group hover:scale-[1.01] transition-all">
              <div className="p-8 sm:p-12 flex flex-col xl:flex-row gap-12">

                {/* 1. Thumbnail & Intellectual Specs */}
                <div className="flex flex-col sm:flex-row gap-8 flex-1">
                  <div className="w-full sm:w-44 h-64 sm:h-auto aspect-[3/4] rounded-3xl overflow-hidden flex-shrink-0 relative border border-zinc-100 shadow-xl shadow-zinc-200/20">
                    <img src={tournament.thumbnailUrl} alt={tournament.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-transparent to-transparent opacity-60" />
                    <div className="absolute bottom-4 left-4 px-3 py-1 bg-netflix-red text-[8px] font-black text-white rounded-lg uppercase tracking-widest">
                      {tournament.game}
                    </div>
                  </div>

                  <div className="flex-1 space-y-8">
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className={cn(
                          "px-4 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                          tournament.status === 'PENDING_APPROVAL' ? "bg-amber-100 text-amber-700 border-amber-200" : "bg-green-100 text-green-700 border-green-200"
                        )}>
                          {tournament.status.replace('_', ' ')}
                        </span>
                        <div className="flex items-center gap-2 px-4 py-1 bg-zinc-50 border border-zinc-100 rounded-lg text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                          <Building className="w-3.5 h-3.5" />
                          {tournament.organizerName}
                        </div>
                      </div>
                      <h3 className="text-3xl sm:text-4xl font-black text-zinc-900 uppercase tracking-wider leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                        {tournament.title}
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                      <ReviewStat icon={<IndianRupee className="w-4 h-4 text-green-600" />} label="PRIZE POOL" value={formatCurrency(tournament.prizePool / 100)} />
                      <ReviewStat icon={<Users className="w-4 h-4 text-zinc-900" />} label="MAX PLAYERS" value={tournament.maxParticipants.toString()} />
                      <ReviewStat icon={<Zap className="w-4 h-4 text-amber-500" />} label="ENTRY FEE" value={formatCurrency(tournament.entryFee / 100)} />
                      <ReviewStat icon={<Calendar className="w-4 h-4 text-netflix-red" />} label="START DATE" value={formatDateTime(tournament.startsAt)} />
                    </div>
                  </div>
                </div>

                {/* 2. Tactical Authorization Actions */}
                <div className="xl:w-80 flex flex-col justify-center gap-4 xl:border-l border-zinc-100 xl:pl-12 pt-8 xl:pt-0">
                  <button
                    onClick={() => handleApprove(tournament.id)}
                    className="w-full py-5 bg-zinc-900 hover:bg-netflix-red text-white text-[10px] font-black rounded-2xl uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-zinc-200 group/btn transition-all"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500 group-hover/btn:text-white" />
                    APPROVE TOURNAMENT
                  </button>
                  <button
                    onClick={() => handleReject(tournament.id)}
                    className="w-full py-5 bg-zinc-50 border border-zinc-100 hover:bg-red-50 hover:border-red-100 text-zinc-400 hover:text-netflix-red text-[10px] font-black rounded-2xl uppercase tracking-widest flex items-center justify-center gap-3 transition-all"
                  >
                    <XCircle className="w-5 h-5" />
                    REJECT TOURNAMENT
                  </button>
                  <Link href={`/tournaments/${tournament.id}`} className="w-full">
                    <button className="w-full py-2 text-zinc-300 text-[9px] font-black uppercase tracking-[0.2em] hover:text-zinc-900 flex items-center justify-center gap-2 transition-all">
                      VIEW DETAILS <ExternalLink className="w-3 h-3" />
                    </button>
                  </Link>
                </div>
              </div>

              {/* Integrity Certification Bar */}
              <div className="bg-zinc-50/50 border-t border-zinc-100 px-8 sm:px-12 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-green-600" />
                    <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest leading-none">Organizer Verified</p>
                  </div>
                  <div className="w-1 h-1 bg-zinc-200 rounded-full hidden sm:block" />
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-netflix-red" />
                    <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest leading-none">Bank Info & KYC Checked</p>
                  </div>
                </div>
                <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">SUBMITTED: 2.5H AGO</p>
              </div>
            </div>
          ))
        ) : (
          <div className="py-32 text-center bg-white border border-zinc-100 rounded-[3rem] shadow-xl shadow-zinc-200/20">
            <div className="w-24 h-24 bg-zinc-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
              <CheckCircle className="w-12 h-12 text-zinc-200" />
            </div>
            <h3 className="text-2xl font-black text-zinc-900 uppercase tracking-wider" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>QUEUE IS CLEAR</h3>
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.3em] mt-2">NO TOURNAMENTS AWAITING APPROVAL</p>
          </div>
        )}
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

function ReviewStat({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center shadow-sm">
          {icon}
        </div>
        <div>
          <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">{label}</p>
          <p className="text-xs font-black text-zinc-900 uppercase tracking-wider">{value}</p>
        </div>
      </div>
    </div>
  );
}
