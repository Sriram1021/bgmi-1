import { APP_NAME, LEGAL } from '@/app/lib/constants';
import {
  Target,
  Brain,
  Crosshair,
  Clock,
  Users,
  Award,
  CheckCircle,
  ChevronRight,
  Scale,
  ShieldCheck,
  Gavel,
  FileText,
  Ban,
  UserCheck,
  Gift,
  Shield,
  Gamepad2,
  Flame,
  ArrowRight,
  ShieldAlert,
  Info,
  Medal
} from 'lucide-react';
import { cn } from '@/app/lib/utils';

export const metadata = {
  title: `Skill & Legal Declaration - ${APP_NAME}`,
  description: 'Certified skill-based gaming and legal framework for the platform in India.',
};

export default function SkillDeclarationPage() {
  return (
    <div className="min-h-screen bg-white pb-24">

      {/* 1. Tactical Header */}
      <div className="bg-zinc-50 border-b border-zinc-100 pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-netflix-red/[0.03] to-transparent" />
        <div className="main-container relative z-10">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 text-netflix-red text-[10px] font-black uppercase tracking-[0.4em] mb-8">
              <ShieldCheck className="w-4 h-4" />
              LEGAL INFO
            </div>
            <h1 className="text-[clamp(3.5rem,10vw,7rem)] font-black text-zinc-900 tracking-wider leading-[0.85] uppercase mb-10" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              IS THIS <span className="text-netflix-red italic">LEGAL?</span><br />
              & LEGAL FRAMEWORK
            </h1>
            <p className="text-zinc-500 max-w-2xl text-lg font-bold uppercase tracking-widest leading-relaxed">
              Learn why our platform is 100% legal to play matches and win prizes in India.
            </p>
          </div>
        </div>
      </div>

      <div className="main-container py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

          {/* Left Column: Intelligence (8 cols) */}
          <div className="lg:col-span-8 space-y-20">

            {/* Official Proclamation */}
            <div className="bg-white border border-zinc-100 rounded-[3rem] overflow-hidden shadow-2xl shadow-zinc-200/50 group">
              <div className="bg-zinc-900 px-10 py-6 flex items-center justify-between">
                <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">OFFICIAL STATEMENT</span>
                <Info className="w-4 h-4 text-white/30" />
              </div>
              <div className="p-12 sm:p-16">
                <p className="text-xl sm:text-2xl font-black text-zinc-800 leading-[1.6] uppercase tracking-widest" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                  "{LEGAL.SKILL_BASED_DECLARATION}"
                </p>
                <div className="mt-10 flex items-center gap-4 py-6 border-t border-zinc-50">
                  <div className="w-12 h-12 bg-zinc-50 rounded-full flex items-center justify-center">
                    <Gavel className="w-5 h-5 text-zinc-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-zinc-900 uppercase tracking-widest">CERTIFIED UNDER THE SUPREME COURT RULING</p>
                    <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">Proving that games of skill are a legitimate business activity</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Core Skill Verticals */}
            <div>
              <div className="flex items-center gap-4 mb-12">
                <div className="w-2 h-10 bg-netflix-red rounded-full" />
                <h2 className="text-4xl font-black text-zinc-900 uppercase tracking-widest" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                  WHY IT'S A <span className="text-netflix-red">GAME OF SKILL</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <SkillCard
                  icon={Brain}
                  title="STRATEGY"
                  desc="Complex decision-making regarding drop zones, rotations, and combat positioning."
                />
                <SkillCard
                  icon={Crosshair}
                  title="AIM & PRECISION"
                  desc="Mechanical mastery of recoil control, weapon physics, and high-pressure aiming."
                />
                <SkillCard
                  icon={Clock}
                  title="REACTION SPEED"
                  desc="Millisecond reaction times and rapid cognitive processing during matches."
                />
                <SkillCard
                  icon={Users}
                  title="TEAMWORK"
                  desc="Squad-level communication, coordination, and unified match play."
                />
              </div>
            </div>

            {/* Constitutional Framework */}
            <div className="space-y-12">
              <div className="flex items-center gap-4">
                <div className="w-2 h-10 bg-zinc-900 rounded-full" />
                <h2 className="text-4xl font-black text-zinc-900 uppercase tracking-widest" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                  INDIAN <span className="text-zinc-400">LAW</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <LegalBlock
                  icon={Scale}
                  title="SUPREME COURT PRECEDENT"
                  desc="Indian courts have consistently recognized 'Games of Skill' as a fundamental right under Article 19(1)(g) of the Constitution."
                />
                <LegalBlock
                  icon={ShieldCheck}
                  title="PUBLIC GAMBLING ACT EXEMPTION"
                  desc="The archaic anti-gambling laws specifically exempt 'games of mere skill' from their purview across the majority of Indian states."
                />
              </div>
            </div>
          </div>

          {/* Right Column: Comparative Analysis (4 cols) */}
          <div className="lg:col-span-4 space-y-12">

            {/* The Integrity Matrix */}
            <div className="bg-zinc-900 rounded-[3rem] overflow-hidden shadow-2xl shadow-zinc-400/20">
              <div className="p-10 border-b border-white/5">
                <h3 className="text-2xl font-black text-white uppercase tracking-widest" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>SKILL VS LUCK</h3>
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] mt-1">LUCK VS. ABSOLUTE SKILL</p>
              </div>
              <div>
                <ComparisonRow label="WHAT MATTERS" bad="CHANCE" good="SKILL" />
                <ComparisonRow label="PLAYER PROGRESS" bad="STAGNANT" good="EVOLVING" />
                <ComparisonRow label="MATCH PATTERN" bad="RANDOM" good="STRATEGIC" />
                <ComparisonRow label="ENTRY MODEL" bad="BETTING" good="ENTRY FEE" />
              </div>
              <div className="p-10 bg-white/5">
                <div className="flex items-center gap-3 p-4 bg-live-green/10 rounded-2xl border border-live-green/20">
                  <Medal className="w-5 h-5 text-live-green" />
                  <p className="text-[10px] text-white font-black uppercase tracking-widest leading-relaxed">
                    Winners are decided only by skill, not by luck.
                  </p>
                </div>
              </div>
            </div>

            {/* Platform Guardrails */}
            <div className="bg-zinc-50 rounded-[3.5rem] p-10 space-y-8 border border-zinc-100">
              <h3 className="text-sm font-black text-zinc-900 uppercase tracking-[0.3em] flex items-center gap-3">
                <ShieldAlert className="w-4 h-4 text-netflix-red" />
                SAFETY RULES
              </h3>
              <div className="space-y-4">
                <Guardrail icon={Ban} label="NO GAMBLING" />
                <Guardrail icon={UserCheck} label="ONLY FOR 18+ AGES" highlight />
                <Guardrail icon={Flame} label="ADVANCED ANTI-CHEAT" />
                <Guardrail icon={Shield} label="SECURE PAYMENTS" />
              </div>
            </div>

            {/* Responsible Gaming CTA */}
            <div className="bg-gradient-to-br from-netflix-red to-red-700 rounded-[3.5rem] p-10 text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent)] opacity-0 group-hover:opacity-100 transition-opacity" />
              <Award className="w-12 h-12 text-white/50 mx-auto mb-8 group-hover:scale-110 transition-transform" />
              <h3 className="text-3xl font-black text-white uppercase tracking-widest mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                LEGAL PLATFORM
              </h3>
              <p className="text-[10px] text-white/70 font-bold uppercase tracking-widest leading-loose">
                {APP_NAME} operates as a skill-based platform. We strictly prohibit any form of gambling, betting, or chance-based outcomes.
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}

