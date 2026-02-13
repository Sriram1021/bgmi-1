'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/app/components/ui/toast';
import { mockMatches, mockTournaments, mockUsers } from '@/app/lib/mock-data';
import { formatCurrency, formatDateTime, cn } from '@/app/lib/utils';
import { 
  ShieldCheck, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  ArrowLeft,
  Camera,
  Trophy,
  Users,
  Crosshair,
  Building,
  ArrowRight,
  ExternalLink,
  Lock,
  DollarSign,
  UserCheck
} from 'lucide-react';
import Link from 'next/link';

export default function AdminVerifyResultsPage({ params }: { params: { matchId: string } }) {
  const router = useRouter();
  const { addToast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Find match and tournament
  const match = mockMatches.find(m => m.id === 'match_001'); // Using static ID for demo
  const tournament = mockTournaments.find(t => t.id === match?.tournamentId);
  const organizer = mockUsers.find(u => u.id === tournament?.organizerId);

  // Mock winner data (from what organizer would have submitted)
  const submissionData = {
    winnerName: 'RahulGamer',
    winnerKills: 12,
    submittedAt: new Date().toISOString(),
    screenshots: [
      '/images/results/screenshot-1.jpg',
      '/images/results/screenshot-2.jpg'
    ]
  };

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      addToast({ 
        type: 'success', 
        title: 'Results Verified!', 
        message: 'Prize pool has been released from escrow to player wallets.' 
      });
      router.push('/admin/results');
    } catch {
      addToast({ type: 'error', title: 'Action Failed', message: 'Could not release payout.' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="main-container py-12 pb-24">
      <Link href="/admin/results" className="inline-flex items-center gap-2 text-[10px] font-black text-netflix-gray-500 hover:text-white uppercase tracking-[0.2em] mb-8 transition-colors group">
        <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
        Back to Verification Queue
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* LEFT: Verification Details (8 cols) */}
        <div className="lg:col-span-8 space-y-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-500 text-[10px] font-black rounded uppercase tracking-widest border border-yellow-500/20">
                Awaiting Verification
              </span>
              <span className="text-[10px] text-netflix-gray-500 font-bold uppercase tracking-widest flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Submitted {formatDateTime(submissionData.submittedAt)}
              </span>
            </div>
            <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter mb-4">
              Audit Match <span className="text-netflix-red">Results</span>
            </h1>
            <p className="text-netflix-gray-500 font-bold uppercase tracking-widest text-xs">
              {tournament?.title} • Match #{match?.matchNumber}
            </p>
          </div>

          {/* 1. Winner Data for Audit */}
          <div className="bg-netflix-gray-900 border border-white/5 rounded-3xl p-8">
            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-8 flex items-center gap-3">
              <UserCheck className="w-5 h-5 text-netflix-red" />
              Reported Winners
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 pb-4">
                    <th className="text-[10px] font-black text-netflix-gray-500 uppercase tracking-widest pb-4">Rank</th>
                    <th className="text-[10px] font-black text-netflix-gray-500 uppercase tracking-widest pb-4">Player/IGN</th>
                    <th className="text-[10px] font-black text-netflix-gray-500 uppercase tracking-widest pb-4">Kills</th>
                    <th className="text-[10px] font-black text-netflix-gray-500 uppercase tracking-widest pb-4">Estimated Payout</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr className="group">
                    <td className="py-6 font-black italic text-yellow-400">#1</td>
                    <td className="py-6 text-sm font-bold text-white">{submissionData.winnerName}</td>
                    <td className="py-6 text-sm font-bold text-white">{submissionData.winnerKills}</td>
                    <td className="py-6 text-sm font-black text-live-green">{formatCurrency(tournament?.prizePool ? tournament.prizePool / 100 : 0)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 2. Evidence Gallery */}
          <div className="bg-netflix-gray-900 border border-white/5 rounded-3xl p-8">
            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-8 flex items-center gap-3">
              <Camera className="w-5 h-5 text-netflix-blue" />
              Submitted Evidence
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {submissionData.screenshots.map((_, idx) => (
                <div key={idx} className="aspect-video bg-netflix-black rounded-2xl border border-white/10 flex flex-col items-center justify-center group overflow-hidden relative">
                  <div className="text-center p-8">
                    <Camera className="w-12 h-12 text-netflix-gray-800 mx-auto mb-4" />
                    <p className="text-[10px] font-black text-netflix-gray-600 uppercase tracking-widest">Evidence Screenshot #{idx + 1}</p>
                  </div>
                  <div className="absolute inset-0 bg-netflix-red/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm cursor-pointer">
                    <p className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                      VIEW FULL RESOLUTION <ExternalLink className="w-3 h-3" />
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Audit Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Escrow Status */}
          <div className="bg-netflix-gray-900 border border-white/5 rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-netflix-blue/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <h3 className="text-[10px] font-black text-netflix-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Lock className="w-4 h-4 text-netflix-blue" />
                Escrow Ledger
              </h3>
              <div className="space-y-4 mb-8">
                <SummaryRow label="Entry Fees Collected" value={formatCurrency(tournament?.prizePool ? tournament.prizePool / 100 : 0)} />
                <SummaryRow label="Platform Fee (10%)" value={formatCurrency(tournament?.prizePool ? (tournament.prizePool / 100) * 0.1 : 0)} color="text-netflix-red" />
                <SummaryRow label="Total Payout Release" value={formatCurrency(tournament?.prizePool ? (tournament.prizePool / 100) * 0.9 : 0)} color="text-live-green" isBold />
              </div>
              
              <button 
                onClick={handleApprove}
                disabled={isProcessing}
                className="w-full py-4 bg-live-green hover:bg-green-500 text-black text-[10px] font-black rounded-xl uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl transition-all"
              >
                {isProcessing ? 'PROCESSING...' : 'VERIFY & RELEASE PAYOUT'}
                {!isProcessing && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Dispute Handling */}
          <div className="bg-netflix-black border border-white/5 rounded-3xl p-8">
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
              Conflict Center
            </h3>
            <p className="text-[10px] text-netflix-gray-500 leading-relaxed font-medium uppercase tracking-widest mb-6">
              0 Active Player Disputes for this match.
            </p>
            <button className="w-full py-4 bg-white/5 hover:bg-netflix-red hover:text-white text-netflix-gray-400 text-[10px] font-black rounded-xl uppercase tracking-widest transition-all">
              REJECT & OPEN DISPUTE
            </button>
          </div>

          {/* Organizer Stats */}
          <div className="bg-netflix-gray-900/50 border border-white/5 rounded-3xl p-8">
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
              <Building className="w-4 h-4 text-netflix-red" />
              Host Integrity
            </h3>
            <div className="space-y-4">
              <SummaryRow label="Verified Host" value="YES" />
              <SummaryRow label="Past Verifications" value="24 Match(es)" />
              <SummaryRow label="Avg. Reveal Time" value="12 Mins" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, color = "text-white", isBold = false }: { label: string, value: string, color?: string, isBold?: boolean }) {
  return (
    <div className="flex justify-between items-end border-b border-white/5 pb-3 last:border-0 last:pb-0">
      <span className="text-[9px] font-black text-netflix-gray-600 uppercase tracking-widest">{label}</span>
      <span className={cn("text-xs uppercase", color, isBold ? "font-black italic" : "font-bold")}>{value}</span>
    </div>
  );
}

function Clock({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

