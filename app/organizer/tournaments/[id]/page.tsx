'use client';

import { useState, use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTournamentById, updateTournament } from '@/app/lib/redux/slices/tournamentSlice';
import { AppDispatch, RootState } from '@/app/lib/redux/store';
import { useToast } from '@/app/components/ui/toast';
import { GAMES, FORMATS, PERSPECTIVES, GAME_MODE_CATEGORIES, GAME_MODES } from '@/app/lib/constants';
import type { GameModeCategory, MapType } from '@/app/types';
import { formatCurrency, cn } from '@/app/lib/utils';
import { Button } from '@/app/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Trophy,
  Calendar,
  Users,
  FileText,
  Gamepad2,
  Map,
  Eye,
  DollarSign,
  Award,
  AlertCircle,
  Lightbulb,
  CheckCircle,
  Trash2,
  Calculator,
  TrendingUp,
  ArrowRight,
  Target,
  Plus,
} from 'lucide-react';

const PLATFORM_FEE_PERCENT = 10;

/**
 * Reusable helper to convert strings like "ERANGEL" to "Erangel" 
 * to match backend validation requirements.
 */
const toTitleCase = (str: string) => {
  if (!str) return '';
  // Handle Special cases if any, otherwise standard Title Case
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const STEPS = [
  { id: 1, title: 'Tournament Info', icon: Trophy },
  { id: 2, title: 'Tournament Schedule', icon: Calendar },
  { id: 3, title: 'Prizes & Fees', icon: DollarSign },
  { id: 4, title: 'Tournament Rules', icon: FileText },
  { id: 5, title: 'Final Review', icon: Check },
];

interface ManageTournamentPageProps {
  params: Promise<{ id: string }>;
}

export default function ManageTournamentPage({ params }: ManageTournamentPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { addToast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get tournament from Redux
  const { currentTournament: existingTournament, loading: fetchLoading, error: fetchError } = useSelector((state: RootState) => state.tournament);

  const [formData, setFormData] = useState({
    title: '',
    game: 'BGMI',
    format: 'SQUAD',
    modeCategory: 'CLASSIC' as GameModeCategory,
    map: 'ERANGEL' as MapType,
    description: '',
    perspective: 'TPP',
    registrationStartsAt: '',
    registrationEndsAt: '',
    startsAt: '',
    maxParticipants: 100,
    minParticipants: 20,
    entryFee: 50,
    prizePool: 5000,
    prizePerKill: 10,
    firstPrice: 2500,
    secondPrice: 1500,
    thirdPrice: 1000,
    prizeDistribution: [
      { position: 1, percentage: 50, label: '1st Place', color: 'text-amber-500' },
      { position: 2, percentage: 30, label: '2nd Place', color: 'text-zinc-400' },
      { position: 3, percentage: 20, label: '3rd Place', color: 'text-amber-700' },
    ],
    thumbnailUrl: '/games/bgmi_classic.png',
    rules: '',
    roomId: '',
    roomPassword: '',
  });

  // Fetch on mount
  useEffect(() => {
    if (id) {
      dispatch(fetchTournamentById(id));
    }
  }, [id, dispatch]);

  // Update form when data is fetched
  useEffect(() => {
    if (existingTournament) {
      setFormData({
        title: existingTournament.title || '',
        game: existingTournament.game || 'BGMI',
        format: existingTournament.format || 'SQUAD',
        modeCategory: (existingTournament.modeCategory || existingTournament.mode || 'CLASSIC') as GameModeCategory,
        map: ((existingTournament.map || 'ERANGEL') as string).toUpperCase() as MapType,
        description: existingTournament.description || '',
        perspective: existingTournament.perspective || 'TPP',
        registrationStartsAt: (existingTournament.registrationStartsAt || '').slice(0, 16),
        registrationEndsAt: (existingTournament.registrationEndsAt || '').slice(0, 16),
        startsAt: (existingTournament.startsAt || existingTournament.startTime || '').slice(0, 16),
        maxParticipants: existingTournament.maxParticipants || 100,
        minParticipants: existingTournament.minParticipants || 20,
        entryFee: (existingTournament.entryFee || 0),
        prizePool: (existingTournament.prizePool || 0),
        prizePerKill: (existingTournament.prizePerKill || 0),
        firstPrice: (existingTournament.firstPrice || 0),
        secondPrice: (existingTournament.secondPrice || 0),
        thirdPrice: (existingTournament.thirdPrice || 0),
        prizeDistribution: existingTournament.prizeDistribution?.map((p: any, i: number) => ({
          position: p.position,
          percentage: Math.round((p.amount / (existingTournament.prizePool || 1)) * 100),
          label: p.label,
          color: i === 0 ? 'text-amber-500' : i === 1 ? 'text-zinc-400' : 'text-amber-700'
        })) || [
          { position: 1, percentage: 50, label: '1st Place', color: 'text-amber-500' },
          { position: 2, percentage: 30, label: '2nd Place', color: 'text-zinc-400' },
          { position: 3, percentage: 20, label: '3rd Place', color: 'text-amber-700' },
        ],
        thumbnailUrl: existingTournament.thumbnailUrl || '/games/bgmi_classic.png',
        rules: existingTournament.rules || '',
        roomId: existingTournament.roomId || '',
        roomPassword: existingTournament.roomPassword || '',
      });
    }
  }, [existingTournament]);

  const availableMaps = GAME_MODES[formData.modeCategory] || [];

  const updateForm = (field: string, value: unknown) => setFormData((prev) => ({ ...prev, [field]: value }));
  const handleNext = () => currentStep < STEPS.length && setCurrentStep(currentStep + 1);
  const handlePrev = () => currentStep > 1 && setCurrentStep(currentStep - 1);

  const calculateProfit = () => {
    const totalEntry = formData.entryFee * formData.maxParticipants;
    const platformFee = (totalEntry * PLATFORM_FEE_PERCENT) / 100;
    return totalEntry - formData.prizePool - platformFee;
  };

  const handleSubmit = async (isDraft: boolean = false) => {
    if (!id) return;
    
    setIsSubmitting(true);
    try {
      // Map formData to backend-expected structure
      // Calculate players per team based on format
      const playersPerTeam =
        formData.format === 'SQUAD' ? 4 :
        formData.format === 'DUO' ? 2 : 1;

      // Map formData to backend-expected structure
      const payload = {
        title: formData.title,
        description: formData.description,
        game: formData.game,
        format: formData.format,
        teamType: toTitleCase(formData.format),
        mode: formData.modeCategory, // Match create flow: mode = CLASSIC/ARENA
        matchMode: toTitleCase(formData.modeCategory), // Match user's mapping: matchMode = Classic
        perspective: formData.perspective,
        map: toTitleCase(formData.map),
        maxTeams: Math.floor(formData.maxParticipants / playersPerTeam),
        maxPlayersPerTeam: playersPerTeam,
        entryFee: formData.entryFee * 100,
        prizePool: formData.prizePool * 100,
        prizePerKill: (formData.prizePerKill || 0) * 100,
        firstPrice: (formData.firstPrice || 0) * 100,
        secondPrice: (formData.secondPrice || 0) * 100,
        thirdPrice: (formData.thirdPrice || 0) * 100,
        startTime: new Date(formData.startsAt).toISOString(),
        registrationDeadline: new Date(formData.registrationEndsAt).toISOString(),
        rules: formData.rules,
        thumbnailUrl: formData.thumbnailUrl,
        roomId: formData.roomId,
        roomPassword: formData.roomPassword,
      };

      console.log('📡 Dispatching Update with Payload:', payload);
      
      const resultAction = await dispatch(updateTournament({ id, data: payload }));
      
      if (updateTournament.fulfilled.match(resultAction)) {
        if (isDraft) {
          addToast({ type: 'success', title: 'Tournament Draft Saved', message: 'Your changes have been saved.' });
        } else {
          addToast({ type: 'success', title: 'Tournament Updated!', message: 'The mission updates have been recorded.' });
        }
        router.push('/organizer/tournaments');
      } else {
        const errorMsg = resultAction.payload as string || 'Failed to update tournament';
        addToast({ type: 'error', title: 'Update Failed', message: errorMsg });
      }
    } catch (err: any) {
      console.error('🔥 HandleSubmit Error:', err);
      addToast({ type: 'error', title: 'Error', message: err.message || 'An unexpected error occurred.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (fetchLoading || (!existingTournament && !fetchError)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-10 bg-white">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 border-4 border-netflix-red border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">Retrieving Mission Parameters...</p>
        </div>
      </div>
    );
  }

  if (!existingTournament && !fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-10">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-zinc-50 border border-zinc-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
            <AlertCircle className="w-10 h-10 text-zinc-300" />
          </div>
          <h2 className="text-3xl font-black text-zinc-900 uppercase tracking-widest" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Mission Not Found</h2>
          <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">The tournament data could not be retrieved from HQ.</p>
          <Link href="/organizer/tournaments">
            <Button variant="primary" className="px-10 py-6 rounded-2xl text-xs font-black uppercase tracking-widest mt-8 shadow-lg shadow-red-500/20">RETURN TO BASE</Button>
          </Link>
        </div>
      </div>
    );
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8 sm:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <InputGroup label="Tournament Title" icon={Trophy}>
              <input
                type="text"
                placeholder="e.g., Weekend Warriors Championship"
                value={formData.title}
                onChange={(e) => updateForm('title', e.target.value)}
                className="w-full px-6 py-5 bg-zinc-50 border border-zinc-100 rounded-2xl text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-netflix-red focus:bg-white transition-all text-sm font-bold"
                required
              />
            </InputGroup>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <InputGroup label="BGMI Room ID" icon={Target}>
                <input
                  type="text"
                  placeholder="e.g., ROOM-12345"
                  value={formData.roomId}
                  onChange={(e) => updateForm('roomId', e.target.value)}
                  className="w-full px-6 py-5 bg-zinc-50 border border-zinc-100 rounded-2xl text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-netflix-red focus:bg-white transition-all text-sm font-bold"
                />
              </InputGroup>
              <InputGroup label="Room Password" icon={Target}>
                <input
                  type="text"
                  placeholder="e.g., PASS123"
                  value={formData.roomPassword}
                  onChange={(e) => updateForm('roomPassword', e.target.value)}
                  className="w-full px-6 py-5 bg-zinc-50 border border-zinc-100 rounded-2xl text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-netflix-red focus:bg-white transition-all text-sm font-bold"
                />
              </InputGroup>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <InputGroup label="Game Platform" icon={Gamepad2}>
                <select
                  value={formData.game}
                  onChange={(e) => updateForm('game', e.target.value)}
                  className="w-full px-6 py-5 bg-zinc-50 border border-zinc-100 rounded-2xl text-zinc-900 focus:outline-none focus:border-netflix-red focus:bg-white transition-all text-sm font-bold appearance-none cursor-pointer"
                >
                  {GAMES.map((g) => (
                    <option key={g.value} value={g.value}>
                      {g.label}
                    </option>
                  ))}
                </select>
              </InputGroup>
              <InputGroup label="Unit Format" icon={Users}>
                <select
                  value={formData.format}
                  onChange={(e) => updateForm('format', e.target.value)}
                  className="w-full px-6 py-5 bg-zinc-50 border border-zinc-100 rounded-2xl text-zinc-900 focus:outline-none focus:border-netflix-red focus:bg-white transition-all text-sm font-bold appearance-none cursor-pointer"
                >
                  {FORMATS.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </InputGroup>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <InputGroup label="Match Mode" icon={Target}>
                <select
                  value={formData.modeCategory}
                  onChange={(e) => {
                    const newCategory = e.target.value as GameModeCategory;
                    const firstMap = GAME_MODES[newCategory][0]?.value;
                    setFormData((prev) => ({ ...prev, modeCategory: newCategory, map: firstMap as MapType }));
                  }}
                  className="w-full px-6 py-5 bg-zinc-50 border border-zinc-100 rounded-2xl text-zinc-900 focus:outline-none focus:border-netflix-red focus:bg-white transition-all text-sm font-bold appearance-none cursor-pointer"
                >
                  {GAME_MODE_CATEGORIES.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </InputGroup>

              <InputGroup label="Map Name" icon={Map}>
                <select
                  value={formData.map}
                  onChange={(e) => updateForm('map', e.target.value)}
                  className="w-full px-6 py-5 bg-zinc-50 border border-zinc-100 rounded-2xl text-zinc-900 focus:outline-none focus:border-netflix-red focus:bg-white transition-all text-sm font-bold appearance-none cursor-pointer"
                >
                  {availableMaps.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </InputGroup>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
              <InputGroup label="Tournament Details" icon={FileText}>
                <textarea
                  className="w-full px-6 py-5 bg-zinc-50 border border-zinc-100 rounded-3xl text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-netflix-red focus:bg-white transition-all text-sm font-bold min-h-[160px] resize-none"
                  placeholder="Describe your tournament..."
                  value={formData.description}
                  onChange={(e) => updateForm('description', e.target.value)}
                />
              </InputGroup>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] flex items-center gap-2 px-2">
                  <Gamepad2 className="w-4 h-4" />
                  Select Tournament Poster
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: 'bgmi_classic', url: '/games/bgmi_classic.png', label: 'BGMI CLASSIC' },
                    { id: 'bgmi_solo', url: '/games/bgmi_solo.png', label: 'BGMI SOLO' },
                    { id: 'bgmi_arena', url: '/games/bgmi_arena.png', label: 'BGMI ARENA' },
                    { id: 'pubg_classic', url: '/games/pubg_classic.png', label: 'PUBG CLASSIC' },
                  ].map((poster) => (
                    <button
                      key={poster.id}
                      type="button"
                      onClick={() => updateForm('thumbnailUrl', poster.url)}
                      className={cn(
                        "relative aspect-video rounded-xl overflow-hidden border-2 transition-all group",
                        formData.thumbnailUrl === poster.url ? "border-netflix-red ring-4 ring-netflix-red/10" : "border-zinc-100 opacity-60 hover:opacity-100"
                      )}
                    >
                      <img src={poster.url} alt={poster.label} className="w-full h-full object-cover" />
                      {formData.thumbnailUrl === poster.url && (
                        <div className="absolute top-2 right-2 bg-netflix-red text-white p-1 rounded-full">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <InputGroup label="Registration Starts" icon={Calendar}>
                <input
                  type="datetime-local"
                  value={formData.registrationStartsAt}
                  onChange={(e) => updateForm('registrationStartsAt', e.target.value)}
                  className="w-full px-6 py-5 bg-zinc-50 border border-zinc-100 rounded-2xl text-zinc-900 font-bold"
                  required
                />
              </InputGroup>
              <InputGroup label="Registration Ends" icon={Calendar}>
                <input
                  type="datetime-local"
                  value={formData.registrationEndsAt}
                  onChange={(e) => updateForm('registrationEndsAt', e.target.value)}
                  className="w-full px-6 py-5 bg-zinc-50 border border-zinc-100 rounded-2xl text-zinc-900 font-bold"
                  required
                />
              </InputGroup>
              <InputGroup label="Match Start" icon={Calendar}>
                <input
                  type="datetime-local"
                  value={formData.startsAt}
                  onChange={(e) => updateForm('startsAt', e.target.value)}
                  className="w-full px-6 py-5 bg-zinc-50 border border-zinc-100 rounded-2xl text-zinc-900 font-bold"
                  required
                />
              </InputGroup>
            </div>
          </div>
        );
      case 3: {
        const totalCollections = formData.entryFee * formData.maxParticipants;
        const platformFee = Math.round(totalCollections * (PLATFORM_FEE_PERCENT / 100));
        const organizerProfit = totalCollections - formData.prizePool - platformFee;
        const totalPrizePercentage = formData.prizeDistribution.reduce((sum, p) => sum + p.percentage, 0);
        const isPercentageValid = totalPrizePercentage === 100;

        const updatePrizePercentage = (index: number, newPercentage: number) => {
          const newDistribution = [...formData.prizeDistribution];
          newDistribution[index] = { ...newDistribution[index], percentage: Math.max(0, Math.min(100, newPercentage)) };
          updateForm('prizeDistribution', newDistribution);
        };

        return (
          <div className="space-y-10 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              <InputGroup label="Max Players" icon={Users}>
                <input
                  type="number"
                  value={formData.maxParticipants}
                  onChange={(e) => updateForm('maxParticipants', parseInt(e.target.value) || 0)}
                  className="w-full px-6 py-5 bg-zinc-50 border border-zinc-100 rounded-2xl text-zinc-900 font-bold"
                  required
                />
              </InputGroup>
              <InputGroup label="Min Players" icon={Users}>
                <input
                  type="number"
                  value={formData.minParticipants}
                  onChange={(e) => updateForm('minParticipants', parseInt(e.target.value) || 0)}
                  className="w-full px-6 py-5 bg-zinc-50 border border-zinc-100 rounded-2xl text-zinc-900 font-bold"
                  required
                />
              </InputGroup>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              <InputGroup label="Entry Fee (₹)" icon={DollarSign}>
                <input
                  type="number"
                  value={formData.entryFee}
                  onChange={(e) => updateForm('entryFee', parseInt(e.target.value) || 0)}
                  className="w-full px-6 py-5 bg-zinc-50 border border-zinc-100 rounded-2xl text-zinc-900 font-bold shadow-sm"
                  required
                />
              </InputGroup>
              <InputGroup label="Prize Pool (₹)" icon={Trophy}>
                <input
                  type="number"
                  value={formData.prizePool}
                  onChange={(e) => updateForm('prizePool', parseInt(e.target.value) || 0)}
                  className="w-full px-6 py-5 bg-zinc-50 border border-zinc-100 rounded-2xl text-zinc-900 font-bold shadow-sm"
                  required
                />
              </InputGroup>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
              <InputGroup label="1st Place Prize (₹)" icon={Award}>
                <input
                  type="number"
                  value={formData.firstPrice}
                  onChange={(e) => updateForm('firstPrice', parseInt(e.target.value) || 0)}
                  min={0}
                  className="w-full px-6 py-5 bg-zinc-50 border border-zinc-100 rounded-2xl text-zinc-900 font-bold focus:outline-none focus:border-netflix-red focus:bg-white transition-all shadow-sm"
                  required
                />
              </InputGroup>
              <InputGroup label="2nd Place Prize (₹)" icon={Award}>
                <input
                  type="number"
                  value={formData.secondPrice}
                  onChange={(e) => updateForm('secondPrice', parseInt(e.target.value) || 0)}
                  min={0}
                  className="w-full px-6 py-5 bg-zinc-50 border border-zinc-100 rounded-2xl text-zinc-900 font-bold focus:outline-none focus:border-netflix-red focus:bg-white transition-all shadow-sm"
                  required
                />
              </InputGroup>
              <InputGroup label="3rd Place Prize (₹)" icon={Award}>
                <input
                  type="number"
                  value={formData.thirdPrice}
                  onChange={(e) => updateForm('thirdPrice', parseInt(e.target.value) || 0)}
                  min={0}
                  className="w-full px-6 py-5 bg-zinc-50 border border-zinc-100 rounded-2xl text-zinc-900 font-bold focus:outline-none focus:border-netflix-red focus:bg-white transition-all shadow-sm"
                  required
                />
              </InputGroup>
            </div>

            <div className="bg-white border border-zinc-100 rounded-[2.5rem] p-8 sm:p-10 shadow-xl shadow-zinc-100/30">
              <h4 className="text-sm font-black text-zinc-900 uppercase tracking-widest mb-8 flex items-center gap-3">
                <Calculator className="w-5 h-5 text-netflix-red" />
                Mission Economics
              </h4>
              <div className="space-y-4">
                <MetricRow label="Total Revenue" value={totalCollections} />
                <MetricRow label="Prize Allocation" value={-formData.prizePool} color="text-red-600" />
                <MetricRow label="Platform Fee (10%)" value={-platformFee} color="text-red-600" />
                <div className="pt-6 border-t border-zinc-100 flex items-center justify-between">
                  <span className="text-xs font-black text-zinc-900 tracking-widest">NET PROFIT</span>
                  <span className={cn("text-3xl font-black", organizerProfit < 0 ? "text-netflix-red" : "text-green-600")} style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                    {formatCurrency(organizerProfit * 100)}
                  </span>
                </div>
              </div>
            </div>

            {/* <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  Prize Distribution
                </h4>
                <div className={cn("px-4 py-1.5 rounded-full text-[10px] font-black", isPercentageValid ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600")}>
                  {totalPrizePercentage}% ALLOCATED
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {formData.prizeDistribution.map((prize, index) => (
                  <div key={index} className="flex items-center gap-4 p-6 bg-white border border-zinc-100 rounded-2xl shadow-sm">
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center font-black bg-zinc-50", prize.color)}>{prize.position}</div>
                    <div className="flex-1">
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{prize.label}</p>
                      <div className="flex items-center gap-4">
                         <div className="relative">
                            <input
                              type="number"
                              value={prize.percentage}
                              onChange={(e) => updatePrizePercentage(index, parseInt(e.target.value) || 0)}
                              className="w-24 px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-lg text-zinc-900 font-bold"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 font-black">%</span>
                         </div>
                         <span className="text-xl font-black text-zinc-900 leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{formatCurrency((formData.prizePool * (prize.percentage/100)) * 100)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div> */}
          </div>
        );
      }
      case 4:
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <InputGroup label="Mission Rules" icon={FileText}>
              <textarea
                className="w-full px-8 py-8 bg-zinc-50 border border-zinc-100 rounded-4xl text-zinc-900 font-bold min-h-[400px] resize-none"
                value={formData.rules}
                onChange={(e) => updateForm('rules', e.target.value)}
              />
            </InputGroup>
          </div>
        );
      case 5:
        return (
          <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500">
             <div className="bg-white border border-zinc-100 rounded-[3rem] p-12 text-center shadow-xl mb-12">
               <div className="w-20 h-20 bg-netflix-red rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-red-500/20">
                 <CheckCircle className="w-10 h-10 text-white" />
               </div>
               <h3 className="text-4xl font-black text-zinc-900 uppercase tracking-widest mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>COMMAND READY</h3>
               <p className="text-zinc-400 font-bold uppercase tracking-widest text-[9px]">Confirm your updates to the mission parameters.</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="md:col-span-2 lg:col-span-1">
                  <h4 className="text-sm font-black text-zinc-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Eye className="w-5 h-5 text-netflix-red" />
                    Poster Preview
                  </h4>
                  <div className="relative aspect-video rounded-[2.5rem] overflow-hidden border border-zinc-100 shadow-lg">
                    <img 
                      src={formData.thumbnailUrl} 
                      alt="Tournament Poster" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                </div>

                <ReviewBlock title="Tournament Info" icon={Trophy} color="text-netflix-red">
                  <ReviewItem label="TITLE" value={formData.title} />
                  <ReviewItem label="FORMAT" value={`${formData.format} • ${formData.perspective}`} />
                  <ReviewItem label="MAP" value={`${formData.modeCategory} • ${formData.map}`} />
                </ReviewBlock>

                <ReviewBlock title="Prizes & Fees" icon={DollarSign} color="text-green-600">
                  <ReviewItem label="PRIZE POOL" value={formatCurrency(formData.prizePool * 100)} highlight="text-green-600" />
                  <ReviewItem label="ENTRY FEE" value={formatCurrency(formData.entryFee * 100)} />
                  <ReviewItem label="EXPECTED EARNINGS" value={formatCurrency(calculateProfit() * 100)} highlight="text-netflix-red" />
                </ReviewBlock>
              </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto space-y-12 sm:space-y-16 pb-32 pt-8 lg:pt-20">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div>
          <h1 className="text-[clamp(2.5rem,8vw,4.5rem)] font-black text-zinc-900 tracking-widest leading-[0.85] uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            MANAGE<br />
            <span className="text-netflix-red">TOURNAMENT</span>
          </h1>
          <p className="text-zinc-400 font-bold uppercase tracking-[0.2em] text-[10px] sm:text-xs mt-6 flex items-center gap-3">
            <span className="w-12 h-[2px] bg-netflix-red" />
            Updating mission ID: {id}
          </p>
        </div>
        <Link href="/organizer/tournaments" className="px-6 py-3 text-zinc-400 hover:text-zinc-900 font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-2 group">
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Cancel Updates
        </Link>
      </div>

      <div className="bg-zinc-50 border border-zinc-100 rounded-4xl p-6 sm:p-10 text-left space-y-4 sm:space-y-6 relative overflow-hidden">
        <div className="flex items-center justify-between gap-1">
          {STEPS.map((step, index) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            return (
              <div key={step.id} className={cn("flex items-center", index < STEPS.length - 1 && "flex-1")}>
                <div className="flex flex-col items-center gap-2 sm:gap-4">
                  <div className={cn("w-7 h-7 sm:w-16 sm:h-16 rounded-xl sm:rounded-[1.25rem] flex items-center justify-center transition-all duration-500",
                    isCompleted ? "bg-green-500 text-white" : isCurrent ? "bg-netflix-red text-white scale-110 shadow-lg" : "bg-zinc-50 text-zinc-300")}>
                    {isCompleted ? <Check className="w-3 h-3 sm:w-8 sm:h-8" /> : <step.icon className="w-3 h-3 sm:w-6 sm:h-6" />}
                  </div>
                  <span className={cn("text-[6px] sm:text-[9px] font-black uppercase tracking-tight text-center leading-[1.1]", isCurrent ? "text-zinc-900" : isCompleted ? "text-green-600" : "text-zinc-300")}>
                    {step.title.split(' ').map((word, i) => (<span key={i} className="block sm:inline">{word} </span>))}
                  </span>
                </div>
                {index < STEPS.length - 1 && (<div className={cn("flex-1 h-0.5 rounded-full mx-1 sm:mx-6", isCompleted ? "bg-green-500" : "bg-zinc-100")} />)}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white border border-zinc-100 rounded-[3.5rem] p-8 sm:p-12 lg:p-16 shadow-xl shadow-zinc-200/30">
        {renderStepContent()}
      </div>

      <div className="mt-16 bg-[#fcfcfc]/80 backdrop-blur-xl border border-zinc-100 rounded-[2.5rem] p-6 shadow-2xl flex items-center justify-between">
          <Button variant="outline" onClick={handlePrev} disabled={currentStep === 1 || isSubmitting} className="px-10 py-7 font-black uppercase tracking-widest text-[10px]">BACK</Button>
          {currentStep < STEPS.length ? (
            <Button onClick={handleNext} className="px-12 py-7 bg-zinc-900 hover:bg-netflix-red text-white font-black uppercase tracking-widest text-[10px]">NEXT</Button>
          ) : (
            <Button onClick={() => handleSubmit(false)} disabled={isSubmitting} className="px-12 py-7 bg-netflix-red hover:bg-zinc-900 text-white font-black uppercase tracking-widest text-[10px]">
              {isSubmitting ? 'UPDATING...' : 'UPDATE MISSION'}
            </Button>
          )}
      </div>
    </div>
  );
}

function InputGroup({ label, icon: Icon, children }: { label: string; icon: any; children: React.ReactNode }) {
  return (
    <div className="space-y-3 group">
      <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] flex items-center gap-2 px-2 group-focus-within:text-netflix-red transition-colors">
        <Icon className="w-4 h-4" />
        {label}
      </label>
      {children}
    </div>
  );
}

function ReviewBlock({ title, icon: Icon, color, children }: { title: string; icon: any; color: string; children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <h4 className={cn("text-sm font-black uppercase tracking-widest flex items-center gap-2", color)}>
        <Icon className="w-5 h-5" />
        {title}
      </h4>
      <div className="bg-white border border-zinc-100 rounded-[2.5rem] p-8 space-y-4 shadow-sm">
        {children}
      </div>
    </div>
  );
}

function ReviewItem({ label, value, highlight }: { label: string; value: string; highlight?: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-zinc-50 last:border-0">
      <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">{label}</span>
      <span className={cn("text-[11px] font-bold uppercase tracking-tight truncate max-w-[150px]", highlight || "text-zinc-600")}>{value}</span>
    </div>
  );
}

function MetricRow({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest border-b border-zinc-50 pb-4">
      <span className="text-zinc-400">{label}</span>
      <span className={cn("text-zinc-900", color)}>{formatCurrency(value * 100)}</span>
    </div>
  );
}
