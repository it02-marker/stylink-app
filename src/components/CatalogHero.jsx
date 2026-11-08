import React from 'react';
import { Link } from 'react-router-dom';

export default function CatalogHero() {
  return (
    <section className="relative bg-brand-navy pt-28 pb-20 overflow-hidden border-b border-white/10">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400 mb-6">
          <Link to="/" className="hover:text-brand-orange transition">
            Home
          </Link>
          <span className="text-brand-orange">/</span>
          <span className="text-white">Commercial Parts Catalog</span>
        </div>

        {/* Hero Title & Subtext */}
        <div className="max-w-3xl mb-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase leading-tight mb-6">
            Truck Spares <br />
            <span className="text-brand-orange">Parts Catalog</span>
          </h1>

          <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-light mb-8 max-w-2xl">
            Browse our comprehensive inventory of genuine Japanese truck spares and heavy-duty commercial auto parts.
            Direct delivery to workshops across Zimbabwe or counter pickup in Harare & Bulawayo.
          </p>
        </div>
      </div>
    </section>
  );
}