import React from 'react';
import { testimonialsData } from '../data/testimonials';

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 bg-white border-t border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <h3 className="text-3xl font-extrabold text-brand-navy uppercase tracking-tight">
              What Fleet Operators Say
            </h3>
            <p className="text-gray-500 text-sm mt-2">
              Verified feedback from commercial transport and fleet managers across Zimbabwe
            </p>
          </div>
          <div className="flex items-center gap-2 text-red-500 text-sm font-bold uppercase tracking-wider">
            <div className="flex text-red-500 text-xs gap-1">
              {[...Array(5)].map((_, i) => (
                <i key={i} className="fa-solid fa-star"></i>
              ))}
            </div>
            <span className="text-brand-navy text-xs ml-2 font-extrabold">
              Trusted Across Zimbabwe
            </span>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonialsData.map((item, index) => (
            <div
              key={index}
              className="bg-[#eef2f6] rounded-2xl p-7 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div>
                {/* Header: Avatar + Info (Left) & Red Stars (Right) */}
                <div className="flex items-start justify-between gap-3 mb-5">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={item.avatar}
                      alt={item.author}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-sm flex-shrink-0"
                    />
                    <div>
                      <h4 className="text-[15px] sm:text-base font-bold text-gray-900 leading-tight">
                        {item.author}
                      </h4>
                      <p className="text-xs text-gray-500 font-medium mt-1">
                        {item.location}
                      </p>
                    </div>
                  </div>

                  {/* Red Stars */}
                  <div className="flex text-red-500 text-sm gap-0.5 pt-1 flex-shrink-0">
                    {[...Array(item.rating || 5)].map((_, i) => (
                      <i key={i} className="fa-solid fa-star"></i>
                    ))}
                  </div>
                </div>

                {/* Review Text */}
                <p className="text-[14px] sm:text-[15px] text-gray-600 leading-relaxed font-normal">
                  {item.quote}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
