import React from 'react';
import { Link } from 'react-router-dom';

export default function CatalogHero() {
  return (
    <section className="relative bg-brand-navy pt-24 pb-12 sm:pt-28 sm:pb-16 overflow-hidden border-b border-white/10">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage:
            "url('https://www.truckpartsltd.com/images/site/home-category-brake-system.webp')",
        }}
      />
      {/* Reduced Gradient Opacity to Accommodate Background Image */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-navyDark/70 via-brand-navy/50 to-brand-navyDark/30 z-0" />

      {/* Decorative Brand Accent */}
      <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-96 h-96 bg-brand-orange/10 rounded-full blur-3xl pointer-events-none" />

      <div className="site-container relative z-10 text-center">
        {/* Breadcrumb */}
        <div className="mb-5 flex items-center justify-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400 sm:mb-6 sm:text-xs">
          <Link to="/" className="hover:text-brand-orange transition">
            Home
          </Link>
          <span className="text-brand-orange">/</span>
          <span className="text-white">Commercial Parts Catalog</span>
        </div>

        {/* Hero Title & Subtext */}
        <div className="mx-auto mb-6 max-w-3xl sm:mb-8">
          <h1 className="text-3xl min-[380px]:text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase leading-tight mb-4 sm:mb-6">
            Truck Spares <br />
            <span className="text-brand-orange">Parts Catalog</span>
          </h1>

          <p className="mx-auto mb-6 max-w-2xl text-sm font-light leading-relaxed text-gray-300 sm:mb-8 sm:text-base lg:text-lg">
            Browse our comprehensive inventory of genuine Japanese truck spares and heavy-duty commercial auto parts.
            Direct delivery to workshops across Zimbabwe or counter pickup in Harare & Bulawayo.
          </p>
        </div>
      </div>
    </section>
  );
}