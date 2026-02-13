// ============================================
// Application Constants
// ============================================

export const APP_NAME = 'BattleGround Arena';
export const APP_DESCRIPTION = 'India\'s Premier Skill-Based BGMI & PUBG Tournament Platform';

// Repeat.gg inspired colors
export const COLORS = {
  netflixRed: '#E50914',
  netflixBlack: '#141414',
  netflixGray: {
    900: '#141414',
    800: '#1F1F1F',
    700: '#2F2F2F',
    600: '#404040',
    500: '#808080',
    400: '#B3B3B3',
    300: '#D1D1D1',
  },
  liveGreen: '#00E676',
  fillingOrange: '#FF9100',
  infoBlue: '#2196F3',
  premiumPurple: '#9C27B0',
};

// Legal text - DO NOT modify without legal review
export const LEGAL = {
  INTERMEDIARY_DISCLAIMER: `${APP_NAME} operates solely as a technology intermediary platform that facilitates connections between tournament organizers and participants. The platform does not organize, operate, or conduct any games or tournaments. All tournaments are organized and operated by independent third-party organizers who are solely responsible for the conduct, rules, and outcomes of their events.`,

  SKILL_BASED_DECLARATION: `All competitions hosted on this platform are skill-based gaming tournaments as defined under applicable Indian law. Outcomes are determined predominantly by the skill, knowledge, and experience of participants, not by chance. Participation requires proficiency in game mechanics, strategy, and real-time decision making.`,

  AGE_RESTRICTION: 'You must be 18 years or older to participate in tournaments on this platform.',

  NO_GAMBLING: 'This platform does not offer gambling, betting, or wagering of any kind.',
};

// Minimum age requirement
export const MIN_AGE_REQUIRED = 18;

// Restricted states where skill-based gaming has restrictions
export const RESTRICTED_STATES = [
  'Andhra Pradesh',
  'Telangana',
  'Assam',
  'Odisha',
  'Nagaland',
  'Sikkim',
];

// Alias for backward compatibility
export const BLOCKED_STATES = RESTRICTED_STATES;

// All Indian states
export const INDIAN_STATES = [
  'Andaman and Nicobar Islands',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Lakshadweep',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];

// Game options
export const GAMES = [
  { value: 'BGMI', label: 'Battlegrounds Mobile India' },
  { value: 'PUBG_MOBILE', label: 'PUBG Mobile' },
] as const;

// Game Mode Categories
export const GAME_MODE_CATEGORIES = [
  { value: 'CLASSIC', label: 'Classic Mode' },
  { value: 'ARENA', label: 'Arena Mode' },
  { value: 'ARCADE', label: 'Arcade Mode' },
] as const;

// Detailed Maps/Modes per Category
export const GAME_MODES = {
  CLASSIC: [
    { value: 'ERANGEL', label: 'Erangel' },
    { value: 'MIRAMAR', label: 'Miramar' },
    { value: 'VIKENDI', label: 'Vikendi' },
    { value: 'SANHOK', label: 'Sanhok' },
    { value: 'KARAKIN', label: 'Karakin' },
    { value: 'LIVIK', label: 'Livik' },
    { value: 'NUSA', label: 'Nusa' },
  ],
  ARENA: [
    { value: 'TDM', label: 'Team Deathmatch (TDM)' },
    { value: 'DOMINATION', label: 'Domination' },
    { value: 'ASSAULT', label: 'Assault' },
    { value: 'GUN_GAME', label: 'Gun Game' },
    { value: 'ARENA_TRAINING', label: 'Arena Training' },
    { value: 'ULTIMATE_ARENA', label: 'Ultimate Arena' },
  ],
  ARCADE: [
    { value: 'QUICK_MATCH', label: 'Quick Match' },
    { value: 'WAR', label: 'War' },
    { value: 'SNIPER_TRAINING', label: 'Sniper Training' },
    { value: 'MINI_ZONE', label: 'Mini-Zone' },
  ]
} as const;

// Flattened list of all maps for types/validation if needed
export const ALL_MAPS = [
  ...GAME_MODES.CLASSIC,
  ...GAME_MODES.ARENA,
  ...GAME_MODES.ARCADE,
];

// Format options
export const FORMATS = [
  { value: 'SOLO', label: 'Solo', players: 1 },
  { value: 'DUO', label: 'Duo', players: 2 },
  { value: 'SQUAD', label: 'Squad', players: 4 },
] as const;

// Legacy MAPS export for backward compatibility (pointing to Classic maps mainly or all)
export const MAPS = ALL_MAPS;

// Perspective options
export const PERSPECTIVES = [
  { value: 'TPP', label: 'Third Person (TPP)' },
  { value: 'FPP', label: 'First Person (FPP)' },
] as const;

// Match mode options
export const MATCH_MODES = [
  { value: 'RANKED', label: 'Ranked' },
  { value: 'UNRANKED', label: 'Unranked' },
] as const;

// Tournament status labels and colors
export const TOURNAMENT_STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string }> = {
  DRAFT: { label: 'Draft', color: 'text-gray-600', bgColor: 'bg-gray-100' },
  PENDING_APPROVAL: { label: 'Waiting for Approval', color: 'text-yellow-700', bgColor: 'bg-yellow-100' },
  APPROVED: { label: 'Approved', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  REGISTRATION_OPEN: { label: 'Join Now', color: 'text-green-700', bgColor: 'bg-green-100' },
  REGISTRATION_CLOSED: { label: 'Entry Closed', color: 'text-orange-700', bgColor: 'bg-orange-100' },
  LIVE: { label: 'Live Now', color: 'text-red-700', bgColor: 'bg-red-100' },
  IN_PROGRESS: { label: 'In Progress', color: 'text-purple-700', bgColor: 'bg-purple-100' },
  COMPLETED: { label: 'Ended', color: 'text-gray-700', bgColor: 'bg-gray-200' },
  CANCELLED: { label: 'Cancelled', color: 'text-red-700', bgColor: 'bg-red-100' },
};

// Navigation items
export const PUBLIC_NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/tournaments', label: 'Tournaments' },
  { href: '/skill-declaration', label: 'Skill-Based Gaming' },
];

