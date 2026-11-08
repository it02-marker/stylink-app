import React, { useState } from 'react';
import CatalogHero from '../components/CatalogHero';
import BrandsMarquee from '../components/BrandsMarquee';
import CatalogContent from '../components/CatalogContent';

export default function CatalogPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      <CatalogHero />
      {/* Shared Marquee component */}
      <BrandsMarquee />
      {/* Unique Catalog Content */}
      <CatalogContent
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
    </>
  );
}
