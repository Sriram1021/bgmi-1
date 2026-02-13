import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface CreateTournamentPayload {
  title: string;
  description: string;
  map: string;
  mode: string;
  matchMode: string;
  perspective: string;
  teamType: string;
  maxTeams: number;
  entryFee: number;
  prizePool: number;
  prizePerKill: number;
  firstPrice: number;
  secondPrice: number;
  thirdPrice: number;
  startTime: string;
  registrationDeadline: string;
  rules: string;
  thumbnailUrl?: string;
  roomId?: string;
  roomPassword?: string;
}

interface TournamentState {
  tournaments: any[];
  organizedTournaments: any[]; // New state for organizer dashboard
  myRegistrations: any[]; // New state for participant dashboard
  currentRegistration: any | null; // Stores details for a specific registration
  currentTournamentParticipants: any[]; // New state for participants list
  currentTournament: any | null;
  loading: boolean;
  error: string | null;
  createSuccess: boolean;
}

const initialState: TournamentState = {
  tournaments: [],
  organizedTournaments: [],
  myRegistrations: [],
  currentRegistration: null,
  currentTournamentParticipants: [],
  currentTournament: null,
  loading: false,
  error: null,
  createSuccess: false,
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

// Create Tournament Async Thunk
export const createTournament = createAsyncThunk(
  'tournament/createTournament',
  async (tournamentData: CreateTournamentPayload, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { user: { token: string | null } };
      const token = state.user.token || localStorage.getItem('auth_token');

      if (!token) {
        console.error('❌ No authentication token found');
        throw new Error('Authentication required. Please log in again.');
      }

      // Use local Next.js proxy to avoid CORS
      const url = '/api/tournaments';
      console.log('🚀 Creating tournament via Proxy at:', url);
      console.log('📦 Payload:', JSON.stringify(tournamentData, null, 2));

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...tournamentData,
          thumbnail: tournamentData.thumbnailUrl,
          image: tournamentData.thumbnailUrl,
          thumbnail_url: tournamentData.thumbnailUrl,
          poster: tournamentData.thumbnailUrl,
          poster_url: tournamentData.thumbnailUrl
        }),
      });

      console.log('📡 Response status:', response.status);

      const contentType = response.headers.get('content-type');
      let data: any = null;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      }

      if (!response.ok) {
        let errorMessage = 'Failed to create tournament';
        if (data && data.message) {
          errorMessage = data.message;
        } else {
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      console.log('✅ Tournament created successfully:', data);

      // Normalize created tournament
      const t = data?.tournament || data?.data || data;

      // Handle prize distribution object-to-array conversion
      let prizes = [];
      if (t.prizeDistribution && !Array.isArray(t.prizeDistribution)) {
        prizes = Object.entries(t.prizeDistribution).map(([key, val]) => ({
          position: key === 'first' ? 1 : key === 'second' ? 2 : key === 'third' ? 3 : 0,
          amount: Number(val) / 100,
          label: key.toUpperCase()
        })).sort((a, b) => a.position - b.position);
      } else {
        prizes = t.prizeDistribution || [];
      }

      // Fallback: Synthesize from fixed price fields if array is empty
      if (prizes.length === 0 && (Number(t.firstPrice) > 0 || Number(t.secondPrice) > 0 || Number(t.thirdPrice) > 0)) {
        if (Number(t.firstPrice) > 0) prizes.push({ position: 1, amount: Number(t.firstPrice), label: '1ST PLACE', color: 'text-amber-500' });
        if (Number(t.secondPrice) > 0) prizes.push({ position: 2, amount: Number(t.secondPrice), label: '2ND PLACE', color: 'text-zinc-400' });
        if (Number(t.thirdPrice) > 0) prizes.push({ position: 3, amount: Number(t.thirdPrice), label: '3RD PLACE', color: 'text-amber-700' });
      }

      // Default thumbnail based on game and format
      const defaultThumbnail = t.game?.includes('PUBG')
        ? (t.format === 'SOLO' ? '/games/pubg.png' : '/games/pubg_classic.png')
        : (t.format === 'SOLO' ? '/games/bgmi_solo.png' : '/games/bgmi_classic.png');

      const normalizedTournament = {
        ...t,
        id: t.tournamentId || t._id || t.id,
        game: t.game || 'BGMI',
        format: t.format || t.teamType || 'SQUAD',
        startsAt: t.startsAt || t.startTime,
        registrationEndsAt: t.registrationEndsAt || t.registrationDeadline,
        currentParticipants: t.currentParticipants || t.registeredTeams || 0,
        maxParticipants: t.maxParticipants || t.maxTeams || 100,
        entryFee: (Number(t.entryFee) || 0) / 100,
        prizePool: (Number(t.prizePool) || 0) / 100,
        prizePerKill: (Number(t.prizePerKill) || 0) / 100,
        firstPrice: (Number(t.firstPrice) || 0) / 100,
        secondPrice: (Number(t.secondPrice) || 0) / 100,
        thirdPrice: (Number(t.thirdPrice) || 0) / 100,
        prizeDistribution: prizes,
        roomId: t.roomId || '',
        roomPassword: t.roomPassword || '',
        thumbnailUrl: t.thumbnailUrl || t.thumbnail || t.image || t.posterUrl || t.poster || t.thumbnail_url || defaultThumbnail,
        status: (t.status === 'open' ? 'REGISTRATION_OPEN' : t.status?.toUpperCase()) || 'APPROVED'
      };

      return normalizedTournament;
    } catch (error: any) {
      console.error('❌ Create tournament error:', error);
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);

// Fetch Tournaments Async Thunk
export const fetchTournaments = createAsyncThunk(
  'tournament/fetchTournaments',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { user: { token: string | null } };
      const token = state.user.token || localStorage.getItem('auth_token');

      // Use local Next.js proxy to avoid CORS
      const url = '/api/tournaments';
      console.log('📡 Fetching tournaments via Proxy at:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
      });

      console.log('📡 Fetch response status:', response.status);

      const contentType = response.headers.get('content-type');
      let data: any = null;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      }

      if (!response.ok) {
        throw new Error(data?.message || `Server error: ${response?.status}`);
      }

      // Normalize data to an array
      const tourneyList = Array.isArray(data)
        ? data
        : data?.tournaments || data?.data || data?.items || [];

      // Global Normalization: Unified data structure for all UI components
      const normalizedTourneys = tourneyList.map((t: any) => {
        // Handle prize distribution object-to-array conversion
        let prizes = [];
        if (t.prizeDistribution && !Array.isArray(t.prizeDistribution)) {
          prizes = Object.entries(t.prizeDistribution).map(([key, val]) => ({
            position: key === 'first' ? 1 : key === 'second' ? 2 : key === 'third' ? 3 : 0,
            amount: Number(val) / 100,
            label: key.toUpperCase()
          })).sort((a, b) => a.position - b.position);
        } else {
          prizes = t.prizeDistribution || [];
        }

        // Fallback: Synthesize from fixed price fields if array is empty
        if (prizes.length === 0 && (Number(t.firstPrice) > 0 || Number(t.secondPrice) > 0 || Number(t.thirdPrice) > 0)) {
          if (Number(t.firstPrice) > 0) prizes.push({ position: 1, amount: Number(t.firstPrice), label: '1ST PLACE', color: 'text-amber-500' });
          if (Number(t.secondPrice) > 0) prizes.push({ position: 2, amount: Number(t.secondPrice), label: '2ND PLACE', color: 'text-zinc-400' });
          if (Number(t.thirdPrice) > 0) prizes.push({ position: 3, amount: Number(t.thirdPrice), label: '3RD PLACE', color: 'text-amber-700' });
        }

        // Default thumbnail based on game and format
        const defaultThumbnail = t.game?.includes('PUBG')
          ? (t.format === 'SOLO' ? '/games/pubg.png' : '/games/pubg_classic.png')
          : (t.format === 'SOLO' ? '/games/bgmi_solo.png' : '/games/bgmi_classic.png');

        return {
          ...t,
          id: t.tournamentId || t._id || t.id,
          game: t.game || 'BGMI',
          format: t.format || t.teamType || 'SQUAD',
          startsAt: t.startsAt || t.startTime,
          registrationEndsAt: t.registrationEndsAt || t.registrationDeadline,
          currentParticipants: t.currentParticipants || t.registeredTeams || 0,
          maxParticipants: t.maxParticipants || t.maxTeams || 100,
          entryFee: (Number(t.entryFee) || 0) / 100,
          prizePool: (Number(t.prizePool) || 0) / 100,
          prizePerKill: (Number(t.prizePerKill) || 0) / 100,
          firstPrice: (Number(t.firstPrice) || 0) / 100,
          secondPrice: (Number(t.secondPrice) || 0) / 100,
          thirdPrice: (Number(t.thirdPrice) || 0) / 100,
          prizeDistribution: prizes,
          thumbnailUrl: t.thumbnailUrl || t.thumbnail || t.image || t.posterUrl || defaultThumbnail,
          status: (t.status === 'open' ? 'REGISTRATION_OPEN' : t.status?.toUpperCase()) || 'APPROVED'
        };
      });

      console.log(`✅ Normalized ${normalizedTourneys.length} tournaments (IDs, Dates, Prizes, Stats)`);
      return normalizedTourneys;
    } catch (error: any) {
      console.error('❌ Fetch tournaments error:', error);
      
      // Return a user-friendly error message
      const errorMessage = error.message === 'fetch failed' 
        ? 'Unable to connect to server. Please check your internet connection and try again.'
        : error.message || 'Failed to load tournaments. Please try again later.';
      
      return rejectWithValue(errorMessage);
    }
  }
);

