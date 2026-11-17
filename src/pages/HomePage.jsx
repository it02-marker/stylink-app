import React from 'react';
import Hero from '../components/Hero';
import BrandsMarquee from '../components/BrandsMarquee';
import FeaturedBrands from '../components/FeaturedBrands';
import CtaBanner from '../components/CtaBanner';
import Testimonials from '../components/Testimonials';

export default function HomePage() {
  return (
    <>
      <Hero />
      <BrandsMarquee />
      <FeaturedBrands />
      <CtaBanner />
      <Testimonials />
    </>
  );
}
