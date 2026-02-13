'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/app/components/ui/toast';
import { mockMatches, mockTournaments } from '@/app/lib/mock-data';
import { formatCurrency, cn } from '@/app/lib/utils';
import {
  Trophy,
  Upload,
  Trash2,
  CheckCircle,
  AlertCircle,
  Users,
  Crosshair,
  ArrowRight,
  ShieldCheck,
  Building,
  ArrowLeft,
  Camera,
  FileText,
  DollarSign,
  ClipboardList
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/app/components/ui/button';

export default function SubmitResultsPage({ params }: { params: { matchId: string } }) {
  const router = useRouter();
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Find match and tournament
  const match = mockMatches.find(m => m.id === 'match_001'); // Using static ID for demo
  const tournament = mockTournaments.find(t => t.id === match?.tournamentId);

  // Results State
  const [winnerName, setWinnerName] = useState('');
  const [winnerKills, setWinnerKills] = useState('');
  const [screenshots, setScreenshots] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setScreenshots(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeScreenshot = (index: number) => {
    setScreenshots(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (screenshots.length === 0) {
      addToast({ type: 'error', title: 'Missing Evidence', message: 'Please upload at least one screenshot as proof.' });
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      addToast({ type: 'success', title: 'Results Submitted!', message: 'Match data is being verified by our team.' });
      router.push('/organizer/dashboard');
    } catch {
      addToast({ type: 'error', title: 'Submission Error', message: 'Failed to upload results. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1240px] mx-auto px-6 py-12 pb-32 pt-8 lg:pt-16">
      {/* HUD Navigation */}
      <Link href="/organizer/dashboard" className="inline-flex items-center gap-3 px-5 py-2.5 rounded-xl bg-white border border-zinc-100 text-[10px] font-black text-zinc-400 hover:text-zinc-900 shadow-sm hover:shadow-md uppercase tracking-[0.2em] mb-12 transition-all group w-fit">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        BACK TO DASHBOARD
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

        {/* LEFT: Submission Form Area (8 cols) */}
        <div className="lg:col-span-8 space-y-12">
          <div className="space-y-4">
            <h1 className="text-[clamp(2.5rem,8vw,5.5rem)] font-black text-zinc-900 tracking-tight leading-[0.85] uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              SUBMIT MATCH<br />
              <span className="text-netflix-red italic">RESULTS</span>
            </h1>
            <p className="text-zinc-400 font-bold uppercase tracking-[0.2em] text-[10px] sm:text-xs flex items-center gap-3">
              <span className="w-12 h-[2px] bg-netflix-red" />
              Match #{match?.matchNumber} • {tournament?.title}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-16">

            {/* 1. Champion Declaration Container */}
            <div className="bg-white border border-zinc-100 shadow-xl shadow-zinc-200/50 rounded-[3rem] p-10 sm:p-14 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50 group-hover:bg-amber-50 transition-colors duration-500" />

              <div className="relative z-10">
                <h3 className="text-sm font-black text-zinc-900 uppercase tracking-[0.3em] mb-12 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-100">
                    <Trophy className="w-5 h-5 text-amber-500" />
                  </div>
                  WINNER INFO
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <InputGroup label="WINNER NAME (IGN)" icon={Users}>
                    <input
                      type="text"
                      placeholder="Enter exact player name"
                      value={winnerName}
                      onChange={(e) => setWinnerName(e.target.value)}
                      className="w-full bg-zinc-50/50 border border-zinc-100 rounded-2xl px-6 py-5 text-zinc-900 font-bold placeholder:text-zinc-300 focus:outline-none focus:border-netflix-red focus:bg-white transition-all shadow-inner"
                      required
                    />
                  </InputGroup>
                  <InputGroup label="TOTAL MATCH KILLS" icon={Crosshair}>
                    <input
                      type="number"
                      placeholder="0"
                      value={winnerKills}
                      onChange={(e) => setWinnerKills(e.target.value)}
                      className="w-full bg-zinc-50/50 border border-zinc-100 rounded-2xl px-6 py-5 text-zinc-900 font-bold placeholder:text-zinc-300 focus:outline-none focus:border-netflix-red focus:bg-white transition-all shadow-inner"
                      required
                    />
                  </InputGroup>
                </div>
              </div>
            </div>

            {/* 2. Tactical Evidence (Screenshots) */}
            <div className="bg-white border border-zinc-100 shadow-xl shadow-zinc-200/50 rounded-[3rem] p-10 sm:p-14">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
                <h3 className="text-sm font-black text-zinc-900 uppercase tracking-[0.3em] flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
                    <Camera className="w-5 h-5 text-blue-600" />
                  </div>
                  SCREENSHOT PROOF
                </h3>
                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] bg-zinc-50 px-4 py-1.5 rounded-full border border-zinc-100">MAX 5 IMAGES</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-12">
                {screenshots.map((file, idx) => (
                  <div key={idx} className="aspect-video bg-zinc-50 rounded-[2rem] border border-zinc-100 relative overflow-hidden group shadow-sm hover:shadow-xl transition-all">
                    <div className="absolute inset-0 flex items-center justify-center opacity-20">
                      <FileText className="w-12 h-12 text-zinc-900" />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeScreenshot(idx)}
                      className="absolute top-3 right-3 p-2 bg-netflix-red text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-90 z-20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="absolute inset-0 bg-zinc-900/40 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-white/50 z-20">
                      <p className="text-[10px] text-zinc-900 truncate font-black uppercase tracking-tight">{file.name}</p>
                    </div>
                  </div>
                ))}

                {screenshots.length < 5 && (
                  <label className="aspect-video bg-zinc-50 border-3 border-dashed border-zinc-200 rounded-[2rem] flex flex-col items-center justify-center cursor-pointer hover:border-netflix-red hover:bg-white transition-all group shadow-inner">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-zinc-100 group-hover:scale-110 group-hover:border-netflix-red/30 transition-all">
                      <Upload className="w-6 h-6 text-zinc-300 group-hover:text-netflix-red transition-colors" />
                    </div>
                    <span className="text-[9px] font-black text-zinc-400 uppercase mt-4 tracking-widest group-hover:text-netflix-red transition-colors">UPLOAD PROOF</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  </label>
                )}
              </div>

              <div className="p-8 bg-zinc-900 rounded-[2.5rem] flex gap-6 items-start shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-netflix-red opacity-10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:opacity-20 transition-opacity" />
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 relative z-10">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <div className="relative z-10 space-y-2">
                  <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">PROOF REQUIREMENTS</h4>
                  <p className="text-[10px] text-zinc-500 leading-loose font-bold uppercase tracking-widest max-w-md">
                    Evidence must include the final scoreboard showing placements and total kills for all players.
                    Blurred or partial data will result in result rejection.
                  </p>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-10 bg-zinc-900 hover:bg-netflix-red text-white text-xl font-black rounded-[2.5rem] uppercase tracking-[0.3em] shadow-2xl shadow-zinc-300 hover:shadow-red-500/20 active:scale-95 transition-all flex items-center justify-center gap-6"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              {isSubmitting ? 'UPLOADING...' : 'SUBMIT RESULTS'}
              {!isSubmitting && <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />}
            </Button>

          </form>
        </div>

        {/* RIGHT: Operational Summary (4 cols) */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 space-y-10">

            <div className="bg-white border border-zinc-100 rounded-[3rem] p-10 sm:p-12 shadow-xl shadow-zinc-200/50">
              <h3 className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.4em] mb-10 flex items-center gap-3">
                <ClipboardList className="w-4 h-4 text-netflix-red" />
                MATCH SUMMARY
              </h3>
              <div className="space-y-8">
                <SummaryItem label="PRIZE POOL" value={formatCurrency(tournament?.prizePool || 0)} highlight="text-green-600" />
                <SummaryItem label="KILL REWARD" value={formatCurrency(tournament?.prizePerKill || 0)} highlight="text-netflix-red" />
                <SummaryItem label="TOTAL PLAYERS" value={`${tournament?.currentParticipants || 0}/${tournament?.maxParticipants || 0}`} />
              </div>
            </div>

            <div className="bg-zinc-50/50 border border-zinc-100 rounded-[3rem] p-10 sm:p-12 shadow-sm">
              <h3 className="text-[11px] font-black text-zinc-900 uppercase tracking-[0.4em] mb-10 flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-white" />
                </div>
                FAIR PLAY POLICY
              </h3>
              <ul className="space-y-6">
                <RuleItem text="Results must be submitted within 15 minutes of match end." />
                <RuleItem text="Results are checked against player reports." />
                <RuleItem text="Wrong info can lead to permanent ban." />
                <RuleItem text="Prizes are released after admin approval." />
              </ul>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

function InputGroup({ label, icon: Icon, children }: { label: string; icon: any; children: React.ReactNode }) {
  return (
    <div className="space-y-4 group">
      <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em] flex items-center gap-2 px-1 group-focus-within:text-netflix-red transition-colors">
        <Icon className="w-4 h-4" />
        {label}
      </label>
      {children}
    </div>
  );
}

function SummaryItem({ label, value, highlight }: { label: string, value: string, highlight?: string }) {
  return (
    <div className="flex justify-between items-end border-b border-zinc-50 pb-6 last:border-0 last:pb-0">
      <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{label}</span>
      <span className={cn("text-3xl font-black uppercase tracking-tight leading-none", highlight || "text-zinc-900")} style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{value}</span>
    </div>
  );
}

function RuleItem({ text }: { text: string }) {
  return (
    <li className="flex gap-4">
      <div className="w-1.5 h-1.5 bg-zinc-900 rounded-full mt-[5px] flex-shrink-0" />
      <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest leading-relaxed">{text}</p>
    </li>
  );
}
