import Link from 'next/link';
import { cn } from '@/app/lib/utils';
import { formatCurrency, formatDate } from '@/app/lib/utils';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { TournamentStatusBadge } from './tournament-status-badge';
import type { Tournament } from '@/app/types';
import {
  Trophy,
  Users,
  Calendar,
  Gamepad2,
  Play,
  ChevronRight,
  ArrowRight,
  Target,
  Zap,
} from 'lucide-react';

interface TournamentCardProps {
  tournament: Tournament;
  variant?: 'default' | 'featured' | 'compact';
  disableNavigation?: boolean; // Modified prop to also support custom href scenarios
  customHref?: string; // New prop for custom navigation
}

export function TournamentCard({ tournament, variant = 'default', disableNavigation = false, customHref }: TournamentCardProps) {
  const isLive = tournament.status === 'LIVE' || tournament.status === 'IN_PROGRESS';
  const isRegistrationOpen = tournament.status === 'REGISTRATION_OPEN';

  // Helper to wrap content in Link or div
  const Wrapper = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    if (disableNavigation) {
      return <div className={className}>{children}</div>;
    }
    
    // Determine the target URL
    const targetUrl = customHref || (variant === 'featured' 
      ? `/tournaments/${tournament.id || (tournament as any)._id}` 
      : `/tournaments/${tournament.id}`);

    return (
      <Link href={targetUrl} className={className}>
        {children}
      </Link>
    );
  };

  if (variant === 'featured') {
    return (
      <Wrapper>
        <div className="relative group overflow-hidden rounded-[2.5rem] bg-white border border-zinc-100 shadow-xl shadow-zinc-200/50 hover:shadow-2xl hover:shadow-zinc-300/60 transition-all duration-500 cursor-default">
          <div className="absolute top-0 right-0 w-96 h-96 bg-zinc-50 rounded-full blur-3xl -mr-48 -mt-48 opacity-50 group-hover:bg-netflix-red/5 transition-colors duration-700" />
          
           {/* ... existing content ... */}
           {/* Note: I will need to replace the entire return block to properly wrap it. 
               Since I cannot easily reference existing content in 'ReplacementContent' without copying it all, 
               I will rewrite the return statements to use the Wrapper. 
           */}
           <div className="relative p-8 sm:p-12">
            {/* Same content as before */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
              <div className="flex-1 max-w-2xl space-y-6">
                {/* Tactical Badges */}
                <div className="flex flex-wrap items-center gap-3">
                  {isLive && (
                    <div className="px-4 py-1.5 bg-netflix-red text-white text-[9px] font-black rounded-full flex items-center gap-2 shadow-lg shadow-red-500/20">
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse shadow-[0_0_10px_white]" />
                      LIVE MATCH
                    </div>
                  )}
                  <TournamentStatusBadge status={tournament.status} />
                  <div className="px-4 py-1.5 bg-zinc-50 border border-zinc-100 text-zinc-400 text-[9px] font-black rounded-full uppercase tracking-widest">
                    {tournament.game} • {tournament.format}
                  </div>
                </div>

                {/* Prime Title */}
                <h2 className="text-4xl sm:text-6xl font-black text-zinc-900 leading-[0.85] uppercase tracking-tight" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                  {tournament.title}
                </h2>

                {/* Briefing */}
                <p className="text-zinc-400 text-xs sm:text-sm font-bold uppercase tracking-widest line-clamp-2 leading-relaxed">
                  {tournament.description}
                </p>

                {/* Payload Stats Row */}
                <div className="flex flex-wrap items-center gap-8 sm:gap-12 pt-4">
                  <div className="space-y-1">
                    <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">TOTAL PRIZE</p>
                    <div className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-amber-500" />
                      <span className="text-2xl font-black text-zinc-900" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                        {formatCurrency(tournament.prizePool * 100)}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">PLAYERS</p>
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-zinc-900" />
                      <span className="text-2xl font-black text-zinc-900" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                        {tournament.currentParticipants}/{tournament.maxParticipants}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">MATCH STARTS</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-zinc-400" />
                      <span className="text-2xl font-black text-zinc-900" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                        {formatDate(tournament.startsAt || (tournament as any).startTime)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Master CTA */}
              {!disableNavigation && (
                <div className="flex flex-col items-start lg:items-center gap-4">
                  <div className="w-16 h-16 sm:w-24 sm:h-24 bg-zinc-900 rounded-[2rem] flex items-center justify-center text-white shadow-2xl group-hover:bg-netflix-red group-hover:scale-110 transition-all duration-500 active:scale-95">
                    <ArrowRight className="w-8 h-8 sm:w-12 sm:h-12" />
                  </div>
                  <div className="text-left lg:text-center">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-1">ENTRY FEE</p>
                    <p className="text-xl font-black text-zinc-900 uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                      {tournament.entryFee === 0 ? 'FREE ENTRY' : formatCurrency(tournament.entryFee * 100)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Wrapper>
    );
  }

  if (variant === 'compact') {
    return (
      <Wrapper>
        <div className="flex items-center gap-5 p-5 rounded-[2rem] bg-white border border-zinc-100 hover:border-netflix-red/30 hover:shadow-xl transition-all duration-500 group cursor-default">
          <div className="w-14 h-14 rounded-2xl bg-zinc-50 flex items-center justify-center flex-shrink-0 border border-zinc-100 group-hover:bg-netflix-red group-hover:border-netflix-red transition-all">
            <Gamepad2 className="h-6 w-6 text-zinc-900 group-hover:text-white transition-colors" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-black text-zinc-900 truncate text-[11px] uppercase tracking-widest">{tournament.title}</h4>
            <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest mt-1">
              <span className="text-amber-500">{formatCurrency(tournament.prizePool * 100)}</span>
              <span className="text-zinc-300">{tournament.currentParticipants}/{tournament.maxParticipants} PLAYERS</span>
            </div>
          </div>
          <TournamentStatusBadge status={tournament.status} />
        </div>
      </Wrapper>
    );
  }

  // Tactical Core Card (Default)
  return (
    <Wrapper>
      <div className={`group relative overflow-hidden rounded-[2.5rem] bg-white border border-zinc-100 transition-all duration-700 hover:border-netflix-red/30 hover:shadow-2xl hover:shadow-zinc-200/50 hover:-translate-y-2 ${disableNavigation ? 'cursor-default' : 'cursor-pointer'}`}>
        {/* Visual Intelligence Split */}
        <div className="relative aspect-[16/10] bg-zinc-100 overflow-hidden">
          {tournament.thumbnailUrl ? (
            <img 
              src={tournament.thumbnailUrl} 
              alt={tournament.title} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:scale-125 transition-transform duration-1000">
              <Gamepad2 className="h-32 w-32 text-zinc-900" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

          {/* HUD Overlays */}
          <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isLive ? (
                <div className="px-3 py-1 bg-netflix-red text-white text-[8px] font-black rounded-full flex items-center gap-1.5 shadow-lg shadow-red-500/20">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  LIVE
                </div>
              ) : isRegistrationOpen ? (
                <div className="px-3 py-1 bg-green-500 text-white text-[8px] font-black rounded-full shadow-lg shadow-green-500/10">OPEN</div>
              ) : null}
            </div>
            <div className="px-3 py-1 bg-white/90 backdrop-blur-md border border-white/20 text-zinc-900 text-[8px] font-black rounded-full shadow-sm uppercase tracking-widest">
              {tournament.game}
            </div>
          </div>

          {/* Quick Deployment Link (Desktop) */}
          {!disableNavigation && (
            <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-white text-zinc-900 flex items-center justify-center shadow-2xl scale-50 group-hover:scale-100 transition-transform duration-500">
                <Zap className="h-6 w-6 fill-zinc-900" />
              </div>
            </div>
          )}
        </div>

        {/* Tactical Content Block */}
        <div className="p-8">
          {/* Metadata Row */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-4 bg-netflix-red rounded-full" />
            <span className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em]">{tournament.format} • {tournament.perspective}</span>
          </div>

          {/* Target Title */}
          <h3 className="text-xl font-black text-zinc-900 mb-6 line-clamp-1 group-hover:text-netflix-red transition-colors uppercase tracking-tight" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            {tournament.title}
          </h3>

          {/* Asset Breakdown */}
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <p className="text-[7px] font-black text-zinc-300 uppercase tracking-widest">TOTAL PRIZE</p>
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-amber-500" />
                <span className="text-lg font-black text-zinc-900" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{formatCurrency(tournament.prizePool * 100)}</span>
              </div>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-[7px] font-black text-zinc-300 uppercase tracking-widest">PLAYERS</p>
              <div className="flex items-center gap-2 justify-end">
                <Users className="h-4 w-4 text-zinc-300" />
                <span className="text-lg font-black text-zinc-900" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{tournament.currentParticipants}/{tournament.maxParticipants}</span>
              </div>
            </div>
          </div>

          {/* Operational Footer */}
          <div className="flex items-center justify-between pt-6 border-t border-zinc-50">
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-zinc-300" />
              <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">{formatDate(tournament.startsAt || (tournament as any).startTime)}</span>
            </div>
            <div className={cn(
              "text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-xl border transition-all",
              tournament.entryFee === 0
                ? "bg-green-50 border-green-100 text-green-600"
                : "bg-zinc-50 border-zinc-100 text-zinc-900 group-hover:bg-zinc-900 group-hover:text-white group-hover:border-zinc-900"
            )}>
              {tournament.entryFee === 0 ? 'FREE TO JOIN' : formatCurrency(tournament.entryFee * 100)}
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
