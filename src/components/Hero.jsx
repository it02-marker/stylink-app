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

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
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

  const handlePrev = () => {
    prevSlide();
    resetTimer();
  };

  const handleNext = () => {
    nextSlide();
    resetTimer();
  };

  const translatePercent = -(currentSlide * (100 / totalSlides));

  if (!content || !heroSlides.length) return null;
  return (
    <section
      id="home"
      className="relative h-[80dvh] w-full flex items-center overflow-hidden bg-brand-navy"
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
            <div className="absolute inset-0 bg-gradient-to-r from-brand-navyDark/75 via-brand-navy/40 to-transparent" />
          </div>
        ))}
      </div>

      {/* Navigation Controls (Inside Hero Only) */}
      <button
        id="prev-slide"
        onClick={handlePrev}
        aria-label="Previous slide"
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center bg-brand-navy/50 border border-white/20 text-white hover:bg-brand-orange hover:border-brand-orange transition-all duration-300"
      >
        <i className="fa-solid fa-chevron-left text-lg"></i>
      </button>
      <button
        id="next-slide"
        onClick={handleNext}
        aria-label="Next slide"
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center bg-brand-navy/50 border border-white/20 text-white hover:bg-brand-orange hover:border-brand-orange transition-all duration-300"
      >
        <i className="fa-solid fa-chevron-right text-lg"></i>
      </button>

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
          <h1 className="mx-auto mb-6 max-w-[16ch] text-balance text-[clamp(2.5rem,8vw,5.5rem)] font-extrabold uppercase leading-[1.05] tracking-tight text-white drop-shadow-md">
            {content.title}
          </h1>
          <p className="mx-auto max-w-xl text-lg md:text-xl text-gray-200 mb-10 font-light drop-shadow">
            {content.description}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/outlets"
              className="px-8 py-4 bg-brand-orange text-white font-bold text-sm uppercase tracking-wider hover:bg-orange-700 transition shadow-lg inline-flex items-center gap-2"
            >
              <span>{content.ctaLabel}</span>
              <i className="fa-solid fa-arrow-right text-xs"></i>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
