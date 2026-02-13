import { ModernHeader } from '@/app/components/layout/modern-header';
import { SlimSidebar } from '@/app/components/layout/slim-sidebar';
import { MobileBottomNav } from '@/app/components/layout/mobile-bottom-nav';
import { Footer } from '@/app/components/layout/footer';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#fcfcfc] text-zinc-900">
      <SlimSidebar />
      <div className="pl-0 lg:pl-16">
        <ModernHeader />
        <main className="min-h-screen pt-16 pb-20 md:pb-0">
          {children}
        </main>
        <Footer />
        <MobileBottomNav />
      </div>
    </div>
  );
}
