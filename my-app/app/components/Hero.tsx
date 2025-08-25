'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

/**
 * Redesign notes:
 * - Make background full-bleed (spans the entire viewport width) even when
 *   the site layout uses centered containers.
 * - Keep content centered with a max width for readability.
 * - Add a split layout on large screens: hero text + small product card.
 */

const Hero: React.FC = () => {
  return (
    <section className="relative w-full">
      {/* Full-bleed background that always covers viewport width */}
      <div
        aria-hidden
        className="absolute left-1/2 right-1/2 -translate-x-1/2 w-screen inset-0 z-0"
        style={{
          backgroundImage: 'url("/images/hero-bg.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content wrapper: centered with readable width */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Headline + CTAs */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight text-white"
            >
              Discover Your Style
              <br />
              <span className="text-yellow-400">Elevate Your Wardrobe</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mt-6 text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto lg:mx-0"
            >
              Explore our curated collection of premium streetwear and fashion essentials —
              crafted for comfort, built to last.
            </motion.p>

            <div className="mt-8 flex flex-col sm:flex-row sm:justify-start justify-center gap-4">
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-8 py-3 bg-yellow-400 text-black font-semibold rounded-full shadow-sm hover:brightness-95 transition"
              >
                Shop Now
              </Link>

              <Link
                href="/products?new=true"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-black transition"
              >
                New Arrivals
              </Link>
            </div>
          </div>

          {/* Right: small product highlight card on large screens */}
          <div className="hidden lg:col-span-5 lg:flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="relative w-80 bg-white/5 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/10"
            >
              <div className="relative h-56 w-full rounded-md overflow-hidden">
                <Image
                  src="/images/hero-product.jpg"
                  alt="Featured product"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>

              <div className="mt-4 text-left text-white">
                <h4 className="text-lg font-semibold">Featured: Midnight Jacket</h4>
                <p className="text-sm text-gray-300">Limited drop · Premium materials</p>
                <div className="mt-3 flex items-center gap-3">
                  <span className="text-xl font-bold">$129.00</span>
                  <Link
                    href="/products/midnight-jacket"
                    className="ml-auto text-sm bg-yellow-400 text-black px-3 py-1 rounded-full font-medium"
                  >
                    View
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
