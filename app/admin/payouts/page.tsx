'use client';

import { useState } from 'react';
import { Modal } from '@/app/components/ui/modal';
import { useToast } from '@/app/components/ui/toast';
import { mockPayouts } from '@/app/lib/mock-data';
import { formatCurrency, cn } from '@/app/lib/utils';
import {
  Wallet,
  CheckCircle,
  AlertCircle,
  User,
  Trophy,
  CreditCard,
  Shield,
  Clock,
  XCircle,
  IndianRupee,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

export default function PayoutsPage() {
  const { success } = useToast();
  const [selectedPayout, setSelectedPayout] = useState<typeof mockPayouts[0] | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'all'>('pending');

  const filteredPayouts = mockPayouts.filter((p) => {
    switch (activeTab) {
      case 'pending': return p.status === 'PENDING';
      case 'approved': return ['APPROVED', 'PROCESSING', 'COMPLETED'].includes(p.status);
      default: return true;
    }
  });

  const pendingCount = mockPayouts.filter((p) => p.status === 'PENDING').length;
  const approvedCount = mockPayouts.filter((p) => ['APPROVED', 'PROCESSING', 'COMPLETED'].includes(p.status)).length;
  const totalPendingAmount = mockPayouts.filter((p) => p.status === 'PENDING').reduce((acc, p) => acc + p.amount, 0);

  const handleApprovePayout = () => {
    if (selectedPayout) {
      success('PAYMENT APPROVED', `Payout of ${formatCurrency(selectedPayout.amount)} to ${selectedPayout.userName} has been approved.`);
      setShowApproveModal(false);
      setSelectedPayout(null);
    }
  };

  const handleBatchApprove = () => {
    success('BATCH APPROVAL', `${pendingCount} payouts have been approved for payment.`);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-12 sm:pt-20 pb-16 space-y-12">
      {/* 1. Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div>
          <h1 className="text-[clamp(2.5rem,8vw,4.5rem)] font-black text-zinc-900 tracking-tight leading-[0.8] uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            PAYOUTS & <span className="text-netflix-red italic">WITHDRAWALS</span>
          </h1>
          <p className="text-zinc-400 font-bold uppercase tracking-[0.3em] text-[10px] sm:text-xs mt-6 flex items-center gap-3">
            <span className="w-12 h-[2px] bg-netflix-red" />
            Verify and approve player prize distribution
          </p>
        </div>

        <div className="flex bg-white border border-zinc-100 p-1 rounded-2xl shadow-sm">
          <StatMini label="PENDING" value={pendingCount} color="text-amber-600" />
          <div className="w-px h-8 bg-zinc-50 my-auto" />
          <StatMini label="TOTAL PENDING" value={`₹${(totalPendingAmount / 1000).toFixed(0)}K`} color="text-green-600" />
          <div className="w-px h-8 bg-zinc-50 my-auto" />
          {pendingCount > 0 && (
            <button
              onClick={handleBatchApprove}
              className="px-6 py-4 bg-zinc-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-netflix-red transition-all flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              APPROVE ALL
            </button>
          )}
        </div>
      </div>

      {/* 2. Escrow Security Notice */}
      <div className="bg-zinc-900 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-netflix-red opacity-10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-start gap-6">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-white uppercase tracking-widest" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Payment Security</h3>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-loose max-w-xl">
                All payments need admin approval. Funds are held safely until results are verified and KYC is checked.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black text-white px-4 py-2 bg-white/5 border border-white/5 rounded-full uppercase tracking-widest">
              ENCRYPTION: AES-256
            </span>
          </div>
        </div>
      </div>

      {/* 3. Operation Hub (Tabs) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
        <div className="flex p-1.5 bg-zinc-50 border border-zinc-100 rounded-2xl gap-1">
          <TabButton
            active={activeTab === 'pending'}
            onClick={() => setActiveTab('pending')}
            label="PENDING"
            count={pendingCount}
          />
          <TabButton
            active={activeTab === 'approved'}
            onClick={() => setActiveTab('approved')}
            label="APPROVED"
          />
          <TabButton
            active={activeTab === 'all'}
            onClick={() => setActiveTab('all')}
            label="ALL HISTORY"
          />
        </div>

        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
          Viewing {filteredPayouts.length} Operations
        </p>
      </div>

      {/* 4. Transmission Matrix (Table) */}
      <div className="bg-white border border-zinc-100 rounded-[3rem] overflow-hidden shadow-2xl shadow-zinc-200/50">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 border-b border-zinc-100">
                <th className="px-8 py-6 text-left text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">PLAYER</th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">TOURNAMENT</th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">AMOUNT</th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">STATUS</th>
                <th className="px-8 py-6 text-right text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50 font-bold">
              {filteredPayouts.map((payout) => (
                <tr key={payout.id} className="hover:bg-zinc-50/30 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center text-white text-sm font-black shadow-lg shadow-zinc-900/10">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-zinc-900 uppercase tracking-tight">{payout.userName}</p>
                        <p className="text-[10px] text-zinc-400 uppercase tracking-widest mt-0.5">ID: {payout.id.toUpperCase()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center">
                        <Trophy className="w-4 h-4 text-zinc-400" />
                      </div>
                      <span className="text-[11px] font-black text-zinc-900 uppercase tracking-tight">{payout.tournamentTitle}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-black text-green-600 tabular-nums">
                      {formatCurrency(payout.amount)}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <StatusBadge status={payout.status} />
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-end">
                      {payout.status === 'PENDING' && (
                        <button
                          onClick={() => { setSelectedPayout(payout); setShowApproveModal(true); }}
                          className="px-6 py-2.5 bg-white border border-zinc-100 rounded-xl text-[10px] font-black text-zinc-900 uppercase tracking-widest hover:bg-zinc-900 hover:text-white transition-all shadow-sm flex items-center gap-2 group/btn"
                        >
                          <CheckCircle className="w-4 h-4 group-hover/btn:text-green-500 transition-colors" />
                          APPROVE
                        </button>
                      )}
                      <button className="p-3 text-zinc-300 hover:text-zinc-900 transition-colors">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredPayouts.length === 0 && (
            <div className="py-24 text-center">
              <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <p className="text-xl font-black text-zinc-900 uppercase tracking-widest" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>NO PENDING PAYOUTS</p>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-2">{activeTab === 'pending' ? 'ALL PENDING PAYMENTS COMPLETED' : 'NO RECORDS FOUND'}</p>
            </div>
          )}
        </div>
      </div>

      {/* Approve Modal */}
      <Modal
        isOpen={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        title="CAPITAL AUTHORIZATION"
        size="md"
      >
        <div className="space-y-8 py-4">
          <div className="space-y-2">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">TRANSMISSION INTEL</p>
            <div className="bg-zinc-50 rounded-[2rem] border border-zinc-100 divide-y divide-zinc-100 overflow-hidden">
              <ModalDetail label="PLAYER" value={selectedPayout?.userName} />
              <ModalDetail label="TOURNAMENT" value={selectedPayout?.tournamentTitle} />
              <ModalDetail label="AMOUNT" value={selectedPayout && formatCurrency(selectedPayout.amount)} valueColor="text-green-600" />
            </div>
          </div>

          <div className="flex items-start gap-4 p-6 bg-amber-50 rounded-3xl border border-amber-100">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-700 font-bold uppercase tracking-wide leading-relaxed">
              APPROVAL IS IRREVERSIBLE. MONEY WILL BE SENT TO THE PLAYER. ENSURE MATCH RESULTS ARE CORRECT.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={() => setShowApproveModal(false)}
              className="flex-1 py-4 bg-zinc-100 text-zinc-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all font-bold"
            >
              ABORT
            </button>
            <button
              onClick={handleApprovePayout}
              className="flex-1 py-4 bg-zinc-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-netflix-red transition-all flex items-center justify-center gap-3 shadow-xl shadow-zinc-200"
            >
              <CheckCircle className="w-5 h-5 text-green-500" />
              CONFIRM PAYMENT
            </button>
          </div>
        </div>
      </Modal>
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

function TabButton({ active, onClick, label, count }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all transition-all flex items-center gap-3",
        active ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100"
      )}
    >
      {label}
      {count !== undefined && (
        <span className={cn(
          "px-2 py-0.5 rounded-full text-[9px] font-black tabular-nums",
          active ? "bg-amber-500 text-white" : "bg-zinc-200 text-zinc-500"
        )}>
          {count}
        </span>
      )}
    </button>
  );
}

function ModalDetail({ label, value, valueColor = "text-zinc-900" }: any) {
  return (
    <div className="flex justify-between items-center px-8 py-5">
      <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{label}</span>
      <span className={cn("text-xs font-black uppercase tracking-tight", valueColor)}>{value}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    PENDING: { label: 'PENDING', bg: 'bg-amber-100 text-amber-700' },
    APPROVED: { label: 'APPROVED', bg: 'bg-blue-100 text-blue-700' },
    PROCESSING: { label: 'SENDING', bg: 'bg-purple-100 text-purple-700' },
    COMPLETED: { label: 'SUCCESS', bg: 'bg-green-100 text-green-700' },
    FAILED: { label: 'FAILED', bg: 'bg-red-50 text-red-700' },
  };
  const s = styles[status] || { label: status, bg: 'bg-zinc-100 text-zinc-500' };
  return (
    <span className={cn("px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest", s.bg)}>
      {s.label}
    </span>
  );
}
