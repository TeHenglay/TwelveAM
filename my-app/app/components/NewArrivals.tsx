'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface ProductProps {
  id: string;
  name: string;
  price: number;
  image: string;
  sizes: string[];
}

const products: ProductProps[] = [
  { id: '1', name: 'REACH THENG',     price: 14.99, image: '/uploads/products/product1.jpg', sizes: ['S','M','L'] },
  { id: '2', name: 'CLASSIC TEE',     price: 19.99, image: '/uploads/products/product2.jpg', sizes: ['S','M','L'] },
  { id: '3', name: 'VINTAGE HOODIE',  price: 29.99, image: '/uploads/products/product3.jpg', sizes: ['S','M','L'] },
  { id: '4', name: 'URBAN SWEATER',   price: 24.99, image: '/uploads/products/product4.jpg', sizes: ['S','M','L'] },
  { id: '5', name: 'STREET STYLE',    price: 34.99, image: '/uploads/products/product5.jpg', sizes: ['S','M','L'] },
];

// Get circular relative position from -N..+N
function getPos(i: number, current: number, total: number) {
  let d = (i - current) % total;
  if (d > total / 2) d -= total;
  if (d < -total / 2) d += total;
  return d; // e.g., -2,-1,0,1,2
}

const CARD_W = 360;  // visual width target for center card (px)
const GAP = 60;      // gap between cards (px)

/** Position helpers based on relative slot (-2..2) */
function slotToX(slot: number) {
  // Space cards left/right of center. 0 = center.
  return slot * (CARD_W * 0.55 + GAP); // tighter spacing as they shrink
}
function slotToScale(slot: number) {
  return [0.78, 0.88, 1, 0.88, 0.78][slot + 2];
}
function slotToOpacity(slot: number) {
  return [0.35, 0.6, 1, 0.6, 0.35][slot + 2];
}
function slotToZ(slot: number) {
  return [1, 5, 10, 5, 1][slot + 2];
}

const CenterPriceTag = ({ price }: { price: number }) => (
  <div className="absolute right-4 bottom-4 text-white text-3xl font-black tracking-wide">
    ${price.toFixed(2)}
  </div>
);

const SizePills = ({ sizes }: { sizes: string[] }) => (
  <div className="flex items-center justify-center gap-3">
    {sizes.map((s) => (
      <button
        key={s}
        className="w-9 h-9 rounded-full border border-black/80 bg-white text-sm font-medium
                   hover:bg-black hover:text-white transition-colors"
      >
        {s}
      </button>
    ))}
  </div>
);

export default function NewArrivals() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((p) => (p + 1) % products.length);
  const prev = () => setCurrentIndex((p) => (p - 1 + products.length) % products.length);

  // Compute visible deck: only items within ±2 of the focused card.
  const deck = useMemo(() => {
    const total = products.length;
    return products
      .map((p, i) => {
        const slot = getPos(i, currentIndex, total); // -2..+2 (or beyond)
        return { ...p, i, slot };
      })
      .filter((x) => Math.abs(x.slot) <= 2);
  }, [currentIndex]);

  return (
    <section className="py-16 bg-white select-none">
      <h2 className="text-3xl font-bold text-center mb-12">New Arrivals</h2>

      <div className="relative mx-auto max-w-[1200px] px-4">
        {/* Arrow buttons */}
        <button
          onClick={prev}
          className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white shadow-lg
                     flex items-center justify-center hover:bg-gray-50"
          aria-label="Previous product"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
               strokeWidth={1.5} stroke="currentColor" fill="none" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5"/>
          </svg>
        </button>

        <button
          onClick={next}
          className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white shadow-lg
                     flex items-center justify-center hover:bg-gray-50"
          aria-label="Next product"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
               strokeWidth={1.5} stroke="currentColor" fill="none" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"/>
          </svg>
        </button>

        {/* Stage */}
        <div
          className="relative mx-auto"
          style={{ height: 520 }}
        >
          {/* Cards are absolutely positioned and animated into slots */}
          {deck.map(({ id, name, image, price, sizes, slot }) => (
            <motion.div
              key={id}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                         rounded-[28px] overflow-hidden shadow-xl"
              style={{ width: CARD_W, height: CARD_W * 1.15, zIndex: slotToZ(slot) }}
              animate={{
                x: slotToX(slot),
                scale: slotToScale(slot),
                opacity: slotToOpacity(slot),
                filter: slot === 0 ? 'grayscale(0%)' : 'grayscale(10%)',
              }}
              transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            >
              {/* Card body — dark for center, light-gray for sides */}
              <div className={slot === 0 ? 'h-full bg-black text-white' : 'h-full bg-gray-200'}>
                <div className="relative h-[72%]">
                  <Image
                    src={image}
                    alt={name}
                    fill
                    className={`object-cover ${slot === 0 ? 'mix-blend-normal' : 'opacity-90'}`}
                    sizes="(max-width: 1200px) 360px, 360px"
                    priority={slot === 0}
                  />
                  {slot === 0 && <CenterPriceTag price={price} />}
                </div>

                {/* Meta / sizes */}
                <div className={`h-[28%] flex flex-col items-center justify-center gap-2
                                 ${slot === 0 ? 'text-white' : 'text-black'}`}>
                  <div className="text-sm tracking-[0.2em] uppercase">{name}</div>
                  <SizePills sizes={sizes} />
                  {slot !== 0 && (
                    <div className="text-xs font-semibold opacity-60">
                      ${price.toFixed(2)}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

