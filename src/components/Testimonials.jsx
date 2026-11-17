import React from 'react';
import { useSiteData } from '../context/SiteDataContext';
export default function Testimonials() {
  const { testimonials: testimonialsData } = useSiteData();

  return (
    <section id="testimonials" className="py-20 bg-white border-t border-brand-border">
      <div className="site-container">
        {/* Section Header */}
        <div className="mb-12 flex flex-col items-center gap-4 text-center">
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
        <div className="flex gap-6 lg:gap-8 overflow-x-auto pb-2 snap-x snap-mandatory">
          {testimonialsData.map((item, index) => (
            <div
              key={index}
              className="flex-[1_0_280px] snap-start bg-[#eef2f6] rounded-2xl p-7 sm:p-8 flex flex-col justify-between text-center shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div>
                {/* Header: Avatar + Info (Left) & Red Stars (Right) */}
                <div className="mb-5 flex flex-col items-center gap-3">
                  <div className="flex flex-col items-center gap-2">
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
                  <div className="flex text-red-500 text-sm gap-0.5">
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
