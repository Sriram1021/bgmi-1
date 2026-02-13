// ============================================
// BGMI Tournament Platform - Type Definitions
// ============================================

// User & Auth Types
export type UserRole = 'PARTICIPANT' | 'ORGANIZER' | 'ADMIN';

export type KYCStatus = 'NOT_SUBMITTED' | 'PENDING' | 'APPROVED' | 'REJECTED';

export type ApplicationStatus = 'NOT_APPLIED' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'REQUEST_INFO';

export interface OrganizerApplication {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  experience?: string;
  reason: string;
  sampleTournament?: string;
  status: ApplicationStatus;
  submittedAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export interface User {
  id: string;
  email: string;
  phone: string;
  name: string;
  displayName: string;
  avatarUrl: string | null;
  bannerUrl?: string | null;
  bgmiId: string | null;
  pubgId: string | null;
  role: UserRole;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  dateOfBirth: string;
  ageVerifiedAt: string | null;
  kycStatus: KYCStatus;
  state: string;
  stats?: UserStats;
  gamingProfile?: PlayerGamingProfile;
  organizerApplication?: OrganizerApplication;
  joinedTournamentIds?: string[];
  wallet?: WalletBalance;
  createdAt: string;
}

export interface UserStats {
  tournamentsPlayed: number;
  tournamentsWon: number;
  totalEarnings: number;
  totalKills: number;
  winRate: number;
  avgPlacement: number;
  matchesPlayed: number;
}

// Player Gaming Profile (THE GAMING PASSPORT)
export interface PlayerGamingProfile {
  // 1. Mandatory Identity (from Onboarding Step 1)
  fullName: string;
  mobileNumber: string;
  isMobileVerified: boolean;
  country: 'India';
  state: string;

  // 2. Game-Specific (Locked once verified/submitted)
  preferredGame: 'BGMI' | 'PUBG_MOBILE' | 'BOTH';
  bgmiId: string; // Character ID
  bgmiUsername: string; // In-game name (IGN)
  pubgId: string;
  pubgUsername: string;

  // 3. Match Preferences
  preferredMatchTypes: ('TDM' | 'ARENA' | 'CLASSIC')[];

  // 4. Optional / Hardware
  device: 'ANDROID' | 'IOS' | 'PC' | '';
  clanName?: string;
  discordId?: string;
  telegramId?: string;

  // Meta
  profileCompleteness: number; // 0-100
  isProfileLocked: boolean; // True after first submission, edits need admin/cooldown
  onboardingCompleted: boolean;
}

export interface TimeSlot {
  day: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';
  startTime: string; // HH:mm
  endTime: string;
}

export interface SocialLinks {
  youtube?: string;
  instagram?: string;
  twitter?: string;
  discord?: string;
}

// Tournament Types
export type GameType = 'BGMI' | 'PUBG_MOBILE';

export type TournamentFormat = 'SOLO' | 'DUO' | 'SQUAD';

export type TournamentStatus =
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'REGISTRATION_OPEN'
  | 'REGISTRATION_CLOSED'
  | 'LIVE'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

// Game Modes & Maps
export type GameModeCategory = 'CLASSIC' | 'ARENA' | 'ARCADE';

export type MapType =
  // Classic
  | 'ERANGEL' | 'MIRAMAR' | 'VIKENDI' | 'SANHOK' | 'KARAKIN' | 'LIVIK' | 'NUSA'
  // Arena
  | 'TDM' | 'DOMINATION' | 'ASSAULT' | 'GUN_GAME' | 'ARENA_TRAINING' | 'ULTIMATE_ARENA'
  // Arcade
  | 'QUICK_MATCH' | 'WAR' | 'SNIPER_TRAINING' | 'MINI_ZONE';

export type Perspective = 'TPP' | 'FPP';

export interface QuickMatch {
  id: string;
  title: string;
  mode: GameModeCategory; // Changed from QuickPlayMode to align with new categories
  map: MapType;
  game: GameType;
  perspective: Perspective;
  entryFee: number; // in paisa
  prizePerKill: number; // in paisa
  maxPlayers: number;
  currentPlayers: number;
  startsAt: string;
  status: 'FILLING' | 'STARTING' | 'LIVE' | 'COMPLETED';
  roomCode?: string;
  roomPassword?: string;
}

// Wallet & Earnings
export interface WalletBalance {
  cash: number; // in paisa
  pendingWithdrawal: number; // in paisa
}

// Leaderboard Types
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  avatarUrl: string;
  totalKills: number;
  totalWins: number;
  winRate: number;
  totalEarnings: number;
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND' | 'CROWN' | 'ACE' | 'CONQUEROR';
}