function SkillCard({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="bg-white border border-zinc-100 rounded-[2.5rem] p-10 shadow-xl shadow-zinc-200/30 hover:shadow-2xl hover:shadow-zinc-300/40 transition-all group">
      <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center mb-8 border border-zinc-100 group-hover:bg-zinc-900 group-hover:border-zinc-900 transition-all">
        <Icon className="w-8 h-8 text-zinc-400 group-hover:text-white transition-all" />
      </div>
      <h3 className="text-2xl font-black text-zinc-900 uppercase tracking-widest mb-3" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{title}</h3>
      <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest leading-relaxed">{desc}</p>
    </div>
  );
}

function LegalBlock({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="flex gap-8 group">
      <div className="flex-shrink-0 w-16 h-16 bg-zinc-900 rounded-[1.5rem] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
        <Icon className="w-7 h-7 text-white" />
      </div>
      <div className="space-y-2">
        <h4 className="text-xl font-black text-zinc-900 uppercase tracking-widest" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{title}</h4>
        <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest leading-relaxed">
          {desc}
        </p>
      </div>
    </div>
  );
}

function ComparisonRow({ label, bad, good }: { label: string, bad: string, good: string }) {
  return (
    <div className="grid grid-cols-2 border-b border-white/5">
      <div className="p-8 border-r border-white/5 space-y-2">
        <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest leading-none">{label}</p>
        <p className="text-[11px] font-black text-netflix-red uppercase tracking-[0.2em]">{bad}</p>
      </div>
      <div className="p-8 bg-white/5 space-y-2 group">
        <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest leading-none">PLATFORM VIEW</p>
        <p className="text-[11px] font-black text-live-green uppercase tracking-[0.2em] group-hover:translate-x-1 transition-transform inline-flex items-center gap-2">
          {good}
          <ArrowRight className="w-3 h-3" />
        </p>
      </div>
    </div>
  );
}

function Guardrail({ icon: Icon, label, highlight }: { icon: any, label: string, highlight?: boolean }) {
  return (
    <div className={cn(
      "flex items-center gap-4 p-5 rounded-2xl border transition-all group",
      highlight ? "bg-white border-zinc-100 shadow-sm" : "bg-transparent border-zinc-100/50"
    )}>
      <div className={cn(
        "w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform",
        highlight ? "bg-zinc-900" : "bg-zinc-100"
      )}>
        <Icon className={cn("w-5 h-5", highlight ? "text-white" : "text-zinc-400")} />
      </div>
      <span className="text-[10px] font-black text-zinc-900 uppercase tracking-widest">{label}</span>
    </div>
  );
}
