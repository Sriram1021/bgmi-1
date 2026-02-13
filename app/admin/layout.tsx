import { ModernHeader } from '@/app/components/layout/modern-header';
import { SlimSidebar } from '@/app/components/layout/slim-sidebar';
import { MobileBottomNav } from '@/app/components/layout/mobile-bottom-nav';
import { AlertCircle } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#fcfcfc]">
      <SlimSidebar />
      <div className="lg:pl-20 transition-all duration-300">
        <ModernHeader />
        <div className="bg-zinc-900 border-b border-white/5 px-6 py-4 flex items-center justify-between gap-4 text-white text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] pt-20 shadow-2xl relative z-30">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-netflix-red rounded-full animate-pulse" />
            <span>SECURE SESSION // LOGGED IN AS ADMIN</span>
          </div>
          <div className="hidden sm:flex items-center gap-6 opacity-40">
            <span className="flex items-center gap-2"><AlertCircle className="w-4 h-4" /> SECURE NODE</span>
            <span className="w-px h-3 bg-white/20" />
            <span>ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
          </div>
        </div>
        <main className="min-h-screen pb-24 lg:pb-0">
          {children}
        </main>
        <MobileBottomNav />
      </div>
    </div>
  );
}
