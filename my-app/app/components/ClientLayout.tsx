'use client';

import AnimatedHeader from './AnimatedHeader';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { Footer, MobileNav } = require('./index');
  
  return (
    <>
      {/* Animated Header with GSAP */}
      <AnimatedHeader />
      
      {/* Main content with proper spacing for fixed nav */}
      <main className="flex-1 container mx-auto px-2 pt-20">{children}</main>
      
      <Footer />
      <MobileNav />
    </>
  );
}
