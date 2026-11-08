import React from 'react';
import { brandLogos } from '../data/brands';

export default function BrandsMarquee() {
  // Triple the logos to guarantee seamless infinite scrolling on all display sizes
  const repeatedLogos = [...brandLogos, ...brandLogos, ...brandLogos, ...brandLogos];

  return (
    <section id="brands-marquee" className="py-10 bg-white border-b border-brand-border overflow-hidden marquee-container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 text-center">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Trusted Parts & Spares For Major Truck Brands
        </h4>
      </div>

      {/* Marquee Track */}
      <div className="relative w-full flex overflow-hidden py-2">
        <div className="animate-marquee gap-12 md:gap-16 items-center px-4">
          {repeatedLogos.map((brand, idx) => (
            <img
              key={`${brand.name}-${idx}`}
              src={brand.logoUrl}
              alt={brand.alt}
              className="h-16 md:h-20 w-auto object-contain grayscale hover:grayscale-0 opacity-75 hover:opacity-100 transition-all duration-300"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

