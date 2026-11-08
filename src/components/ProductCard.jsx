import React from 'react';

export default function ProductCard({ item }) {
  return (
    <div className="bg-white border border-brand-border rounded-xl overflow-hidden group hover:border-brand-orange transition-all duration-300 shadow-sm flex flex-col h-full">
      {/* Top Image Area - Increased height from h-40 to h-56 */}
      <div className="h-56 overflow-hidden bg-brand-navy relative">
        <img
          src={item.image}
          alt={item.imageAlt}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Bottom Bar: Logo | Name and subtext - Added py-6 for extra vertical height */}
      <div className="p-5 py-6 bg-white flex items-center border-t border-brand-border flex-grow">
        {/* Logo */}
        <div className="w-20 h-12 flex-shrink-0 flex items-center justify-center p-1">
          <img
            src={item.logo}
            alt={`${item.brand} Parts`}
            className="max-h-full max-w-full object-contain grayscale group-hover:grayscale-0 transition"
          />
        </div>

        {/* Vertical Separator Line */}
        <div className="w-px h-10 bg-brand-border mx-3"></div>

        {/* Name and Other Text */}
        <div className="flex-grow">
          <h4 className="text-lg font-black text-brand-navy uppercase tracking-tight leading-none mb-1">
            {item.brand}
          </h4>
          <p className="text-[11px] text-gray-500 leading-tight">{item.tagline}</p>
        </div>
      </div>
    </div>
  );
}