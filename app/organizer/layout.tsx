'use client';

import { ModernHeader } from '@/app/components/layout/modern-header';
import { SlimSidebar } from '@/app/components/layout/slim-sidebar';
import { MobileBottomNav } from '@/app/components/layout/mobile-bottom-nav';

export default function OrganizerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // No auth logic needed - middleware handles authentication and role checks!
  return (
    <div className="min-h-screen bg-[#fcfcfc]">
      <SlimSidebar />
      <div className="lg:pl-20 transition-all duration-300">
        <ModernHeader />
        <main className="min-h-screen pt-16 pb-24 lg:pb-0 p-4 sm:p-6 lg:p-10">
          {children}
        </main>
        <MobileBottomNav />
      </div>
    </div>
  );
}
