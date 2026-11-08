import React from 'react';
import Hero from '../components/Hero';
import BrandsMarquee from '../components/BrandsMarquee';
import Products from '../components/Products';
import CtaBanner from '../components/CtaBanner';
import Testimonials from '../components/Testimonials';

export default function HomePage() {
  return (
    <>
      <Hero />
      <BrandsMarquee />
      <Products />
      <CtaBanner />
      <Testimonials />
    </>
  );
}