// Fetch Single Tournament Async Thunk
export const fetchTournamentById = createAsyncThunk(
  'tournament/fetchTournamentById',
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { user: { token: string | null } };
      const token = state.user.token || localStorage.getItem('auth_token');

      // Use local Next.js proxy to avoid CORS
      const url = `/api/tournaments/${id}`;
      console.log('📡 Fetching single tournament via Proxy at:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
      });

      console.log('📡 Fetch response status:', response.status);

      const contentType = response.headers.get('content-type');
      let data: any = null;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      }

      if (!response.ok) {
        throw new Error(data?.message || `Server error: ${response.status}`);
      }

      // Normalize single tournament data
      const t = data?.tournament || data?.data || data;

      // Handle prize distribution object-to-array conversion
      let prizes = [];
      if (t.prizeDistribution && !Array.isArray(t.prizeDistribution)) {
        prizes = Object.entries(t.prizeDistribution).map(([key, val]) => ({
          position: key === 'first' ? 1 : key === 'second' ? 2 : key === 'third' ? 3 : 0,
          amount: Number(val) / 100,
          label: key.toUpperCase()
        })).sort((a, b) => a.position - b.position);
      } else {
        prizes = t.prizeDistribution || [];
      }

      // Fallback: Synthesize from fixed price fields if array is empty
      if (prizes.length === 0 && (Number(t.firstPrice) > 0 || Number(t.secondPrice) > 0 || Number(t.thirdPrice) > 0)) {
        if (Number(t.firstPrice) > 0) prizes.push({ position: 1, amount: Number(t.firstPrice), label: '1ST PLACE', color: 'text-amber-500' });
        if (Number(t.secondPrice) > 0) prizes.push({ position: 2, amount: Number(t.secondPrice), label: '2ND PLACE', color: 'text-zinc-400' });
        if (Number(t.thirdPrice) > 0) prizes.push({ position: 3, amount: Number(t.thirdPrice), label: '3RD PLACE', color: 'text-amber-700' });
      }

      // Default thumbnail based on game and format
      const defaultThumbnail = t.game?.includes('PUBG')
        ? (t.format === 'SOLO' ? '/games/pubg.png' : '/games/pubg_classic.png')
        : (t.format === 'SOLO' ? '/games/bgmi_solo.png' : '/games/bgmi_classic.png');

      const normalizedTournament = {
        ...t,
        id: t.tournamentId || t._id || t.id,
        game: t.game || 'BGMI',
        format: t.format || t.teamType || 'SQUAD',
        startsAt: t.startsAt || t.startTime,
        registrationEndsAt: t.registrationEndsAt || t.registrationDeadline,
        currentParticipants: t.currentParticipants || t.registeredTeams || 0,
        maxParticipants: t.maxParticipants || t.maxTeams || 100,
        entryFee: (Number(t.entryFee) || 0) / 100,
        prizePool: (Number(t.prizePool) || 0) / 100,
        prizePerKill: (Number(t.prizePerKill) || 0) / 100,
        firstPrice: (Number(t.firstPrice) || 0) / 100,
        secondPrice: (Number(t.secondPrice) || 0) / 100,
        thirdPrice: (Number(t.thirdPrice) || 0) / 100,
        prizeDistribution: prizes,
        roomId: t.roomId || '',
        roomPassword: t.roomPassword || '',
        thumbnailUrl: t.thumbnailUrl || defaultThumbnail,
        status: (t.status === 'open' ? 'REGISTRATION_OPEN' : t.status?.toUpperCase()) || 'APPROVED'
      };

      console.log('✅ Normalized tournament detail:', normalizedTournament.id);
      return normalizedTournament;
    } catch (error: any) {
      console.error('❌ Fetch tournament details error:', error);
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);

