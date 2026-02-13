'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTournaments } from '@/app/lib/redux/slices/tournamentSlice';
import { AppDispatch, RootState } from '@/app/lib/redux/store';
import { GAMES, FORMATS, APP_NAME } from '@/app/lib/constants';
import { cn, formatCurrency } from '@/app/lib/utils';
import type { GameType, TournamentFormat, TournamentStatus, Tournament } from '@/app/types';
import {
    Search,
    Trophy,
    Users,
    Gamepad2,
    X,
    ChevronDown,
    Zap,
    ZapOff,
    SlidersHorizontal,
    ArrowRight,
    Filter,
    LayoutGrid,
    List,
    Smartphone,
    Trophy as TrophyIcon,
    Target,
    Flame,
    ChevronRight,
    Clock,
    Shield
} from 'lucide-react';

const STATUS_OPTIONS = [
    { value: 'ALL', label: 'All Matches' },
    { value: 'LIVE', label: 'Live Now', icon: Zap },
    { value: 'REGISTRATION_OPEN', label: 'Open for Entry' },
    { value: 'COMPLETED', label: 'Finished' },
];

const SORT_OPTIONS = [
    { value: 'date', label: 'Newest First' },
    { value: 'prizePool', label: 'Highest Prize' },
    { value: 'entryFee', label: 'Lowest Entry' },
    { value: 'participants', label: 'Most Players' },
];

