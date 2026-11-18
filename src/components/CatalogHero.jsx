import React from 'react';
import { Link } from 'react-router-dom';
import { useSiteData } from '../context/SiteDataContext';

export default function CatalogHero() {
  const { heroSections } = useSiteData();
  const content = heroSections.catalog;

  if (!content) return null;

  return (
    <section className="relative min-h-[80dvh] flex items-center bg-brand-navy pt-24 pb-12 sm:pt-28 sm:pb-16 overflow-hidden border-b border-white/10">
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: content.imageUrl ? `url("${content.imageUrl}")` : 'none' }}
        role={content.imageAlt ? 'img' : undefined}
        aria-label={content.imageAlt || undefined}
      />
      <div className="subtle-backdrop-blur absolute inset-0 z-0" />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-navyDark/40 via-brand-navy/25 to-brand-navyDark/15 z-0" />

      <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-96 h-96 bg-brand-orange/10 rounded-full blur-3xl pointer-events-none" />

      <div className="site-container relative z-10 text-center">
        <div className="mb-5 flex items-center justify-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400 sm:mb-6 sm:text-xs">
          <Link to="/" className="hover:text-brand-orange transition">
            Home
          </Link>
          <span className="text-brand-orange">/</span>
          <span className="text-white">{content.breadcrumb}</span>
        </div>

        <div className="mx-auto mb-6 max-w-3xl sm:mb-8">
          <h1 className="text-3xl min-[380px]:text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase leading-tight mb-4 sm:mb-6">
            {content.title}
          </h1>

          <p className="mx-auto mb-6 max-w-2xl text-sm font-light leading-relaxed text-gray-300 sm:mb-8 sm:text-base lg:text-lg">
            {content.description}
          </p>
        </div>
      </div>
    </section>
  );
}