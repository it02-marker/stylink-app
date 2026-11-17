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
        className="min-w-0 flex-1 border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
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
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-3">
              <img
                src={contactInfo.logoUrl}
                alt="Stylink Truck Parts Logo"
                className="h-10 sm:h-12 w-auto object-contain"
              />
              <span className="text-xl xl:text-2xl font-black tracking-tighter text-brand-navy uppercase hidden sm:block">
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
        } lg:hidden flex-col bg-white border-b border-brand-border px-4 py-4 space-y-3 transition-all duration-300`}
      >
        {renderSearchForm('navbar-search-mobile', 'w-full mb-2')}
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
