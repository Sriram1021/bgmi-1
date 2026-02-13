import Link from 'next/link';
import {
  MessageSquare,
  ShieldCheck,
  Youtube,
  Twitter,
  Instagram,
  ChevronRight,
  Globe,
  Flame,
  LifeBuoy,
  ShieldAlert,
  Zap,
  Radio,
  ExternalLink,
  ArrowUpRight
} from 'lucide-react';
import { cn } from '@/app/lib/utils';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-zinc-100 pt-24 sm:pt-32 pb-16 relative overflow-hidden text-zinc-900">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-netflix-red/[0.02] rounded-full blur-[150px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/[0.02] rounded-full blur-[120px] -z-10" />

      <div className="main-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 mb-24">

          {/* 1. Brand Intel & Social */}
          <div className="lg:col-span-5 space-y-12">
            <Link href="/" className="flex items-center gap-6 group">
              <div className="w-16 h-16 bg-netflix-red rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-xl shadow-red-500/20">
                <Flame className="w-9 h-9 text-white fill-current" />
              </div>
              <div>
                <span className="block text-5xl letter-spacing-[1px] font-black tracking-widest leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>THE ARENA</span>
                <p className="flex items-center gap-3 text-zinc-400 font-bold uppercase tracking-[0.4em] text-[9px] mt-2">
                  <span className="w-8 h-[1px] bg-netflix-red" />
                  PRO GAMING PLATFORM
                </p>
              </div>
            </Link>

            <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest leading-loose max-w-md">
              India's premier tournament engine. Create matches, join tournaments, and win prizes in a professional environment for BGMI and PUBG players.
            </p>

            <div className="flex items-center gap-4">
              <SocialLink icon={<Youtube className="w-5 h-5" />} href="#" />
              <SocialLink icon={<Twitter className="w-5 h-5" />} href="#" />
              <SocialLink icon={<Instagram className="w-5 h-5" />} href="#" />
              <div className="w-[1px] h-8 bg-zinc-100 mx-2" />
              <SocialLink icon={<MessageSquare className="w-5 h-5" />} href="#" />
            </div>
          </div>

          {/* 2. Content Matrix */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-8">
            <div className="space-y-8">
              <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em]">MENU</h4>
              <ul className="space-y-4">
                <FooterLink href="/tournaments" label="Tournaments" />
                {/* <FooterLink href="/leaderboards" label="Leaderboards" /> */}
                <FooterLink href="/quick-play" label="Live Matches" />
                <FooterLink href="/organizer/tournaments/create" label="Host Tournament" />
              </ul>
            </div>
            <div className="space-y-8">
              <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em]">LEGAL</h4>
              <ul className="space-y-4">
                <FooterLink href="/skill-declaration" label="Is This Legal?" />
                <FooterLink href="/terms" label="Terms & Rules" />
                <FooterLink href="/privacy" label="Privacy Policy" />
                <FooterLink href="/support" label="Help Center" />
              </ul>
            </div>
          </div>

          {/* 3. Operational HUD */}
          <div className="lg:col-span-3 space-y-10">
            <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em]">SERVER STATUS</h4>
            <div className="space-y-5">
              <div className="bg-zinc-50 border border-zinc-100 rounded-[2rem] p-8 group hover:bg-white hover:shadow-xl hover:shadow-zinc-200/50 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <Globe className="w-5 h-5 text-green-500" />
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-glow-green" />
                </div>
                <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">NETWORK STATUS</p>
                <p className="text-sm font-black text-zinc-900 uppercase tracking-tight">ALL SYSTEMS RUNNING</p>
              </div>

              <Link href="mailto:support@thearena.in" className="flex items-center justify-between p-2 pl-6 bg-zinc-900 rounded-2xl group transition-all">
                <span className="text-[10px] font-black text-white uppercase tracking-widest">GET HELP</span>
                <div className="w-12 h-12 bg-netflix-red rounded-xl flex items-center justify-center group-hover:rotate-45 transition-transform">
                  <ArrowUpRight className="w-5 h-5 text-white" />
                </div>
              </Link>
            </div>
          </div>

        </div>

        {/* Tactical Bottom Bar */}
        <div className="pt-12 border-t border-zinc-100 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-16">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">
              © {currentYear} THE ARENA INDIA // TEAM
            </p>
            <div className="flex items-center gap-8">
              <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2 hover:text-netflix-red transition-all cursor-pointer">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                SAFE & SECURE
              </p>
              <div className="w-[1px] h-4 bg-zinc-100" />
              <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2 hover:text-netflix-red transition-all cursor-pointer">
                <Zap className="w-4 h-4 text-amber-500" />
                1.2MS LATENCY
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-1.5 bg-zinc-50 rounded-2xl border border-zinc-100">
            <span className="px-5 py-2.5 bg-white shadow-sm rounded-xl text-[10px] font-black tracking-widest uppercase border border-zinc-100">
              VER {process.env.NEXT_PUBLIC_APP_VERSION || '2.4.0'}-PROD
            </span>
            <span className="px-5 py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase text-zinc-900 flex items-center gap-2">
              <div className="w-2 h-2 bg-live-green rounded-full shadow-glow-green" />
              LIVE
            </span>
          </div>
        </div>

        {/* Global Compliance */}
        <div className="mt-16 text-center">
          <p className="text-[9px] text-zinc-300 font-bold uppercase tracking-[0.3em] max-w-4xl mx-auto leading-loose transition-colors hover:text-zinc-500">
            IMPORTANT NOTICE: THE ARENA IS A SKILL-BASED COMPETITIVE PLATFORM. ENTRY IS RESTRICTED TO USERS AGED 18+. WE STRICTLY ADHERE TO ALL INDIAN GAMING LAWS AND IT STANDARDS.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link href={href} className="text-[11px] font-bold text-zinc-500 hover:text-netflix-red uppercase tracking-widest transition-all flex items-center gap-3 group">
        <div className="w-1.5 h-[1px] bg-netflix-red/30 group-hover:w-4 transition-all" />
        {label}
      </Link>
    </li>
  );
}

function SocialLink({ icon, href }: { icon: React.ReactNode; href: string }) {
  return (
    <Link href={href} className="w-12 h-12 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400 hover:bg-white hover:text-netflix-red hover:border-netflix-red/20 transition-all shadow-sm hover:shadow-xl hover:shadow-zinc-200/50 hover:-translate-y-1">
      {icon}
    </Link>
  );
}
