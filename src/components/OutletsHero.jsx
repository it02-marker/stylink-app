import React from 'react';
import { Link } from 'react-router-dom';
import { useSiteData } from '../context/SiteDataContext';
export default function OutletsHero() {
  const { heroSections } = useSiteData();
  const content = heroSections.outlets;

  if (!content) return null;

  return (
    <section className="relative min-h-[80dvh] flex items-start sm:items-center bg-brand-navy pt-10 sm:pt-28 pb-20 overflow-hidden border-b border-white/10">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-70 z-0"
        style={{ backgroundImage: content.imageUrl ? `url("${content.imageUrl}")` : 'none' }}
        role={content.imageAlt ? 'img' : undefined}
        aria-label={content.imageAlt || undefined}
      />
      <div className="subtle-backdrop-blur absolute inset-0 z-0" />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-navyDark/25 via-brand-navy/15 to-brand-navyDark/10 z-0" />

      <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-96 h-96 bg-brand-orange/15 rounded-full blur-3xl pointer-events-none" />

      <div className="site-container relative z-10 text-center">
        <div className="mb-6 sm:mb-8 hidden items-center justify-center gap-2 text-[clamp(0.625rem,1.8vw,0.75rem)] font-semibold uppercase tracking-wider text-gray-400 sm:flex">
          <Link to="/" className="hover:text-brand-orange transition">
            Home
          </Link>
          <span className="text-brand-orange">/</span>
          <span className="text-white">{content.breadcrumb}</span>
        </div>

        <div className="mx-auto mb-8 sm:mb-12 max-w-3xl">
          <h1 className="text-[clamp(1.75rem,7vw,3.75rem)] font-black text-white tracking-tight uppercase leading-[1.1] mb-4 sm:mb-6">
            {content.title}
          </h1>

          <p className="text-[clamp(0.875rem,2.5vw,1.125rem)] font-light leading-relaxed text-gray-300">
            {content.description}
          </p>
        </div>
      </div>
    </section>
  );
}