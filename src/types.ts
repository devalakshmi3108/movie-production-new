export interface Movie {
  id: string;
  title: string;
  synopsis: string;
  rating: number;
  genre: string;
  category: string;
  runtime: string;
  year: number;
  posterUrl: string;
  trailerUrl: string; // Embeddable YouTube URL
  director: string;
  cast: string[];
  timings: string[];
  theaters: string[];
}

export interface Booking {
  id: string;
  movieId: string;
  movieTitle: string;
  theater: string;
  timing: string;
  date: string;
  seats: string[];
  totalAmount: number;
}

export type ActiveTab = 'home' | 'collection' | 'upcoming' | 'about' | 'contact';
