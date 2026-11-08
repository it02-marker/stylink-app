import React from 'react';
import { companyOverview } from '../data/company';

export default function About() {
  return (
    <section id="about" className="py-20 bg-white border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Left: 60% Profile & Vision/Mission */}
          <div className="lg:w-3/5">
            <h3 className="text-3xl md:text-4xl font-extrabold text-brand-navy uppercase tracking-tight mb-6">
              {companyOverview.title}
            </h3>

            <div className="prose max-w-none text-gray-600 mb-10 text-base leading-relaxed">
              <p className="mb-6">
                <strong className="text-brand-navy font-bold">{companyOverview.name}</strong>{' '}
                {companyOverview.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-brand-border pt-8">
              <div>
                <h4 className="text-sm font-bold text-brand-navy uppercase mb-3">
                  <i className="fa-solid fa-bullseye text-brand-orange mr-2"></i> Our Mission
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {companyOverview.mission}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-bold text-brand-navy uppercase mb-3">
                  <i className="fa-solid fa-eye text-brand-orange mr-2"></i> Our Vision
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {companyOverview.vision}
                </p>
              </div>
            </div>
          </div>

          {/* Right: 40% Core Values (Clean List format) */}
          <div className="lg:w-2/5 bg-brand-slate p-8 lg:p-10 border border-brand-border">
            <h3 className="text-xl font-bold text-brand-navy uppercase tracking-wide mb-8 border-b-2 border-brand-navy pb-4">
              Core Values
            </h3>

            <ul className="space-y-6">
              {companyOverview.values.map((val) => (
                <li key={val.title} className="flex items-start gap-4">
                  <i className={`${val.icon} text-brand-orange mt-1`}></i>
                  <div>
                    <h5 className="font-bold text-brand-navy text-sm uppercase tracking-wide">
                      {val.title}
                    </h5>
                    <p className="text-sm text-gray-600 mt-1">{val.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

