import type { Metadata } from 'next';
import { Bebas_Neue } from 'next/font/google';
import Script from 'next/script';
import { Providers } from '@/app/providers';
import './globals.css';

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas-neue',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'BattleGround Arena - Skill-Based BGMI & PUBG Tournaments',
  description: 'India\'s premier platform for skill-based BGMI and PUBG Mobile esports tournaments. Compete, win, and prove your skills.',
  keywords: ['BGMI', 'PUBG Mobile', 'esports', 'tournaments', 'skill-based gaming', 'India'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bebasNeue.variable} antialiased`}>
        <Providers>
          {children}
        </Providers>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
