import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Smartphone, Calendar, Layers, MapPin, Users, Flame, CreditCard, Ticket } from 'lucide-react';
import { Movie, Booking } from '../types';
import { MOVIES } from '../data';

interface BookingEngineProps {
  initialMovie: Movie | null;
  onClose: () => void;
}

export default function BookingEngine({ initialMovie, onClose }: BookingEngineProps) {
  // Local state
  const [selectedMovie, setSelectedMovie] = useState<Movie>(initialMovie || MOVIES[0]);
  const [selectedTheater, setSelectedTheater] = useState<string>('');
  const [selectedTiming, setSelectedTiming] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('May 28, 2026');
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [customerName, setCustomerName] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [bookingConfirmed, setBookingConfirmed] = useState<Booking | null>(null);

  // Seat pricing
  const SEAT_PRICE = 12.5;

  // Sync on initialMovie changes
  useEffect(() => {
    if (initialMovie) {
      setSelectedMovie(initialMovie);
    }
  }, [initialMovie]);

  // Sync defaults on movie change
  useEffect(() => {
    setSelectedTheater(selectedMovie.theaters[0] || 'Dolby Cinema Aura');
    setSelectedTiming(selectedMovie.timings[0] || '6:15 PM');
    setSelectedSeats([]);
  }, [selectedMovie]);

  // Render theater seat matrix grid (Row A to F, Seats 1 to 8)
  const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
  const seatsPerRow = 8;
  
  // Fake randomized occupied seats based on time/theater combo to feel alive
  const getOccupiedSeats = () => {
    // Deterministic occupying based on strings to prevent re-rendering issues
    const seed = (selectedMovie.id + selectedTheater + selectedTiming).length;
    const occupied: string[] = [];
    rows.forEach((row, i) => {
      for (let seatNum = 1; seatNum <= seatsPerRow; seatNum++) {
        // pseudo-random logic
        if ((seed * (i + 1) * seatNum) % 5 === 0) {
          occupied.push(`${row}${seatNum}`);
        }
      }
    });
    return occupied;
  };

  const occupiedSeats = getOccupiedSeats();

  const handleSeatClick = (seatId: string) => {
    if (occupiedSeats.includes(seatId)) return;
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleBookNow = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat to proceed.');
      return;
    }
    if (!customerName || !customerEmail) {
      alert('Please fill out your name and email to generate the cinematic pass.');
      return;
    }

    const bookingId = 'UNAI-' + Math.floor(Math.random() * 900000 + 100000);
    const newBooking: Booking = {
      id: bookingId,
      movieId: selectedMovie.id,
      movieTitle: selectedMovie.title,
      theater: selectedTheater,
      timing: selectedTiming,
      date: selectedDate,
      seats: selectedSeats,
      totalAmount: selectedSeats.length * SEAT_PRICE,
    };

    setBookingConfirmed(newBooking);
  };

  const handleReset = () => {
    setBookingConfirmed(null);
    setSelectedSeats([]);
    setCustomerName('');
    setCustomerEmail('');
  };

  return (
    <div
      id="booking-engine-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="booking-engine-container"
        className="relative w-full max-w-5xl bg-white dark:bg-[#161b2a] rounded-3xl overflow-hidden shadow-2xl border border-brand-blue/10 transform scale-100 transition-all duration-300 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#f8f9ff] dark:bg-[#111522] border-b border-brand-blue/5">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-brand-blue animate-bounce" />
            <h3 className="font-display font-extrabold text-brand-dark dark:text-white text-lg uppercase tracking-wide">
              Cinematic Ticket Center
            </h3>
          </div>
          <button
            id="booking-close-button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 hover:text-brand-blue dark:text-gray-300 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Core content */}
        <div className="overflow-y-auto flex-1 p-6 md:p-8">
          {!bookingConfirmed ? (
            <form onSubmit={handleBookNow} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Side (8 cols for desktop): Movie Selector & Seats matrix */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* 1. Select Movie */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest font-poppins block">
                    Choose Movie
                  </label>
                  <select
                    id="booking-movie-select"
                    value={selectedMovie.id}
                    onChange={(e) => {
                      const found = MOVIES.find((m) => m.id === e.target.value);
                      if (found) setSelectedMovie(found);
                    }}
                    className="w-full px-4 py-3 bg-white dark:bg-[#1f263a] border border-brand-blue/10 rounded-xl font-sans text-sm outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue dark:text-white transition-all"
                  >
                    {MOVIES.map((movie) => (
                      <option key={movie.id} value={movie.id}>
                        {movie.title} ({movie.genre})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Selecting Theater & Timing */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Theater option */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest font-poppins block">
                      Select Luxury Hall
                    </label>
                    <select
                      id="booking-theater-select"
                      value={selectedTheater}
                      onChange={(e) => setSelectedTheater(e.target.value)}
                      className="w-full px-4 py-3 bg-white dark:bg-[#1f263a] border border-brand-blue/10 rounded-xl font-sans text-sm outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue dark:text-white transition-all"
                    >
                      {selectedMovie.theaters.map((hall) => (
                        <option key={hall} value={hall}>
                          {hall}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Timing Option */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest font-poppins block">
                      Available Showtime
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedMovie.timings.map((time) => {
                        const isSelected = selectedTiming === time;
                        return (
                          <button
                            type="button"
                            key={time}
                            onClick={() => setSelectedTiming(time)}
                            className={`py-2 px-3 text-xs font-semibold rounded-lg text-center transition-all ${
                              isSelected
                                ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/20'
                                : 'bg-white dark:bg-[#1f263a] text-gray-700 dark:text-gray-200 border border-brand-blue/10 hover:border-brand-blue hover:text-brand-blue'
                            }`}
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Date Slider */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest font-poppins block">
                    Choose Date
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['May 28, 2026', 'May 29, 2026', 'May 30, 2026'].map((date) => {
                      const isSelected = selectedDate === date;
                      return (
                        <button
                          type="button"
                          key={date}
                          onClick={() => setSelectedDate(date)}
                          className={`py-2 px-3 text-xs font-semibold rounded-lg text-center transition-all ${
                            isSelected
                              ? 'bg-brand-blue text-white'
                              : 'bg-white dark:bg-[#1f263a] text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-800'
                          }`}
                        >
                          {date}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Screen Seat Grid map */}
                <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <div className="text-center space-y-1">
                    <div className="h-1.5 w-3/4 bg-brand-blue/30 mx-auto rounded-full shadow-[0_0_15px_rgba(30,77,255,0.4)]" />
                    <p className="text-[10px] uppercase tracking-widest text-brand-blue font-extrabold font-poppins">
                      CINEMATIC THEATER SCREEN
                    </p>
                  </div>

                  {/* Seat Matrix grid */}
                  <div className="flex flex-col gap-2 items-center justify-center p-4 bg-gray-50 dark:bg-[#111522] rounded-2xl">
                    {rows.map((row) => (
                      <div key={row} className="flex gap-2 items-center">
                        <span className="text-[10px] font-bold text-gray-400 w-4 font-mono">{row}</span>
                        {Array.from({ length: seatsPerRow }, (_, idx) => {
                          const seatNum = idx + 1;
                          const seatId = `${row}${seatNum}`;
                          const isOccupied = occupiedSeats.includes(seatId);
                          const isSelected = selectedSeats.includes(seatId);

                          return (
                            <button
                              type="button"
                              key={seatId}
                              disabled={isOccupied}
                              onClick={() => handleSeatClick(seatId)}
                              className={`w-6 h-6 rounded-md text-[9px] font-bold flex items-center justify-center transition-all ${
                                isOccupied
                                  ? 'bg-gray-300 text-gray-500 line-through dark:bg-gray-800 dark:text-gray-600 cursor-not-allowed'
                                  : isSelected
                                  ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/50 scale-105'
                                  : 'bg-white hover:bg-brand-blue/10 hover:border-brand-blue dark:bg-[#1f263a] text-gray-700 dark:text-gray-200 border border-brand-blue/20'
                              }`}
                              title={`Seat ${seatId}`}
                            >
                              {seatNum}
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>

                  {/* Legend Indicator */}
                  <div className="flex items-center justify-center gap-6 text-[10px] font-extrabold uppercase tracking-widest text-gray-500 font-poppins pt-2">
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 bg-white dark:bg-[#1f263a] border border-brand-blue/30 rounded-full" />
                      Available
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 bg-brand-blue rounded-full" />
                      Selected
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 bg-gray-300 dark:bg-gray-800 rounded-full" />
                      Booked
                    </span>
                  </div>
                </div>

              </div>

              {/* Right Side (4 cols for desktop): Order Summary & Personal Input */}
              <div className="lg:col-span-5 bg-gray-50 dark:bg-[#1c2235] p-6 rounded-2xl border border-brand-blue/5 flex flex-col justify-between space-y-6">
                <div className="space-y-6">
                  <div className="mb-2">
                    <h4 className="text-xs font-extrabold text-[#1E4DFF] uppercase tracking-wider font-poppins">
                      Selected Bill Summary
                    </h4>
                    <p className="text-[10px] text-gray-400 font-medium">Verify your selection before processing pass generation.</p>
                  </div>

                  {/* Dynamic Ticket Preview List */}
                  <div className="space-y-3 font-sans text-sm">
                    <div className="flex items-center justify-between py-1.5 border-b border-gray-200 dark:border-gray-800">
                      <span className="text-gray-500 dark:text-gray-400">Movie Choice</span>
                      <span className="font-bold text-gray-800 dark:text-white max-w-[180px] truncate">{selectedMovie.title}</span>
                    </div>
                    <div className="flex items-center justify-between py-1.5 border-b border-gray-200 dark:border-gray-800 font-medium text-xs">
                      <span className="text-gray-500 dark:text-gray-400">Theater Suite</span>
                      <span className="text-gray-800 dark:text-white">{selectedTheater}</span>
                    </div>
                    <div className="flex items-center justify-between py-1.5 border-b border-gray-200 dark:border-gray-800">
                      <span className="text-gray-500 dark:text-gray-400">Session Date / Time</span>
                      <span className="font-semibold text-brand-blue text-xs">{selectedDate} at {selectedTiming}</span>
                    </div>
                    <div className="flex items-center justify-between py-1.5 border-b border-gray-200 dark:border-gray-800">
                      <span className="text-gray-500 dark:text-gray-400">Tickets Chosen</span>
                      <span className="font-bold text-brand-blue">
                        {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None SELECTED'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b-2 border-dashed border-gray-200 dark:border-gray-800">
                      <span className="text-gray-500 dark:text-gray-400 font-semibold">Seat Count</span>
                      <span className="font-extrabold text-gray-800 dark:text-white">{selectedSeats.length} × ${SEAT_PRICE}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-gray-800 dark:text-white font-extrabold text-base">Total Cost</span>
                      <span className="font-display font-extrabold text-lg text-brand-blue">
                        ${(selectedSeats.length * SEAT_PRICE).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Customer Input Fields */}
                  <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest font-poppins block">
                        Your Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Alexis Carter"
                        className="w-full px-4 py-2.5 bg-white dark:bg-[#1f263a] border border-brand-blue/10 rounded-xl font-sans text-sm outline-none focus:border-brand-blue dark:text-white transition-all"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest font-poppins block">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="e.g. alexis@unai.com"
                        className="w-full px-4 py-2.5 bg-white dark:bg-[#1f263a] border border-brand-blue/10 rounded-xl font-sans text-sm outline-none focus:border-brand-blue dark:text-white transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Confirm Action Button */}
                <button
                  type="submit"
                  id="booking-confirm-submit-btn"
                  className="w-full py-4 bg-[#1E4DFF] hover:bg-brand-blue/90 text-white font-sans text-sm font-semibold rounded-xl shadow-lg shadow-brand-blue/20 hover:shadow-brand-blue/30 transition-all duration-300 hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CreditCard className="w-4 h-4" />
                  Generate VIP Movie Pass
                </button>
              </div>
            </form>
          ) : (
            /* Immersive visual Ticket generation block */
            <div className="max-w-md mx-auto space-y-8 py-4">
              <div className="text-center space-y-2">
                <CheckCircle className="w-12 h-12 text-[#1E4DFF] mx-auto animate-bounce" />
                <h4 className="text-xl font-display font-extrabold text-brand-dark dark:text-white">
                  Booking Confirmed!
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Your VIP Pass has been validated successfully. Show the QR-code at the lobby entrance.
                </p>
              </div>

              {/* Printable UNAI CINEMATIC PASS Card */}
              <div className="relative overflow-hidden bg-gradient-to-br from-[#1E4DFF] to-[#00174a] text-white rounded-3xl p-6 shadow-2xl border border-white/10 flex flex-col justify-between min-h-[460px]">
                {/* Decorative radial lighting bubble */}
                <span className="absolute -right-16 -top-16 w-56 h-56 bg-brand-blue/30 rounded-full blur-3xl pointer-events-none" />

                <div className="flex items-center justify-between border-b border-white/20 pb-4">
                  <div className="flex items-center gap-2">
                    <Ticket className="w-5 h-5 text-brand-blue animate-pulse" />
                    <span className="font-display font-extrabold text-xs uppercase tracking-[0.2em]">
                      unai cinematic pass
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-gray-200 tracking-wider">
                    VIP GOLD # {bookingConfirmed.id}
                  </span>
                </div>

                <div className="space-y-6 my-6 flex-1 flex flex-col justify-center">
                  {/* Movie Title */}
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-widest text-[#87a5ff] font-extrabold font-poppins">
                      Selected Feature
                    </span>
                    <h2 className="text-2xl font-display font-extrabold leading-tight tracking-tight">
                      {bookingConfirmed.movieTitle}
                    </h2>
                  </div>

                  {/* Hall and Timing grid info */}
                  <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-xs">
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-[#87a5ff] font-bold block font-poppins">
                        Luxury Suite
                      </span>
                      <span className="font-semibold font-sans mt-0.5 block truncate">
                        {bookingConfirmed.theater}
                      </span>
                    </div>

                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-[#87a5ff] font-bold block font-poppins">
                        Date / Time
                      </span>
                      <span className="font-semibold font-sans mt-0.5 block">
                        {bookingConfirmed.date} — {bookingConfirmed.timing}
                      </span>
                    </div>

                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-[#87a5ff] font-bold block font-poppins">
                        Seats Assigned
                      </span>
                      <span className="font-extrabold mt-0.5 block text-lg tracking-wide">
                        {bookingConfirmed.seats.join(', ')}
                      </span>
                    </div>

                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-[#87a5ff] font-bold block font-poppins">
                        Holder details
                      </span>
                      <span className="font-semibold font-sans mt-0.5 block truncate">
                        {customerName}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Border line dotted cut representation */}
                <div className="border-t border-dashed border-white/30 my-3 relative">
                  <span className="absolute -left-9 -top-3 w-6 h-6 bg-white dark:bg-[#161b2a] rounded-full" />
                  <span className="absolute -right-9 -top-3 w-6 h-6 bg-white dark:bg-[#161b2a] rounded-full" />
                </div>

                {/* Barcode & Total Block */}
                <div className="flex items-end justify-between pt-3">
                  {/* Barcode representation */}
                  <div className="flex flex-col gap-1">
                    <div className="flex gap-0.5 h-10 items-center justify-start bg-white p-1 rounded-md">
                      {Array.from({ length: 28 }, (_, j) => {
                        const heights = ['h-8', 'h-6', 'h-7', 'h-5', 'h-8', 'h-4'];
                        const h = heights[(j * 7) % heights.length];
                        const w = j % 3 === 0 ? 'w-[3px]' : j % 4 === 0 ? 'w-[4px]' : 'w-[2px]';
                        const color = j % 5 === 0 ? 'bg-transparent' : 'bg-black';
                        return <span key={j} className={`${h} ${w} ${color} block`} />;
                      })}
                    </div>
                    <span className="text-[9px] text-gray-300 font-mono tracking-widest">
                      *UNAI-{bookingConfirmed.id}*
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[9px] uppercase tracking-widest text-[#87a5ff] block font-poppins">
                      Total Cost
                    </span>
                    <span className="font-display font-extrabold text-2xl text-white">
                      ${bookingConfirmed.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="flex gap-4">
                <button
                  id="booking-pass-reset-btn"
                  onClick={handleReset}
                  className="flex-1 py-3 bg-[#1E4DFF]/10 hover:bg-[#1E4DFF]/20 text-[#1E4DFF] font-semibold text-sm rounded-xl text-center cursor-pointer transition-colors"
                >
                  Book Another Movie
                </button>
                <button
                  id="booking-pass-print-btn"
                  onClick={() => window.print()}
                  className="flex-1 py-3 bg-brand-blue text-white font-semibold text-sm rounded-xl text-center hover:bg-brand-blue/95 transition-colors cursor-pointer"
                >
                  Print PDF Pass
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
