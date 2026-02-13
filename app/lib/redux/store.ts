import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import tournamentReducer from './slices/tournamentSlice';
import profileReducer from './slices/profileSlice';
import joinTournamentReducer from './slices/joinTournamentSlice';
import paymentReducer from './slices/paymentSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    tournament: tournamentReducer,
    profile: profileReducer,
    joinTournament: joinTournamentReducer,
    payment: paymentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
