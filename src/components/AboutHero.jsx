import React from 'react';
import { Link } from 'react-router-dom';

export default function AboutHero() {
  return (
    <section className="relative bg-brand-navy pt-28 pb-20 overflow-hidden border-b border-white/10">
      {/* Background Graphic */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-50 z-0"
        style={{
          backgroundImage:
            "url('https://www.geotab.com/CMS-Media-production/Blog/NA/2026/January/fleet-operations/fleet-operations.jpg')",
        }}
      />
      {/* Increased Gradient Transparency */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-navyDark/40 via-brand-navy/30 to-brand-navyDark/20 z-0" />

      {/* Decorative Brand Accent Circles */}
      <div className="absolute -right-24 -top-24 w-96 h-96 bg-brand-orange/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute left-1/3 -bottom-24 w-80 h-80 bg-brand-orange/10 rounded-full blur-2xl pointer-events-none" />

      <div className="site-container relative z-10 text-center">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
          <Link to="/" className="hover:text-brand-orange transition">
            Home
          </Link>
          <span className="text-brand-orange">/</span>
          <span className="text-white">About Us & Why Us</span>
        </div>

        {/* 2-Column Hero Grid: Narrative (Left) & Stat Badges (Right) */}
        <div className="grid grid-cols-1 items-center gap-12">
          {/* Left Column: Narrative */}
          <div className="mx-auto max-w-4xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase leading-[1.1] mb-6">
              Keeping Zimbabwe&apos;s Fleets <br />
              <span className="text-brand-orange">Moving Forward</span>
            </h1>

            <p className="mx-auto mb-8 max-w-2xl text-base font-light leading-relaxed text-gray-300 sm:text-lg">
              Stylink Truck Parts is Zimbabwe&apos;s specialist wholesale and retail supplier of heavy-duty
              Japanese truck spares. Learn who we are, our core commitments, and why commercial hauliers
              partner with us.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}