// Reusable Tournament Card (Netflix White Style)
function TournamentGridCard({ tournament }: { tournament: Tournament }) {
    const isLive = tournament.status === 'LIVE' || tournament.status === 'IN_PROGRESS';
    const isFree = tournament.entryFee === 0;
    const fillPercentage = (tournament.currentParticipants / tournament.maxParticipants) * 100;

    return (
        <Link href={`/tournaments/${tournament.id}`} className="group relative bg-white border border-zinc-100 rounded-2xl overflow-hidden hover:border-netflix-red/30 transition-all duration-500 shadow-sm hover:shadow-xl block">
            {/* Image/Featured Area */}
            <div className="aspect-[4/3] sm:aspect-[16/9] relative overflow-hidden bg-zinc-50">
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 via-transparent to-transparent z-10" />
                {tournament.thumbnailUrl ? (
                    <img
                        src={tournament.thumbnailUrl}
                        alt={tournament.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center opacity-5 transition-transform duration-700 group-hover:scale-125">
                        <TrophyIcon className="w-16 h-16 sm:w-32 sm:h-32 text-zinc-900" />
                    </div>
                )}

                {/* Badges */}
                <div className="absolute top-3 sm:top-5 inset-x-3 sm:inset-x-5 flex justify-between items-start z-20">
                    <div className={cn(
                        "px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[7px] sm:text-[10px] font-black text-white uppercase tracking-widest border border-white/10 flex items-center gap-1.5 sm:gap-2 shadow-lg",
                        isLive ? "bg-netflix-red" : "bg-black/60 backdrop-blur-md"
                    )}>
                        {isLive && <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse" />}
                        {tournament.status === 'REGISTRATION_OPEN' ? 'OPEN' : tournament.status.replace('_', ' ')}
                    </div>

                    <div className="px-2 sm:px-3 py-1 sm:py-1.5 bg-green-500 text-white rounded-lg text-[7px] sm:text-[10px] font-black uppercase tracking-widest shadow-lg">
                        {isFree ? 'FREE' : formatCurrency(tournament.entryFee * 100)}
                    </div>
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-3 left-3 sm:bottom-5 sm:left-5 z-20">
                    <div className="px-2 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-md text-[7px] sm:text-[8px] font-bold text-white uppercase tracking-widest">
                        {(tournament.game || 'BGMI').split('_')[0]} • {tournament.format || 'SQUAD'}
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-4 sm:p-8 space-y-6 sm:space-y-8">
                <div>
                    <h4 className="text-xl sm:text-3xl font-black text-zinc-900 group-hover:text-netflix-red transition-colors uppercase tracking-widest line-clamp-1" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                        {tournament.title}
                    </h4>
                    <div className="flex items-center gap-3 sm:gap-5 mt-2">
                        <span className="flex items-center gap-1 sm:gap-1.5 text-[9px] sm:text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
                            <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-300" /> ERANGEL
                        </span>
                        <span className="flex items-center gap-1 sm:gap-1.5 text-[9px] sm:text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
                            <Smartphone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-300" /> MOBILE
                        </span>
                    </div>
                </div>

                {/* Capacity Progress */}
                <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center justify-between text-[9px] sm:text-[11px] font-black uppercase tracking-widest text-zinc-400">
                        <span>CAPACITY</span>
                        <span className="text-zinc-900 tabular-nums">{tournament.currentParticipants}/{tournament.maxParticipants}</span>
                    </div>
                    <div className="h-1.5 sm:h-2 bg-zinc-50 rounded-full overflow-hidden border border-zinc-100 p-0.5">
                        <div
                            className={cn(
                                "h-full rounded-full transition-all duration-1000",
                                fillPercentage >= 90 ? "bg-netflix-red" : "bg-zinc-800"
                            )}
                            style={{ width: `${fillPercentage}%` }}
                        />
                    </div>
                </div>

                {/* Footer: Prize & Action */}
                <div className="grid grid-cols-2 gap-3 sm:gap-6 items-end pt-4 border-t border-zinc-50">
                    <div>
                        <p className="text-[7px] sm:text-[10px] text-zinc-400 uppercase font-bold tracking-widest mb-0.5 sm:mb-1">PRIZE POOL</p>
                        <p className="text-xl sm:text-3xl font-black text-zinc-900 tracking-wide" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{formatCurrency(tournament.prizePool * 100)}</p>
                    </div>
                    <div className="w-full py-3 sm:py-5 bg-netflix-red hover:bg-[#b00710] text-white text-[9px] sm:text-[11px] font-black rounded-xl transition-all uppercase tracking-widest flex items-center justify-center">
                        JOIN
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default function TournamentsPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { tournaments, loading: tournamentsLoading } = useSelector((state: RootState) => state.tournament);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGame, setSelectedGame] = useState<GameType | 'ALL'>('ALL');
    const [selectedFormat, setSelectedFormat] = useState<TournamentFormat | 'ALL'>('ALL');
    const [selectedStatus, setSelectedStatus] = useState<TournamentStatus | 'ALL'>('ALL');
    const [sortBy, setSortBy] = useState<'date' | 'prizePool' | 'entryFee' | 'participants'>('date');

    useEffect(() => {
        dispatch(fetchTournaments());
    }, [dispatch]);

    const filteredTournaments = tournaments
        .filter((tournament) => {
            const matchesSearch = (tournament.title || '').toLowerCase().includes(searchQuery.toLowerCase());
            const matchesGame = selectedGame === 'ALL' || tournament.game === selectedGame;
            const matchesFormat = selectedFormat === 'ALL' || tournament.format === selectedFormat;
            const matchesStatus = selectedStatus === 'ALL' || tournament.status === selectedStatus;
            
            // Allow more statuses for public view
            const isPublicVisible = ['REGISTRATION_OPEN', 'APPROVED', 'LIVE', 'IN_PROGRESS', 'COMPLETED'].includes(tournament.status || '');

            return matchesSearch && matchesGame && matchesFormat && matchesStatus && isPublicVisible;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'prizePool':
                    return (b.prizePool || 0) - (a.prizePool || 0);
                case 'entryFee':
                    return (a.entryFee || 0) - (b.entryFee || 0);
                case 'participants':
                    return (b.currentParticipants || 0) - (a.currentParticipants || 0);
                case 'date':
                default:
                    return new Date(b.startsAt || 0).getTime() - new Date(a.startsAt || 0).getTime();
            }
        });

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedGame('ALL');
        setSelectedFormat('ALL');
        setSelectedStatus('ALL');
    };

    const openCount = tournaments.filter(t => t.status === 'REGISTRATION_OPEN' || t.status === 'APPROVED').length;
    const liveCount = tournaments.filter(t => t.status === 'LIVE' || t.status === 'IN_PROGRESS').length;
    const totalPrize = tournaments.reduce((acc, t) => acc + (t.prizePool || 0), 0);

    return (
        <div className="min-h-screen bg-[#fcfcfc] text-zinc-900 pb-40">
            {/* 1. Feature Banner Section */}
            <div className="relative pt-6 sm:pt-10 pb-12 sm:pb-20">
                <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
                    <h2 className="text-zinc-500 text-[10px] sm:text-sm font-bold uppercase tracking-[0.2em] mb-6 sm:mb-8 flex items-center gap-2 sm:gap-3">
                        <span className="w-6 sm:w-8 h-[2px] bg-netflix-red" />
                        TOURNAMENT CENTER
                    </h2>

                    <div className="relative bg-white rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-zinc-100 h-full min-h-[450px] lg:min-h-[550px] flex items-end group">
                        {/* Background Image */}
                        <div className="absolute inset-0 bg-[url('/tournament-hero.png')] bg-cover bg-center" />

                        {/* Overlays */}
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent z-10" />
                        <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/60 via-transparent to-transparent z-10" />

                        {/* Content Overlay */}
                        <div className="relative z-20 w-full p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
                            <div className="max-w-2xl">
                                <div className="px-4 py-1.5 bg-netflix-red rounded-full text-[10px] font-bold text-white uppercase tracking-widest mb-6 inline-block shadow-lg shadow-red-500/20">LIVE ARENA ENABLED</div>
                                <h1 className="text-5xl sm:text-7xl lg:text-[7rem] font-black text-white leading-[0.85] tracking-[0.02em] uppercase mb-8" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                                    BATTLEGROUND <br /> <span className="text-netflix-red">ARENA 2026</span>
                                </h1>

                                <div className="flex flex-wrap gap-8">
                                    <StatBlock label="PRIZES HUB" value={`₹${(totalPrize / 100000).toFixed(1)}L+`} icon={<Trophy className="w-5 h-5 text-netflix-red" />} light />
                                    <StatBlock label="SPOTS" value={openCount} icon={<Users className="w-5 h-5 text-white/70" />} light />
                                    <StatBlock label="LIVE" value={liveCount} icon={<Zap className="w-5 h-5 text-amber-500" />} light />
                                </div>
                            </div>

                            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl lg:w-80 space-y-6">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-white/50 uppercase tracking-[0.1em]">COMPETITIVE INFRASTRUCTURE</span>
                                    <h3 className="text-xl font-bold text-white leading-tight tracking-wide">Elite Player Pools</h3>
                                </div>
                                <p className="text-[10px] text-white/40 leading-relaxed font-medium uppercase tracking-widest">
                                    Verified competitive environment for high-skill players.
                                </p>
                                <div className="pt-4 border-t border-white/10">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[10px] font-bold text-white uppercase tracking-widest">SYSTEM STATUS</span>
                                        <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">SECURE</span>
                                    </div>
                                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full w-full bg-green-500/50" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Filters Section */}
            <div className="relative py-4 mb-8 sm:mb-20">
                <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
                    <div className="bg-white border border-zinc-100 rounded-2xl sm:rounded-3xl p-3 sm:p-6 shadow-[0_15px_40px_rgba(0,0,0,0.03)] flex flex-col xl:flex-row gap-4 sm:gap-6 items-center">
                        <div className="relative flex-1 w-full group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-netflix-red transition-colors" />
                            <input
                                type="text"
                                placeholder="SEARCH..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-zinc-50 border border-zinc-100 rounded-xl sm:rounded-2xl py-4 sm:py-5 pl-14 sm:pl-16 pr-6 text-[9px] sm:text-[10px] font-black tracking-widest text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-netflix-red/20 focus:bg-white transition-all uppercase"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
                            <div className="w-full sm:w-auto flex bg-zinc-50 p-1 rounded-xl border border-zinc-100 overflow-x-auto scrollbar-hide">
                                {STATUS_OPTIONS.map((status) => (
                                    <button
                                        key={status.value}
                                        onClick={() => setSelectedStatus(status.value as TournamentStatus | 'ALL')}
                                        className={cn(
                                            "whitespace-nowrap px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[8px] sm:text-[10px] font-black uppercase tracking-widest transition-all",
                                            selectedStatus === status.value
                                                ? "bg-white text-zinc-900 shadow-lg border border-zinc-100"
                                                : "text-zinc-400 hover:text-zinc-600"
                                        )}
                                    >
                                        {status.label.split(' ')[0]}
                                    </button>
                                ))}
                            </div>

                            <div className="flex gap-3 sm:gap-4 items-center w-full sm:w-auto">
                                <CustomSelect
                                    value={selectedGame}
                                    onChange={(e) => setSelectedGame(e.target.value as any)}
                                    options={[{ value: 'ALL', label: 'GAMES' }, ...GAMES.map(g => ({ value: g.value, label: g.label.toUpperCase().split(' ')[0] }))]}
                                />
                                {(searchQuery || selectedGame !== 'ALL' || selectedStatus !== 'ALL') && (
                                    <button
                                        onClick={clearFilters}
                                        className="shrink-0 p-4 sm:p-5 bg-zinc-900 text-white rounded-xl sm:rounded-2xl hover:bg-black transition-all active:scale-95"
                                    >
                                        <X className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Tournament Grid */}
            <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 sm:mb-12 border-b border-zinc-100 pb-8">
                    <div className="flex items-center gap-4 sm:gap-5">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-netflix-red/5 flex items-center justify-center border border-netflix-red/10">
                            <LayoutGrid className="w-5 h-5 sm:w-6 sm:h-6 text-netflix-red" />
                        </div>
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 uppercase tracking-wide" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                                {selectedStatus === 'ALL' ? 'AVAILABLE MATCHES' : STATUS_OPTIONS.find(s => s.value === selectedStatus)?.label}
                            </h2>
                            <p className="text-[8px] sm:text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">EXPLORE LIVE LOBBIES</p>
                        </div>
                    </div>
                    <div className="inline-flex self-start sm:self-center px-4 py-1.5 bg-zinc-50 border border-zinc-100 rounded-full text-[8px] sm:text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                        {filteredTournaments.length} MATCHES FOUND
                    </div>
                </div>

                {filteredTournaments.length > 0 ? (
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-10">
                        {filteredTournaments.map((tournament) => (
                            <TournamentGridCard key={tournament.id} tournament={tournament} />
                        ))}
                    </div>
                ) : (
                    <div className="py-40 text-center max-w-md mx-auto">
                        <div className="w-20 h-20 bg-zinc-50 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-zinc-100">
                            <ZapOff className="w-10 h-10 text-zinc-300" />
                        </div>
                        <h3 className="text-4xl font-black text-zinc-900 uppercase tracking-wide mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>NO LOBBIES FOUND</h3>
                        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-10 leading-relaxed">
                            Reset your filters or search criteria to view available tournaments.
                        </p>
                        <button
                            onClick={clearFilters}
                            className="px-12 py-5 bg-zinc-900 text-white text-[11px] font-black rounded-xl uppercase tracking-widest shadow-xl active:scale-95"
                        >
                            RESET FILTERS
                        </button>
                    </div>
                )}
            </div>

            {/* 4. Support Footer */}
            <div className="max-w-[1240px] mx-auto px-6 mt-40">
                <div className="relative group bg-zinc-900 rounded-[2.5rem] p-16 md:p-24 overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-netflix-red opacity-10 rounded-full blur-[100px] -mr-32 -mt-32" />
                    <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                        <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center shadow-2xl border border-white/10 group-hover:scale-110 transition-transform">
                            <Shield className="w-12 h-12 text-white" />
                        </div>
                        <div className="flex-1 text-center lg:text-left">
                            <h3 className="text-4xl md:text-6xl font-black text-white uppercase tracking-wide mb-6 leading-tight" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                                NEW TO {APP_NAME}?
                            </h3>
                            <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs max-w-2xl leading-relaxed">
                                Join the elite arena. Learn how to verify your account, enter tournaments, and withdraw your winnings safely through our certified system.
                            </p>
                        </div>
                        <Link href="/skill-declaration" className="shrink-0 w-full lg:w-auto">
                            <button className="w-full lg:w-auto px-16 py-6 bg-white text-zinc-900 font-black rounded-2xl hover:bg-zinc-200 transition-all uppercase tracking-widest text-[11px] shadow-2xl active:scale-95">
                                VIEW GUIDE
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatBlock({ label, value, icon, light }: { label: string, value: string | number, icon: React.ReactNode, light?: boolean }) {
    return (
        <div className="flex items-center gap-4 sm:gap-6 group">
            <div className={cn(
                "w-10 h-10 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center border transition-colors shadow-sm",
                light ? "bg-white/10 border-white/10 shadow-none" : "bg-white border-zinc-100 group-hover:bg-netflix-red/5"
            )}>
                {icon}
            </div>
            <div>
                <p className={cn(
                    "text-[8px] sm:text-[10px] font-black uppercase tracking-widest mb-0.5 sm:mb-1",
                    light ? "text-white/40" : "text-zinc-400"
                )}>{label}</p>
                <p
                    className={cn(
                        "text-xl sm:text-3xl font-black tracking-wide leading-none",
                        light ? "text-white" : "text-zinc-900"
                    )}
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >{value}</p>
            </div>
        </div>
    );
}

function CustomSelect({ value, onChange, options }: { value: string, onChange: (e: any) => void, options: { value: string, label: string }[] }) {
    return (
        <div className="relative group w-full sm:min-w-[140px]">
            <select
                value={value}
                onChange={onChange}
                className="w-full appearance-none bg-zinc-50 border border-zinc-100 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-4 sm:py-5 pr-10 sm:pr-14 text-[8px] sm:text-[10px] font-black text-zinc-600 uppercase tracking-widest focus:outline-none focus:border-netflix-red/20 cursor-pointer transition-all hover:bg-white"
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-white text-zinc-900">{opt.label}</option>
                ))}
            </select>
            <ChevronDown className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-zinc-400 pointer-events-none transition-colors" />
        </div>
    );
}
