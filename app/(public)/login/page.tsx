'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/providers/auth-provider';
import {
  Gamepad2,
  Trophy,
  Users,
  Building,
  ShieldCheck,
  CheckCircle2,
  Flame,
  ArrowLeft
} from 'lucide-react';
import { cn } from '@/app/lib/utils';

type LoginRole = 'PLAYER' | 'ORGANIZER' | 'ADMIN';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
   const { loginWithGoogle } = useAuth();

  const redirect = searchParams.get('redirect') || '/';

  const [role, setRole] = useState<LoginRole>('PLAYER');
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = () => {
    setIsLoading(true);
    const roleMap = {
      'PLAYER': 'PARTICIPANT' as const,
      'ORGANIZER': 'ORGANIZER' as const,
      'ADMIN': 'ADMIN' as const,
    };
    const backendRole = roleMap[role];
    const redirectPath = role === 'ORGANIZER' ? '/organizer/dashboard' : role === 'ADMIN' ? '/admin/dashboard' : '/participant/dashboard';
    loginWithGoogle(backendRole, redirectPath);
  };

  const roles: { id: LoginRole; label: string; icon: any; color: string; desc: string }[] = [
    {
      id: 'PLAYER',
      label: 'Player',
      icon: Trophy,
      color: 'text-netflix-blue',
      desc: 'Join tournaments and win cash',
    },
    {
      id: 'ORGANIZER',
      label: 'Organizer',
      icon: Users,
      color: 'text-netflix-red',
      desc: 'Create matches and manage rooms',
    },
    {
      id: 'ADMIN',
      label: 'Admin',
      icon: ShieldCheck,
      color: 'text-premium-purple',
      desc: 'System management and approvals',
    }
  ];

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex flex-col lg:flex-row overflow-hidden text-zinc-900">
      {/* ... Left Side ... */}
      
      {/* Right Side: Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-20 relative bg-white">
        <div className="w-full max-w-md space-y-8 sm:space-y-12">

          <div className="lg:hidden flex justify-between items-center mb-10">
            <Link href="/" className="text-netflix-red font-black text-[10px] uppercase tracking-widest">ARENA</Link>
            <Link href="/register" className="text-zinc-400 font-bold text-[10px] uppercase tracking-widest">JOIN NOW</Link>
          </div>

          {/* Header */}
          <div className="space-y-4 sm:space-y-6 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-4">
              <div className="w-1 h-8 sm:w-1.5 sm:h-10 bg-netflix-red rounded-full" />
              <h2 className="text-3xl sm:text-5xl font-black text-zinc-900 uppercase tracking-widest leading-tight">Sign In</h2>
            </div>
            <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px] sm:text-sm">Enter your account details below</p>
          </div>
          {/* Role Tabs */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 p-1 sm:p-1.5 bg-zinc-50 rounded-2xl sm:rounded-3xl border border-zinc-100">
            {roles.map((r) => (
              <button
                key={r.id}
                onClick={() => setRole(r.id)}
                className={cn(
                  "relative flex flex-col items-center gap-1.5 sm:gap-2 py-3 sm:py-4 rounded-xl sm:rounded-2xl transition-all group overflow-hidden",
                  role === r.id
                    ? "bg-white border border-zinc-100 shadow-md"
                    : "hover:bg-zinc-100/50"
                )}
              >
                {role === r.id && <div className={cn("absolute inset-x-0 top-0 h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-current to-transparent", r.color)} />}
                <r.icon className={cn("w-4 h-4 sm:w-5 sm:h-5", role === r.id ? r.color : "text-zinc-400")} />
                <span className={cn("text-[8px] sm:text-[10px] font-black uppercase tracking-widest", role === r.id ? "text-zinc-900" : "text-zinc-400")}>
                  {r.label}
                </span>
              </button>
            ))}
          </div>
           {/* Google Login Button */}
           <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full py-4 bg-white border-2 border-zinc-100 hover:border-netflix-red/20 hover:bg-zinc-50 text-zinc-900 text-xs sm:text-sm font-black rounded-xl sm:rounded-2xl transition-all uppercase tracking-widest flex items-center justify-center gap-3 group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
          >
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-100/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
             <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
             </svg>
             <span>{isLoading ? 'CONNECTING...' : `Sign in as ${role}`}</span>
           </button>

          {/* Footer */}
          <div className="pt-8 sm:pt-12 border-t border-zinc-100 text-center">
            <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px] sm:text-[11px]">
              New to {role === 'PLAYER' ? 'playing' : 'hosting'}?{' '}
              <Link href="/register" className="text-zinc-900 hover:text-netflix-red transition-colors underline underline-offset-[12px] decoration-1 ml-2">
                Create An Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ icon, text }: { icon: any; text: string }) {
  return (
    <div className="flex items-center gap-5 group">
      <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center border border-zinc-100 group-hover:bg-netflix-red group-hover:border-netflix-red transition-all duration-500">
        <div className="text-zinc-400 group-hover:text-white transition-colors">
          {icon}
        </div>
      </div>
      <p className="text-lg font-black text-zinc-900 uppercase tracking-widest group-hover:text-netflix-red transition-colors leading-tight">{text}</p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#fcfcfc] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-netflix-red border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
