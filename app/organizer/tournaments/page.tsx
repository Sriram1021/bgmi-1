'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TournamentStatusBadge } from '@/app/components/tournaments/tournament-status-badge';
import { ParticipantsTable } from '@/app/components/tournaments/participants-table';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrganizedTournaments, deleteTournament } from '@/app/lib/redux/slices/tournamentSlice';
import type { AppDispatch, RootState } from '@/app/lib/redux/store';
import { useAuth } from '@/app/providers/auth-provider';
import { formatCurrency, formatDateTime, cn } from '@/app/lib/utils';
import { Button } from '@/app/components/ui/button';
import {
  Trophy,
  PlusCircle,
  Users,
  Calendar,
  Settings,
  ChevronRight,
  Gamepad2,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  Trash,
  Info,
} from 'lucide-react';
import { 
  Modal, 
  ModalHeader, 
  ModalTitle, 
  ModalDescription, 
  ModalContent, 
  ModalFooter 
} from '@/app/components/ui/modal';

type FilterTab = 'all' | 'active' | 'pending' | 'completed';

export default function OrganizerTournamentsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { organizedTournaments, loading, error } = useSelector((state: RootState) => state.tournament);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [tournamentToDelete, setTournamentToDelete] = useState<any>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [participantsTournamentId, setParticipantsTournamentId] = useState<string | null>(null);
  const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false);

  const handleShowParticipants = (id: string) => {
    setParticipantsTournamentId(id);
    setIsParticipantsModalOpen(true);
  };

  const handleDeleteClick = (tournament: any) => {
    setTournamentToDelete(tournament);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (tournamentToDelete) {
      await dispatch(deleteTournament(tournamentToDelete.id));
      setIsDeleteModalOpen(false);
      setTournamentToDelete(null);
    }
  };

  useEffect(() => {
    // Wait for auth to load
    if (isLoading) return;

    if (!isAuthenticated) {
      // Option A: Redirect
      // router.push('/login?redirect=/organizer/tournaments');
      return;
    }

    dispatch(fetchOrganizedTournaments());
  }, [dispatch, isAuthenticated, isLoading, router]);

  const myTournaments = organizedTournaments;

  const filteredTournaments = myTournaments.filter((t: any) => {
    switch (activeTab) {
      case 'active': return ['REGISTRATION_OPEN', 'LIVE', 'IN_PROGRESS', 'APPROVED'].includes(t.status);
      case 'pending': return t.status === 'PENDING_APPROVAL';
      case 'completed': return t.status === 'COMPLETED';
      default: return true;
    }
  });

  const tabs = [
    { key: 'all' as FilterTab, label: 'All Operations', count: myTournaments.length, icon: Trophy },
    { key: 'active' as FilterTab, label: 'Active Missions', count: myTournaments.filter((t) => ['REGISTRATION_OPEN', 'LIVE', 'IN_PROGRESS', 'APPROVED'].includes(t.status)).length, icon: Gamepad2 },
    { key: 'pending' as FilterTab, label: 'Pending Approval', count: myTournaments.filter((t) => t.status === 'PENDING_APPROVAL').length, icon: Clock },
    { key: 'completed' as FilterTab, label: 'Mission History', count: myTournaments.filter((t) => t.status === 'COMPLETED').length, icon: CheckCircle },
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-10 sm:space-y-16 pb-24 pt-8 lg:pt-12">
      {/* Header - Netflix White Style */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 sm:gap-10">
        <div>
          <h1 className="text-[clamp(2.5rem,8vw,4.5rem)] font-black text-zinc-900 tracking-widest leading-[0.85] uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            MY<br />
            <span className="text-netflix-red">TOURNAMENTS</span>
          </h1>
          <p className="text-zinc-400 font-bold uppercase tracking-[0.2em] text-[10px] sm:text-xs mt-4 sm:mt-6 flex items-center gap-3">
            <span className="w-10 sm:w-12 h-[2px] bg-netflix-red" />
            Manage your competitive operations
          </p>
        </div>
        <Link href="/organizer/tournaments/create" className="w-full sm:w-auto">
          <Button variant="primary" className="w-full sm:w-auto px-8 sm:px-12 py-7 sm:py-8 text-xs sm:text-sm font-black uppercase tracking-[0.2em] shadow-lg shadow-red-500/20 rounded-2xl sm:rounded-3xl hover:scale-105 transition-transform">
            <PlusCircle className="h-5 w-5 sm:h-6 sm:w-6" />
            INITIATE NEW MISSION
          </Button>
        </Link>
      </div>

      {/* High-Impact Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        <StatSummaryCard
          label="TOTAL OPERATIONS"
          value={myTournaments.length}
          icon={Trophy}
          color="text-zinc-900"
          bg="bg-zinc-50"
        />
        <StatSummaryCard
          label="ACTIVE MISSIONS"
          value={tabs[1].count}
          icon={Gamepad2}
          color="text-green-600"
          bg="bg-green-50"
        />
        <StatSummaryCard
          label="PENDING APPROVAL"
          value={tabs[2].count}
          icon={Clock}
          color="text-amber-600"
          bg="bg-amber-50"
        />
        <StatSummaryCard
          label="COMPLETED HISTORY"
          value={tabs[3].count}
          icon={CheckCircle}
          color="text-zinc-400"
          bg="bg-zinc-50/50"
        />
      </div>

      {/* Refined Navigation Filters */}
      <div className="sticky top-20 z-30 py-4 bg-[#fcfcfc]/80 backdrop-blur-xl -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-2 p-1.5 bg-white border border-zinc-100 rounded-2xl sm:rounded-3xl shadow-sm overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "sm:flex-1 sm:min-w-[140px] flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-[9px] sm:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap shrink-0",
                  active
                    ? "bg-netflix-red text-white shadow-lg shadow-red-500/20 scale-[1.02]"
                    : "text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50"
                )}
              >
                <Icon className={cn("h-4 w-4", active ? "text-white" : "text-zinc-400")} />
                {tab.label}
                <span className={cn(
                  "px-2.5 py-0.5 rounded-full text-[10px] font-black leading-none",
                  active ? "bg-white/20 text-white" : "bg-zinc-100 text-zinc-500"
                )}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mission Deployment List */}
      <div className="space-y-6 sm:space-y-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="w-12 h-12 border-4 border-netflix-red border-t-transparent rounded-full animate-spin" />
            <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">Scanning Arena...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-100 rounded-4xl p-12 text-center shadow-sm">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-black text-red-900 mb-2 uppercase tracking-widest">Connection Failed</h3>
            <p className="text-red-400 font-bold uppercase tracking-widest text-[10px] mb-6">{error}</p>
            <Button onClick={() => dispatch(fetchOrganizedTournaments())} variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 font-black uppercase tracking-widest text-[10px]">
              Retry Connection
            </Button>
          </div>
        ) : filteredTournaments.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:gap-8">
            {filteredTournaments.map((tournament: any, index: number) => (
              <TournamentMissionCard 
                key={tournament.id || `tourney-${index}`} 
                tournament={tournament} 
                onDelete={() => handleDeleteClick(tournament)}
                onShowParticipants={handleShowParticipants}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-zinc-100 rounded-[3rem] p-16 sm:p-24 text-center shadow-sm">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-zinc-50 flex items-center justify-center mx-auto mb-8 sm:mb-12 border border-zinc-100 shadow-inner">
              <Trophy className="h-10 w-10 sm:h-14 sm:w-14 text-zinc-200" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-zinc-900 mb-4 uppercase tracking-widest" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              NO MISSIONS FOUND
            </h3>
            <p className="text-zinc-400 font-bold uppercase tracking-[0.2em] text-xs max-w-md mx-auto mb-10 sm:mb-16">
              Ready to dominate? Start your first tournament deployment now and command the arena.
            </p>
            <Link href="/organizer/tournaments/create">
              <Button variant="primary" className="px-10 sm:px-16 py-7 sm:py-8 text-xs sm:text-sm font-black uppercase tracking-[0.2em] shadow-lg shadow-red-500/20 rounded-2xl sm:rounded-3xl hover:scale-105 transition-transform">
                <PlusCircle className="h-5 w-5 sm:h-6 sm:w-6" />
                CREATE FIRST TOURNAMENT
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} size="md">
        <ModalHeader onClose={() => setIsDeleteModalOpen(false)}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
              <Trash className="w-5 h-5 text-netflix-red" />
            </div>
            <ModalTitle>CONFIRM DELETION</ModalTitle>
          </div>
        </ModalHeader>
        <ModalContent>
          <div className="space-y-4">
            <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">
              You are about to terminate the following mission:
            </p>
            <div className="bg-zinc-50 border border-zinc-100 p-4 rounded-2xl">
              <h4 className="text-lg font-black text-zinc-900 uppercase tracking-widest" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                {tournamentToDelete?.title}
              </h4>
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-1">
                ID: {tournamentToDelete?.id}
              </p>
            </div>
            <div className="flex gap-3 p-4 bg-amber-50 border border-amber-100 rounded-2xl">
              <Info className="w-5 h-5 text-amber-600 shrink-0" />
              <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider leading-relaxed">
                Warning: This action is irreversible. All data associated with this tournament will be permanently purged from the arena database.
              </p>
            </div>
          </div>
        </ModalContent>
        <ModalFooter>
          <Button 
            variant="outline" 
            onClick={() => setIsDeleteModalOpen(false)}
            className="border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 font-black uppercase tracking-widest text-[10px] px-8 py-4 rounded-xl"
          >
            ABORT MISSION
          </Button>
          <Button 
            onClick={handleConfirmDelete}
            className="bg-netflix-red hover:bg-zinc-900 text-white font-black uppercase tracking-widest text-[10px] px-8 py-4 rounded-xl shadow-lg shadow-red-500/20"
          >
            CONFIRM DELETE
          </Button>
        </ModalFooter>
      </Modal>

      {/* Participants Modal */}
      <Modal isOpen={isParticipantsModalOpen} onClose={() => setIsParticipantsModalOpen(false)} size="xl">
        <ModalHeader onClose={() => setIsParticipantsModalOpen(false)}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-netflix-red" />
            </div>
            <ModalTitle>CONFIRMED PARTICIPANTS</ModalTitle>
          </div>
        </ModalHeader>
        <ModalContent className="max-h-[70vh] overflow-y-auto p-0">
          <div className="p-6">
            {participantsTournamentId && <ParticipantsTable tournamentId={participantsTournamentId} />}
          </div>
        </ModalContent>
        <ModalFooter>
          <Button 
            onClick={() => setIsParticipantsModalOpen(false)}
            className="bg-zinc-900 hover:bg-zinc-800 text-white font-black uppercase tracking-widest text-[10px] px-8 py-4 rounded-xl"
          >
            CLOSE
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

function StatSummaryCard({ label, value, icon: Icon, color, bg }: { label: string; value: number; icon: any; color: string; bg: string }) {
  return (
    <div className="bg-white border border-zinc-100 shadow-sm rounded-4xl p-8 relative overflow-hidden group hover:shadow-xl transition-all hover:-translate-y-1">
      <div className={cn("absolute -top-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-20", bg)} />
      <div className="relative z-10 text-center sm:text-left">
        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-zinc-50 shadow-sm mx-auto sm:mx-0 group-hover:scale-110 transition-transform", bg)}>
          <Icon className={cn("h-7 w-7", color)} />
        </div>
        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-3">{label}</p>
        <p className="text-4xl sm:text-5xl lg:text-6xl font-black text-zinc-900 uppercase tracking-widest leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
          {value}
        </p>
      </div>
    </div>
  );
}

function TournamentMissionCard({ tournament, onDelete, onShowParticipants }: { tournament: any; onDelete: () => void; onShowParticipants: (id: string) => void }) {
  const dispatch = useDispatch<AppDispatch>();
  const fillPercentage = (tournament.currentParticipants / tournament.maxParticipants) * 100;

  return (
    <div className="bg-white border border-zinc-100 rounded-4xl p-6 sm:p-10 shadow-sm hover:shadow-2xl hover:border-netflix-red/20 transition-all group relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50 group-hover:bg-red-50 transition-colors" />

      <div className="flex flex-col lg:flex-row gap-8 relative z-10">
        {/* Tournament Poster Preview */}
        <div className="w-full lg:w-48 aspect-video lg:aspect-square rounded-3xl overflow-hidden border border-zinc-100 bg-zinc-50 shrink-0">
          <img 
            src={tournament.thumbnailUrl || '/games/bgmi_classic.png'} 
            alt={tournament.title} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <TournamentStatusBadge status={tournament.status} />
            <span className="px-3 py-1 bg-zinc-100 text-zinc-500 text-[10px] font-black uppercase tracking-widest rounded-lg">
              {tournament.game}
            </span>
            <span className="px-3 py-1 bg-zinc-100 text-zinc-500 text-[10px] font-black uppercase tracking-widest rounded-lg">
              {tournament.format}
            </span>
            {tournament.status === 'PENDING_APPROVAL' && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-amber-100">
                <AlertCircle className="w-3.5 h-3.5" />
                Awaiting Deployment Approval
              </span>
            )}
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-zinc-900 mb-6 uppercase tracking-widest group-hover:text-netflix-red transition-colors" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            {tournament.title}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10">
            {/* Registrations */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  CAPACITY
                </span>
                <span className="text-sm font-black text-zinc-900 tracking-tighter">
                  {tournament.currentParticipants}/{tournament.maxParticipants}
                </span>
              </div>
              <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden shadow-inner">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-1000",
                    fillPercentage >= 90 ? "bg-netflix-red" : "bg-zinc-900"
                  )}
                  style={{ width: `${fillPercentage}%` }}
                />
              </div>
            </div>

            {/* Launch Date */}
            <div>
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4" />
                LAUNCH DATE
              </span>
              <p className="text-sm font-black text-zinc-900 uppercase tracking-widest">
                {formatDateTime(tournament.startsAt)}
              </p>
            </div>

            {/* Prize Pool */}
            <div>
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                PRIZE REWARD
              </span>
              <p className="text-xl font-black text-netflix-red uppercase tracking-widest" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                {formatCurrency(tournament.prizePool * 100)}
              </p>
            </div>

            {/* Fee */}
            <div>
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                <PlusCircle className="w-4 h-4" />
                ENTRY FEE
              </span>
              <p className="text-sm font-black text-zinc-900 uppercase tracking-widest">
                {tournament.entryFee > 0 ? formatCurrency(tournament.entryFee * 100) : 'FREE ENTRY'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="flex flex-row lg:flex-col gap-3 min-w-[160px]">
          <Link href={`/organizer/tournaments/${tournament.id}`} className="flex-1">
            <Button className="w-full bg-netflix-red hover:bg-zinc-900 text-white font-black uppercase tracking-widest text-[10px] sm:text-xs py-4 sm:py-5 rounded-xl sm:rounded-2xl transition-all shadow-lg shadow-red-500/10">
              <Settings className="w-4 h-4" />
              MANAGE
            </Button>
          </Link>
          <Link href={`/tournaments/${tournament.id}`} className="flex-1">
            <Button variant="outline" className="w-full border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 font-black uppercase tracking-widest text-[10px] sm:text-xs py-4 sm:py-5 rounded-xl sm:rounded-2xl transition-all">
              <Eye className="w-4 h-4" />
              PREVIEW
            </Button>
          </Link>
          <Button 
            onClick={() => onShowParticipants(tournament.id)}
            variant="outline" 
            className="flex-1 w-full border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 font-black uppercase tracking-widest text-[10px] sm:text-xs py-4 sm:py-5 rounded-xl sm:rounded-2xl transition-all"
          >
            <Users className="w-4 h-4" />
            PARTICIPANTS
          </Button>
          <div className="flex-1">
            <Button 
              onClick={onDelete}
              className="w-full bg-netflix-red hover:bg-zinc-900 text-white font-black uppercase tracking-widest text-[10px] sm:text-xs py-4 sm:py-5 rounded-xl sm:rounded-2xl transition-all shadow-lg shadow-red-500/10"
            >
              <Trash className="w-4 h-4" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

