import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface TeamMember {
  userId: string;
  name: string;
  role: 'LEADER' | 'MEMBER';
  bgmiId?: string;
  pubgId?: string;
}

export interface JoinTournamentPayload {
  tournamentId: string;
  teamName: string;
  teamMembers: TeamMember[];
}

interface JoinTournamentState {
  loading: boolean;
  success: boolean;
  error: string | null;
  registrationData: any | null;
}

const initialState: JoinTournamentState = {
  loading: false,
  success: false,
  error: null,
  registrationData: null,
};

export const joinTournament = createAsyncThunk(
  'joinTournament/join',
  async (payload: JoinTournamentPayload, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { user: { token: string | null } };
      const token = state.user.token || localStorage.getItem('auth_token');

      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }

      const { tournamentId, ...body } = payload;
      const url = `/api/tournaments/${tournamentId}/join`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to join tournament');
      }

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);

const joinTournamentSlice = createSlice({
  name: 'joinTournament',
  initialState,
  reducers: {
    resetJoinState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(joinTournament.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(joinTournament.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.registrationData = action.payload;
      })
      .addCase(joinTournament.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });
  },
});

export const { resetJoinState } = joinTournamentSlice.actions;
export default joinTournamentSlice.reducer;
