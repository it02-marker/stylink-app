import React from 'react';
import { Link } from 'react-router-dom';
import { contactInfo } from '../data/navigation';
import { branchesData } from '../data/branches';
import { socialLinks } from '../data/socials';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="outlets" className="relative min-h-[500px] w-full bg-brand-navy text-gray-300 overflow-hidden">
      {/* Background Image (Hero-style positioning) */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url('${contactInfo.footerBgUrl}')` }}
      />

      {/* Hero-Style Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-navyDark/95 via-brand-navy/85 to-brand-navyDark/95 z-0" />

      {/* Content Overlay Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Col */}
          <div>
            <Link
              to="/"
              className="flex items-center gap-3 text-xl font-black tracking-tighter text-white uppercase mb-6"
            >
              <img
                src={contactInfo.logoUrl}
                alt="Stylink Truck Parts Logo"
                className="h-10 w-auto object-contain bg-white/10 p-1 border border-white/20"
              />
              <span>
                Stylink <span className="text-brand-orange">Truck Parts</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-6 text-gray-300">
              Leading the supply of heavy-duty auto components in Zimbabwe. Helping you not to stop.
            </p>
            <a
              href={contactInfo.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-white hover:text-brand-orange transition text-sm uppercase font-bold tracking-wide mb-6"
            >
              <i className="fa-brands fa-youtube text-lg text-brand-orange"></i> YouTube Channel
            </a>

            {/* Social Media Handles */}
            <div className="pt-2">
              <h5 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                Follow Us
              </h5>
              <div className="flex items-center gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className={`w-9 h-9 flex items-center justify-center bg-brand-navy/60 backdrop-blur-sm border border-white/20 text-gray-200 hover:text-white ${social.hoverClass} transition`}
                  >
                    <i className={`${social.icon} text-sm`}></i>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Branches (HQ, CBD Branch, Bulawayo Branch) */}
          {branchesData.map((branch) => (
            <div key={branch.name}>
              <h4 className="text-white text-sm font-bold uppercase tracking-widest mb-6 border-b border-white/10 pb-2">
                {branch.name}
              </h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <i className="fa-solid fa-location-dot mt-1 text-brand-orange"></i>
                  <span>
                    {branch.addressLines.map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        {i < branch.addressLines.length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <i className="fa-solid fa-phone text-brand-orange"></i>
                  <a href={branch.telLink} className="hover:text-white transition">
                    {branch.phone}
                  </a>
                </li>
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs uppercase tracking-wide">
          <p>&copy; {currentYear} Stylink Truck Parts (Pvt) Ltd. All Rights Reserved.</p>
          <div className="space-x-4">
            <span className="text-gray-400">ITF263 / TIN / VAT Certified</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