// Update Tournament Async Thunk
export const updateTournament = createAsyncThunk(
  'tournament/updateTournament',
  async ({ id, data }: { id: string, data: any }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { user: { token: string | null } };
      const token = state.user.token || localStorage.getItem('auth_token');

      if (!token) {
        throw new Error('Authentication required');
      }

      // Use local Next.js proxy
      const url = `/api/tournaments/${id}`;
      console.log(`📡 [DEBUG] Updating tournament. ID: ${id}`);
      console.log(`📡 [DEBUG] Target URL: ${url}`);
      console.log(`📡 [DEBUG] Auth Token Present: ${!!token}`);
      console.log('📡 Updating tournament via Proxy at:', url);

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...data,
          thumbnailUrl: data.thumbnailUrl,
          thumbnail: data.thumbnailUrl,
          image: data.thumbnailUrl,
          thumbnail_url: data.thumbnailUrl,
          poster: data.thumbnailUrl,
          poster_url: data.thumbnailUrl
        }),
      });

      console.log('📡 Update response status:', response.status);

      const contentType = response.headers.get('content-type');
      let responseData: any = null;

      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      }

      if (!response.ok) {
        throw new Error(responseData?.message || `Server error: ${response.status}`);
      }

      // Normalize updated data
      const t = responseData?.tournament || responseData?.data || responseData;

      let prizes = [];
      if (t.prizeDistribution && !Array.isArray(t.prizeDistribution)) {
        prizes = Object.entries(t.prizeDistribution).map(([key, val]) => ({
          position: key === 'first' ? 1 : key === 'second' ? 2 : key === 'third' ? 3 : 0,
          amount: Number(val) / 100,
          label: key.toUpperCase()
        })).sort((a, b) => a.position - b.position);
      } else {
        prizes = t.prizeDistribution || [];
      }

      // Fallback: Synthesize from fixed price fields if array is empty
      if (prizes.length === 0 && (Number(t.firstPrice) > 0 || Number(t.secondPrice) > 0 || Number(t.thirdPrice) > 0)) {
        if (Number(t.firstPrice) > 0) prizes.push({ position: 1, amount: Number(t.firstPrice), label: '1ST PLACE', color: 'text-amber-500' });
        if (Number(t.secondPrice) > 0) prizes.push({ position: 2, amount: Number(t.secondPrice), label: '2ND PLACE', color: 'text-zinc-400' });
        if (Number(t.thirdPrice) > 0) prizes.push({ position: 3, amount: Number(t.thirdPrice), label: '3RD PLACE', color: 'text-amber-700' });
      }

      // Default thumbnail based on game and format
      const defaultThumbnail = t.game?.includes('PUBG')
        ? (t.format === 'SOLO' ? '/games/pubg.png' : '/games/pubg_classic.png')
        : (t.format === 'SOLO' ? '/games/bgmi_solo.png' : '/games/bgmi_classic.png');

      const normalizedTournament = {
        ...t,
        id: t.tournamentId || t._id || t.id,
        game: t.game || 'BGMI',
        format: t.format || t.teamType || 'SQUAD',
        startsAt: t.startsAt || t.startTime,
        registrationEndsAt: t.registrationEndsAt || t.registrationDeadline,
        currentParticipants: t.currentParticipants || t.registeredTeams || 0,
        maxParticipants: t.maxParticipants || t.maxTeams || 100,
        entryFee: (Number(t.entryFee) || 0) / 100,
        prizePool: (Number(t.prizePool) || 0) / 100,
        prizePerKill: (Number(t.prizePerKill) || 0) / 100,
        firstPrice: (Number(t.firstPrice) || 0) / 100,
        secondPrice: (Number(t.secondPrice) || 0) / 100,
        thirdPrice: (Number(t.thirdPrice) || 0) / 100,
        prizeDistribution: prizes,
        roomId: t.roomId || '',
        roomPassword: t.roomPassword || '',
        thumbnailUrl: t.thumbnailUrl || defaultThumbnail,
        status: (t.status === 'open' ? 'REGISTRATION_OPEN' : t.status?.toUpperCase()) || 'APPROVED'
      };

      console.log('✅ Tournament updated and normalized:', normalizedTournament.id);
      return normalizedTournament;
    } catch (error: any) {
      console.error('❌ Update tournament error:', error);
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);