export interface PrizeDistribution {
  position: number;
  amount: number;
  label: string;
  color?: string;
}

export interface Tournament {
  id: string;
  tournamentId?: string; // Backend-specific ID
  title: string;
  slug: string;
  game: GameType;
  format: TournamentFormat;
  description: string;
  rules: string;
  organizerId: string;
  organizerName: string;
  organizerVerified: boolean;
  registrationStartsAt: string;
  registrationEndsAt: string;
  registrationDeadline?: string; // Backend-specific field
  startsAt: string;
  startTime?: string; // Backend-specific field
  endsAt: string | null;
  maxParticipants: number;
  minParticipants: number;
  currentParticipants: number;
  entryFee: number; // in paisa
  prizePool: number; // in paisa
  prizeDistribution: PrizeDistribution[];
  prizePerKill: number; // in paisa
  firstPrice: number; // in paisa
  secondPrice: number; // in paisa
  thirdPrice: number; // in paisa
  status: TournamentStatus;
  approvedAt: string | null;
  approvedBy: string | null;
  thumbnailUrl: string;
  modeCategory: GameModeCategory; // New field
  map: MapType;
  perspective: Perspective;
  createdAt: string;
  updatedAt: string;
  roomId?: string;
  roomPassword?: string;
}

export interface TeamMember {
  userId: string;
  name: string;
  role: 'LEADER' | 'MEMBER';
}

export interface TournamentEntry {
  id: string;
  tournamentId: string;
  userId: string;
  teamId: string | null;
  teamName: string | null;
  teamMembers: TeamMember[];
  slotNumber: number | null;
  paymentId: string;
  paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  amountPaid: number;
  status: 'REGISTERED' | 'CHECKED_IN' | 'NO_SHOW' | 'DISQUALIFIED';
  registeredAt: string;
}

export type MatchStatus = 'SCHEDULED' | 'ROOM_OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface Match {
  id: string;
  tournamentId: string;
  tournamentTitle: string;
  matchNumber: number;
  scheduledAt: string;
  roomCodeRevealAt: string;
  startedAt: string | null;
  endedAt: string | null;
  roomCode: string;
  roomPassword: string;
  status: MatchStatus;
  map: MapType;
  mode: string;
  resultsSubmitted: boolean;
  resultsApproved: boolean;
}

export type ResultStatus = 'PENDING' | 'APPROVED' | 'DISPUTED' | 'REJECTED';

export interface MatchResult {
  id: string;
  matchId: string;
  rank: number;
  userId: string;
  userName: string;
  teamName: string | null;
  placement: number;
  kills: number;
  placementPoints: number;
  killPoints: number;
  totalPoints: number;
  prizeAmount: number;
  submittedBy: string;
  submittedAt: string;
  evidenceUrls: string[];
  status: ResultStatus;
  reviewedBy: string | null;
  reviewedAt: string | null;
  reviewNotes: string | null;
}

export type PayoutStatus = 'PENDING' | 'APPROVED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface Payout {
  id: string;
  tournamentId: string;
  tournamentTitle: string;
  userId: string;
  userName: string;
  amount: number;
  status: PayoutStatus;
  approvedBy: string | null;
  approvedAt: string | null;
  processedAt: string | null;
  razorpayId: string | null;
}
