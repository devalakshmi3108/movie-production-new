import React, { useState, useEffect, useRef } from 'react';
import {
  Film,
  Star,
  Clock,
  Play,
  Calendar,
  Sparkles,
  Bell,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Volume2,
  VolumeX,
  Ticket,
  ChevronLeft,
  ChevronRight,
  Award,
  BookOpen,
  Send,
  CheckCircle2,
  Tv,
  Users,
  Lightbulb,
  Map,
  Link,
  MessageSquare
} from 'lucide-react';

import { Movie, ActiveTab } from './types';
import { MOVIES, UPCOMING_MOVIES, TIMELINE_EVENTS, ACHIEVEMENTS } from './data';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import TrailerModal from './components/TrailerModal';
import MovieDetailModal from './components/MovieDetailModal';
import BookingEngine from './components/BookingEngine';

export default function App() {
  // Global View / Modal States
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  
  // Modals controllers
  const [trailerModal, setTrailerModal] = useState<{ videoUrl: string; title: string } | null>(null);
  const [detailMovie, setDetailMovie] = useState<Movie | null>(null);
  const [bookingMovie, setBookingMovie] = useState<Movie | null>(null);

  // Home slider state
  const [heroIndex, setHeroIndex] = useState<number>(0);
  const heroMovies = MOVIES.slice(0, 3); // Top 3 as featured showcase

  // Collection filters
  const [selectedGenre, setSelectedGenre] = useState<string>('ALL');
  const genres = ['ALL', 'ROMANCE', 'DRAMA', 'MYSTERY', 'SPORTS', 'ANIMATION', 'FANTASY', 'ADVENTURE'];

  // Newsletter form
  const [subscribedEmail, setSubscribedEmail] = useState<string>('');
  const [subscribedSuccess, setSubscribedSuccess] = useState<boolean>(false);

  // Active contact form states
  const [fullName, setFullName] = useState<string>('');
  const [contactEmail, setContactEmail] = useState<string>('');
  const [messageText, setMessageText] = useState<string>('');
  const [contactResult, setContactResult] = useState<string | null>(null);

  // Active notification list for countdown reminders
  const [notifiedUpcomingIds, setNotifiedUpcomingIds] = useState<string[]>([]);

  // Simple Web Audio Synthesizer for high-end cinematic micro-interactions
  const playInteractiveTone = (freq = 220, type: OscillatorType = 'sine', duration = 0.12) => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gainNode.gain.setValueAtTime(0.015, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // ignore audio lock issues
    }
  };

  // Turn off loading screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  // Movie rotating slide timer
  useEffect(() => {
    if (activeTab !== 'home') return;
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroMovies.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeTab]);

  // Handle reminder click
  const toggleReminder = (upcomingId: string) => {
    playInteractiveTone(520, 'triangle', 0.18);
    if (notifiedUpcomingIds.includes(upcomingId)) {
      setNotifiedUpcomingIds(notifiedUpcomingIds.filter(id => id !== upcomingId));
    } else {
      setNotifiedUpcomingIds([...notifiedUpcomingIds, upcomingId]);
    }
  };

  // Submit contact form
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playInteractiveTone(440, 'sine', 0.25);
    if (!fullName || !contactEmail || !messageText) return;
    setContactResult('Transmission Successful. Our executive director will contact you within 24 hours.');
    setFullName('');
    setContactEmail('');
    setMessageText('');
    setTimeout(() => setContactResult(null), 5000);
  };

  const handleSubscribeHero = (e: React.FormEvent) => {
    e.preventDefault();
    if (subscribedEmail) {
      playInteractiveTone(600, 'sine', 0.2);
      setSubscribedSuccess(true);
      setSubscribedEmail('');
      setTimeout(() => setSubscribedSuccess(false), 5050);
    }
  };

  // Computed filter
  const filteredMovies = selectedGenre === 'ALL'
    ? MOVIES
    : MOVIES.filter(m => m.genre === selectedGenre);

  return (
    <div id="app-root-container" className="min-h-screen bg-white text-[#161b2a] dark:bg-[#161b2a] dark:text-white transition-colors duration-500 selection:bg-brand-blue/20 flex flex-col justify-between">
      
      {/* 1. Cinematic Loading Screen overlay */}
      {loading && (
        <div id="cinematic-loading-screen" className="fixed inset-0 z-100 bg-[#161b2a] flex flex-col items-center justify-center text-white transition-opacity duration-700 animate-fade-out">
          <div className="relative text-center space-y-4">
            {/* Glowing neon background blur element */}
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-brand-blue/30 rounded-full blur-2xl animate-pulse" />
            
            <div className="relative p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md inline-block shadow-2xl">
              <Film className="w-10 h-10 text-[#1E4DFF] animate-spin" />
            </div>
            
            <div className="relative">
              <h1 className="font-display font-black text-3xl tracking-tighter uppercase text-white">
                unai production
              </h1>
              <span className="text-xs uppercase tracking-[0.3em] text-[#1E4DFF] font-semibold block mt-1 font-poppins">
                cinematic mastery
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Navigation bar header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenBooking={() => {
          playInteractiveTone(350, 'sine', 0.1);
          setBookingMovie(MOVIES[0]);
        }}
      />

      {/* Floating sound control & branding badge */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
        <button
          id="sound-control-toggle"
          onClick={() => setSoundEnabled(!soundEnabled)}
          onMouseEnter={() => playInteractiveTone(880, 'sine', 0.05)}
          className="p-3 bg-white/90 dark:bg-[#1f263a]/90 hover:bg-brand-blue hover:text-white text-brand-blue rounded-full shadow-lg backdrop-blur-md transition-all border border-brand-blue/10 cursor-pointer"
          title={soundEnabled ? 'Mute micro-interaction audio' : 'Enable premium sound synthesis'}
        >
          {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>
      </div>

      {/* Ambient background styling */}
      <div className="relative w-full overflow-hidden flex-1 pt-24">
        {/* Soft background blue blobs across the screen to feel high end */}
        <span className="ambient-aura top-20 left-[10%] w-[35rem] h-[35rem] opacity-50" />
        <span className="ambient-aura bottom-96 right-[5%] w-[40rem] h-[40rem] opacity-40" />

        {/* ================= HOME VIEW ================= */}
        {activeTab === 'home' && (
          <div id="view-home" className="space-y-24 pb-20 animate-fade-in">
            
            {/* Stunning full-width hero presentation */}
            <section id="hero-slider" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="relative rounded-3xl overflow-hidden glass-card p-2 border border-brand-blue/10 shadow-2xl min-h-[520px] lg:min-h-[600px] flex flex-col justify-between">
                
                {/* Embedded Auto-rotating highlight slides */}
                <div className="relative flex-1 rounded-2xl overflow-hidden bg-[#161b2a] text-white flex flex-col lg:flex-row items-stretch justify-between">
                  {/* Backdrop banner aspect */}
                  <div className="lg:w-1/2 relative h-64 lg:h-auto overflow-hidden">
                    <img
                      src={heroMovies[heroIndex].posterUrl}
                      alt={heroMovies[heroIndex].title}
                      className="w-full h-full object-cover transition-all duration-1000 transform scale-100 filter brightness-95"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#161b2a]" />
                  </div>

                  {/* Information block */}
                  <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-between space-y-6 relative bg-gradient-to-t lg:bg-none from-[#161b2a] via-[#161b2a]/95 lg:from-transparent">
                    <div>
                      {/* Logo watermark badge */}
                      <div className="flex items-center gap-2 mb-4">
                        <span className="px-3 py-1 text-[9px] font-extrabold uppercase bg-brand-blue/20 text-brand-blue rounded-full font-poppins tracking-wider border border-brand-blue/20 animate-pulse">
                          Featured Showcase
                        </span>
                        <span className="text-xs text-brand-blue font-extrabold tracking-widest font-display">
                          UNAI LIVE
                        </span>
                      </div>

                      {/* Main Heading Text */}
                      <h1 className="text-4xl lg:text-5xl font-display font-extrabold tracking-tight text-white leading-tight">
                        {heroMovies[heroIndex].title}
                      </h1>
                      
                      <p className="text-xs text-[#87a5ff] mt-2 font-poppins tracking-wide">
                        DIRECTED BY {heroMovies[heroIndex].director.toUpperCase()} • RATED {heroMovies[heroIndex].rating}★
                      </p>

                      <p className="text-sm mt-4 text-gray-300 font-sans leading-relaxed max-w-lg">
                        {heroMovies[heroIndex].synopsis}
                      </p>
                    </div>

                    {/* CTA triggers */}
                    <div className="flex flex-wrap gap-4 pt-4">
                      <button
                        id="hero-book-cta"
                        onMouseEnter={() => playInteractiveTone(330, 'sine', 0.1)}
                        onClick={() => {
                          playInteractiveTone(480, 'sine', 0.15);
                          setBookingMovie(heroMovies[heroIndex]);
                        }}
                        className="px-8 py-3.5 bg-brand-blue hover:bg-brand-blue/90 text-white font-sans text-sm font-semibold rounded-full shadow-lg shadow-brand-blue/30 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 flex items-center gap-2 cursor-pointer"
                      >
                        <Ticket className="w-4 h-4" />
                        Book Your Show
                      </button>

                      <button
                        id="hero-detail-cta"
                        onMouseEnter={() => playInteractiveTone(260, 'sine', 0.1)}
                        onClick={() => {
                          playInteractiveTone(400, 'sine', 0.12);
                          setDetailMovie(heroMovies[heroIndex]);
                        }}
                        className="px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/50 text-white font-sans text-sm font-semibold rounded-full transition-all duration-300 cursor-pointer"
                      >
                        Explore Details
                      </button>

                      <button
                        id="hero-trailer-cta"
                        onMouseEnter={() => playInteractiveTone(300, 'sine', 0.1)}
                        onClick={() => {
                          playInteractiveTone(440, 'sine', 0.15);
                          setTrailerModal({
                            videoUrl: heroMovies[heroIndex].trailerUrl,
                            title: heroMovies[heroIndex].title,
                          });
                        }}
                        className="px-5 py-3.5 flex items-center gap-2 hover:text-[#87a5ff] transition-colors text-xs font-semibold uppercase tracking-widest font-poppins relative group.cursor-pointer"
                      >
                        <Play className="w-4 h-4 fill-current text-brand-blue" />
                        Watch Trailer
                      </button>
                    </div>
                  </div>
                </div>

                {/* Micro indicators bar */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-brand-blue/5">
                  <div className="flex items-center gap-2">
                    {heroMovies.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          playInteractiveTone(350 + idx * 50, 'triangle', 0.1);
                          setHeroIndex(idx);
                        }}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${
                          idx === heroIndex ? 'bg-[#1E4DFF] w-6' : 'bg-gray-300/60 hover:bg-brand-blue/40'
                        }`}
                        title={`Slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest font-poppins">
                    Experience dynamic storytelling
                  </span>
                </div>

              </div>
            </section>

            {/* Premium interactive horizontal selector showcase */}
            <section id="featured-carousel" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-blue/5 text-brand-blue text-[10px] font-extrabold uppercase font-poppins tracking-wider border border-brand-blue/10">
                    <Sparkles className="w-3.5 h-3.5" />
                    Now Screenings
                  </div>
                  <h2 className="text-3xl font-display font-black tracking-tight text-brand-dark dark:text-white capitalize">
                    Featured Masterpieces
                  </h2>
                </div>
                <button
                  id="tab-switcher-collection-link"
                  onClick={() => setActiveTab('collection')}
                  className="group flex items-center gap-1.5 text-xs font-extrabold uppercase text-[#1E4DFF] tracking-wider hover:text-brand-blue transition-colors font-poppins"
                >
                  View All Collection
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
                </button>
              </div>

              {/* Horizontal slider container */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {MOVIES.slice(0, 4).map((movie) => (
                  <div
                    key={movie.id}
                    id={`featured-card-${movie.id}`}
                    onMouseEnter={() => playInteractiveTone(400, 'sine', 0.08)}
                    className="movie-card group glass-card rounded-2xl overflow-hidden shadow-md border border-brand-blue/10 flex flex-col justify-between h-auto transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-brand-blue/10"
                  >
                    {/* Media Aspect container */}
                    <div className="relative aspect-[2/3] overflow-hidden bg-gray-900 group">
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=1025';
                        }}
                      />
                      {/* Vignette with overlay button details */}
                      <span className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80" />
                      
                      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
                        <span className="bg-[#1E4DFF] text-white text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full font-poppins shadow-lg shadow-brand-blue/30">
                          {movie.genre}
                        </span>
                      </div>

                      <div className="absolute top-4 right-4 z-10 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 text-yellow-400 text-xs font-extrabold shadow-sm">
                        <Star className="w-3 h-3 fill-current" />
                        {movie.rating}
                      </div>

                      {/* Hover Watch Trailer button quick access */}
                      <div className="absolute inset-x-0 bottom-4 px-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          id={`quick-trailer-${movie.id}`}
                          onClick={() => {
                            playInteractiveTone(440, 'sine', 0.15);
                            setTrailerModal({
                              videoUrl: movie.trailerUrl,
                              title: movie.title,
                            });
                          }}
                          className="w-full py-2.5 bg-white hover:bg-[#1E4DFF] text-[#1E4DFF] hover:text-white font-sans text-xs font-bold rounded-full shadow-lg transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          Watch Trailer
                        </button>
                      </div>
                    </div>

                    {/* Metadata Content area */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h3 className="font-display font-extrabold text-sm md:text-base text-gray-900 dark:text-white group-hover:text-brand-blue transition-colors truncate">
                          {movie.title}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-sans line-clamp-2 mt-1 font-medium">
                          {movie.synopsis}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                        <button
                          id={`info-popup-trigger-${movie.id}`}
                          onClick={() => {
                            playInteractiveTone(380, 'sine', 0.1);
                            setDetailMovie(movie);
                          }}
                          className="text-xs font-bold uppercase tracking-wider text-gray-600 hover:text-brand-blue dark:text-gray-300 cursor-pointer"
                        >
                          Synopsis Info
                        </button>
                        <button
                          id={`inline-book-cta-${movie.id}`}
                          onClick={() => {
                            playInteractiveTone(480, 'sine', 0.18);
                            setBookingMovie(movie);
                          }}
                          className="px-4 py-1.5 bg-brand-blue/10 hover:bg-[#1E4DFF] hover:text-white text-brand-blue font-sans text-xs font-semibold rounded-full transition-all cursor-pointer"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Immersive Newsletter / Callout banner spotlight */}
            <section id="spotlight-highlight" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
              <div className="relative rounded-3xl overflow-hidden glass-card p-8 md:p-12 lg:p-16 border border-brand-blue/15 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-10">
                {/* Embedded aura visual glowing spots */}
                <span className="absolute -left-12 -top-12 w-64 h-64 bg-brand-blue/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
                <span className="absolute -right-12 -bottom-12 w-64 h-64 bg-brand-blue/10 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-xl space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1E4DFF]/10 text-brand-blue text-[10px] font-bold uppercase tracking-wider font-poppins">
                    Exclusive Insider Membership
                  </div>
                  <h2 className="text-3xl md:text-4xl font-display font-black tracking-tight text-brand-dark dark:text-white leading-tight">
                    Join Unai Elite Premiere Circle
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300 font-sans leading-relaxed">
                    Be the first to secure premier seats, discover unreleased filmography notes, receive invite-only invitations to cinematic festivals, and download high-resolution teasers.
                  </p>
                </div>

                <div className="w-full max-w-sm">
                  <form onSubmit={handleSubscribeHero} className="space-y-3 relative z-10">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="email"
                        required
                        placeholder="Premium email handle..."
                        value={subscribedEmail}
                        onChange={(e) => setSubscribedEmail(e.target.value)}
                        className="flex-1 px-4 py-3 bg-white dark:bg-[#1f263a] border border-brand-blue/15 rounded-xl font-sans text-sm focus:border-brand-blue outline-none focus:ring-1 focus:ring-brand-blue dark:text-white"
                      />
                      <button
                        type="submit"
                        id="elite-subscribe-cta"
                        className="px-6 py-3 bg-[#1E4DFF] hover:bg-brand-blue/90 text-white text-sm font-semibold rounded-xl shadow-md transition-all duration-300 shrink-0 cursor-pointer"
                      >
                        Sign Up Now
                      </button>
                    </div>
                    {subscribedSuccess && (
                      <p className="text-xs text-[#1E4DFF] font-medium flex items-center gap-1.5 animate-fade-in">
                        <CheckCircle2 className="w-4 h-4 text-brand-blue" />
                        Fantastic! Premiere invitation transmitted successfully.
                      </p>
                    )}
                  </form>
                </div>
              </div>
            </section>

          </div>
        )}

        {/* ================= COLLECTION VIEW ================= */}
        {activeTab === 'collection' && (
          <div id="view-collection" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 animate-fade-in space-y-12">
            
            {/* Title / Description info */}
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-1 bg-brand-blue/5 text-brand-blue px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest font-poppins border border-brand-blue/10">
                Premium Catalog Year 2026
              </div>
              <h1 className="text-3xl lg:text-5xl font-display font-black tracking-tight text-brand-dark dark:text-white capitalize">
                Movie Collection
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-sans">
                Browse our complete, exquisite catalog of high-definition cinematic pieces. Filter by genres of romance, drama, fantasy or animation classics.
              </p>
            </div>

            {/* Genre Filters Row */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {genres.map((g) => {
                const isSelected = selectedGenre === g;
                return (
                  <button
                    key={g}
                    id={`filter-btn-${g.toLowerCase()}`}
                    onClick={() => {
                      playInteractiveTone(440, 'sine', 0.1);
                      setSelectedGenre(g);
                    }}
                    className={`px-4 py-2 text-xs font-bold rounded-full uppercase tracking-wider font-poppins transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#1E4DFF] text-white shadow-md shadow-brand-blue/20'
                        : 'bg-gray-100 hover:bg-brand-blue/10 text-gray-600 hover:text-brand-blue'
                    }`}
                  >
                    {g}
                  </button>
                );
              })}
            </div>

            {/* Movie grid list */}
            {filteredMovies.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                {filteredMovies.map((movie) => (
                  <div
                    key={movie.id}
                    id={`movie-card-grid-${movie.id}`}
                    onMouseEnter={() => playInteractiveTone(350, 'sine', 0.08)}
                    className="movie-card group glass-card rounded-2xl overflow-hidden shadow-md border border-brand-blue/10 flex flex-col justify-between h-auto transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-brand-blue/10"
                  >
                    {/* Media container */}
                    <div className="relative aspect-[2/3] overflow-hidden bg-gray-900">
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=1025';
                        }}
                      />
                      <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

                      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
                        <span className="bg-[#1E4DFF] text-white text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full font-poppins shadow-lg">
                          {movie.genre}
                        </span>
                      </div>

                      <div className="absolute top-4 right-4 z-10 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 text-yellow-400 text-xs font-extrabold">
                        <Star className="w-3 h-3 fill-current" />
                        {movie.rating}
                      </div>

                      {/* Watch trailer overlays trigger */}
                      <div className="absolute inset-x-0 bottom-4 px-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          id={`quick-trailer-collection-${movie.id}`}
                          onClick={() => {
                            playInteractiveTone(420, 'sine', 0.15);
                            setTrailerModal({
                              videoUrl: movie.trailerUrl,
                              title: movie.title,
                            });
                          }}
                          className="w-full py-2.5 bg-white hover:bg-brand-blue text-brand-blue hover:text-white font-sans text-xs font-bold rounded-full shadow-lg transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          Watch Trailer
                        </button>
                      </div>
                    </div>

                    {/* Metadata body */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h3 className="font-display font-extrabold text-sm md:text-base text-gray-900 dark:text-white group-hover:text-brand-blue transition-colors truncate">
                          {movie.title}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-sans line-clamp-2 mt-1 font-medium">
                          {movie.synopsis}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                        <button
                          id={`info-grid-trigger-${movie.id}`}
                          onClick={() => {
                            playInteractiveTone(380, 'sine', 0.12);
                            setDetailMovie(movie);
                          }}
                          className="text-xs font-bold uppercase tracking-wider text-gray-600 hover:text-brand-blue dark:text-gray-300 cursor-pointer"
                        >
                          Synopsis Info
                        </button>
                        <button
                          id={`grid-book-cta-${movie.id}`}
                          onClick={() => {
                            playInteractiveTone(500, 'sine', 0.15);
                            setBookingMovie(movie);
                          }}
                          className="px-4 py-1.5 bg-brand-blue/10 hover:bg-[#1E4DFF] hover:text-white text-brand-blue font-sans text-xs font-semibold rounded-full transition-all cursor-pointer"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-gray-50 dark:bg-white/5 rounded-2xl max-w-md mx-auto">
                <p className="text-gray-500 dark:text-gray-400 font-sans font-medium text-sm">
                  No masterpieces match the selected filter category at present.
                </p>
              </div>
            )}

          </div>
        )}

        {/* ================= UPCOMING VIEW ================= */}
        {activeTab === 'upcoming' && (
          <div id="view-upcoming" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 animate-fade-in space-y-12">
            
            {/* Header info bar */}
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-1.5 bg-brand-blue/5 text-brand-blue px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest font-poppins border border-brand-blue/10">
                <Bell className="w-3.5 h-3.5" />
                Next Premiere Waves
              </div>
              <h1 className="text-3xl lg:text-5xl font-display font-black tracking-tight text-brand-dark dark:text-white capitalize">
                Upcoming Movies
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-sans">
                Subscribe to instant countdown notifications. Get exclusive trailer alerts before they crash the internet.
              </p>
            </div>

            {/* Upcoming content list items */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
              {UPCOMING_MOVIES.map((upcoming) => {
                const isReminded = notifiedUpcomingIds.includes(upcoming.id);
                return (
                  <div
                    key={upcoming.id}
                    id={`upcoming-card-${upcoming.id}`}
                    className="glass-card rounded-3xl p-5 border border-brand-blue/10 flex flex-col justify-between gap-5 shadow-lg group hover:shadow-brand-blue/10 transition-all duration-300"
                  >
                    {/* Visual poster aspect ratio */}
                    <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-gray-900 cursor-pointer">
                      <img
                        src={upcoming.posterUrl}
                        alt={upcoming.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-85" />
                      
                      {/* Interactive Watch teaser icon */}
                      <button
                        id={`upcoming-teaser-${upcoming.id}`}
                        onClick={() => {
                          playInteractiveTone(400, 'sine', 0.15);
                          setTrailerModal({
                            videoUrl: upcoming.trailerUrl,
                            title: upcoming.title,
                          });
                        }}
                        className="absolute inset-0 flex items-center justify-center text-white cursor-pointer"
                        title="Watch Teaser Trailer"
                      >
                        <div className="p-3.5 rounded-full bg-[#1E4DFF] hover:scale-110 active:scale-95 transition-all shadow-lg text-white">
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </div>
                      </button>

                      {/* Show countdown in corner */}
                      <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-extrabold uppercase font-poppins tracking-wider border border-white/10">
                        {upcoming.daysLeft} Days to Release
                      </div>
                    </div>

                    {/* Meta information */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-widest text-[#1E4DFF] font-extrabold font-poppins">
                          {upcoming.genre}
                        </span>
                        <span className="text-xs text-brand-blue dark:text-gray-300 font-semibold font-sans flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {upcoming.runtime}
                        </span>
                      </div>

                      <h3 className="font-display font-extrabold text-[#161b2a] dark:text-white text-[17px] md:text-lg">
                        {upcoming.title}
                      </h3>

                      <p className="text-xs text-gray-500 dark:text-gray-400 font-sans leading-relaxed max-w-sm line-clamp-3">
                        {upcoming.teaser}
                      </p>
                    </div>

                    {/* Actions panel */}
                    <div className="flex items-center justify-between gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                      <button
                        id={`upcoming-reminder-${upcoming.id}`}
                        onClick={() => toggleReminder(upcoming.id)}
                        className={`flex-1 py-2.5 px-4 rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          isReminded
                            ? 'bg-green-600 text-white shadow-md'
                            : 'bg-[#1E4DFF] hover:bg-brand-blue/90 text-white shadow-md shadow-brand-blue/20'
                        }`}
                      >
                        <Bell className="w-3.5 h-3.5" />
                        {isReminded ? 'Reminder Configured' : 'Get Teaser Alerts'}
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* ================= ABOUT US VIEW ================= */}
        {activeTab === 'about' && (
          <div id="view-about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 animate-fade-in space-y-20">
            
            {/* Top storytelling info block */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
              
              {/* Brand introduction */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#1E4DFF]/10 text-brand-blue text-[10px] font-extrabold uppercase tracking-wider font-poppins">
                  <BookOpen className="w-3.5 h-3.5" />
                  Our Studio Legacy
                </div>
                <h1 className="text-4xl lg:text-5xl font-display font-black tracking-tight text-brand-dark dark:text-white leading-tight">
                  Uncompromised Craft.<br />
                  Cinematic Mastery.
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-sans">
                  At **UNAI PRODUCTION**, we believe that film is the ultimate intersection of human emotion, optical science, and interactive design. Born in the heart of cinematic innovation, we construct visual ecosystems that move audiences, redefine box offices, and push creative limits.
                </p>
                
                {/* Mission / Vision side by side cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <div className="p-5 rounded-2xl bg-white dark:bg-white/5 border border-brand-blue/10">
                    <h4 className="text-xs font-black uppercase text-[#1E4DFF] font-poppins tracking-wider mb-2">
                      Our Studio Mission
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-sans leading-relaxed">
                      To empower visionary directors and deliver flawless interactive screenplays that leave a lasting imprint on global pop culture.
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl bg-white dark:bg-white/5 border border-brand-blue/10">
                    <h4 className="text-xs font-black uppercase text-[#1E4DFF] font-poppins tracking-wider mb-2">
                      Our Creative Vision
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-sans leading-relaxed">
                      To build integrated smart cinema systems where fans, actors, and engineers collaborate seamlessly on visual storytelling.
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats showcase panel (Achievements) */}
              <div className="lg:col-span-5 p-6 md:p-8 bg-gray-50 dark:bg-[#1a2034] rounded-3xl border border-brand-blue/10 shadow-xl space-y-6 text-center">
                <h3 className="font-display font-extrabold text-sm md:text-base uppercase tracking-wider text-brand-dark dark:text-white">
                  Corporate Achievements
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {ACHIEVEMENTS.map((stat, i) => (
                    <div key={i} className="p-4 bg-white dark:bg-[#161b2a] rounded-2xl border border-brand-blue/5">
                      <span className="text-2xl md:text-3xl font-display font-black text-brand-blue block tracking-tight">
                        {stat.count}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold block mt-1 font-poppins">
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Audited and approved by Global Filmography Council.
                  </p>
                </div>
              </div>

            </div>

            {/* Immersive milestone timeline block with neat nodes */}
            <div className="space-y-10 relative z-10 pt-10 border-t border-gray-100 dark:border-gray-800">
              <div className="text-center max-w-xl mx-auto space-y-2">
                <h2 className="text-2xl font-display font-bold text-brand-dark dark:text-white uppercase tracking-wider font-poppins">
                  Production Journey Timeline
                </h2>
                <p className="text-xs text-gray-500 font-sans">
                  The milestones that sculpted Unai Production into an entertainment powerhouse.
                </p>
              </div>

              <div className="relative max-w-3xl mx-auto pl-6 border-l-2 border-brand-blue/30 space-y-10">
                {TIMELINE_EVENTS.map((item, idx) => (
                  <div key={idx} className="relative space-y-1">
                    {/* Glowing node point indicator */}
                    <span className="absolute -left-[30px] top-1.5 w-4.5 h-4.5 rounded-full bg-brand-blue border-4 border-white dark:border-[#161b2a] shadow-md shadow-brand-blue/50" />
                    
                    <span className="text-sm font-extrabold text-[#1E4DFF] font-mono tracking-wider block">
                      {item.year}
                    </span>
                    <h4 className="font-display font-bold text-gray-800 dark:text-white text-base">
                      {item.title}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-sans max-w-xl">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Directors message quote box */}
            <div className="glass-card rounded-3xl p-8 md:p-12 relative overflow-hidden border border-brand-blue/10 max-w-4xl mx-auto text-center space-y-4">
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-brand-blue/10 rounded-full blur-2xl pointer-events-none" />
              <p className="text-base md:text-lg text-brand-dark dark:text-gray-100 italic font-medium leading-relaxed max-w-2xl mx-auto relative z-10">
                "Storytelling is not about spectacular screens or excessive pixels. It resides in raw, unfiltered human vulnerability mapped to visual canvas. We construct platforms that respect that art."
              </p>
              <div className="relative z-10">
                <h5 className="font-display font-bold text-[#1E4DFF] text-sm uppercase tracking-wider font-poppins leading-none">
                  Unai Ramachandran
                </h5>
                <span className="text-[10px] text-gray-400 font-semibold block uppercase tracking-widest font-poppins mt-1">
                  Founder & Principal Creative Director
                </span>
              </div>
            </div>

          </div>
        )}

        {/* ================= CONTACT VIEW ================= */}
        {activeTab === 'contact' && (
          <div id="view-contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 animate-fade-in space-y-12">
            
            {/* Title */}
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-1.5 bg-brand-blue/5 text-brand-blue px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest font-poppins border border-brand-blue/10">
                <MessageSquare className="w-3.5 h-3.5" />
                Collaborations Hub
              </div>
              <h1 className="text-3xl lg:text-5xl font-display font-black tracking-tight text-brand-dark dark:text-white capitalize">
                Contact Our Studio
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-sans">
                Planning a script pitch, press interview, or corporate screening alliance? Drop our office a message instantly.
              </p>
            </div>

            {/* Split Contact Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative z-10">
              
              {/* Left Column (5 cols): Office Details with visual Map */}
              <div className="lg:col-span-5 flex flex-col justify-between gap-6">
                
                {/* Specific Details Cards */}
                <div className="glass-card rounded-3xl p-6 border border-brand-blue/10 space-y-6 flex-1 flex flex-col justify-center">
                  <h3 className="font-display font-extrabold text-base uppercase tracking-wider text-brand-dark dark:text-white">
                    Unai Headquarter Office
                  </h3>
                  
                  <div className="space-y-4 text-xs font-sans">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-gray-800 dark:text-white block">Studio Location</span>
                        <span className="text-gray-500 dark:text-gray-400 block mt-0.5">
                          248 Ocean Drive Suite B, Venice Beach, Los Angeles, CA 90291
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Mail className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-gray-800 dark:text-white block">Email Dispatch</span>
                        <a href="mailto:director@unai.com" className="text-brand-blue hover:underline block mt-0.5">
                          director@unai.production.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-gray-800 dark:text-white block">Direct Voice Line</span>
                        <a href="tel:+13105550192" className="text-gray-500 dark:text-gray-300 hover:text-brand-blue block mt-0.5">
                          +1 (310) 555-0192 (Mon - Fri, 9 AM - 6 PM PST)
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Simulated minimal vector map block */}
                <div className="glass-card rounded-3xl p-4 border border-brand-blue/10 overflow-hidden relative h-52 flex items-center justify-center bg-gray-100 dark:bg-gray-900 group">
                  {/* Decorative grid lines */}
                  <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#1E4DFF_1px,transparent_1px),linear-gradient(to_bottom,#1E4DFF_1px,transparent_1px)] bg-[size:14px_24px]" />
                  
                  {/* Glowing central indicator dot */}
                  <span className="absolute w-5 h-5 bg-[#1E4DFF]/30 rounded-full animate-ping z-10" />
                  <span className="absolute w-2.5 h-2.5 bg-brand-blue rounded-full z-10 shadow-lg shadow-brand-blue/50" />
                  
                  <div className="relative text-center space-y-2 z-20 bg-white/70 dark:bg-[#161b2a]/90 backdrop-blur-md p-4 rounded-xl border border-brand-blue/10">
                    <span className="font-display font-bold text-xs text-[#1E4DFF] tracking-wider uppercase block">
                      unai studio map
                    </span>
                    <span className="text-[10px] text-gray-500 block">Venice Creative District Active</span>
                  </div>
                </div>

              </div>

              {/* Right Column (7 cols): Contact Form with Floating Labels */}
              <div className="lg:col-span-7 bg-gray-50 dark:bg-[#1c2235] p-6 md:p-8 rounded-3xl border border-brand-blue/5 shadow-xl flex flex-col justify-between">
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div>
                    <h3 className="text-lg font-display font-bold text-brand-dark dark:text-white">
                      Transmission Desk
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Your query will route directly to Director Unai's administrative assistant.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest block font-poppins">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Alexis Carter"
                        className="w-full px-4 py-2.5 bg-white dark:bg-[#1f263a] border border-brand-blue/10 rounded-xl text-sm outline-none focus:border-brand-blue dark:text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest block font-poppins">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="alexis@unai.com"
                        className="w-full px-4 py-2.5 bg-white dark:bg-[#1f263a] border border-brand-blue/10 rounded-xl text-sm outline-none focus:border-brand-blue dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest block font-poppins">
                      Cinematic Dialogue / Proposal Info
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Insert details of your filmography alliance or script pitch..."
                      className="w-full px-4 py-2.5 bg-white dark:bg-[#1f263a] border border-brand-blue/10 rounded-xl text-sm outline-none focus:border-brand-blue dark:text-white"
                    />
                  </div>

                  {contactResult && (
                    <p className="text-xs text-[#1E4DFF] font-semibold flex items-center gap-1.5 animate-fade-in font-sans">
                      <CheckCircle2 className="w-4 h-4 text-brand-blue" />
                      {contactResult}
                    </p>
                  )}

                  <button
                    type="submit"
                    id="contact-submit-btn"
                    className="w-full py-4 bg-[#1E4DFF] hover:bg-brand-blue/95 text-white font-sans text-sm font-semibold rounded-xl shadow-lg shadow-brand-blue/25 hover:shadow-brand-blue/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    Transmit Proposal
                  </button>
                </form>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* 4. Global cinematic footer */}
      <Footer setActiveTab={setActiveTab} />

      {/* ================= MODALS OVERLAYS SYSTEM ================= */}
      {/* Dynamic video modal */}
      <TrailerModal
        isOpen={!!trailerModal}
        videoUrl={trailerModal?.videoUrl || ''}
        movieTitle={trailerModal?.title || ''}
        onClose={() => setTrailerModal(null)}
      />

      {/* Detailed overview popup modal */}
      <MovieDetailModal
        movie={detailMovie}
        onClose={() => setDetailMovie(null)}
        onPlayTrailer={(url, title) => {
          setTrailerModal({ videoUrl: url, title });
        }}
        onStartBooking={(movie) => {
          setBookingMovie(movie);
        }}
      />

      {/* Seat booking utility engine modal */}
      {bookingMovie && (
        <BookingEngine
          initialMovie={bookingMovie}
          onClose={() => setBookingMovie(null)}
        />
      )}

    </div>
  );
}