// Delete Tournament Async Thunk
export const deleteTournament = createAsyncThunk(
  'tournament/deleteTournament',
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { user: { token: string | null } };
      const token = state.user.token || localStorage.getItem('auth_token');

      if (!token) {
        throw new Error('Authentication required');
      }

      const url = `/api/tournaments/${id}`;
      console.log('📡 Deleting tournament via Proxy at:', url);

      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      console.log('📡 Delete response status:', response.status);

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.message || `Server error: ${response.status}`);
      }

      console.log('✅ Tournament deleted successfully:', id);
      return id;
    } catch (error: any) {
      console.error('❌ Delete tournament error:', error);
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);

// Fetch Organized Tournaments (for Organizer Dashboard)
export const fetchOrganizedTournaments = createAsyncThunk(
  'tournament/fetchOrganizedTournaments',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { user: { token: string | null } };
      const token = state.user.token || localStorage.getItem('auth_token');

      if (!token) {
        throw new Error('Authentication required');
      }

      const url = '/api/tournaments/my/organized';
      console.log('📡 Fetching organized tournaments via Proxy at:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      const contentType = response.headers.get('content-type');
      let data: any = null;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      }

      if (!response.ok) {
        throw new Error(data?.message || `Server error: ${response.status}`);
      }

      const tourneyList = Array.isArray(data)
        ? data
        : data?.tournaments || data?.data || data?.items || [];

      // Unified normalization logic
      const normalizedTourneys = tourneyList.map((t: any) => {
        let prizes = [];
        if (t.prizeDistribution && !Array.isArray(t.prizeDistribution)) {
          prizes = Object.entries(t.prizeDistribution).map(([key, val]) => ({
            position: key === 'first' ? 1 : key === 'second' ? 2 : key === 'third' ? 3 : 0,
            amount: Number(val) / 100,
            label: key.toUpperCase()
          })).sort((a, b) => a.position - b.position);
        } else {
          prizes = t.prizeDistribution || [];
        }

        // Fallback: Synthesize from fixed price fields if array is empty
        if (prizes.length === 0 && (Number(t.firstPrice) > 0 || Number(t.secondPrice) > 0 || Number(t.thirdPrice) > 0)) {
          if (Number(t.firstPrice) > 0) prizes.push({ position: 1, amount: Number(t.firstPrice), label: '1ST PLACE', color: 'text-amber-500' });
          if (Number(t.secondPrice) > 0) prizes.push({ position: 2, amount: Number(t.secondPrice), label: '2ND PLACE', color: 'text-zinc-400' });
          if (Number(t.thirdPrice) > 0) prizes.push({ position: 3, amount: Number(t.thirdPrice), label: '3RD PLACE', color: 'text-amber-700' });
        }

        const defaultThumbnail = t.game?.includes('PUBG')
          ? (t.format === 'SOLO' ? '/games/pubg.png' : '/games/pubg_classic.png')
          : (t.format === 'SOLO' ? '/games/bgmi_solo.png' : '/games/bgmi_classic.png');

        return {
          ...t,
          id: t.tournamentId || t._id || t.id,
          game: t.game || 'BGMI',
          format: t.format || t.teamType || 'SQUAD',
          startsAt: t.startsAt || t.startTime,
          registrationEndsAt: t.registrationEndsAt || t.registrationDeadline,
          currentParticipants: t.currentParticipants || t.registeredTeams || 0,
          maxParticipants: t.maxParticipants || t.maxTeams || 100,
          entryFee: (Number(t.entryFee) || 0) / 100,
          prizePool: (Number(t.prizePool) || 0) / 100,
          prizePerKill: (Number(t.prizePerKill) || 0) / 100,
          firstPrice: (Number(t.firstPrice) || 0) / 100,
          secondPrice: (Number(t.secondPrice) || 0) / 100,
          thirdPrice: (Number(t.thirdPrice) || 0) / 100,
          prizeDistribution: prizes,
          thumbnailUrl: t.thumbnailUrl || t.thumbnail || t.image || t.posterUrl || defaultThumbnail,
          status: (t.status === 'open' ? 'REGISTRATION_OPEN' : t.status?.toUpperCase()) || 'APPROVED'
        };
      });

      return normalizedTourneys;
    } catch (error: any) {
      console.error('❌ Fetch organized tournaments error:', error);
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);

