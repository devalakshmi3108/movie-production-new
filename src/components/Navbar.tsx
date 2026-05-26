import React, { useState, useEffect } from 'react';
import { Film, Menu, X, Ticket } from 'lucide-react';
import { ActiveTab } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenBooking: () => void;
}

export default function Navbar({ activeTab, setActiveTab, onOpenBooking }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems: { id: ActiveTab; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'collection', label: 'Movie Collection' },
    { id: 'upcoming', label: 'Upcoming Movies' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      id="main-app-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 dark:bg-[#161b2a]/90 shadow-lg shadow-brand-blue/5 backdrop-blur-xl border-b border-brand-blue/10 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            id="brand-logo-container"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="p-2.5 rounded-xl bg-brand-blue/10 text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-all duration-300 shadow-sm shadow-brand-blue/20">
              <Film className="w-5 h-5 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-xl tracking-tighter text-brand-dark dark:text-white uppercase">
                unai production
              </span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-brand-blue font-semibold -mt-1 font-poppins">
                premium cinema
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative py-1 font-sans text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'text-brand-blue font-semibold scale-105'
                      : 'text-gray-500 hover:text-brand-blue hover:dark:text-brand-blue dark:text-gray-300'
                  }`}
                >
                  {item.label}
                  {/* Underline Indicator */}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-brand-blue rounded-full transition-all duration-300 shadow-[0_2px_8px_rgba(30,77,255,0.4)]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Button */}
          <div className="hidden md:block">
            <button
              id="header-booking-cta"
              onClick={onOpenBooking}
              className="px-6 py-2.5 bg-brand-blue hover:bg-brand-blue/95 text-white font-sans text-sm font-semibold rounded-full shadow-lg shadow-brand-blue/25 hover:shadow-brand-blue/35 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] flex items-center gap-2"
            >
              <Ticket className="w-4 h-4" />
              Book Ticket
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-500 hover:text-brand-blue dark:text-gray-300 hover:bg-brand-blue/5 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div id="mobile-nav-menu" className="md:hidden glass-card mt-2 mx-4 rounded-2xl p-4 border border-brand-blue/10 shadow-xl relative z-50">
          <div className="flex flex-col gap-3">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`py-2 px-3 text-left font-sans text-sm font-medium rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-brand-blue/10 text-brand-blue font-semibold'
                    : 'text-gray-600 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-[#161b2a]/50'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="border-t border-gray-100 dark:border-gray-800/80 my-2 pt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full py-3 bg-brand-blue text-white font-semibold rounded-xl text-center shadow-md flex items-center justify-center gap-2"
              >
                <Ticket className="w-4 h-4" />
                Book Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
