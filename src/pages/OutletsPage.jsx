import React from 'react';
import OutletsHero from '../components/OutletsHero';
import BrandsMarquee from '../components/BrandsMarquee';
import { contactInfo } from '../data/navigation';

export default function OutletsPage() {
  return (
    <>
      <OutletsHero />
      <BrandsMarquee />

      {/* Branch Details & Service Information */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-brand-navy uppercase tracking-tight">
              Fast Commercial Spares Dispatch
            </h2>
            <p className="text-gray-600 mt-4 text-base">
              All branches maintain stock of OEM and replacement parts for quick collection or same-day dispatch 
              to major towns, mines, farms, and transport depots across Zimbabwe.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-orange-100 text-brand-orange rounded-xl flex items-center justify-center text-xl mb-6">
                <i className="fa-solid fa-clock"></i>
              </div>
              <h3 className="text-lg font-bold text-brand-navy uppercase mb-3">Operating Hours</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex justify-between">
                  <span>Monday - Friday:</span>
                  <strong className="text-brand-navy">8:00 AM - 5:00 PM</strong>
                </li>
                <li className="flex justify-between">
                  <span>Saturday:</span>
                  <strong className="text-brand-navy">8:00 AM - 1:00 PM</strong>
                </li>
                <li className="flex justify-between text-gray-400">
                  <span>Sunday & Holidays:</span>
                  <span>Emergency dispatch on request</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-orange-100 text-brand-orange rounded-xl flex items-center justify-center text-xl mb-6">
                <i className="fa-solid fa-truck-ramp-box"></i>
              </div>
              <h3 className="text-lg font-bold text-brand-navy uppercase mb-3">Countrywide Logistics</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Breakdown outside town? We partner with trusted courier and bus logistics services 
                to ensure urgent spares reach Mutare, Gweru, Masvingo, Chinhoyi, and Beitbridge within hours.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-orange-100 text-brand-orange rounded-xl flex items-center justify-center text-xl mb-6">
                <i className="fa-solid fa-headset"></i>
              </div>
              <h3 className="text-lg font-bold text-brand-navy uppercase mb-3">Parts Matching Help</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Not sure about the part number? Send a photo or description to our dedicated technical WhatsApp line.
              </p>
              <a
                href={contactInfo.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-emerald-600 uppercase tracking-wider hover:underline flex items-center gap-1.5"
              >
                <i className="fa-brands fa-whatsapp text-sm"></i>
                <span>Open WhatsApp Support</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