// Fetch My Registrations (for Participant Dashboard)
export const fetchMyRegistrations = createAsyncThunk(
  'tournament/fetchMyRegistrations',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { user: { token: string | null } };
      const token = state.user.token || localStorage.getItem('auth_token');

      if (!token) {
        throw new Error('Authentication required');
      }

      const url = '/api/tournaments/my/registrations';
      console.log('📡 Fetching my registrations via Proxy at:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      const contentType = response.headers.get('content-type');
      let data: any = null;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      }

      if (!response.ok) {
        throw new Error(data?.message || `Server error: ${response.status}`);
      }

      console.log('📡 [DEBUG] My Registrations Raw Data:', JSON.stringify(data, null, 2));

      let tourneyList: any[] = [];
      
      if (Array.isArray(data)) {
        tourneyList = data;
      } else if (data?.tournaments && Array.isArray(data.tournaments)) {
        tourneyList = data.tournaments;
      } else if (data?.data && Array.isArray(data.data)) {
        tourneyList = data.data;
      } else if (data?.items && Array.isArray(data.items)) {
        tourneyList = data.items;
      } else {
        console.warn('⚠️ Unexpected response format for registrations:', data);
        tourneyList = [];
      }

      // Unified normalization logic
      const normalizedTourneys = tourneyList.map((item: any) => {
        // Handle case where item IS a registration object containing a 'tournament' field
        // If the item itself looks like a tournament (has title/game), use it. Otherwise check for nested tournament.
        const t = (item.title && item.game) ? item : (item.tournament || item);
        
        // If tournament data is missing or empty, return null to filter it out
        // STRICT CHECK: Must have an ID and a Title to be considered valid
        if (!t || (!t._id && !t.id && !t.tournamentId) || !t.title) {
          console.warn('⚠️ Skipping invalid/empty tournament data:', item);
          return null;
        }

        let prizes = [];
        if (t.prizeDistribution && !Array.isArray(t.prizeDistribution)) {
          prizes = Object.entries(t.prizeDistribution).map(([key, val]) => ({
            position: key === 'first' ? 1 : key === 'second' ? 2 : key === 'third' ? 3 : 0,
            amount: Number(val) / 100,
            label: key.toUpperCase()
          })).sort((a, b) => a.position - b.position);
        } else {
          prizes = t.prizeDistribution || [];
        }

        // Fallback: Synthesize from fixed price fields if array is empty
        if (prizes.length === 0 && (Number(t.firstPrice) > 0 || Number(t.secondPrice) > 0 || Number(t.thirdPrice) > 0)) {
          if (Number(t.firstPrice) > 0) prizes.push({ position: 1, amount: Number(t.firstPrice), label: '1ST PLACE', color: 'text-amber-500' });
          if (Number(t.secondPrice) > 0) prizes.push({ position: 2, amount: Number(t.secondPrice), label: '2ND PLACE', color: 'text-zinc-400' });
          if (Number(t.thirdPrice) > 0) prizes.push({ position: 3, amount: Number(t.thirdPrice), label: '3RD PLACE', color: 'text-amber-700' });
        }

        const defaultThumbnail = t.game?.includes('PUBG')
          ? (t.format === 'SOLO' ? '/games/pubg.png' : '/games/pubg_classic.png')
          : (t.format === 'SOLO' ? '/games/bgmi_solo.png' : '/games/bgmi_classic.png');

        return {
          ...t,
          id: t.tournamentId || t._id || t.id,
          game: t.game || 'BGMI',
          format: t.format || t.teamType || 'SQUAD',
          startsAt: t.startsAt || t.startTime,
          registrationEndsAt: t.registrationEndsAt || t.registrationDeadline,
          currentParticipants: t.currentParticipants || t.registeredTeams || 0,
          maxParticipants: t.maxParticipants || t.maxTeams || 100,
          entryFee: (Number(t.entryFee) || 0) / 100,
          prizePool: (Number(t.prizePool) || 0) / 100,
          prizePerKill: (Number(t.prizePerKill) || 0) / 100,
          firstPrice: (Number(t.firstPrice) || 0) / 100,
          secondPrice: (Number(t.secondPrice) || 0) / 100,
          thirdPrice: (Number(t.thirdPrice) || 0) / 100,
          prizeDistribution: prizes,
          thumbnailUrl: t.thumbnailUrl || t.thumbnail || t.image || t.posterUrl || defaultThumbnail,
          status: (t.status === 'open' ? 'REGISTRATION_OPEN' : t.status?.toUpperCase()) || 'APPROVED'
        };
      }).filter(Boolean);

      return normalizedTourneys;
    } catch (error: any) {
      console.error('❌ Fetch my registrations error:', error);
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);

