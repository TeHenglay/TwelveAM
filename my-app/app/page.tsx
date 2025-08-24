"use client";

import { Hero } from '@/app/components';
import LogoLoop from '@/app/components/LogoLoop';
import NewArrivals from '@/app/components/NewArrivals';
const brandLogos = [
  { src: "/images/logo.png", alt: "Twelve AM Logo", title: "Twelve AM" },
  { src: "/images/Logo1.png", alt: "Twelve AM Logo 1", title: "Twelve AM" },
  { src: "/images/logo2.png", alt: "Twelve AM Logo 2", title: "Twelve AM" },
  { src: "/images/logo3.png", alt: "Twelve AM Logo 3", title: "Twelve AM" },
];

export default function HomePage() {
  return (
    <main>
      <Hero />
      <div className="h-[80px] relative overflow-hidden bg-black">
        <LogoLoop
          logos={brandLogos}
          speed={40}
          direction="left"
          logoHeight={40}
          gap={80}
          pauseOnHover
          scaleOnHover
          fadeOut
          fadeOutColor="#000000"
          ariaLabel="Twelve AM Brand"
        />
      </div>
      <NewArrivals />
    </main>
  );
}