export const PARTICIPANT_NAV_ITEMS = [
  { href: '/dashboard', label: 'My Page', icon: 'LayoutDashboard' },
  { href: '/quick-play', label: 'Quick Join', icon: 'Zap' },
  { href: '/my-tournaments', label: 'Joined Matches', icon: 'Trophy' },
  { href: '/leaderboards', label: 'Rankings', icon: 'BarChart' },
  { href: '/wallet', label: 'Wallet & Earnings', icon: 'Wallet' },
  { href: '/profile', label: 'My Info', icon: 'User' },
];

export const ORGANIZER_NAV_ITEMS = [
  { href: '/dashboard', label: 'Host Dashboard', icon: 'LayoutDashboard' },
  { href: '/tournaments', label: 'Hosted Matches', icon: 'Trophy' },
  { href: '/tournaments/create', label: 'Host New Match', icon: 'PlusCircle' },
  { href: '/quick-matches', label: 'Fast Matches', icon: 'Zap' },
  { href: '/profile', label: 'Host Info', icon: 'User' },
];

export const ADMIN_NAV_ITEMS = [
  { href: '/dashboard', label: 'Admin Panels', icon: 'LayoutDashboard' },
  { href: '/tournaments', label: 'All Matches', icon: 'Trophy' },
  { href: '/tournaments/pending', label: 'Approve Matches', icon: 'Clock' },
  { href: '/organizers/pending', label: 'Approve Hosts', icon: 'ShieldCheck' },
  { href: '/results', label: 'Verify Results', icon: 'ClipboardCheck' },
  { href: '/payouts', label: 'Withdraw Requests', icon: 'Wallet' },
  { href: '/users', label: 'Player List', icon: 'Users' },
  { href: '/organizers', label: 'Organizer List', icon: 'Building' },
  { href: '/disputes', label: 'Player Disputes', icon: 'AlertTriangle' },
];

// Pagination
export const DEFAULT_PAGE_SIZE = 12;

// Currency
export const CURRENCY = {
  code: 'INR',
  symbol: '₹',
  locale: 'en-IN',
};

export const QUICK_PLAY_MODES = [
  { id: 'TDM', name: 'Team Deathmatch', description: 'Quick 4v4 action', players: 8 },
  { id: 'ARENA', name: 'Arena Battle', description: 'Fast-paced arena combat', players: 100 },
  { id: 'CLASSIC', name: 'Classic Quick', description: '15-min Classic match', players: 100 },
];
