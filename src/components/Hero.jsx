import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSiteData } from '../context/SiteDataContext';
export default function Hero() {
  const { slides: heroSlides, heroSections } = useSiteData();
  const content = heroSections.home;

  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = heroSlides.length;
  const autoSwapSpeed = 4000;
  const timerRef = useRef(null);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    resetTimer();
  };

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(nextSlide, autoSwapSpeed);
  }, [nextSlide]);

  const resetTimer = useCallback(() => {
    startTimer();
  }, [startTimer]);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTimer]);

  const translatePercent = -(currentSlide * (100 / totalSlides));

  if (!content || !heroSlides.length) return null;
  return (
    <section
      id="home"
      className="relative min-h-[clamp(26rem,72svh,34rem)] sm:min-h-[80dvh] w-full flex items-center py-16 sm:py-24 overflow-hidden bg-brand-navy"
    >
      {/* Background Image Slides Container (Slide Window) */}
      <div
        id="hero-slider-track"
        className="absolute inset-0 w-[300%] h-full flex transition-transform duration-700 ease-out z-0"
        style={{ transform: `translateX(${translatePercent}%)` }}
      >
        {heroSlides.map((slide) => (
          <div key={slide.id} className="w-1/3 h-full relative flex-shrink-0">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${slide.imageUrl}')` }}
              role="img"
              aria-label={slide.alt}
            />
            {/* Lighter Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-brand-navyDark/75 via-brand-navy/55 to-brand-navyDark/40 sm:bg-gradient-to-r sm:from-brand-navyDark/75 sm:via-brand-navy/40 sm:to-transparent" />
          </div>
        ))}
      </div>
      <div className="subtle-backdrop-blur absolute inset-0 z-10 pointer-events-none" />

      {/* Slide Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`w-3 h-3 rounded-full transition-all ${currentSlide === index ? 'bg-brand-orange' : 'bg-white/40 hover:bg-white'
              }`}
          />
        ))}
      </div>

      {/* Hero Content Overlay */}
      <div className="site-container relative z-20 text-center">
        <div className="mx-auto max-w-3xl">
          <h1 className="mx-auto mb-4 sm:mb-6 max-w-[16ch] text-balance text-[clamp(1.75rem,7.5vw,2.75rem)] sm:text-[clamp(3rem,6vw,5.5rem)] font-extrabold uppercase leading-[1.05] tracking-tight text-white drop-shadow-md">
            {content.title}
          </h1>
          <p className="mx-auto mb-6 sm:mb-10 max-w-xl text-[clamp(0.875rem,3.8vw,1rem)] sm:text-lg leading-relaxed text-gray-200 font-light drop-shadow">
            {content.description}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 sm:mt-12 sm:gap-4">
            <Link
              to="/outlets"
              className="hero-cta-outline inline-flex rounded-full border border-white bg-transparent px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-brand-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:px-8 sm:py-3.5 sm:text-sm"
            >
              {content.ctaLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
