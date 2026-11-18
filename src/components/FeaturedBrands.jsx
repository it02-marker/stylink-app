import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import BrandCard from './BrandCard';
import { useSiteData } from '../context/SiteDataContext';
export default function FeaturedBrands() {
  const { featuredBrands, contactInfo } = useSiteData();
  const cardsRef = useRef(null);
  const scrollbarRef = useRef(null);
  const thumbRef = useRef(null);
  const dragRef = useRef(null);
  const cardsDragRef = useRef(null);
  const suppressCardClickUntilRef = useRef(0);
  const [scrollbar, setScrollbar] = useState({ visible: false, thumbSize: 100, progress: 0 });

  const updateScrollbar = useCallback(() => {
    const cards = cardsRef.current;
    if (!cards) return;

    const maxScroll = cards.scrollWidth - cards.clientWidth;
    const thumbSize = maxScroll > 0
      ? Math.max((cards.clientWidth / cards.scrollWidth) * 100, 12)
      : 100;
    const progress = maxScroll > 0 ? cards.scrollLeft / maxScroll : 0;
    if (thumbRef.current) {
      thumbRef.current.style.width = `${thumbSize}%`;
      thumbRef.current.style.left = `${progress * (100 - thumbSize)}%`;
    }
    setScrollbar({ visible: maxScroll > 1, thumbSize, progress });
  }, []);

  useEffect(() => {
    const cards = cardsRef.current;
    if (!cards) return undefined;

    updateScrollbar();
    const observer = new ResizeObserver(updateScrollbar);
    observer.observe(cards);
    Array.from(cards.children).forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [featuredBrands.length, updateScrollbar]);

  function scrollCards(direction) {
    const cards = cardsRef.current;
    if (!cards) return;
    cards.scrollBy({ left: direction * cards.clientWidth * 0.8, behavior: 'smooth' });
  }

  function handleScrollbarPointerDown(event) {
    const cards = cardsRef.current;
    const scrollbarTrack = scrollbarRef.current;
    if (!cards || !scrollbarTrack) return;

    const trackRect = scrollbarTrack.getBoundingClientRect();
    const thumbWidth = trackRect.width * (scrollbar.thumbSize / 100);
    const maxScroll = cards.scrollWidth - cards.clientWidth;

    if (!event.target.closest('[data-scroll-thumb]')) {
      const progress = (event.clientX - trackRect.left - thumbWidth / 2)
        / Math.max(1, trackRect.width - thumbWidth);
      cards.scrollTo({ left: Math.max(0, Math.min(1, progress)) * maxScroll, behavior: 'smooth' });
      return;
    }

    dragRef.current = {
      pointerId: event.pointerId,
      grabOffset: event.clientX
        - trackRect.left
        - (trackRect.width * scrollbar.progress * (1 - scrollbar.thumbSize / 100)),
      trackWidth: trackRect.width,
      thumbWidth,
      maxScroll,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handleScrollbarPointerMove(event) {
    const drag = dragRef.current;
    const cards = cardsRef.current;
    if (!drag || drag.pointerId !== event.pointerId || !cards) return;

    const scrollableTrackWidth = Math.max(1, drag.trackWidth - drag.thumbWidth);
    const thumbLeft = event.clientX - scrollbarRef.current.getBoundingClientRect().left - drag.grabOffset;
    cards.scrollLeft = Math.max(0, Math.min(1, thumbLeft / scrollableTrackWidth)) * drag.maxScroll;
  }

  function handleScrollbarPointerUp(event) {
    if (dragRef.current?.pointerId === event.pointerId) dragRef.current = null;
  }

  function handleCardsPointerDown(event) {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    cardsDragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startScroll: cardsRef.current.scrollLeft,
      moved: false,
    };
  }

  useEffect(() => {
    function handleCardsPointerMove(event) {
      const drag = cardsDragRef.current;
      const cards = cardsRef.current;
      if (!drag || drag.pointerId !== event.pointerId || !cards) return;

      const deltaX = event.clientX - drag.startX;
      if (!drag.moved && Math.abs(deltaX) < 5) return;

      drag.moved = true;
      cards.scrollLeft = drag.startScroll - deltaX;
    }

    function handleCardsPointerUp(event) {
      const drag = cardsDragRef.current;
      if (!drag || drag.pointerId !== event.pointerId) return;
      if (drag.moved) suppressCardClickUntilRef.current = Date.now() + 250;
      cardsDragRef.current = null;
    }

    window.addEventListener('pointermove', handleCardsPointerMove);
    window.addEventListener('pointerup', handleCardsPointerUp);
    window.addEventListener('pointercancel', handleCardsPointerUp);
    return () => {
      window.removeEventListener('pointermove', handleCardsPointerMove);
      window.removeEventListener('pointerup', handleCardsPointerUp);
      window.removeEventListener('pointercancel', handleCardsPointerUp);
    };
  }, []);

  function handleCardsClickCapture(event) {
    if (event.detail === 0 || Date.now() > suppressCardClickUntilRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    suppressCardClickUntilRef.current = 0;
  }

  return (
    <section id="featured-brands" className="py-20 bg-brand-slate">
      <div className="site-container">
        <div className="mb-12">
          <div className="mx-auto max-w-2xl text-center">
            <h3 className="text-3xl font-extrabold text-brand-navy uppercase tracking-tight">
              Featured Truck Brands
            </h3>
            <p className="text-gray-600 mt-3 text-base">
              We supply components that guarantee maximum protection and optimal performance.{' '}
              <strong className="text-brand-navy">We specialise in all Japanese trucks.</strong>
            </p>
          </div>
        </div>

        {/* Card Grid */}
        <div
          id="featured-brand-cards"
          ref={cardsRef}
          onScroll={updateScrollbar}
          onPointerDown={handleCardsPointerDown}
          onClickCapture={handleCardsClickCapture}
          className="hide-native-scrollbar grid auto-cols-[85%] grid-flow-col [justify-content:safe_center] gap-6 overflow-x-auto pb-2 cursor-grab active:cursor-grabbing sm:auto-cols-[calc((100%-1.5rem)/2)] lg:auto-cols-[calc((100%-4.5rem)/4)] 2xl:auto-cols-[calc((100%-6rem)/5)]"
        >
          {featuredBrands.map((brand) => (
            <div
              key={brand.id}
              className="min-w-0 snap-start"
            >
              <BrandCard brand={brand} />
            </div>
          ))}
        </div>

        {scrollbar.visible && (
          <div className="mt-8">
            <div
              ref={scrollbarRef}
              role="scrollbar"
              aria-label="Featured brands"
              aria-controls="featured-brand-cards"
              aria-orientation="horizontal"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(scrollbar.progress * 100)}
              onPointerDown={handleScrollbarPointerDown}
              onPointerMove={handleScrollbarPointerMove}
              onPointerUp={handleScrollbarPointerUp}
              onPointerCancel={handleScrollbarPointerUp}
              onKeyDown={(event) => {
                if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                  event.preventDefault();
                  scrollCards(event.key === 'ArrowLeft' ? -1 : 1);
                }
              }}
              tabIndex={0}
              className="relative h-6 cursor-pointer touch-none"
            >
              <span className="pointer-events-none absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-gray-300" />
              <span
                ref={thumbRef}
                data-scroll-thumb
                className="absolute top-1/2 h-[2px] -translate-y-1/2 bg-gray-900"
                style={{
                  width: `${scrollbar.thumbSize}%`,
                  left: `${scrollbar.progress * (100 - scrollbar.thumbSize)}%`,
                }}
              />
            </div>
            <div className="mt-3 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => scrollCards(-1)}
                aria-label="Previous featured brands"
                className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-900 transition hover:bg-gray-200 disabled:opacity-40"
                disabled={scrollbar.progress <= 0.001}
              >
                <i className="fa-solid fa-arrow-left text-lg" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => scrollCards(1)}
                aria-label="Next featured brands"
                className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-900 transition hover:bg-gray-200 disabled:opacity-40"
                disabled={scrollbar.progress >= 0.999}
              >
                <i className="fa-solid fa-arrow-right text-lg" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/catalog"
            className="px-6 py-3 bg-brand-orange text-white text-sm font-bold uppercase tracking-wider hover:bg-orange-700 transition shadow-sm whitespace-nowrap"
          >
            Explore Full Catalog
          </Link>
          <a
            href={contactInfo.primaryTel}
            className="px-6 py-3 border border-brand-navy text-brand-navy text-sm font-bold uppercase tracking-wider hover:bg-brand-navy hover:text-white transition whitespace-nowrap"
          >
            Enquire Stock
          </a>
        </div>

        <div className="mt-8 py-2 text-center">
          <p className="text-sm text-gray-600 uppercase tracking-wide font-semibold">
            * Also supplying a wide range of parts for all major global truck brands and models.
          </p>
        </div>
      </div>
    </section>
  );
}
