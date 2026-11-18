import React from 'react';
import { Link } from 'react-router-dom';
import { useSiteData } from '../context/SiteDataContext';

export default function AboutHero() {
  const { heroSections } = useSiteData();
  const content = heroSections.about;

  if (!content) return null;

  return (
    <section className="relative min-h-[80dvh] flex items-center bg-brand-navy pt-28 pb-20 overflow-hidden border-b border-white/10">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-50 z-0"
        style={{ backgroundImage: content.imageUrl ? `url("${content.imageUrl}")` : 'none' }}
        role={content.imageAlt ? 'img' : undefined}
        aria-label={content.imageAlt || undefined}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-navyDark/40 via-brand-navy/30 to-brand-navyDark/20 z-0" />

      <div className="absolute -right-24 -top-24 w-96 h-96 bg-brand-orange/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute left-1/3 -bottom-24 w-80 h-80 bg-brand-orange/10 rounded-full blur-2xl pointer-events-none" />

      <div className="site-container relative z-10 text-center">
        <div className="mb-8 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
          <Link to="/" className="hover:text-brand-orange transition">
            Home
          </Link>
          <span className="text-brand-orange">/</span>
          <span className="text-white">{content.breadcrumb}</span>
        </div>

        <div className="grid grid-cols-1 items-center gap-12">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase leading-[1.1] mb-6">
              {content.title}
            </h1>

            <p className="mx-auto mb-8 max-w-2xl text-base font-light leading-relaxed text-gray-300 sm:text-lg">
              {content.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}