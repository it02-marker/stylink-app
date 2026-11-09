import React, { useEffect } from 'react';

export default function ProductModal({ item, onClose, contactInfo, onCopyOem, copiedId }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!item) return null;

  const baseUrl = contactInfo?.whatsappUrl || 'https://wa.me/';
  const whatsappMsg = `Hi Stylink Truck Parts, I am inquiring about the ${item.brand || ''} ${item.name || ''} (OEM: ${item.oemNumber || 'N/A'}). Is this part available?`;
  const whatsappLink = `${baseUrl}?text=${encodeURIComponent(whatsappMsg)}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white border border-gray-300 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-brand-navy text-white px-5 py-4 flex items-center justify-between sticky top-0 z-10 border-b border-brand-orange/40">
          <div className="flex items-center gap-2.5">
            {item.brand && (
              <span className="bg-brand-orange text-white text-[10px] font-black uppercase px-2 py-0.5 tracking-wider">
                {item.brand}
              </span>
            )}
            <span className="text-xs text-gray-300 uppercase tracking-widest font-semibold hidden sm:inline">
              Part Details
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-none bg-white/10 hover:bg-brand-orange text-white flex items-center justify-center transition"
            aria-label="Close modal"
          >
            <i className="fa-solid fa-xmark text-base"></i>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Main Visual & Key Data */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Image */}
            <div className="relative h-56 sm:h-64 bg-gray-900 border border-gray-200 overflow-hidden group">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <i className="fa-solid fa-truck text-4xl"></i>
                </div>
              )}
              {item.availability && (
                <div className="absolute bottom-2 left-2 bg-black/85 text-emerald-400 text-[10px] font-bold px-2.5 py-1 border border-emerald-500/40 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  {item.availability}
                </div>
              )}
            </div>

            {/* Quick Specs */}
            <div className="flex flex-col justify-between space-y-3">
              <div>
                <h3 className="text-base sm:text-lg font-black text-brand-navy uppercase leading-snug">
                  {item.name}
                </h3>
                {item.category && (
                  <p className="text-[11px] text-gray-500 uppercase tracking-wider mt-1 font-semibold">
                    Category: <span className="text-brand-orange font-bold">{item.category}</span>
                  </p>
                )}
              </div>

              {/* OEM Code Box */}
              {item.oemNumber && (
                <div className="bg-gray-50 border border-gray-200 p-3 space-y-1">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                    OEM / Part Number
                  </span>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs sm:text-sm font-extrabold text-brand-navy select-all break-all">
                      {item.oemNumber}
                    </span>
                    <button
                      type="button"
                      onClick={() => onCopyOem && onCopyOem(item.id, item.oemNumber)}
                      className="px-2.5 py-1 bg-white border border-gray-300 hover:border-brand-orange text-gray-700 hover:text-brand-orange text-[10px] font-bold uppercase transition flex items-center gap-1 shrink-0"
                      title="Copy OEM"
                    >
                      <i
                        className={`fa-regular ${
                          copiedId === item.id ? 'fa-circle-check text-emerald-600' : 'fa-copy'
                        }`}
                      ></i>
                      <span>{copiedId === item.id ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons inside Quick Specs */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 text-center"
                >
                  <i className="fa-brands fa-whatsapp text-sm"></i>
                  <span>WhatsApp Inquiry</span>
                </a>
                {contactInfo?.primaryTel && (
                  <a
                    href={contactInfo.primaryTel}
                    className="py-2.5 px-4 bg-brand-navy hover:bg-brand-orange text-white text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 text-center"
                  >
                    <i className="fa-solid fa-phone text-xs"></i>
                    <span>Call Branch</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Detailed Info Sections */}
          <div className="border-t border-gray-200 pt-4 space-y-3">
            {/* Compatibility */}
            {item.compatibility && (
              <div className="bg-amber-50/60 border-l-4 border-amber-500 p-3">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5 mb-1">
                  <i className="fa-solid fa-truck-moving text-amber-700"></i>
                  Vehicle Compatibility
                </h4>
                <p className="text-xs text-gray-700 font-medium leading-relaxed">
                  {item.compatibility}
                </p>
              </div>
            )}

            {/* Full Description */}
            {item.description && (
              <div className="space-y-1">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-brand-navy">
                  Part Specification & Description
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 border border-gray-200">
                  {item.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-100 px-5 py-3 border-t border-gray-200 flex items-center justify-between text-[11px] text-gray-500">
          <span>* Genuine and OEM certified parts for commercial Japanese fleets.</span>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-bold uppercase text-brand-navy hover:text-brand-orange transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
