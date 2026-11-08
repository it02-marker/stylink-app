import React from 'react';
import { Link } from 'react-router-dom';
import { branchesData } from '../data/branches';
import { contactInfo } from '../data/navigation';

export default function OutletsHero() {
  return (
    <section className="relative bg-brand-navy pt-28 pb-20 overflow-hidden border-b border-white/10">
      {/* Background Graphic */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-50 z-0"
        style={{
          backgroundImage:
            "url('https://scontent-jnb2-1.xx.fbcdn.net/v/t39.30808-6/656198905_1475515537613537_2491431788241770214_n.jpg?stp=cp6_dst-jpegr_tt6&cstp=mx2048x1536&ctp=s2048x1536&_nc_cat=100&ccb=1-7&_nc_sid=833d8c&_nc_ohc=-Bo7LWjOjkMQ7kNvwF3meJR&_nc_oc=AdohcQz5o7FMKX1wKlMFAmf4rUZ5cRywDgKWkcyrcLLhvmBWuWEF6Bczq_d5x5N4xw4&_nc_zt=23&se=-1&_nc_ht=scontent-jnb2-1.xx&_nc_gid=o7txYCHs2VMcHWSQXpmmJQ&_nc_ss=7b2a8&oh=00_AQQz49u8QFIzCaiFETCJNpqG_UyuvK23VQ--V18-vRxzfA&oe=6AF3D83C')",
        }}
      />
      {/* Increased Gradient Transparency */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-navyDark/40 via-brand-navy/30 to-brand-navyDark/20 z-0" />

      {/* Decorative Brand Accent */}
      <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-96 h-96 bg-brand-orange/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400 mb-8">
          <Link to="/" className="hover:text-brand-orange transition">
            Home
          </Link>
          <span className="text-brand-orange">/</span>
          <span className="text-white">Our Outlets & Branches</span>
        </div>

        {/* Title */}
        <div className="max-w-3xl mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase leading-[1.1] mb-6">
            Visit Our Branches <br />
            <span className="text-brand-orange">In Harare & Bulawayo</span>
          </h1>

          <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-light">
            Conveniently located for workshops, transport operators, and cross-border commercial fleets.
            Walk into any branch for immediate counter service or call directly for countrywide delivery.
          </p>
        </div>
      </div>
    </section>
  );
}