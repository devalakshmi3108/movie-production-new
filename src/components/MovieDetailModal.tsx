import React from 'react';
import { X, Clock, Play, Calendar, Award, Star, Film, CheckCircle2 } from 'lucide-react';
import { Movie } from '../types';

interface MovieDetailModalProps {
  movie: Movie | null;
  onClose: () => void;
  onPlayTrailer: (videoUrl: string, title: string) => void;
  onStartBooking: (movie: Movie) => void;
}

export default function MovieDetailModal({
  movie,
  onClose,
  onPlayTrailer,
  onStartBooking,
}: MovieDetailModalProps) {
  if (!movie) return null;

  return (
    <div
      id="movie-detail-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="movie-detail-content"
        className="relative w-full max-w-4xl bg-white dark:bg-[#161b2a] rounded-3xl overflow-hidden shadow-2xl border border-brand-blue/10 transform scale-100 transition-all duration-300 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with high contrast Close button */}
        <button
          id="detail-close-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors cursor-pointer"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal body (Scrollable) */}
        <div className="overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-12">
            {/* Left Column: HD Poster with trailer play overlay */}
            <div className="md:col-span-5 relative h-80 md:h-[500px] w-full bg-gray-900 group">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=1025';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 flex flex-col justify-end p-6">
                <button
                  id="detail-play-trailer-overlay"
                  onClick={() => onPlayTrailer(movie.trailerUrl, movie.title)}
                  className="mx-auto p-4 rounded-full bg-brand-blue hover:bg-brand-blue/90 text-white shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer"
                >
                  <Play className="w-6 h-6 fill-current ml-0.5" />
                </button>
                <p className="text-center mt-3 text-sm text-gray-200 font-medium tracking-wide">
                  Watch Official Teaser
                </p>
              </div>
            </div>

            {/* Right Column: Information & Timings */}
            <div className="md:col-span-7 p-6 md:p-8 flex flex-col justify-between space-y-6">
              <div>
                {/* Tag & Category */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="px-3 py-1 text-[10px] font-extrabold uppercase bg-brand-blue/10 text-brand-blue rounded-full font-poppins tracking-wider border border-brand-blue/10">
                    {movie.genre}
                  </span>
                  <span className="text-xs text-brand-blue font-medium dark:text-gray-300">
                    {movie.category}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-2xl md:text-3xl font-display font-extrabold text-brand-dark dark:text-white leading-tight tracking-tight">
                  {movie.title}
                </h2>

                {/* Quick Info */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-brand-blue" />
                    {movie.runtime}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-brand-blue" />
                    {movie.year}
                  </span>
                  <span className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    {movie.rating} / 10
                  </span>
                </div>

                <div className="h-px bg-gray-100 dark:bg-gray-800 my-4" />

                {/* Synopsis */}
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider font-poppins">
                    Synopsis
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-sans">
                    {movie.synopsis}
                  </p>
                </div>

                {/* Cast & Crew row */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div>
                    <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest block font-poppins">
                      Director
                    </span>
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 block mt-0.5">
                      {movie.director}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest block font-poppins">
                      Cast Members
                    </span>
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-300 block mt-0.5 max-h-12 overflow-y-auto">
                      {movie.cast.join(', ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Show timings info */}
              <div className="bg-brand-blue/[0.03] dark:bg-brand-blue/[0.01] border border-brand-blue/10 p-4 rounded-2xl">
                <h4 className="text-xs font-extrabold text-[#1E4DFF] uppercase tracking-wider font-poppins mb-3 flex items-center gap-1.5">
                  <Award className="w-4 h-4" />
                  Featured Timings (Today)
                </h4>
                <div className="flex flex-wrap gap-2 text-xs">
                  {movie.timings.map((time) => (
                    <span
                      key={time}
                      className="px-3 py-1.5 bg-white dark:bg-[#1f263a]/50 text-gray-700 dark:text-gray-200 border border-gray-100 dark:border-gray-800 rounded-lg hover:border-brand-blue hover:text-brand-blue transition-all cursor-pointer font-sans"
                    >
                      {time}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  id="detail-book-now-cta"
                  onClick={() => {
                    onClose();
                    onStartBooking(movie);
                  }}
                  className="flex-1 px-8 py-3.5 bg-brand-blue hover:bg-brand-blue/95 text-white font-sans text-sm font-semibold rounded-full shadow-lg shadow-brand-blue/25 hover:shadow-brand-blue/35 hover:-translate-y-0.5 cursor-pointer active:translate-y-0 transition-all duration-300 text-center"
                >
                  Book Your Show
                </button>
                <button
                  id="detail-trailer-btn"
                  onClick={() => onPlayTrailer(movie.trailerUrl, movie.title)}
                  className="px-6 py-3.5 border border-brand-blue/20 hover:border-brand-blue hover:bg-brand-blue/5 text-brand-blue font-sans text-sm font-semibold rounded-full transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  Watch Trailer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
