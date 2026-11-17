import React from 'react';
import { Link } from 'react-router-dom';
import BrandCard from './BrandCard';
import { useSiteData } from '../context/SiteDataContext';
export default function FeaturedBrands() {
  const { featuredBrands, contactInfo } = useSiteData();

  return (
    <section id="featured-brands" className="py-20 bg-brand-slate">
      <div className="site-container">
        <div className="mb-12">
          <div className="mx-auto max-w-2xl text-center">
            <h3 className="text-3xl font-extrabold text-brand-navy uppercase tracking-tight">
              Featured Truck Brands
            </h3>
            <p className="text-gray-600 mt-3 text-base">
              We supply components that guarantee maximum protection and optimal performance.{' '}
              <strong className="text-brand-navy">We specialise in all Japanese trucks.</strong>
            </p>
          </div>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-6">
          {featuredBrands.map((brand) => (
            <BrandCard key={brand.id} brand={brand} />
          ))}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/catalog"
            className="px-6 py-3 bg-brand-orange text-white text-sm font-bold uppercase tracking-wider hover:bg-orange-700 transition shadow-sm whitespace-nowrap"
          >
            Explore Full Catalog
          </Link>
          <a
            href={contactInfo.primaryTel}
            className="px-6 py-3 border border-brand-navy text-brand-navy text-sm font-bold uppercase tracking-wider hover:bg-brand-navy hover:text-white transition whitespace-nowrap"
          >
            Enquire Stock
          </a>
        </div>

        <div className="mt-8 py-2 text-center">
          <p className="text-sm text-gray-600 uppercase tracking-wide font-semibold">
            * Also supplying a wide range of parts for all major global truck brands and models.
          </p>
        </div>
      </div>
    </section>
  );
}
