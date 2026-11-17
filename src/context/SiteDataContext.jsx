import React, { createContext, useContext, useEffect, useState } from 'react';

const SiteDataContext = createContext(null);
const REFRESH_INTERVAL_MS = 15_000;

async function fetchJson(path, signal) {
  const response = await fetch(path, { cache: 'no-store', signal });
  if (!response.ok) {
    throw new Error(`Request to ${path} failed with status ${response.status}`);
  }
  return response.json();
}

export function SiteDataProvider({ children }) {
  const [data, setData] = useState({
    featuredBrands: [],
    branches: [],
    brands: [],
    slides: [],
    features: [],
    testimonials: [],
    company: null,
    navLinks: [],
    contactInfo: {},
    socialLinks: [],
    catalogItems: [],
    catalogCategories: [],
    catalogBrands: [],
    brandLogosMap: {},
    loading: true,
  });

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    let refreshTimer;

    async function loadSiteData() {
      try {
        const [
          featuredBrands,
          branches,
          brands,
          slides,
          features,
          testimonials,
          company,
          catalogItems,
          filters,
        ] = await Promise.all([
          fetchJson('/api/featured-brands', controller.signal),
          fetchJson('/api/branches', controller.signal),
          fetchJson('/api/brands', controller.signal),
          fetchJson('/api/slides', controller.signal),
          fetchJson('/api/features', controller.signal),
          fetchJson('/api/testimonials', controller.signal),
          fetchJson('/api/company', controller.signal),
          fetchJson('/api/catalog', controller.signal),
          fetchJson('/api/catalog/filters', controller.signal),
        ]);

        if (!active) return;

        const safeBrands = Array.isArray(brands) ? brands : [];
        const safeCatalog = Array.isArray(catalogItems) ? catalogItems : [];

        const brandLogosMap = {};
        for (const b of safeBrands) {
          if (b.code && b.logoUrl) brandLogosMap[b.code] = b.logoUrl;
        }
        for (const item of safeCatalog) {
          if (item.brand && item.brandDetails?.logoUrl) {
            brandLogosMap[item.brand] = item.brandDetails.logoUrl;
          }
        }

        setData({
          featuredBrands: Array.isArray(featuredBrands) ? featuredBrands : [],
          branches: Array.isArray(branches) ? branches : [],
          brands: safeBrands,
          slides: Array.isArray(slides) ? slides : [],
          features: Array.isArray(features) ? features : [],
          testimonials: Array.isArray(testimonials) ? testimonials : [],
          company: company || null,
          navLinks: company?.navigation || [],
          contactInfo: company?.contact || {},
          socialLinks: company?.socials || [],
          catalogItems: safeCatalog,
          catalogCategories: filters?.categories || [],
          catalogBrands: filters?.brands || [],
          brandLogosMap,
          loading: false,
        });
      } catch (err) {
        if (active && err.name !== 'AbortError') {
          console.error('Failed to load site data:', err);
        }
      } finally {
        if (active) {
          setData((prev) => ({ ...prev, loading: false }));
          refreshTimer = setTimeout(loadSiteData, REFRESH_INTERVAL_MS);
        }
      }
    }

    loadSiteData();

    return () => {
      active = false;
      clearTimeout(refreshTimer);
      controller.abort();
    };
  }, []);

  return (
    <SiteDataContext.Provider value={data}>
      {children}
    </SiteDataContext.Provider>
  );
}

export function useSiteData() {
  const ctx = useContext(SiteDataContext);
  if (!ctx) throw new Error('useSiteData must be used inside SiteDataProvider');
  return ctx;
}
