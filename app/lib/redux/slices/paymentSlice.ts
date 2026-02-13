import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface PaymentConfig {
  keyId: string;
  amount: number;
  currency: string;
  orderId: string;
  name: string;
  description: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
}

interface PaymentState {
  loading: boolean;
  config: PaymentConfig | null;
  registrationId: string | null;
  error: string | null;
  paymentSuccess: boolean;
}

const initialState: PaymentState = {
  loading: false,
  config: null,
  registrationId: null,
  error: null,
  paymentSuccess: false,
};

export const fetchPaymentConfig = createAsyncThunk(
  'payment/fetchConfig',
  async (tournamentId: string | undefined, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { user: { token: string | null } };
      const token = state.user.token || localStorage.getItem('auth_token');

      if (!token) {
        throw new Error('Authentication required');
      }

      let url = '/api/payments/config';
      if (tournamentId) {
        url += `?tournamentId=${tournamentId}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });


      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch payment config');
      }

      // Auto-extract from data wrapper if present
      const config = data.data || data.config || data.paymentConfig || data;

      // Ensure field normalization for Razorpay
      // IMPORTANT: Backend sends amount in Rupees, Razorpay needs Paise
      const normalizedConfig: PaymentConfig = {
        keyId: config.keyId || config.key_id || config.keyID || config.key || '',
        amount: (Number(config.amount) || 0) * 100, 
        currency: config.currency || 'INR',
        orderId: config.orderId || config.order_id || config.orderID || config.order || '',
        name: config.name || 'BGMI Tournament Platform',
        description: config.description || 'Tournament Registration Fee',
        prefill: {
          name: config.prefill?.name || '',
          email: config.prefill?.email || '',
          contact: config.prefill?.contact || config.prefill?.phone || '',
        },
      };

      console.log('✅ Normalized Payment Config (Rupees -> Paise):', normalizedConfig);
      return normalizedConfig;

    } catch (error: any) {
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);

export const verifyPayment = createAsyncThunk(
  'payment/verify',
  async (
    payload: { 
      registrationId: string; 
      razorpay_payment_id: string; 
      razorpay_order_id: string; 
      razorpay_signature: string; 
    }, 
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as { user: { token: string | null } };
      const token = state.user.token || localStorage.getItem('auth_token');

      const response = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Payment verification failed');
      }

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Verification failed');
    }
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    setPaymentSuccess: (state, action: PayloadAction<boolean>) => {
      state.paymentSuccess = action.payload;
    },
    setRegistrationId: (state, action: PayloadAction<string | null>) => {
      state.registrationId = action.payload;
    },
    resetPaymentState: (state) => {
      state.loading = false;
      state.config = null;
      state.registrationId = null;
      state.error = null;
      state.paymentSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPaymentConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentConfig.fulfilled, (state, action) => {
        state.loading = false;
        state.config = action.payload;
      })
      .addCase(fetchPaymentConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Verify Payment
      .addCase(verifyPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state) => {
        state.loading = false;
        state.paymentSuccess = true;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setPaymentSuccess, setRegistrationId, resetPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;
