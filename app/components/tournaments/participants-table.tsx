'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTournamentParticipants } from '@/app/lib/redux/slices/tournamentSlice';
import { AppDispatch, RootState } from '@/app/lib/redux/store';
import { Users, ShieldCheck, User } from 'lucide-react';
import { cn } from '@/app/lib/utils';

interface ParticipantsTableProps {
  tournamentId: string;
}

export function ParticipantsTable({ tournamentId }: ParticipantsTableProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { currentTournamentParticipants: participants, loading, error } = useSelector((state: RootState) => state.tournament);

  useEffect(() => {
    if (tournamentId) {
      dispatch(fetchTournamentParticipants(tournamentId));
    }
  }, [dispatch, tournamentId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-zinc-100 shadow-sm">
        <div className="w-10 h-10 border-4 border-netflix-red border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Scanning Participants...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-zinc-100 shadow-sm text-center px-6">
        <p className="text-netflix-red text-xs font-black uppercase tracking-widest mb-2">Error Loading Data</p>
        <p className="text-zinc-400 text-[10px] font-medium uppercase tracking-widest">{error}</p>
      </div>
    );
  }

  if (!participants || participants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-zinc-100 shadow-sm text-center px-6">
        <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center mb-6 border border-zinc-100 shadow-inner">
          <Users className="w-8 h-8 text-zinc-200" />
        </div>
        <p className="text-zinc-900 text-sm font-black uppercase tracking-widest mb-1">No Entries Detected</p>
        <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">The arena is still awaiting its first combatants.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-white border border-zinc-100 rounded-3xl shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50/50 border-b border-zinc-100">
              <th className="px-8 py-6 text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] w-20">Rank</th>
              <th className="px-8 py-6 text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em]">Combat Unit / Team</th>
              <th className="px-8 py-6 text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] hidden md:table-cell">Personnel</th>
              <th className="px-8 py-6 text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {participants.map((p: any, i: number) => (
              <tr key={i} className="group hover:bg-zinc-50/50 transition-colors">
                <td className="px-8 py-6">
                  <div className="w-10 h-10 bg-white border border-zinc-100 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <span className="text-[11px] font-black text-zinc-300">{(i + 1).toString().padStart(2, '0')}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-netflix-red rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg shadow-red-500/10">
                      {(p.teamName || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-black text-zinc-900 uppercase tracking-wide truncate max-w-[200px]">
                        {p.teamName || 'Unknown Squad'}
                      </p>
                      <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                        {p.leaderName || 'Leader TBD'}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6 hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-3">
                      {[1, 2, 3, 4].slice(0, p.players?.length || 4).map((_, idx) => (
                        <div key={idx} className="w-8 h-8 rounded-full bg-zinc-100 border-2 border-white flex items-center justify-center overflow-hidden">
                          <User className="w-4 h-4 text-zinc-400" />
                        </div>
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-2">
                      {p.players?.length || 4} Members
                    </span>
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-green-100 shadow-sm">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    CONFIRMED
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="px-8 py-6 bg-zinc-50/30 border-t border-zinc-100 flex items-center justify-between">
        <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em]">
          TOTAL DEPLOYED UNITS: <span className="text-zinc-900">{participants.length}</span>
        </p>
        <div className="flex gap-4">
           {/* Pagination placeholder if needed */}
        </div>
      </div>
    </div>
  );
}
