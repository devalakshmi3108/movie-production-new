import React, { useState } from 'react';
import { Film, Send, Mail, MapPin, Phone, Github, Instagram, Twitter, Youtube, Link2 } from 'lucide-react';
import { ActiveTab } from '../types';

interface FooterProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export default function Footer({ setActiveTab }: FooterProps) {
  const [emailSubscribed, setEmailSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setEmailSubscribed(true);
      setEmail('');
      setTimeout(() => setEmailSubscribed(false), 5000);
    }
  };

  const handleNav = (tab: ActiveTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      id="main-app-footer"
      className="relative bg-white dark:bg-[#111522] text-gray-700 dark:text-gray-300 border-t border-brand-blue/10 pt-16 pb-12 overflow-hidden"
    >
      {/* Background overlay aura */}
      <span className="absolute -left-20 -bottom-20 w-80 h-80 bg-brand-blue/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Logo & Pitch */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-brand-blue/10 text-brand-blue">
                <Film className="w-5 h-5" />
              </div>
              <span className="font-display font-black text-xl tracking-tighter text-brand-dark dark:text-white uppercase">
                unai production
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-sans max-w-sm">
              We engineer advanced interactive cinematic workflows & award-winning visual experiences that inspire filmmakers and capture global audiences.
            </p>
            {/* Social handles */}
            <div className="flex items-center gap-4 pt-4">
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full bg-gray-100 hover:bg-brand-blue/10 text-gray-600 hover:text-brand-blue transition-all"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full bg-gray-100 hover:bg-brand-blue/10 text-gray-600 hover:text-brand-blue transition-all"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full bg-gray-100 hover:bg-brand-blue/10 text-gray-600 hover:text-brand-blue transition-all"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full bg-gray-100 hover:bg-brand-blue/10 text-gray-600 hover:text-brand-blue transition-all"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick links map */}
          <div className="md:col-span-4 grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h5 className="text-xs font-bold text-gray-800 dark:text-white uppercase tracking-widest font-poppins">
                Explore Studio
              </h5>
              <div className="flex flex-col gap-2.5 text-sm font-medium">
                <button
                  onClick={() => handleNav('home')}
                  className="text-left text-gray-500 hover:text-brand-blue transition-colors"
                >
                  Home Main
                </button>
                <button
                  onClick={() => handleNav('collection')}
                  className="text-left text-gray-500 hover:text-brand-blue transition-colors"
                >
                  Movie Collection
                </button>
                <button
                  onClick={() => handleNav('upcoming')}
                  className="text-left text-gray-500 hover:text-brand-blue transition-colors"
                >
                  Upcoming Releases
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h5 className="text-xs font-bold text-gray-800 dark:text-white uppercase tracking-widest font-poppins">
                About & Intel
              </h5>
              <div className="flex flex-col gap-2.5 text-sm font-medium">
                <button
                  onClick={() => handleNav('about')}
                  className="text-left text-gray-500 hover:text-brand-blue transition-colors"
                >
                  Company Bio
                </button>
                <button
                  onClick={() => handleNav('contact')}
                  className="text-left text-gray-500 hover:text-brand-blue transition-colors"
                >
                  Reach Us
                </button>
                <a
                  href="#"
                  className="text-left text-gray-500 hover:text-brand-blue transition-colors"
                >
                  Privacy Policy
                </a>
              </div>
            </div>
          </div>

          {/* Newsletter Box component */}
          <div className="md:col-span-4 space-y-4">
            <h5 className="text-xs font-bold text-gray-800 dark:text-white uppercase tracking-widest font-poppins">
              Newsletter & Releases
            </h5>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Subscribe to get pre-screening alerts, early trailer drops, and VIP box discounts.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative flex items-center">
                <input
                  type="email"
                  required
                  placeholder="Insert premium email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1a2034] text-sm text-gray-800 dark:text-white rounded-xl outline-none border border-brand-blue/10 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-2 p-2 bg-[#1E4DFF] hover:bg-brand-blue/90 text-white rounded-lg shadow-md transition-colors cursor-pointer"
                  title="Subscribe"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              {emailSubscribed && (
                <p className="text-xs text-[#1E4DFF] font-medium flex items-center gap-1.5 font-sans animate-fade-in">
                  <CheckCircleSubscribed />
                  Incredible! Check your inbox for VIP access keys.
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Horizontal Divider */}
        <div className="h-px bg-gray-100 dark:bg-gray-800/80 my-10" />

        {/* Sub bottom notes copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400 font-sans">
            &copy; 2026 UNAI PRODUCTION Inc. Created with cinematic perfection. All Rights Reserved.
          </p>
          <div className="flex gap-6 text-xs text-gray-400 font-medium">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-brand-blue" />
              Los Angeles • Chennai • New York
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Micro checks component inline
function CheckCircleSubscribed() {
  return (
    <svg className="w-4 h-4 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
