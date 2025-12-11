"use client";

import { useRef } from "react";
export type BestsellerBook = {
  id: number;
  title: string;
  author: string;
  coverUrl: string;
  subtitle?: string;
};

interface BestsellerCarouselProps {
  books: BestsellerBook[];
}

export default function BestsellerCarousel({
  books,
}: BestsellerCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  function scrollBy(direction: number) {
    if (!trackRef.current) return;
    trackRef.current.scrollBy({
      left: direction * 260,

      behavior: "smooth",
    });
  }



  return (
    <section className="carousel-section">
      <div className="carousel-header">
        <h2 className="carousel-title">Bestsellers</h2>
      </div>

      <div className="carousel-container">
        <button
          aria-label="Previous books"
          className="carousel-nav carousel-nav-left"
          type="button"
          onClick={() => scrollBy(-1)}
        >
        </button>

        <div className="carousel-track" ref={trackRef}>
          {books.map((book) => (
            <div key={book.id} className="carousel-card">
              <div className="carousel-cover">
                <img src={book.coverUrl} alt={`${book.title} cover`} />
              </div>

              <div className="carousel-card-body">
                <p className="carousel-book-title">{book.title}</p>
                {book.subtitle && (
                  <p className="carousel-subtitle">{book.subtitle}</p>
                )}
                <p className="carousel-author">{book.author}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          aria-label="Next books"
          className="carousel-nav carousel-nav-right"
          type="button"
          onClick={() => scrollBy(1)}
        >
        </button>
      </div>
    </section>
  );
}
