'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setToken, setUser } from '@/app/lib/redux/slices/userSlice';
import { AppDispatch } from '@/app/lib/redux/store';

function OrganizerAuthSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const token = searchParams.get('token');
    const urlUser = searchParams.get('user');
    const urlEmail = searchParams.get('email');
    const urlId = searchParams.get('id') || searchParams.get('userId');
    const urlName = searchParams.get('name') || searchParams.get('displayName');
    const urlRole = searchParams.get('role');

    if (token) {
        // 1. Capture Token
        dispatch(setToken(token));
        
        // 2. Handle User Data
        const savedRole = localStorage.getItem('auth_selected_role');
        const finalRole = (urlRole?.toUpperCase() as any) || savedRole || 'ORGANIZER';

        if (urlUser) {
          try {
            const parsedUser = JSON.parse(decodeURIComponent(urlUser));
            dispatch(setUser(parsedUser));
          } catch (e) {
            console.error('Failed to parse user from URL', e);
          }
        } else if (urlEmail || urlId) {
          // Construct partial user
          const partialUser: any = {
            id: urlId || 'unknown',
            email: urlEmail || '',
            name: urlName || '',
            displayName: urlName || urlEmail?.split('@')[0] || 'User',
            role: finalRole as any,
            avatarUrl: null,
            createdAt: new Date().toISOString(),
          };
          dispatch(setUser(partialUser));
        }

        // 3. Determine Final Redirect
        const intendedRedirect = localStorage.getItem('auth_redirect_path');
        localStorage.removeItem('auth_redirect_path');
        localStorage.removeItem('auth_selected_role');
        
        if (intendedRedirect) {
          router.replace(intendedRedirect);
        } else {
          router.replace('/organizer/dashboard');
        }
    } else {
        router.replace('/organizer/dashboard');
    }
  }, [searchParams, router, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfcfc]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-netflix-red border-t-transparent rounded-full animate-spin" />
        <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">Authenticating...</p>
      </div>
    </div>
  );
}

export default function OrganizerAuthSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#fcfcfc]">
        <div className="w-12 h-12 border-4 border-netflix-red border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <OrganizerAuthSuccessContent />
    </Suspense>
  );
}
