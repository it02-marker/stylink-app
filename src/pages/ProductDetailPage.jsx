import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { catalogItems, brandLogosMap } from '../data/catalog';
import { contactInfo } from '../data/navigation';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  // Scroll to top when product changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  // Find product
  const product = catalogItems.find((item) => item.id === id);

  // If not found, fallback to first item or back to catalog
  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center space-y-4">
        <div className="w-16 h-16 bg-orange-100 text-brand-orange flex items-center justify-center text-2xl">
          <i className="fa-solid fa-triangle-exclamation"></i>
        </div>
        <h2 className="text-2xl font-black text-brand-navy uppercase">Part Not Found</h2>
        <p className="text-gray-500 max-w-md">
          The spare part you are looking for may have been moved or updated.
        </p>
        <Link
          to="/catalog"
          className="px-6 py-3 bg-brand-orange text-white font-bold text-xs uppercase tracking-wider hover:bg-orange-700 transition"
        >
          Back to Catalogue
        </Link>
      </div>
    );
  }

  // Related products (same category or brand, excluding current product)
  const relatedItems = catalogItems.filter(
    (item) => item.id !== product.id && (item.category === product.category || item.brand === product.brand)
  );

  // If few related items, pad with remaining catalog items so marquee looks great
  const finalRelated = (
    relatedItems.length >= 4
      ? relatedItems
      : [...relatedItems, ...catalogItems.filter((i) => i.id !== product.id && !relatedItems.includes(i))]
  ).slice(0, 10);

  // Quadruple for smooth infinite marquee loop
  const marqueeItems = [...finalRelated, ...finalRelated, ...finalRelated, ...finalRelated];

  const handleCopyOem = () => {
    if (product.oemNumber) {
      navigator.clipboard.writeText(product.oemNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const baseUrl = contactInfo?.whatsappUrl || 'https://wa.me/';
  const whatsappMsg = `Hi Stylink Truck Parts, I am inquiring about the ${product.brand || ''} ${product.name || ''} (OEM: ${product.oemNumber || 'N/A'}). Please confirm availability and pricing.`;
  const whatsappLink = `${baseUrl}?text=${encodeURIComponent(whatsappMsg)}`;

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb Bar */}
      <div className="bg-gray-50 border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <nav className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider">
            <Link to="/" className="text-brand-orange hover:underline">
              Home
            </Link>
            <span className="text-gray-300">/</span>
            <Link to="/catalog" className="text-brand-orange hover:underline">
              Catalogue
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-700 font-bold truncate max-w-xs sm:max-w-md">
              {product.name}
            </span>
          </nav>
          <button
            type="button"
            onClick={() => navigate('/catalog')}
            className="text-xs font-bold uppercase text-gray-500 hover:text-brand-orange transition flex items-center gap-1.5"
          >
            <i className="fa-solid fa-arrow-left text-[10px]"></i>
            <span className="hidden sm:inline">Back to Catalogue</span>
          </button>
        </div>
      </div>

      {/* Main Full-Width Product Showcase Section */}
      <section className="py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
            {/* Left Column: Product Image Display (lg: 5 cols) */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="w-full bg-slate-50 border border-gray-200 rounded-none p-6 sm:p-10 flex items-center justify-center relative min-h-[360px] sm:min-h-[460px] group shadow-inner">
                {product.brand && (
                  <div className="absolute top-4 left-4 bg-white/95 px-3 py-1.5 shadow-md border border-gray-200 flex items-center justify-center h-9 max-w-[110px] backdrop-blur-sm z-10">
                    {brandLogosMap[product.brand] ? (
                      <img
                        src={brandLogosMap[product.brand]}
                        alt={product.brand}
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <span className="text-[11px] font-black text-brand-navy uppercase tracking-widest">
                        {product.brand}
                      </span>
                    )}
                  </div>
                )}
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-h-[320px] sm:max-h-[400px] w-auto max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <p className="text-[11px] text-gray-400 uppercase tracking-widest mt-3 text-center">
                * Genuine & OEM heavy-duty Japanese commercial replacement unit
              </p>
            </div>

            {/* Right Column: Product Info & Actions (lg: 7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Brand Tag */}
              <div>
                <span className="text-brand-orange text-sm font-black uppercase tracking-widest block mb-2">
                  {product.brand}
                </span>
                <h1 className="text-2xl sm:text-4xl font-black text-brand-navy uppercase tracking-tight leading-tight">
                  {product.name}
                </h1>
              </div>

              {/* Price / Quote Banner */}
              <div className="bg-slate-50 border border-gray-200 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-brand-orange">
                    Wholesale & Retail
                  </span>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    / Direct Stock
                  </span>
                </div>
                <div className="text-[11px] text-gray-600 uppercase font-semibold">
                  Zimbabwe Branch Collection & Nationwide Delivery
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <div className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  {product.description}
                </div>
              )}

              {/* Specifications Table (TyreZim style) */}
              <div className="border border-gray-200 divide-y divide-gray-200">
                {product.oemNumber && (
                  <div className="flex justify-between items-center px-4 py-3 bg-white text-xs sm:text-sm">
                    <span className="font-bold text-brand-navy uppercase">OEM / Part Number</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-brand-orange text-xs sm:text-sm">
                        {product.oemNumber}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyOem}
                        className="px-2 py-0.5 bg-gray-100 hover:bg-brand-orange hover:text-white text-gray-600 text-[10px] font-bold uppercase transition border border-gray-200"
                        title="Copy OEM"
                      >
                        <i
                          className={`fa-regular ${
                            copied ? 'fa-circle-check text-emerald-600' : 'fa-copy'
                          }`}
                        ></i>
                        <span className="ml-1">{copied ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {product.category && (
                  <div className="flex justify-between items-center px-4 py-3 bg-slate-50/70 text-xs sm:text-sm">
                    <span className="font-bold text-brand-navy uppercase">Category</span>
                    <span className="font-semibold text-gray-800 capitalize">
                      {product.category}
                    </span>
                  </div>
                )}

                {product.compatibility && (
                  <div className="flex justify-between items-center px-4 py-3 bg-white text-xs sm:text-sm">
                    <span className="font-bold text-brand-navy uppercase">Truck Compatibility</span>
                    <span className="font-semibold text-gray-800 text-right max-w-xs">
                      {product.compatibility}
                    </span>
                  </div>
                )}
              </div>

              {/* Call-To-Action Inquiries */}
              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-sm text-center"
                >
                  <i className="fa-brands fa-whatsapp text-lg"></i>
                  <span>Enquire Pricing on WhatsApp</span>
                </a>
                {contactInfo?.primaryTel && (
                  <a
                    href={contactInfo.primaryTel}
                    className="py-4 px-6 bg-brand-navy hover:bg-brand-orange text-white font-black text-xs sm:text-sm uppercase tracking-wider transition flex items-center justify-center gap-2 text-center"
                  >
                    <i className="fa-solid fa-phone text-sm"></i>
                    <span>Call Sales Desk</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Underneath: Moving Marquee of Related Catalogue Items */}
      <section className="py-12 bg-slate-50 border-t border-brand-border overflow-hidden marquee-container">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 flex flex-col sm:flex-row justify-between items-baseline gap-2">
          <div>
            <span className="text-[10px] font-black uppercase text-brand-orange tracking-widest block">
              Related Spares
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-brand-navy uppercase tracking-tight">
              More {product.brand} & {product.category} Parts
            </h3>
          </div>
          <Link
            to="/catalog"
            className="text-xs font-bold uppercase text-brand-navy hover:text-brand-orange transition flex items-center gap-1.5"
          >
            <span>View All Catalogue Items</span>
            <i className="fa-solid fa-arrow-right text-[10px]"></i>
          </Link>
        </div>

        {/* Infinite Moving Marquee Track of Product Cards */}
        <div className="relative w-full flex overflow-hidden py-3">
          <div className="animate-marquee gap-5 items-stretch px-4">
            {marqueeItems.map((item, idx) => (
              <Link
                key={`${item.id}-${idx}`}
                to={`/catalog/${item.id}`}
                className="w-64 sm:w-72 bg-white border border-gray-200 hover:border-brand-orange transition-all duration-300 flex-shrink-0 flex flex-col justify-between group shadow-sm hover:shadow-md cursor-pointer"
              >
                <div>
                  <div className="h-44 bg-gray-900 overflow-hidden relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {item.brand && (
                      <div className="absolute top-2 left-2 bg-white/95 px-2 py-1 shadow-sm border border-gray-200 flex items-center justify-center h-6 max-w-[75px] backdrop-blur-sm z-10">
                        {brandLogosMap[item.brand] ? (
                          <img
                            src={brandLogosMap[item.brand]}
                            alt={item.brand}
                            className="max-h-full max-w-full object-contain"
                          />
                        ) : (
                          <span className="text-[8px] font-black text-brand-navy uppercase tracking-wider">
                            {item.brand}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="p-3.5 space-y-1.5">
                    <h4 className="text-xs font-bold text-brand-navy uppercase leading-snug line-clamp-2 group-hover:text-brand-orange transition min-h-[2rem]">
                      {item.name}
                    </h4>
                    {item.oemNumber && (
                      <p className="text-[10px] font-mono text-gray-500 truncate">
                        OEM: <span className="font-bold text-gray-700">{item.oemNumber}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-3 pt-0 flex items-center justify-between text-[11px] font-bold text-brand-orange uppercase tracking-wider">
                  <span>View Details</span>
                  <i className="fa-solid fa-arrow-right text-[9px] group-hover:translate-x-1 transition-transform"></i>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

