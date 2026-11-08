import React from 'react';
import { featuresData } from '../data/features';

export default function WhyUs() {
  return (
    <section id="why-us" className="py-20 bg-white border-t border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-extrabold text-brand-navy uppercase tracking-tight mb-2">
            Why Partner With Us
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {featuresData.map((feature) => (
            <div key={feature.title}>
              <i className={`${feature.icon} text-2xl text-brand-navy mb-4`}></i>
              <h4 className="text-lg font-bold text-brand-navy uppercase mb-2">
                {feature.title}
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

