'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/app/components/ui/toast';
import { useAuth } from '@/app/providers/auth-provider';
import { useDispatch, useSelector } from 'react-redux';
import { createTournament, clearCreateSuccess, clearTournamentError } from '@/app/lib/redux/slices/tournamentSlice';
import type { CreateTournamentPayload } from '@/app/lib/redux/slices/tournamentSlice';
import type { AppDispatch, RootState } from '@/app/lib/redux/store';
import { GAMES, FORMATS, PERSPECTIVES, GAME_MODE_CATEGORIES, GAME_MODES, MATCH_MODES } from '@/app/lib/constants';
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

const PLATFORM_FEE_PERCENT = 10; // 10% platform fee

// Helper function to format string to Title Case (e.g., SQUAD -> Squad)
const toTitleCase = (str: string) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const STEPS = [
  { id: 1, title: 'Tournament Info', icon: Trophy },
  { id: 2, title: 'Tournament Schedule', icon: Calendar },
  { id: 3, title: 'Prizes & Fees', icon: DollarSign },
  { id: 4, title: 'Tournament Rules', icon: FileText },
  { id: 5, title: 'Final Review', icon: Check },
];

export default function CreateTournamentPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const { addToast } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, createSuccess } = useSelector((state: RootState) => state.tournament);
  const [currentStep, setCurrentStep] = useState(1);

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
    rules: `1. All participants must be 18+ years old.
2. Each squad must have exactly 4 members.
3. Use of hacks, cheats, or exploits is strictly prohibited.
4. All participants must join the room 10 minutes before match start.
5. Results are based on official in-game data.
6. Disputes must be raised within 30 minutes of match end.
7. Organizer's decision is final in case of disputes.`,
  });

  // Handle authentication
  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      addToast({
        type: 'error',
        title: 'Authentication Required',
        message: 'Please log in to create a tournament.'
      });
      // Optionally redirect or show login modal
      // router.push('/login');
    }
  }, [isLoading, isAuthenticated, addToast, router]);

  // Handle success
  useEffect(() => {
    if (createSuccess) {
      addToast({ 
        type: 'success', 
        title: 'Tournament Created!', 
        message: 'Your tournament has been successfully created.' 
      });
      dispatch(clearCreateSuccess());
      router.push('/organizer/tournaments');
    }
  }, [createSuccess, addToast, dispatch, router]);

  // Handle error
  useEffect(() => {
    if (error) {
      addToast({ 
        type: 'error', 
        title: 'Submission Error', 
        message: error 
      });
      dispatch(clearTournamentError());
    }
  }, [error, addToast, dispatch]);

  // Get available maps based on selected category
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
    if (!isAuthenticated) {
        addToast({
            type: 'error',
            title: 'Authentication Required',
            message: 'You must be logged in to create a tournament.'
        });
        return;
    }

    if (isDraft) {
      // Handle draft save (can be implemented later)
      addToast({ 
        type: 'success', 
        title: 'Tournament Draft Saved', 
        message: 'Your configuration has been saved for later.' 
      });
      return;
    }

    // Calculate players per team based on format
    const playersPerTeam =
      formData.format === 'SQUAD' ? 4 :
      formData.format === 'DUO' ? 2 : 1;

    // Validation: Ensure max participants is greater than team size
    if (formData.maxParticipants < playersPerTeam) {
      addToast({
        type: 'error',
        title: 'Invalid Participants',
        message: `Max participants must be at least ${playersPerTeam} for ${formData.format} mode`,
      });
      return;
    }

    // Helper to format string to Title Case (e.g., SQUAD -> Squad)
    const toTitleCase = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

    // Map form data to API payload structure with strong typing
    const tournamentPayload: CreateTournamentPayload = {
      title: formData.title,
      description: formData.description,
      map: toTitleCase(formData.map),
      mode: formData.modeCategory,      // Map mode to CLASSIC/ARENA/ARCADE
      matchMode: toTitleCase(formData.modeCategory),
      perspective: formData.perspective, 
      teamType: toTitleCase(formData.format),
      maxTeams: Math.floor(formData.maxParticipants / playersPerTeam),
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
    };

    dispatch(createTournament(tournamentPayload));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8 sm:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Tournament Title */}
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

            {/* Game & Format */}
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

            {/* Mode Category & Map */}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <InputGroup label="View Perspective" icon={Eye}>
                <select
                  value={formData.perspective}
                  onChange={(e) => updateForm('perspective', e.target.value)}
                  className="w-full px-6 py-5 bg-zinc-50 border border-zinc-100 rounded-2xl text-zinc-900 focus:outline-none focus:border-netflix-red focus:bg-white transition-all text-sm font-bold appearance-none cursor-pointer"
                >
                  {PERSPECTIVES.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </InputGroup>
            </div>

            {/* Description */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
              <InputGroup label="Tournament Details" icon={FileText}>
                <textarea
                  className="w-full px-6 py-5 bg-zinc-50 border border-zinc-100 rounded-3xl text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-netflix-red focus:bg-white transition-all text-sm font-bold min-h-[160px] resize-none"
                  placeholder="Describe your tournament, special rules, or what makes it unique..."
                  value={formData.description}
                  onChange={(e) => updateForm('description', e.target.value)}
                />
              </InputGroup>

              {/* Poster Selection */}
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
                      <img src={poster.url} alt={poster.label} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[8px] font-black text-white uppercase tracking-widest">{poster.label}</span>
                      </div>
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
                  className="w-full px-6 py-5 bg-zinc-50 border border-zinc-100 rounded-2xl text-zinc-900 focus:outline-none focus:border-netflix-red focus:bg-white transition-all text-sm font-bold"
                  required
                />
              </InputGroup>
              <InputGroup label="Registration Ends" icon={Calendar}>
                <input
                  type="datetime-local"
                  value={formData.registrationEndsAt}
                  onChange={(e) => updateForm('registrationEndsAt', e.target.value)}
                  className="w-full px-6 py-5 bg-zinc-50 border border-zinc-100 rounded-2xl text-zinc-900 focus:outline-none focus:border-netflix-red focus:bg-white transition-all text-sm font-bold"
                  required
                />
              </InputGroup>
              <InputGroup label="Match Start" icon={Calendar}>
                <input
                  type="datetime-local"
                  value={formData.startsAt}
                  onChange={(e) => updateForm('startsAt', e.target.value)}
                  className="w-full px-6 py-5 bg-zinc-50 border border-zinc-100 rounded-2xl text-zinc-900 focus:outline-none focus:border-netflix-red focus:bg-white transition-all text-sm font-bold"
                  required
                />
              </InputGroup>
            </div>

            <div className="flex items-start gap-4 p-6 bg-blue-50 border border-blue-100 rounded-[2rem]">
              <Lightbulb className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800 font-bold uppercase tracking-tight leading-relaxed">
                <span className="text-blue-600">Pro Tip:</span> Allow at least 24 hours between registration close and tournament start for participant verification and room preparations.
              </p>
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

        const addPrizePosition = () => {
          const newPosition = formData.prizeDistribution.length + 1;
          const colors = ['text-amber-500', 'text-zinc-400', 'text-amber-700', 'text-blue-600', 'text-purple-600', 'text-green-600'];
          const newDistribution = [
            ...formData.prizeDistribution,
            { position: newPosition, percentage: 0, label: `${newPosition}${newPosition === 1 ? 'st' : newPosition === 2 ? 'nd' : newPosition === 3 ? 'rd' : 'th'} Place`, color: colors[(newPosition - 1) % colors.length] }
          ];
          updateForm('prizeDistribution', newDistribution);
        };

        const removePrizePosition = (index: number) => {
          if (formData.prizeDistribution.length > 1) {
            const newDistribution = formData.prizeDistribution.filter((_, i) => i !== index).map((p, i) => ({
              ...p,
              position: i + 1,
              label: `${i + 1}${i === 0 ? 'st' : i === 1 ? 'nd' : i === 2 ? 'rd' : 'th'} Place`
            }));
            updateForm('prizeDistribution', newDistribution);
          }
        };

        return (
          <div className="space-y-10 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              <InputGroup label="Max Players" icon={Users}>
                <input
                  type="number"
                  value={formData.maxParticipants}
                  onChange={(e) => updateForm('maxParticipants', parseInt(e.target.value) || 0)}
                  min={4}
                  className="w-full px-6 py-5 bg-zinc-50 border border-zinc-100 rounded-2xl text-zinc-900 font-bold focus:outline-none focus:border-netflix-red focus:bg-white transition-all"
                  required
                />
              </InputGroup>
              <InputGroup label="Min Players to Start" icon={Users}>
                <input
                  type="number"
                  value={formData.minParticipants}
                  onChange={(e) => updateForm('minParticipants', parseInt(e.target.value) || 0)}
                  min={4}
                  className="w-full px-6 py-5 bg-zinc-50 border border-zinc-100 rounded-2xl text-zinc-900 font-bold focus:outline-none focus:border-netflix-red focus:bg-white transition-all"
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
                  min={0}
                  className="w-full px-6 py-5 bg-zinc-50 border border-zinc-100 rounded-2xl text-zinc-900 font-bold focus:outline-none focus:border-netflix-red focus:bg-white transition-all"
                  required
                />
              </InputGroup>
              <InputGroup label="Total Prize Pool (₹)" icon={Trophy}>
                <input
                  type="number"
                  value={formData.prizePool}
                  onChange={(e) => updateForm('prizePool', parseInt(e.target.value) || 0)}
                  min={0}
                  className="w-full px-6 py-5 bg-zinc-50 border border-zinc-100 rounded-2xl text-zinc-900 font-bold focus:outline-none focus:border-netflix-red focus:bg-white transition-all"
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
                  className="w-full px-6 py-5 bg-zinc-50 border border-zinc-100 rounded-2xl text-zinc-900 font-bold focus:outline-none focus:border-netflix-red focus:bg-white transition-all"
                  required
                />
              </InputGroup>
              <InputGroup label="2nd Place Prize (₹)" icon={Award}>
                <input
                  type="number"
                  value={formData.secondPrice}
                  onChange={(e) => updateForm('secondPrice', parseInt(e.target.value) || 0)}
                  min={0}
                  className="w-full px-6 py-5 bg-zinc-50 border border-zinc-100 rounded-2xl text-zinc-900 font-bold focus:outline-none focus:border-netflix-red focus:bg-white transition-all"
                  required
                />
              </InputGroup>
              <InputGroup label="3rd Place Prize (₹)" icon={Award}>
                <input
                  type="number"
                  value={formData.thirdPrice}
                  onChange={(e) => updateForm('thirdPrice', parseInt(e.target.value) || 0)}
                  min={0}
                  className="w-full px-6 py-5 bg-zinc-50 border border-zinc-100 rounded-2xl text-zinc-900 font-bold focus:outline-none focus:border-netflix-red focus:bg-white transition-all"
                  required
                />
              </InputGroup>
            </div>

            {/* Earnings Calculator */}
            <div className="bg-white border border-zinc-100 shadow-xl shadow-zinc-100/50 rounded-[2.5rem] p-8 sm:p-10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50 group-hover:bg-green-50 transition-colors" />
              <div className="relative z-10">
                <h4 className="text-sm font-black text-zinc-900 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                  <Calculator className="w-5 h-5 text-netflix-red" />
                  Earnings Calculator
                </h4>

                <div className="space-y-6">
                  <MetricRow label="Total Revenue Projection" value={totalCollections} />
                  <MetricRow label="Prize Allocation" value={-formData.prizePool} color="text-red-600" />
                  <MetricRow label="Platform Fee (10%)" value={-platformFee} color="text-red-600" />

                  <div className="pt-6 border-t border-zinc-100 flex items-center justify-between">
                    <span className="text-xs font-black text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                      Net Earnings
                    </span>
                    <span className={cn("text-4xl font-black text-zinc-900", organizerProfit < 0 && "text-netflix-red")} style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                      {formatCurrency(organizerProfit * 100)}
                    </span>
                  </div>
                </div>

                {organizerProfit < 0 && (
                  <div className="mt-8 p-6 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 animate-pulse">
                    <AlertCircle className="w-5 h-5 text-netflix-red flex-shrink-0 mt-0.5" />
                    <p className="text-[10px] font-black text-netflix-red uppercase tracking-widest leading-relaxed">
                      CRITICAL: Allocated rewards exceed projected revenue. Adjust entry fee or prize pool immediately.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Prize Distribution */}
            {/* <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  Prize Distribution
                </h4>
                <div className={cn("flex items-center gap-3 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest", isPercentageValid ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600")}>
                  Total allocation: {totalPrizePercentage}%
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {formData.prizeDistribution.map((prize, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-4 p-6 bg-white border border-zinc-100 rounded-2xl group hover:border-netflix-red/30 transition-all shadow-sm hover:shadow-lg">
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-sm font-black bg-zinc-50 border border-zinc-100 group-hover:scale-110 transition-transform shadow-sm", prize.color)}>
                      {prize.position}
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{prize.label}</p>
                      <div className="flex items-center gap-4">
                        <div className="relative flex-1 max-w-[120px]">
                          <input
                            type="number"
                            value={prize.percentage}
                            onChange={(e) => updatePrizePercentage(index, parseInt(e.target.value) || 0)}
                            className="w-full pl-6 pr-10 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-zinc-900 font-bold focus:outline-none focus:ring-2 focus:ring-netflix-red/20 focus:border-netflix-red transition-all"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-zinc-400">%</span>
                        </div>
                        <span className="text-2xl font-black text-zinc-900 uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                          {formatCurrency((formData.prizePool * (prize.percentage / 100)) * 100)}
                        </span>
                      </div>
                    </div>
                    {formData.prizeDistribution.length > 1 && (
                      <button
                        onClick={() => removePrizePosition(index)}
                        className="p-3 text-zinc-300 hover:text-netflix-red hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                onClick={addPrizePosition}
                className="w-full py-8 border-2 border-dashed border-zinc-200 text-zinc-400 font-black uppercase tracking-widest text-[10px] rounded-2xl hover:border-netflix-red hover:text-netflix-red hover:bg-red-50 transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Distribution Position
              </Button>
            </div> */}
          </div>
        );
      }
      case 4:
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <InputGroup label="Tournament Rules" icon={FileText}>
              <textarea
                className="w-full px-8 py-8 bg-zinc-50 border border-zinc-100 rounded-[2rem] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-netflix-red focus:bg-white transition-all text-sm font-mono min-h-[400px] resize-none leading-relaxed shadow-inner"
                value={formData.rules}
                onChange={(e) => updateForm('rules', e.target.value)}
                placeholder="Enter tournament rules..."
              />
            </InputGroup>

            <div className="flex items-start gap-4 p-6 bg-amber-50 border border-amber-100 rounded-[2rem]">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-[10px] font-black text-amber-800 uppercase tracking-widest leading-relaxed">
                <span className="text-amber-600">MANDATORY:</span> All tournaments must enforce the 18+ age limit. Rules must be transparent and universally applied.
              </p>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500">
            <div className="bg-white border border-zinc-100 rounded-[3rem] p-12 text-center shadow-2xl shadow-zinc-200/50">
              <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border border-green-100">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <h3 className="text-4xl font-black text-zinc-900 uppercase tracking-widest mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>READY TO CREATE</h3>
              <p className="text-zinc-400 font-bold uppercase tracking-[0.2em] text-[10px] max-w-sm mx-auto">
                Review your tournament details. Some settings will be locked after creation to maintain fair play.
              </p>
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
                <ReviewItem label="MATCH MODE" value={toTitleCase(formData.modeCategory)} />
                <ReviewItem label="PERSPECTIVE" value={formData.perspective} />
                <ReviewItem label="MAP" value={toTitleCase(formData.map)} />
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
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div>
          <h1 className="text-[clamp(2.5rem,8vw,4.5rem)] font-black text-zinc-900 tracking-widest leading-[0.85] uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            CREATE<br />
            <span className="text-netflix-red">TOURNAMENT</span>
          </h1>
          <p className="text-zinc-400 font-bold uppercase tracking-[0.2em] text-[10px] sm:text-xs mt-6 flex items-center gap-3">
            <span className="w-12 h-[2px] bg-netflix-red" />
            Create your tournament step by step
          </p>
        </div>
        <Link href="/organizer/tournaments" className="px-6 py-3 text-zinc-400 hover:text-zinc-900 font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-2 group">
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Cancel
        </Link>
      </div>

      {/* Modern Step Progress */}
      <div className="bg-white border border-zinc-100 rounded-4xl sm:rounded-[2.5rem] p-4 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between gap-1">
          {STEPS.map((step, index) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            return (
              <div key={step.id} className={cn("flex items-center", index < STEPS.length - 1 && "flex-1")}>
                <div className="flex flex-col items-center gap-2 sm:gap-4">
                  <div
                    className={cn(
                      "w-7 h-7 sm:w-16 sm:h-16 rounded-xl sm:rounded-[1.25rem] flex items-center justify-center transition-all duration-500",
                      isCompleted ? "bg-green-500 text-white shadow-lg shadow-green-500/20" :
                        isCurrent ? "bg-netflix-red text-white shadow-xl shadow-red-500/30 ring-4 ring-red-500/10 scale-110" :
                          "bg-zinc-50 text-zinc-300 border border-zinc-100"
                    )}
                  >
                    {isCompleted ? <Check className="w-3 h-3 sm:w-8 sm:h-8" /> : <step.icon className="w-3 h-3 sm:w-6 sm:h-6" />}
                  </div>
                  <span
                    className={cn(
                      "text-[6px] sm:text-[9px] font-black uppercase tracking-tight sm:tracking-[0.2em] text-center leading-[1.1]",
                      isCurrent ? "text-zinc-900" : isCompleted ? "text-green-600" : "text-zinc-300"
                    )}
                  >
                    {step.title.split(' ').map((word, i) => (
                      <span key={i} className="block sm:inline">{word} </span>
                    ))}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div className={cn("flex-1 h-0.5 rounded-full mx-1 sm:mx-6 transition-colors duration-500", isCompleted ? "bg-green-500" : "bg-zinc-100")} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Form Area */}
      <div className="bg-white border border-zinc-100 rounded-[3.5rem] p-8 sm:p-12 lg:p-16 shadow-xl shadow-zinc-200/30">
        <div className="flex items-center gap-5 mb-12">
          <div className="w-2 h-10 bg-netflix-red rounded-full" />
          <h2 className="text-3xl font-black text-zinc-900 uppercase tracking-widest" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            Step {currentStep}: {STEPS[currentStep - 1].title}
          </h2>
        </div>

        {renderStepContent()}
      </div>

      {/* Master Controls */}
      <div className="mt-16 w-full relative z-10">
        <div className="bg-[#fcfcfc]/80 backdrop-blur-xl border border-zinc-100 rounded-[2.5rem] p-6 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-zinc-50">
            <div className="h-full bg-netflix-red transition-all duration-700" style={{ width: `${(currentStep / STEPS.length) * 100}%` }} />
          </div>

          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentStep === 1 || loading}
            className="w-full sm:w-auto px-10 py-7 border-zinc-200 text-zinc-500 font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-zinc-50"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </Button>

          <div className="flex items-center gap-4 w-full sm:w-auto">
            {currentStep < STEPS.length ? (
              <Button
                onClick={handleNext}
                className="w-full sm:w-auto px-12 py-7 bg-zinc-900 hover:bg-netflix-red text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-zinc-900/10 group transition-all"
              >
                Next
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            ) : (
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <Button
                  onClick={() => handleSubmit(true)}
                  disabled={loading}
                  className="px-8 py-7 border-zinc-200 text-zinc-500 font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-zinc-50 flex-1 sm:flex-none"
                >
                  Save Draft
                </Button>
                <Button
                  onClick={() => handleSubmit(false)}
                  disabled={loading}
                  className="px-12 py-7 bg-netflix-red hover:bg-zinc-900 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-red-500/20 group flex-1 sm:flex-none"
                >
                  {loading ? 'Creating...' : 'Create Tournament'}
                  {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                </Button>
              </div>
            )}
          </div>
        </div>
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

function MetricRow({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest border-b border-zinc-50 pb-4">
      <span className="text-zinc-400">{label}</span>
      <span className={cn("text-zinc-900", color)}>{formatCurrency(value * 100)}</span>
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
    <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest">
      <span className="text-zinc-400">{label}</span>
      <span className={cn("text-zinc-900", highlight)}>{value}</span>
    </div>
  );
}
