import React from 'react';

export default function CtaBanner() {
  return (
    <section className="py-16 bg-brand-navy relative overflow-hidden">
      <div className="absolute right-0 top-0 h-full w-1/3 bg-brand-orange opacity-10 skew-x-12 translate-x-16 pointer-events-none"></div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <i className="fa-solid fa-quote-left text-3xl text-brand-orange mb-6"></i>
        <blockquote className="text-2xl md:text-3xl font-light text-white italic leading-relaxed mb-6">
          &quot;Thank you for choosing us as Stylink. Your trust and support drive us to deliver quality parts and excellent service every day. We appreciate you!&quot;
        </blockquote>
        <p className="text-sm font-bold text-brand-orange uppercase tracking-widest">
          — Message to our Partners
        </p>
      </div>
    </section>
  );
}

