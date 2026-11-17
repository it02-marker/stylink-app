import React from 'react';
import { useSearchParams } from 'react-router-dom';
import CatalogHero from '../components/CatalogHero';
import BrandsMarquee from '../components/BrandsMarquee';
import CatalogContent from '../components/CatalogContent';

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const updateSearchQuery = (value) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value.trim()) {
      nextParams.set('search', value);
    } else {
      nextParams.delete('search');
    }
    setSearchParams(nextParams, { replace: true });
  };

  return (
    <>
      <CatalogHero />
      {/* Shared Marquee component */}
      <BrandsMarquee />
      {/* Unique Catalog Content */}
      <CatalogContent
        searchQuery={searchQuery}
        setSearchQuery={updateSearchQuery}
      />
    </>
  );
}
