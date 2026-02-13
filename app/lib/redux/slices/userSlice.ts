import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/app/types';

interface UserState {
  currentUser: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const getInitialToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('auth_token');
    }
    return null;
};

const getInitialUser = (): User | null => {
    if (typeof window !== 'undefined') {
        const userData = localStorage.getItem('user_data');
        if (userData) {
            try {
                return JSON.parse(userData);
            } catch (e) {
                console.error('Failed to parse user data from localStorage', e);
                return null;
            }
        }
    }
    return null;
};

const initialState: UserState = {
  currentUser: getInitialUser(),
  token: getInitialToken(),
  loading: false, 
  error: null,
  isAuthenticated: !!getInitialToken(),
};

export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { user: UserState };
    const { currentUser } = state.user;

    // If we have currentUser, return it early. 
    // fetchUser is now a smart no-op since capture happens in dashboards/success pages.
    if (currentUser) {
      return currentUser;
    }

    return rejectWithValue('No session sync endpoint available');
  }
);

export const performLogout = createAsyncThunk(
  'user/logout',
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      const state = getState() as { user: UserState };
      const token = state.user.token;

      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
      
      dispatch(logoutUser());
      return true;
    } catch (error: any) {
      console.error('Logout error:', error);
      // Even if API fails, we clear local session
      dispatch(logoutUser());
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.currentUser = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_data');
      }
    },
    setUser: (state, action: PayloadAction<User>) => {
        state.currentUser = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
        if (typeof window !== 'undefined') {
            localStorage.setItem('user_data', JSON.stringify(action.payload));
        }
    },
    setToken: (state, action: PayloadAction<string>) => {
        state.token = action.payload;
        state.isAuthenticated = true;
        if (typeof window !== 'undefined') {
            localStorage.setItem('auth_token', action.payload);
        }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        // Only show loading if we don't have a user yet
        if (!state.currentUser) {
          state.loading = true;
          state.error = null;
        }
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.currentUser = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        // We don't clear the token on rejection anymore because fetchUser might fail 
        // simply because the endpoint doesn't exist.
        // Re-authentication should only happen if the token is actually invalid (401).
      });
  },
});

export const { logoutUser, setUser, setToken } = userSlice.actions;
export default userSlice.reducer;
