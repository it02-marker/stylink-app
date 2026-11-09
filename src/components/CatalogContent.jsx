import React, { useState, useMemo, useRef, useEffect } from 'react';
import { catalogCategories, catalogItems } from '../data/catalog';
import { contactInfo } from '../data/navigation';
import ProductModal from './ProductModal';

export default function CatalogContent({ searchQuery = '', setSearchQuery }) {
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const copyTimeoutRef = useRef(null);

  const filterableCategories = useMemo(
    () => catalogCategories.filter((c) => c.id !== 'all'),
    []
  );

  const filterableBrands = useMemo(() => {
    const brandsSet = new Set(catalogItems.map((item) => item.brand).filter(Boolean));
    return Array.from(brandsSet).sort();
  }, []);

  const { brandCounts, categoryCounts } = useMemo(() => {
    const bCounts = {};
    const cCounts = {};

    filterableBrands.forEach((b) => (bCounts[b] = 0));
    filterableCategories.forEach((c) => (cCounts[c.id] = 0));

    catalogItems.forEach((item) => {
      if (bCounts[item.brand] !== undefined) bCounts[item.brand] += 1;
      if (cCounts[item.category] !== undefined) cCounts[item.category] += 1;
    });

    return { brandCounts: bCounts, categoryCounts: cCounts };
  }, [filterableBrands, filterableCategories]);

  useEffect(() => {
    document.body.style.overflow = isMobileFiltersOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileFiltersOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsMobileFiltersOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleBrandToggle = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleCategoryToggle = (catId) => {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId]
    );
  };

  const handleClearAll = () => {
    setSelectedBrands([]);
    setSelectedCategories([]);
    setInStockOnly(false);
    if (setSearchQuery) setSearchQuery('');
  };

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return catalogItems.filter((item) => {
      if (selectedBrands.length > 0 && !selectedBrands.includes(item.brand)) return false;
      if (selectedCategories.length > 0 && !selectedCategories.includes(item.category)) return false;

      if (inStockOnly) {
        const isAvailable = item.availability && item.availability.toLowerCase().includes('in stock');
        if (!isAvailable) return false;
      }

      if (q) {
        return (
          (item.name && item.name.toLowerCase().includes(q)) ||
          (item.brand && item.brand.toLowerCase().includes(q)) ||
          (item.oemNumber && item.oemNumber.toLowerCase().includes(q)) ||
          (item.compatibility && item.compatibility.toLowerCase().includes(q)) ||
          (item.description && item.description.toLowerCase().includes(q))
        );
      }

      return true;
    });
  }, [selectedBrands, selectedCategories, inStockOnly, searchQuery]);

  const activeFiltersCount =
    selectedBrands.length +
    selectedCategories.length +
    (inStockOnly ? 1 : 0) +
    (searchQuery ? 1 : 0);

  const handleCopyOem = (id, oem) => {
    if (!oem) return;
    navigator.clipboard?.writeText(oem);
    setCopiedId(id);
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    copyTimeoutRef.current = setTimeout(() => setCopiedId(null), 2000);
  };

  const getWhatsAppLink = (item) => {
    const message = encodeURIComponent(
      `Hello, I would like to check availability and price for: ${item.name} (${item.brand}, OEM: ${item.oemNumber}).`
    );
    const baseUrl = contactInfo?.whatsappUrl || 'https://wa.me/';
    return baseUrl.includes('?') ? `${baseUrl}&text=${message}` : `${baseUrl}?text=${message}`;
  };

  const renderSidebarFilters = () => (
    <div className="space-y-6 text-xs">
      <div className="flex items-center justify-between pb-3 border-b border-gray-300">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-sliders text-brand-orange text-[11px]" aria-hidden="true"></i>
          <h3 className="font-bold text-brand-navy uppercase text-xs tracking-wider">
            Filters
          </h3>
          {activeFiltersCount > 0 && (
            <span className="w-4 h-4 bg-brand-orange text-white text-[9px] font-bold rounded-none flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            className="text-[10px] font-bold text-gray-500 hover:text-brand-orange uppercase transition"
          >
            Reset
          </button>
        )}
      </div>

      {filterableBrands.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-bold text-brand-navy text-[10px] uppercase tracking-wider flex items-center justify-between">
            <span>Truck Brand</span>
            <span className="text-[9px] text-gray-400 font-normal">
              {selectedBrands.length ? `${selectedBrands.length}` : 'All'}
            </span>
          </h4>
          <div className="space-y-1.5">
            {filterableBrands.map((brand) => {
              const isChecked = selectedBrands.includes(brand);
              return (
                <label
                  key={brand}
                  className="flex items-center justify-between group cursor-pointer select-none py-1 px-1.5 rounded-none hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleBrandToggle(brand)}
                      className="w-3.5 h-3.5 rounded-none border-gray-400 text-brand-orange accent-brand-orange cursor-pointer"
                    />
                    <span
                      className={`text-xs ${isChecked ? 'font-bold text-brand-navy' : 'text-gray-700'
                        }`}
                    >
                      {brand}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400">
                    {brandCounts[brand] || 0}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {filterableCategories.length > 0 && (
        <div className="pt-4 border-t border-gray-200 space-y-2">
          <h4 className="font-bold text-brand-navy text-[10px] uppercase tracking-wider flex items-center justify-between">
            <span>Part Category</span>
            <span className="text-[9px] text-gray-400 font-normal">
              {selectedCategories.length ? `${selectedCategories.length}` : 'All'}
            </span>
          </h4>
          <div className="space-y-1.5">
            {filterableCategories.map((cat) => {
              const isChecked = selectedCategories.includes(cat.id);
              return (
                <label
                  key={cat.id}
                  className="flex items-center justify-between group cursor-pointer select-none py-1 px-1.5 rounded-none hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleCategoryToggle(cat.id)}
                      className="w-3.5 h-3.5 rounded-none border-gray-400 text-brand-orange accent-brand-orange cursor-pointer"
                    />
                    <span
                      className={`text-xs ${isChecked ? 'font-bold text-brand-navy' : 'text-gray-700'
                        }`}
                    >
                      {cat.label}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400">
                    {categoryCounts[cat.id] || 0}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      <div className="pt-4 border-t border-gray-200">
        <label className="flex items-center justify-between cursor-pointer select-none py-1 px-1.5 rounded-none hover:bg-gray-100 transition">
          <div className="flex items-center gap-2.5">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="w-3.5 h-3.5 rounded-none border-gray-400 text-brand-orange accent-brand-orange cursor-pointer"
            />
            <span className={`text-xs ${inStockOnly ? 'font-bold text-brand-navy' : 'text-gray-700'}`}>
              In Stock Only
            </span>
          </div>
          <span className="w-2 h-2 rounded-none bg-emerald-600"></span>
        </label>
      </div>
    </div>
  );

  return (
    <section id="catalog-grid" className="py-8 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:hidden mb-4 flex items-center justify-between bg-white p-3 rounded-none border border-gray-300">
          <div>
            <h2 className="text-sm font-bold text-brand-navy uppercase">Catalog</h2>
            <p className="text-[10px] text-gray-500">{filteredItems.length} items</p>
          </div>
          <button
            type="button"
            onClick={() => setIsMobileFiltersOpen(true)}
            className="px-3 py-1.5 bg-brand-navy text-white text-[10px] font-bold uppercase rounded-none flex items-center gap-2"
          >
            <i className="fa-solid fa-sliders"></i>
            <span>Filter</span>
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 bg-brand-orange text-white rounded-none flex items-center justify-center text-[9px]">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <aside className="hidden lg:block w-56 xl:w-60 flex-shrink-0 bg-white p-4 rounded-none border border-gray-300 sticky top-20">
            {renderSidebarFilters()}
          </aside>

          {isMobileFiltersOpen && (
            <div className="fixed inset-0 z-50 flex lg:hidden" role="dialog" aria-modal="true">
              <div
                className="fixed inset-0 bg-black/60 transition-opacity"
                onClick={() => setIsMobileFiltersOpen(false)}
              />
              <div className="relative ml-auto w-full max-w-xs h-full bg-white p-4 shadow-none border-l border-gray-300 overflow-y-auto flex flex-col justify-between z-10">
                <div>
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-300">
                    <h3 className="font-bold text-brand-navy uppercase text-xs">
                      Filters
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsMobileFiltersOpen(false)}
                      className="text-gray-500 hover:text-black p-1"
                      aria-label="Close filters"
                    >
                      <i className="fa-solid fa-xmark text-sm" aria-hidden="true"></i>
                    </button>
                  </div>
                  {renderSidebarFilters()}
                </div>

                <div className="pt-4 mt-6 border-t border-gray-300">
                  <button
                    type="button"
                    onClick={() => setIsMobileFiltersOpen(false)}
                    className="w-full py-2.5 bg-brand-orange text-white font-bold text-xs uppercase rounded-none hover:bg-orange-700 transition"
                  >
                    View {filteredItems.length} Results
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex-grow w-full space-y-4">
            <div className="bg-white p-3.5 rounded-none border border-gray-300 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-grow max-w-sm">
                  <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
                    placeholder="Search part name, OEM..."
                    className="w-full pl-8 pr-7 py-2 bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 text-xs rounded-none focus:outline-none focus:ring-1 focus:ring-brand-orange font-medium"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery && setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                    >
                      <i className="fa-solid fa-circle-xmark"></i>
                    </button>
                  )}
                </div>

                <div className="text-[11px] font-bold uppercase text-gray-500 whitespace-nowrap">
                  Showing <span className="text-brand-navy">{filteredItems.length}</span> / {catalogItems.length}
                </div>
              </div>

              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-gray-200">
                  <span className="text-[10px] font-bold text-gray-400 uppercase mr-1">Active:</span>

                  {selectedBrands.map((brand) => (
                    <span key={brand} className="inline-flex items-center gap-1.5 px-2 py-1 bg-brand-navy text-white text-[10px] font-medium rounded-none">
                      <span>{brand}</span>
                      <button type="button" onClick={() => handleBrandToggle(brand)} className="hover:text-brand-orange text-[9px]">
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </span>
                  ))}

                  {selectedCategories.map((catId) => {
                    const catObj = filterableCategories.find((c) => c.id === catId);
                    return (
                      <span key={catId} className="inline-flex items-center gap-1.5 px-2 py-1 bg-brand-orange text-white text-[10px] font-medium rounded-none">
                        <span>{catObj ? catObj.label : catId}</span>
                        <button type="button" onClick={() => handleCategoryToggle(catId)} className="hover:text-black text-[9px]">
                          <i className="fa-solid fa-xmark"></i>
                        </button>
                      </span>
                    );
                  })}

                  {inStockOnly && (
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-emerald-600 text-white text-[10px] font-medium rounded-none">
                      <span>In Stock</span>
                      <button type="button" onClick={() => setInStockOnly(false)} className="hover:text-black text-[9px]">
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </span>
                  )}

                  {searchQuery && (
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-gray-200 text-gray-800 text-[10px] font-medium rounded-none">
                      <span>&quot;{searchQuery}&quot;</span>
                      <button type="button" onClick={() => setSearchQuery && setSearchQuery('')} className="hover:text-red-500 text-[9px]">
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </span>
                  )}

                  <button type="button" onClick={handleClearAll} className="text-[10px] text-brand-orange font-bold uppercase hover:underline ml-1">
                    Clear All
                  </button>
                </div>
              )}
            </div>

            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedProduct(item)}
                    className="bg-white rounded-none border border-gray-300 hover:border-brand-orange hover:shadow-md transition-all duration-150 flex flex-col justify-between group h-full cursor-pointer"
                  >
                    <div className="space-y-3">
                      <div className="relative h-44 bg-gray-900 overflow-hidden">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                        {item.brand && (
                          <div className="absolute top-2 left-2 bg-brand-navy/90 text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded-none border border-white/20">
                            {item.brand}
                          </div>
                        )}

                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-brand-orange text-white text-[9px] font-bold uppercase px-1.5 py-0.5 tracking-wider shadow">
                          View Info
                        </div>
                      </div>

                      <div className="px-3 space-y-2">
                        <h3 className="text-xs font-bold text-brand-navy uppercase group-hover:text-brand-orange transition leading-snug line-clamp-2 min-h-[2.25rem]">
                          {item.name}
                        </h3>

                        {item.oemNumber && (
                          <div className="inline-flex items-center gap-1.5 bg-gray-100 rounded-none px-2 py-0.5 text-[10px] text-gray-700 font-mono border border-gray-200">
                            <span className="text-gray-400 font-sans text-[9px] font-bold">OEM:</span>
                            <span className="font-bold text-[10px]">{item.oemNumber}</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyOem(item.id, item.oemNumber);
                              }}
                              className="text-gray-400 hover:text-brand-orange transition ml-0.5"
                              title="Copy OEM"
                            >
                              <i
                                className={`fa-regular ${copiedId === item.id ? 'fa-circle-check text-emerald-600' : 'fa-copy'
                                  }`}
                              ></i>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer bar with View Details prompt + icon-only actions */}
                    <div className="p-3 pt-4 flex items-center justify-between border-t border-gray-100 mt-2">
                      <span className="text-[10px] font-bold text-brand-orange uppercase tracking-wider group-hover:underline flex items-center gap-1">
                        Details <i className="fa-solid fa-arrow-right text-[8px]"></i>
                      </span>
                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <a
                          href={getWhatsAppLink(item)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-7 h-7 bg-emerald-600 hover:bg-emerald-700 text-white rounded-none transition flex items-center justify-center"
                          title="Enquire on WhatsApp"
                          aria-label="Enquire on WhatsApp"
                        >
                          <i className="fa-brands fa-whatsapp text-xs"></i>
                        </a>
                        {contactInfo?.primaryTel && (
                          <a
                            href={contactInfo.primaryTel}
                            className="w-7 h-7 bg-gray-100 hover:bg-brand-navy hover:text-white text-gray-700 rounded-none transition flex items-center justify-center border border-gray-200"
                            title="Call Branch"
                            aria-label="Call Branch"
                          >
                            <i className="fa-solid fa-phone text-[10px]"></i>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-none border border-gray-300 p-8 text-center space-y-3">
                <div className="w-10 h-10 bg-orange-100 text-brand-orange rounded-none flex items-center justify-center mx-auto text-lg">
                  <i className="fa-solid fa-magnifying-glass"></i>
                </div>
                <h3 className="text-sm font-bold text-brand-navy uppercase">No Matching Parts Found</h3>
                <div>
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-[10px] font-bold uppercase rounded-none transition"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductModal
          item={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          contactInfo={contactInfo}
          onCopyOem={handleCopyOem}
          copiedId={copiedId}
        />
      )}
    </section>
  );
}