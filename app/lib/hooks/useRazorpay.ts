'use client';

import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setPaymentSuccess, verifyPayment } from '@/app/lib/redux/slices/paymentSlice';
import { AppDispatch } from '@/app/lib/redux/store';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const useRazorpay = () => {
  const dispatch = useDispatch<AppDispatch>();

  const openRazorpay = useCallback((options: any, registrationId: string | null) => {
    if (!window.Razorpay) {
      console.error('Razorpay SDK not loaded');
      alert('Payment system is not available right now. Please try again later.');
      return;
    }

    const razorpayOptions = {
      ...options,
      handler: function (response: any) {
        console.log('✅ Payment Authorized from SDK:', response);
        
        if (registrationId) {
          console.log('📡 Dispatching Verify Payment...');
          dispatch(verifyPayment({
            registrationId,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature
          }));
        } else {
          console.warn('⚠️ No registrationId found, setting local success only.');
          dispatch(setPaymentSuccess(true));
        }
      },

      modal: {
        ondismiss: function () {
          console.log('❌ Payment Cancelled');
          dispatch(setPaymentSuccess(false));
        },
      },
      theme: {
        color: '#E50914', // Netflix Red
      },
    };

    const rzp = new window.Razorpay(razorpayOptions);
    rzp.open();
  }, [dispatch]);

  return { openRazorpay };
};
