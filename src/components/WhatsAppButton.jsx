import React from 'react';
import { contactInfo } from '../data/navigation';

export default function WhatsAppButton() {
  return (
    <a
      href={contactInfo.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 group"
    >
      {/* Animated Pulse Glow */}
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
      </span>

      {/* Icon */}
      <i className="fa-brands fa-whatsapp text-2xl"></i>

      {/* Label text */}
      <span className="hidden sm:inline-block text-xs font-bold uppercase tracking-wider pr-1">
        Chat Spares Desk
      </span>
    </a>
  );
}

