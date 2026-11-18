import React, { useEffect, useState } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { useSiteData } from '../context/SiteDataContext';
export default function Header() {
  const { navLinks, contactInfo } = useSiteData();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setSearchTerm(new URLSearchParams(location.search).get('search') || '');
  }, [location.search]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const query = searchTerm.trim();
    navigate(query ? `/catalog?search=${encodeURIComponent(query)}` : '/catalog');
    closeMobileMenu();
  };

  const renderSearchForm = (id, className = '') => (
    <form onSubmit={handleSearch} role="search" className={`flex ${className}`}>
      <label htmlFor={id} className="sr-only">
        Search truck parts
      </label>
      <input
        id={id}
        type="search"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        placeholder="Search parts or OEM..."
        className="min-w-0 flex-1 border border-gray-300 bg-gray-50 px-3 py-2 text-xs sm:text-sm text-gray-900 placeholder:text-gray-500 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
      />
      <button
        type="submit"
        aria-label="Search catalog"
        className="shrink-0 bg-brand-navy px-3 text-white transition hover:bg-brand-orange"
      >
        <i className="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
      </button>
    </form>
  );

  const isLinkActive = (item) => {
    if (item.path === '/' && location.pathname === '/' && !location.hash) return true;
    if (item.path !== '/' && location.pathname === item.path) return true;
    return false;
  };

  return (
    <header className="site-navbar sticky top-0 z-50 bg-white border-b border-brand-border">
      <div className="site-container">
        <div className="flex justify-between items-center h-14 sm:h-16 lg:h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2 sm:gap-3">
              <img
                src={contactInfo.logoUrl}
                alt="Stylink Truck Parts Logo"
                className="h-8 sm:h-10 lg:h-12 w-auto object-contain"
              />
              <span className="text-sm sm:text-base lg:text-xl xl:text-2xl font-black tracking-tighter text-brand-navy uppercase">
                Stylink <span className="text-gray-400 font-light">Truck Parts</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
            {navLinks.map((item) => {
              const active = isLinkActive(item);
              return (
                <NavLink
                  key={item.label}
                  to={item.path}
                  className={`text-xs xl:text-sm uppercase tracking-wide transition relative py-1 ${
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
              className="px-4 xl:px-6 py-2.5 bg-brand-orange text-white text-xs xl:text-sm font-bold uppercase tracking-wider hover:bg-orange-700 transition shadow-sm"
            >
              Call Now
            </a>
            {renderSearchForm('navbar-search-desktop', 'w-48 xl:w-56')}
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center">
            <button
              id="mobile-menu-btn"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              className="text-brand-navy focus:outline-none p-1.5 sm:p-2"
            >
              <i className={`fa-solid ${isMobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-xl sm:text-2xl`}></i>
            </button>
          </div>
        </div>
      </div>

      <>
        <button
          type="button"
          aria-label="Close mobile menu"
          aria-hidden={!isMobileMenuOpen}
          tabIndex={isMobileMenuOpen ? 0 : -1}
          onClick={closeMobileMenu}
          className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ease-in-out lg:hidden ${
            isMobileMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
        />
        <nav
          id="mobile-menu"
          aria-label="Mobile navigation"
          aria-hidden={!isMobileMenuOpen}
          inert={!isMobileMenuOpen}
          className={`fixed right-0 top-14 z-50 flex h-[calc(100dvh-3.5rem)] w-[min(85vw,20rem)] flex-col gap-4 overflow-y-auto border-l border-brand-border bg-white px-5 py-5 shadow-xl transition-transform duration-300 ease-in-out sm:top-16 sm:h-[calc(100dvh-4rem)] lg:hidden ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {renderSearchForm('navbar-search-mobile', 'w-full mb-2')}
          {navLinks.map((item) => {
            const active = isLinkActive(item);
            return (
              <NavLink
                key={item.label}
                to={item.path}
                onClick={closeMobileMenu}
                className={`block text-xs sm:text-sm uppercase py-1 ${
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
            className="inline-block mt-2 px-6 py-2.5 bg-brand-orange text-white text-xs sm:text-sm font-bold uppercase tracking-wider text-center hover:bg-orange-700 transition"
          >
            Call Now
          </a>
        </nav>
      </>
    </header>
  );
}
