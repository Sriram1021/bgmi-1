'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/providers/auth-provider';
import {
  Gamepad2,
  Mail,
  Lock,
  User,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Trophy,
  Users,
  ShieldCheck,
  Building,
  ArrowLeft,
  Smartphone,
  MapPin,
  Calendar,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { cn } from '@/app/lib/utils';

type Step = 'role' | 'credentials' | 'verification' | 'complete';
type Role = 'PLAYER' | 'ORGANIZER';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [step, setStep] = useState<Step>('role');
  const [role, setRole] = useState<Role>('PLAYER');

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    ageVerified: false,
    state: '',
    acceptedTerms: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    if (!formData.ageVerified || !formData.acceptedTerms) {
      setError('You must be 18+ and accept terms to join.');
      setIsLoading(false);
      return;
    }

    try {
      // Simulate registration
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Mock login after register
      await login(formData.email, formData.password);
      setStep('complete');
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex flex-col lg:flex-row overflow-hidden text-zinc-900">

      {/* Left Side: Progress & Info */}
      <div className="hidden lg:flex lg:w-[40%] bg-zinc-50 relative p-12 lg:p-24 flex-col justify-between overflow-hidden border-r border-zinc-100">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(229,9,20,0.05),transparent_70%)]" />
          <div className="absolute inset-0 bg-[url('/images/hero-grid.png')] opacity-[0.03] grayscale" />
        </div>

        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 text-netflix-red font-black text-sm lg:text-xl mb-16 uppercase tracking-[0.2em] group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            BACK TO HOME
          </Link>

          <h1 className="text-6xl lg:text-8xl font-bold text-zinc-900 tracking-widest leading-[0.9] mb-12 uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            START YOUR<br />
            <span className="text-netflix-red">JOURNEY</span>
          </h1>

          {/* Progress Steps */}
          <div className="space-y-10 lg:space-y-12">
            <ProgressStep
              num="01"
              label="Choose Role"
              active={step === 'role'}
              completed={step !== 'role'}
            />
            <ProgressStep
              num="02"
              label="Account Details"
              active={step === 'credentials'}
              completed={step === 'verification' || step === 'complete'}
            />
            <ProgressStep
              num="03"
              label="Verify Info"
              active={step === 'verification'}
              completed={step === 'complete'}
            />
          </div>
        </div>

        <div className="relative z-10 pt-12 border-t border-zinc-100">
          <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px] sm:text-[11px] leading-relaxed">
            By creating an account, you join India&apos;s largest community of BGMI & PUBG players. Win cash prizes and build your legacy.
          </p>
        </div>
      </div>

      {/* Right Side: Form Content */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-20 relative bg-white">
        <div className="w-full max-w-md space-y-8 sm:space-y-12">

          <div className="lg:hidden flex justify-between items-center mb-8">
            <Link href="/" className="text-netflix-red font-black text-[10px] uppercase tracking-widest">ARENA</Link>
            <div className="flex gap-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    (step === 'role' && s === 1) || (step === 'credentials' && s === 2) || (step === 'verification' && s === 3) || step === 'complete'
                      ? "bg-netflix-red shadow-sm"
                      : "bg-zinc-100"
                  )}
                />
              ))}
            </div>
          </div>

          {step === 'role' && (
            <div className="space-y-8 sm:space-y-12 animate-fade-in">
              <div className="space-y-4 sm:space-y-6 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-4">
                  <div className="w-1 h-8 sm:w-1.5 sm:h-10 bg-netflix-red rounded-full" />
                  <h2 className="text-3xl sm:text-5xl font-black text-zinc-900 uppercase tracking-widest leading-tight">I WANT TO...</h2>
                </div>
                <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px] sm:text-sm">Select how you want to use the platform</p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <RoleCard
                  active={role === 'PLAYER'}
                  onClick={() => setRole('PLAYER')}
                  icon={<Trophy className="w-10 h-10" />}
                  title="JOIN MATCHES"
                  desc="Play BGMI & PUBG to win cash prizes"
                  color="text-netflix-blue"
                />
                <RoleCard
                  active={role === 'ORGANIZER'}
                  onClick={() => setRole('ORGANIZER')}
                  icon={<Users className="w-10 h-10" />}
                  title="HOST MATCHES"
                  desc="Create tournaments and earn from hosting"
                  color="text-netflix-red"
                />
              </div>

              <button
                onClick={() => setStep('credentials')}
                className="w-full py-5 sm:py-6 bg-netflix-red hover:bg-[#b00710] text-white text-[10px] sm:text-sm font-black rounded-xl sm:rounded-2xl transition-all uppercase tracking-[0.2em] shadow-xl shadow-red-500/10 active:scale-95 group flex items-center justify-center gap-2 sm:gap-3"
              >
                CONTINUE TO NEXT STEP <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {step === 'credentials' && (
            <div className="space-y-8 sm:space-y-12 animate-fade-in">
              <div className="space-y-4 sm:space-y-6 text-center lg:text-left">
                <button
                  onClick={() => setStep('role')}
                  className="flex items-center justify-center lg:justify-start gap-2 text-zinc-400 hover:text-zinc-900 transition-colors text-[9px] sm:text-[10px] font-black uppercase tracking-widest mx-auto lg:mx-0"
                >
                  <ChevronLeft className="w-4 h-4" /> BACK TO ROLE
                </button>
                <div className="flex items-center justify-center lg:justify-start gap-4">
                  <div className="w-1 h-8 sm:w-1.5 sm:h-10 bg-netflix-red rounded-full" />
                  <h2 className="text-3xl sm:text-5xl font-black text-zinc-900 uppercase tracking-widest leading-tight">ACCOUNT INFO</h2>
                </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-6">
                  <InputGroup
                    label="Username"
                    icon={<User className="w-5 h-5" />}
                    placeholder="Enter unique username"
                    value={formData.username}
                    onChange={(val) => setFormData({ ...formData, username: val })}
                  />
                  <InputGroup
                    label="Email Address"
                    icon={<Mail className="w-5 h-5" />}
                    placeholder="name@email.com"
                    type="email"
                    value={formData.email}
                    onChange={(val) => setFormData({ ...formData, email: val })}
                  />
                  <InputGroup
                    label="Create Password"
                    icon={<Lock className="w-5 h-5" />}
                    placeholder="••••••••"
                    type="password"
                    value={formData.password}
                    onChange={(val) => setFormData({ ...formData, password: val })}
                  />
                  <InputGroup
                    label="Confirm Password"
                    icon={<Lock className="w-5 h-5" />}
                    placeholder="••••••••"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(val) => setFormData({ ...formData, confirmPassword: val })}
                  />
                </div>

                <button
                  onClick={() => setStep('verification')}
                  className="w-full py-5 sm:py-6 bg-netflix-red hover:bg-[#b00710] text-white text-[10px] sm:text-sm font-black rounded-xl sm:rounded-2xl transition-all uppercase tracking-[0.2em] shadow-xl shadow-red-500/10 active:scale-95 group flex items-center justify-center gap-2 sm:gap-3"
                >
                  NEXT: VERIFY DETAILS <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          )}

          {step === 'verification' && (
            <div className="space-y-8 sm:space-y-12 animate-fade-in">
              <div className="space-y-4 sm:space-y-6 text-center lg:text-left">
                <button
                  onClick={() => setStep('credentials')}
                  className="flex items-center justify-center lg:justify-start gap-2 text-zinc-400 hover:text-zinc-900 transition-colors text-[9px] sm:text-[10px] font-black uppercase tracking-widest mx-auto lg:mx-0"
                >
                  <ChevronLeft className="w-4 h-4" /> BACK TO ACCOUNT
                </button>
                <div className="flex items-center justify-center lg:justify-start gap-4">
                  <div className="w-1 h-8 sm:w-1.5 sm:h-10 bg-netflix-red rounded-full" />
                  <h2 className="text-3xl sm:text-5xl font-black text-zinc-900 uppercase tracking-widest leading-tight">FINAL CHECK</h2>
                </div>
              </div>

              <form onSubmit={handleRegister} className="space-y-10">
                {error && (
                  <div className="p-5 bg-netflix-red/10 border border-netflix-red/20 rounded-2xl flex items-center gap-4 text-netflix-red text-[11px] font-black uppercase tracking-widest animate-shake">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    {error}
                  </div>
                )}

                <div className="space-y-6">
                  {/* State Select */}
                  <div className="space-y-2 sm:space-y-3">
                    <label className="text-[9px] sm:text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] ml-2">Your State (India)</label>
                    <div className="relative group">
                      <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-zinc-400 group-focus-within:text-netflix-red transition-colors" />
                      <select
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full bg-zinc-50 border border-zinc-100 rounded-xl sm:rounded-2xl py-4 sm:py-5 pl-12 sm:pl-14 pr-6 text-xs sm:text-sm font-bold text-zinc-900 focus:outline-none focus:border-netflix-red/30 transition-all appearance-none cursor-pointer shadow-sm"
                        required
                      >
                        <option value="">Select State</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Karnataka">Karnataka</option>
                        {/* More states... */}
                      </select>
                    </div>
                  </div>

                  {/* Checkboxes */}
                  <div className="space-y-6 pt-4">
                    <CheckboxGroup
                      checked={formData.ageVerified}
                      onChange={(val) => setFormData({ ...formData, ageVerified: val })}
                      label="I am 18 years or older"
                    />
                    <CheckboxGroup
                      checked={formData.acceptedTerms}
                      onChange={(val) => setFormData({ ...formData, acceptedTerms: val })}
                      label="I accept all Platform Rules and Terms"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-5 sm:py-6 bg-netflix-red hover:bg-[#b00710] text-white text-[10px] sm:text-sm font-black rounded-xl sm:rounded-2xl transition-all uppercase tracking-[0.2em] shadow-xl shadow-red-500/10 active:scale-95 group flex items-center justify-center gap-2 sm:gap-3"
                >
                  {isLoading ? 'INITIATING DEPLOYMENT...' : 'FINISH REGISTRATION'}
                </button>
              </form>
            </div>
          )}

          {step === 'complete' && (
            <div className="text-center space-y-8 sm:space-y-10 animate-fade-in">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto shadow-sm border border-green-100">
                <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-green-500" />
              </div>
              <div className="space-y-3 sm:space-y-4">
                <h2 className="text-4xl sm:text-6xl font-black text-zinc-900 uppercase tracking-widest leading-tight">WELCOME!</h2>
                <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px] sm:text-sm">Your account has been created successfully.</p>
              </div>
              <button
                onClick={() => router.push(role === 'PLAYER' ? '/tournaments' : '/organizer/dashboard')}
                className="w-full py-5 sm:py-6 bg-netflix-red hover:bg-[#b00710] text-white text-[10px] sm:text-sm font-black rounded-xl sm:rounded-2xl transition-all uppercase tracking-[0.2em] shadow-xl shadow-red-500/10 active:scale-95 flex items-center justify-center gap-2 sm:gap-3"
              >
                {role === 'PLAYER' ? 'EXPLORE TOURNAMENTS' : 'GO TO DASHBOARD'} <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Login Link */}
          {step !== 'complete' && (
            <div className="pt-8 sm:pt-12 border-t border-zinc-100 text-center">
              <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px] sm:text-[11px]">
                Already have an account?{' '}
                <Link href="/login" className="text-zinc-900 hover:text-netflix-red transition-colors underline underline-offset-[12px] decoration-1 ml-2">
                  Sign In Here
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Sub-components
function ProgressStep({ num, label, active, completed }: { num: string; label: string; active: boolean; completed: boolean }) {
  return (
    <div className={cn(
      "flex items-center gap-6 transition-all duration-500",
      active ? "translate-x-4" : "opacity-40"
    )}>
      <div className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm transition-all",
        completed ? "bg-green-500 text-white" : active ? "bg-netflix-red text-white shadow-lg shadow-red-500/10" : "bg-white text-zinc-400 border border-zinc-100"
      )}>
        {completed ? <CheckCircle2 className="w-6 h-6" /> : num}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-netflix-red">STEP {num}</p>
        <p className="text-lg font-black uppercase tracking-widest text-zinc-900">{label}</p>
      </div>
    </div>
  );
}

