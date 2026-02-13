'use client';

import { createContext, useContext, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/lib/redux/store';
import { fetchUser, logoutUser, setUser, setToken, performLogout } from '@/app/lib/redux/slices/userSlice';
import type { User, UserRole } from '@/app/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  loginWithGoogle: (role?: UserRole, redirectPath?: string) => void;
  register: (data: any) => Promise<boolean>;
  logout: () => void;
  updateProfile: (profile: Partial<User['gamingProfile']>) => Promise<boolean>;
  submitOrganizerApplication: (application: Omit<User['organizerApplication'], 'id' | 'status' | 'submittedAt'>) => Promise<boolean>;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function useOptionalAuth() {
  return useContext(AuthContext);
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { currentUser, loading, isAuthenticated } = useSelector((state: RootState) => state.user);

  const login = useCallback(async (email: string, password: string): Promise<User | null> => {
    // Email/password login is not supported - only Google login is available
    return null;
  }, []);

  const loginWithGoogle = useCallback((role?: UserRole, redirectPath?: string) => {
    // Store the intended redirect path and role in localStorage so we can use it after backend redirect
    if (typeof window !== 'undefined') {
      if (redirectPath) {
        localStorage.setItem('auth_redirect_path', redirectPath);
      }
      if (role) {
        localStorage.setItem('auth_selected_role', role);
      }
    }

    // Use local proxy route instead of direct backend to handle redirects properly
    const baseUrl = '/api/auth/google';

    const params = new URLSearchParams();
    
    // Explicitly set the OAuth callback URL to the frontend proxy
    // This tells the backend (if configured to listen) to use THIS url for Google redirect_uri
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;
      const callbackUrl = `${origin}/api/auth/google/callback`;
      params.set('callbackUrl', callbackUrl);
      // Some backends check redirect_uri param for the OAuth redirect
      params.set('redirect_uri', callbackUrl); 
    }
    
    // Fix: Send absolute URL for redirect so backend knows where to return (prevents localhost issue)
    const origin = window.location.origin;
    const finalRedirect = redirectPath 
      ? (redirectPath.startsWith('http') ? redirectPath : new URL(redirectPath, origin).toString())
      : new URL('/participant/dashboard', origin).toString();
      
    params.set('redirect', finalRedirect);
    if (role) params.set('role', role);

    const url = `${baseUrl}?${params.toString()}`;
    window.location.href = url;
  }, []);

  const register = useCallback(async (data: any): Promise<boolean> => {
    console.warn("Register is handled via Google Auth flow.");
    return false;
  }, []);

  const router = useRouter();

  const logout = useCallback(() => {
    dispatch(performLogout());
    router.push('/');
  }, [dispatch, router]);

  const updateProfile = useCallback(async (profile: Partial<User['gamingProfile']>): Promise<boolean> => {
    // Implement actual API call here if needed
    return true;
  }, []);

  const submitOrganizerApplication = useCallback(async (application: any): Promise<boolean> => {
    // Implement actual API call here if needed
    return true;
  }, []);

  const switchRole = useCallback((role: UserRole) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, role };
      dispatch(setUser(updatedUser)); // We need to export setUser from slice
    }
  }, [currentUser, dispatch]);

  return (
    <AuthContext.Provider
      value={{
        user: currentUser,
        isLoading: loading,
        isAuthenticated,
        login,
        loginWithGoogle,
        register,
        logout,
        updateProfile,
        submitOrganizerApplication,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

