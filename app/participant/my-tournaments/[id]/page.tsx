'use client';

import { useEffect, use } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ArrowLeft, Trophy, Calendar, Users, Target, Shield, Wallet, Ticket, CircleUser, Copy } from 'lucide-react';
import Link from 'next/link';
import { RootState, AppDispatch } from '@/app/lib/redux/store';
import { fetchRegistrationDetails } from '@/app/lib/redux/slices/tournamentSlice';
import { formatCurrency, formatDateTime, cn } from '@/app/lib/utils';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { TournamentStatusBadge } from '@/app/components/tournaments/tournament-status-badge';

export default function RegistrationDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const dispatch = useDispatch<AppDispatch>();
  const { currentRegistration, loading, error } = useSelector((state: RootState) => state.tournament);

  useEffect(() => {
    if (id) {
      dispatch(fetchRegistrationDetails(id));
    }
  }, [id, dispatch]);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-200 border-t-netflix-red" />
          <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest animate-pulse">Loading Details...</p>
        </div>
      </div>
    );
  }

  if (error || !currentRegistration) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
          <Shield className="h-10 w-10 text-red-500" />
        </div>
        <h3 className="text-xl font-black text-zinc-900 uppercase tracking-tight mb-2">Details Unavailable</h3>
        <p className="text-zinc-500 mb-8 max-w-md">
          {error || "We couldn't find your registration details for this tournament."}
        </p>
        <Link href="/participant/my-tournaments">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to My Matches
          </Button>
        </Link>
      </div>
    );
  }

  // Determine status color
  const statusColor = currentRegistration.status === 'CONFIRMED' ? 'text-green-600 bg-green-50 border-green-100' :
                      currentRegistration.status === 'PENDING' ? 'text-amber-600 bg-amber-50 border-amber-100' :
                      'text-zinc-600 bg-zinc-50 border-zinc-100';

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/participant/my-tournaments">
          <Button variant="ghost" className="h-10 w-10 rounded-full hover:bg-zinc-100">
            <ArrowLeft className="h-5 w-5 text-zinc-600" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-black text-zinc-900 uppercase tracking-tight" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            Match Ticket
          </h1>
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
            Registration ID: #{currentRegistration._id?.slice(-8) || 'N/A'}
          </p>
        </div>
      </div>

      {/* Ticket Card */}
      <div className="bg-white rounded-4xl border border-zinc-100 shadow-xl overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
        
        {/* Ticket Header (Perforated Style) */}
        <div className="relative p-8 border-b border-dashed border-zinc-200 bg-zinc-50/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <Badge className={cn("px-3 py-1 text-[10px] font-black uppercase tracking-widest border", statusColor)}>
                {currentRegistration.status}
              </Badge>
              <h2 className="text-3xl md:text-4xl font-black text-zinc-900 uppercase tracking-tight leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                {/* We assume the tournament title might not be directly in registration object, but usually is populated. */}
                {currentRegistration.tournament?.title || "Tournament Match"}
              </h2>
            </div>
            
             <div className="flex items-center gap-4">
               <div className="text-right hidden md:block">
                 <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Entry Fee</p>
                 <p className="text-xl font-black text-zinc-900">{formatCurrency(currentRegistration.amount || 0)}</p>
               </div>
               <div className="h-12 w-12 rounded-xl bg-white border border-zinc-100 shadow-sm flex items-center justify-center">
                 <Ticket className="h-6 w-6 text-zinc-900" />
               </div>
             </div>
          </div>
        </div>

        {/* Ticket Body */}
        <div className="p-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          
          {/* Team Info */}
          <div className="space-y-4 md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-netflix-red" />
              <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">Team Details</h3>
            </div>
            <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-100">
              <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mb-1">Team Name</p>
              <p className="text-xl font-black text-zinc-900">{currentRegistration.teamName}</p>
            </div>
             <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-100 flex items-center justify-between">
              <div>
                <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mb-1">Assigned Slot</p>
                <p className="text-2xl font-black text-zinc-900 font-mono">#{currentRegistration.slot || 'TBD'}</p>
              </div>
              <Target className="h-8 w-8 text-zinc-200" />
            </div>
          </div>

          {/* Payment Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="h-4 w-4 text-emerald-500" />
              <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">Payment Info</h3>
            </div>
            <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-100 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-zinc-400 uppercase">Status</span>
                <Badge className="bg-emerald-50 text-emerald-600 border border-emerald-100 font-bold">
                  {currentRegistration.paymentStatus}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-zinc-400 uppercase">Method</span>
                <span className="text-xs font-bold text-zinc-900 uppercase">UPI / Online</span>
              </div>
              <div className="h-px bg-zinc-200" />
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-zinc-900 uppercase">Total Paid</span>
                <span className="text-sm font-black text-zinc-900">{formatCurrency(currentRegistration.amount || 0)}</span>
              </div>
            </div>
          </div>

          {/* Tournament Quick Info (If available) */}
          <div className="space-y-4">
             <div className="flex items-center gap-2 mb-2">
              <Trophy className="h-4 w-4 text-amber-500" />
              <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">Match Info</h3>
            </div>
             <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-100 space-y-4">
               {/* We can display generic info or fetch it if needed. For now using what's available or placeholders */}
               <div className="flex items-center gap-3">
                 <Calendar className="h-4 w-4 text-zinc-400" />
                 <div>
                   <p className="text-[10px] font-bold text-zinc-400 uppercase">Date</p>
                   <p className="text-xs font-bold text-zinc-900">Check Tournament Page</p>
                 </div>
               </div>
               <Link href={`/tournaments/${currentRegistration.tournamentId || currentRegistration.tournament?._id}`}>
                 <Button className="w-full h-8 text-xs font-bold bg-zinc-900 hover:bg-zinc-800 mt-2">
                   View Full Match Details
                 </Button>
               </Link>
             </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-zinc-900 p-4 text-center">
           <p className="text-[10px] text-zinc-500 font-medium">
             Please ensure you join the lobby 15 minutes before start time with your assigned slot.
           </p>
        </div>
      </div>
    </div>
  );
}
