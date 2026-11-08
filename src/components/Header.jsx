import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { navLinks, contactInfo } from '../data/navigation';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isLinkActive = (item) => {
    if (item.path === '/' && location.pathname === '/' && !location.hash) return true;
    if (item.path !== '/' && location.pathname === item.path) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-brand-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-3">
              <img
                src={contactInfo.logoUrl}
                alt="Stylink Truck Parts Logo"
                className="h-10 sm:h-12 w-auto object-contain"
              />
              <span className="text-2xl font-black tracking-tighter text-brand-navy uppercase hidden sm:block">
                Stylink <span className="text-gray-400 font-light">Truck Parts</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            {navLinks.map((item) => {
              const active = isLinkActive(item);
              return (
                <NavLink
                  key={item.label}
                  to={item.path}
                  className={`text-sm uppercase tracking-wide transition relative py-1 ${
                    active
                      ? 'font-bold text-brand-orange border-b-2 border-brand-orange'
                      : 'font-semibold text-brand-navy hover:text-brand-orange'
                  }`}
                >
                  {item.label}
                </NavLink>
              );
            })}
            <a
              href={contactInfo.primaryTel}
              className="ml-4 px-6 py-2.5 bg-brand-orange text-white text-sm font-bold uppercase tracking-wider hover:bg-orange-700 transition shadow-sm"
            >
              Call Now
            </a>
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              id="mobile-menu-btn"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
              className="text-brand-navy focus:outline-none p-2"
            >
              <i className={`fa-solid ${isMobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-2xl`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <div
        id="mobile-menu"
        className={`${
          isMobileMenuOpen ? 'flex' : 'hidden'
        } md:hidden flex-col bg-white border-b border-brand-border px-4 py-4 space-y-3 transition-all duration-300`}
      >
        {navLinks.map((item) => {
          const active = isLinkActive(item);
          return (
            <NavLink
              key={item.label}
              to={item.path}
              onClick={closeMobileMenu}
              className={`block text-sm uppercase py-1 ${
                active
                  ? 'font-bold text-brand-orange'
                  : 'font-semibold text-brand-navy hover:text-brand-orange'
              }`}
            >
              {item.label}
            </NavLink>
          );
        })}
        <a
          href={contactInfo.primaryTel}
          onClick={closeMobileMenu}
          className="inline-block mt-2 px-6 py-2.5 bg-brand-orange text-white text-sm font-bold uppercase tracking-wider text-center hover:bg-orange-700 transition"
        >
          Call Now
        </a>
      </div>
    </header>
  );
}
