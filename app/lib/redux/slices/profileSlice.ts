import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface Profile {
  id?: string;
  userId?: string;
  fullName: string;
  phoneNumber: string;
  pubgId?: string;
  bgmiId?: string;
  upiId?: string;
  dateOfBirth?: string;
  kycStatus?: 'NOT_SUBMITTED' | 'PENDING' | 'APPROVED' | 'REJECTED';
  organizationName?: string;
  website?: string;
  description?: string;
  gstNumber?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ProfileState {
  data: Profile | null;
  loading: boolean;
  error: string | null;
  isInitialLoad: boolean;
  hasProfile: boolean;
}

const initialState: ProfileState = {
  data: null,
  loading: false,
  error: null,
  isInitialLoad: true,
  hasProfile: false,
};

export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.user.token;

      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      const response = await fetch('/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        if (response.status === 404) {
          return null; // Profile doesn't exist yet
        }
        throw new Error('Failed to fetch profile');
      }
      const data = await response.json();
      return data?.profile || data?.data || data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createProfile = createAsyncThunk(
  'profile/createProfile',
  async (profileData: Partial<Profile>, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.user.token;

      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create profile');
      }
      const data = await response.json();
      return data?.profile || data?.data || data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (profileData: Partial<Profile>, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.user.token;

      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update profile');
      }
      const data = await response.json();
      return data?.profile || data?.data || data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfileError: (state) => {
      state.error = null;
    },
    resetProfile: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
      state.isInitialLoad = true;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Profile
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action: PayloadAction<Profile | null>) => {
        state.loading = false;
        state.data = action.payload;
        state.hasProfile = !!action.payload;
        state.isInitialLoad = false;
        state.error = null;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isInitialLoad = false;
      })
      // Create Profile
      .addCase(createProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProfile.fulfilled, (state, action: PayloadAction<Profile>) => {
        state.loading = false;
        state.data = action.payload;
        state.hasProfile = true;
        state.error = null;
      })
      .addCase(createProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action: PayloadAction<Profile>) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearProfileError, resetProfile } = profileSlice.actions;

export const selectProfileData = (state: any) => state.profile.data as Profile | null;
export const selectProfileLoading = (state: any) => state.profile.loading as boolean;
export const selectProfileError = (state: any) => state.profile.error as string | null;
export const selectProfileInitialLoad = (state: any) => state.profile.isInitialLoad as boolean;
export const selectHasProfile = (state: any) => state.profile.hasProfile as boolean;

export default profileSlice.reducer;
