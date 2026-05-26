import React from 'react';
import { X, Film } from 'lucide-react';

interface TrailerModalProps {
  isOpen: boolean;
  videoUrl: string;
  movieTitle: string;
  onClose: () => void;
}

export default function TrailerModal({ isOpen, videoUrl, movieTitle, onClose }: TrailerModalProps) {
  if (!isOpen) return null;

  return (
    <div
      id="trailer-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        id="trailer-modal-content"
        className="relative w-full max-w-4xl bg-[#161b2a] border border-brand-blue/30 rounded-2xl overflow-hidden shadow-2xl shadow-brand-blue/20 transform scale-100 transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#111522] border-b border-white/5">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-brand-blue animate-pulse" />
            <h3 className="font-display font-bold text-white text-base md:text-lg tracking-wide">
              {movieTitle} — Official Trailer
            </h3>
          </div>
          <button
            id="trailer-close-button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            aria-label="Close trailer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Wrapper aspect-video */}
        <div className="aspect-video w-full bg-black">
          {videoUrl ? (
            <iframe
              id="trailer-iframe"
              src={`${videoUrl}?autoplay=1&rel=0&showinfo=0`}
              title={`${movieTitle} Trailer`}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 font-sans text-sm">
              Trailer is currently unavailable.
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-6 py-3 bg-[#111522] border-t border-white/5 text-center">
          <p className="text-[11px] text-gray-400 uppercase tracking-widest font-poppins">
            Powered by UNAI PRODUCTION • Cinematic Excellence
          </p>
        </div>
      </div>
    </div>
  );
}
