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
      
  {/* Main content: allow sections to decide full-bleed vs centered */}
  <main className="flex-1 w-full px-2 pt-20">{children}</main>
      
      <Footer />
      <MobileNav />
    </>
  );
}
