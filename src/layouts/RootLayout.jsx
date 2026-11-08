import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import ScrollToTop from '../components/ScrollToTop';

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans antialiased selection:bg-brand-orange selection:text-white flex flex-col justify-between">
      <ScrollToTop />
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