// Fetch Registration Details Async Thunk
export const fetchRegistrationDetails = createAsyncThunk(
  'tournament/fetchRegistrationDetails',
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { user: { token: string | null } };
      const token = state.user.token || localStorage.getItem('auth_token');

      if (!token) {
        throw new Error('Authentication required');
      }

      const url = `/api/tournaments/${id}/my-registration`;
      console.log('📡 Fetching registration details via Proxy at:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      const contentType = response.headers.get('content-type');
      let data: any = null;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      }

      if (!response.ok) {
        throw new Error(data?.message || `Server error: ${response.status}`);
      }

      console.log('✅ Fetched registration details:', data);
      return data;
    } catch (error: any) {
      console.error('❌ Fetch registration details error:', error);
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);

// Fetch Tournament Participants Async Thunk
export const fetchTournamentParticipants = createAsyncThunk(
  'tournament/fetchTournamentParticipants',
  async (id: string, { rejectWithValue }) => {
    try {
      // Use local Next.js proxy to avoid CORS
      const url = `/api/tournaments/${id}/participants`;
      console.log('📡 Fetching tournament participants via Proxy at:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const contentType = response.headers.get('content-type');
      let data: any = null;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      }

      if (!response.ok) {
        throw new Error(data?.message || `Server error: ${response.status}`);
      }

      const tourneyParticipants = Array.isArray(data)
        ? data
        : data?.participants || data?.data || data?.items || [];

      console.log('✅ Fetched and normalized tournament participants:', tourneyParticipants.length);
      return tourneyParticipants;
    } catch (error: any) {
      console.error('❌ Fetch tournament participants error:', error);
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);

const tournamentSlice = createSlice({
  name: 'tournament',
  initialState,
  reducers: {
    clearTournamentError: (state) => {
      state.error = null;
    },
    clearCreateSuccess: (state) => {
      state.createSuccess = false;
    },
    setCurrentTournament: (state, action: PayloadAction<any>) => {
      state.currentTournament = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Tournament
      .addCase(createTournament.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.createSuccess = false;
      })
      .addCase(createTournament.fulfilled, (state, action) => {
        state.loading = false;
        state.createSuccess = true;
        state.currentTournament = action.payload;
        state.tournaments.unshift(action.payload);
      })
      .addCase(createTournament.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.createSuccess = false;
      })
      // Fetch Tournaments
      .addCase(fetchTournaments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTournaments.fulfilled, (state, action) => {
        state.loading = false;
        state.tournaments = action.payload;
      })
      .addCase(fetchTournaments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Single Tournament
      .addCase(fetchTournamentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTournamentById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTournament = action.payload;
      })
      .addCase(fetchTournamentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Tournament
      .addCase(updateTournament.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTournament.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTournament = action.payload;
        // Update item in the list if it exists
        const index = state.tournaments.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.tournaments[index] = action.payload;
        }
      })
      .addCase(updateTournament.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete Tournament
      .addCase(deleteTournament.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTournament.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.tournaments = state.tournaments.filter(t => t.id !== action.payload);
        if (state.currentTournament?.id === action.payload) {
          state.currentTournament = null;
        }
      })
      .addCase(deleteTournament.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Organized Tournaments
      .addCase(fetchOrganizedTournaments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrganizedTournaments.fulfilled, (state, action) => {
        state.loading = false;
        state.organizedTournaments = action.payload;
      })
      .addCase(fetchOrganizedTournaments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch My Registrations
      .addCase(fetchMyRegistrations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyRegistrations.fulfilled, (state, action) => {
        state.loading = false;
        state.myRegistrations = action.payload;
      })
      .addCase(fetchMyRegistrations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Registration Details
      .addCase(fetchRegistrationDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentRegistration = null;
      })
      .addCase(fetchRegistrationDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRegistration = action.payload;
      })
      .addCase(fetchRegistrationDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Tournament Participants
      .addCase(fetchTournamentParticipants.pending, (state) => {
        // We don't want global loading state to flicker for this background fetch
        // state.loading = true; 
        state.error = null;
        state.currentTournamentParticipants = [];
      })
      .addCase(fetchTournamentParticipants.fulfilled, (state, action) => {
        // state.loading = false;
        state.currentTournamentParticipants = action.payload;
      })
      .addCase(fetchTournamentParticipants.rejected, (state, action) => {
        // state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearTournamentError, clearCreateSuccess, setCurrentTournament } = tournamentSlice.actions;
export default tournamentSlice.reducer;
