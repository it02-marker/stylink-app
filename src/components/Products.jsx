import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { productsData } from '../data/products';
import { contactInfo } from '../data/navigation';

export default function Products() {
  return (
    <section id="products" className="py-20 bg-brand-slate">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h3 className="text-3xl font-extrabold text-brand-navy uppercase tracking-tight">
              Genuine & OEM Parts
            </h3>
            <p className="text-gray-600 mt-3 text-base">
              We supply components that guarantee maximum protection and optimal performance.{' '}
              <strong className="text-brand-navy">We specialise in all Japanese trucks.</strong>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
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
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {productsData.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>

        <div className="mt-8 border-l-2 border-brand-orange pl-6 py-2">
          <p className="text-sm text-gray-600 uppercase tracking-wide font-semibold">
            * Also supplying a wide range of parts for all major global truck brands and models.
          </p>
        </div>
      </div>
    </section>
  );
}

