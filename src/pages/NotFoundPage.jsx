import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <section className="py-32 bg-gray-50 flex items-center justify-center min-h-[60vh]">
      <div className="max-w-md mx-auto px-4 text-center">
        <div className="w-20 h-20 bg-orange-100 text-brand-orange rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-black">
          404
        </div>
        <h1 className="text-3xl font-black text-brand-navy uppercase tracking-tight mb-3">
          Page Not Found
        </h1>
        <p className="text-gray-600 text-sm mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-block px-8 py-3.5 bg-brand-orange text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-orange-700 transition shadow-lg"
        >
          Return to Home
        </Link>
      </div>
    </section>
  );
}