function RoleCard({ active, onClick, icon, title, desc, color }: { active: boolean; onClick: () => void; icon: any; title: string; desc: string; color: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full p-6 sm:p-8 rounded-2xl sm:rounded-[2rem] border transition-all text-left flex items-center gap-6 sm:gap-8 group",
        active ? "bg-white border-zinc-200 shadow-xl" : "bg-zinc-50 border-zinc-100 hover:bg-white hover:border-zinc-200"
      )}
    >
      <div className={cn(
        "w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-[1.5rem] flex items-center justify-center transition-all group-hover:scale-110",
        active ? "bg-zinc-50 border border-zinc-100" : "bg-white border border-zinc-50"
      )}>
        <div className={cn(active ? color : "text-zinc-300", "transition-colors")}>
          {icon}
        </div>
      </div>
      <div>
        <h3 className={cn("text-xl sm:text-2xl font-black uppercase tracking-widest mb-1 sm:mb-2", active ? "text-zinc-900" : "text-zinc-400 font-bold")}>{title}</h3>
        <p className="text-[10px] sm:text-[11px] font-black text-zinc-400 uppercase tracking-widest">{desc}</p>
      </div>
      {active && <div className="ml-auto w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-netflix-red shadow-sm" />}
    </button>
  );
}

function InputGroup({ label, icon, placeholder, value, onChange, type = 'text' }: { label: string; icon: any; placeholder: string; value: string; onChange: (val: string) => void; type?: string }) {
  return (
    <div className="space-y-2 sm:space-y-3 font-medium">
      <label className="text-[9px] sm:text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] ml-2">{label}</label>
      <div className="relative group text-sm">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-netflix-red transition-colors">
          {icon}
        </div>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-zinc-50 border border-zinc-100 rounded-xl sm:rounded-2xl py-4 sm:py-5 pl-12 sm:pl-14 pr-6 text-xs sm:text-sm font-bold text-zinc-900 placeholder:text-zinc-300 focus:outline-none focus:border-netflix-red/30 focus:bg-white shadow-sm transition-all"
        />
      </div>
    </div>
  );
}

function CheckboxGroup({ checked, onChange, label }: { checked: boolean; onChange: (val: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-4 sm:gap-5 cursor-pointer group">
      <div className={cn(
        "w-6 h-6 sm:w-7 sm:h-7 rounded-lg border-2 flex items-center justify-center transition-all",
        checked ? "bg-netflix-red border-netflix-red shadow-sm" : "bg-zinc-50 border-zinc-100 group-hover:border-zinc-200"
      )}>
        <input
          type="checkbox"
          className="hidden"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        {checked && <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />}
      </div>
      <span className={cn("text-[10px] sm:text-[11px] font-black uppercase tracking-widest", checked ? "text-zinc-900" : "text-zinc-400 transition-colors group-hover:text-zinc-500")}>
        {label}
      </span>
    </label>
  );
}
