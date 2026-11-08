import React from 'react';
import AboutHero from '../components/AboutHero';
import About from '../components/About';
import WhyUs from '../components/WhyUs';
import BrandsMarquee from '../components/BrandsMarquee';

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <About />
      <WhyUs />
      <BrandsMarquee />
    </>
  );
}
