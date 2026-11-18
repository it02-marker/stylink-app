import React from 'react';
import { Link } from 'react-router-dom';
import { useSiteData } from '../context/SiteDataContext';

export default function AboutHero() {
  const { heroSections } = useSiteData();
  const content = heroSections.about;

  if (!content) return null;

  return (
    <section className="relative min-h-[clamp(26rem,72svh,34rem)] sm:min-h-[80dvh] flex items-start sm:items-center bg-brand-navy pt-8 pb-16 sm:py-24 overflow-hidden border-b border-white/10">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-70 z-0"
        style={{ backgroundImage: content.imageUrl ? `url("${content.imageUrl}")` : 'none' }}
        role={content.imageAlt ? 'img' : undefined}
        aria-label={content.imageAlt || undefined}
      />
      <div className="subtle-backdrop-blur absolute inset-0 z-0" />
      <div className="absolute inset-0 bg-gradient-to-b from-brand-navyDark/70 via-brand-navy/55 to-brand-navyDark/40 sm:bg-gradient-to-r sm:from-brand-navyDark/25 sm:via-brand-navy/15 sm:to-brand-navyDark/10 z-0" />

      <div className="absolute -right-24 -top-24 w-96 h-96 bg-brand-orange/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute left-1/3 -bottom-24 w-80 h-80 bg-brand-orange/10 rounded-full blur-2xl pointer-events-none" />

      <div className="site-container relative z-10 text-center">
        <div className="mb-6 hidden items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-gray-300 sm:flex">
          <Link to="/" className="hover:text-brand-orange transition">
            Home
          </Link>
          <span className="text-brand-orange">/</span>
          <span className="text-white">{content.breadcrumb}</span>
        </div>

        <div className="mx-auto max-w-3xl">
          <h1 className="text-balance text-[clamp(1.75rem,7.5vw,2.75rem)] sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase leading-[1.08] mb-4 sm:mb-6">
            {content.title}
          </h1>

          <p className="mx-auto max-w-2xl text-[clamp(0.875rem,3.8vw,1rem)] sm:text-lg font-light leading-relaxed text-gray-200">
            {content.description}
          </p>
        </div>
      </div>
    </section>
  );
}