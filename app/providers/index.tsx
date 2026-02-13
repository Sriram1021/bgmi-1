'use client';

import { AuthProvider } from './auth-provider';
import { QueryProvider } from './query-provider';
import { ReduxProvider } from './redux-provider';
import { ToastProvider } from '@/app/components/ui/toast';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ReduxProvider>
      <QueryProvider>
        <AuthProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </AuthProvider>
    </QueryProvider>
    </ReduxProvider>
  );
}

