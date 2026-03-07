'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const slides = [
  {
    id: 1,
    title: 'Premium Car Rental Services',
    description: 'Experience comfort and reliability with our wide selection of vehicles',
    bgColor: 'bg-gradient-to-r from-[#1a4a8d] to-[#00A8E8]',
  },
  {
    id: 2,
    title: 'Affordable Rates',
    description: 'Get the best value for your money with our competitive pricing',
    bgColor: 'bg-gradient-to-r from-[#00A8E8] to-[#0087b8]',
  },
  {
    id: 3,
    title: '24/7 Support',
    description: 'Round-the-clock customer service for your peace of mind',
    bgColor: 'bg-gradient-to-r from-[#1a4a8d] to-[#2a6ab0]',
  },
];

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative h-96 md:h-[500px] overflow-hidden rounded-lg">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          } ${slide.bgColor}`}
        >
          <div className="h-full flex flex-col items-center justify-center text-white text-center px-4">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">{slide.title}</h2>
            <p className="text-lg md:text-xl mb-8 text-gray-100 max-w-2xl">{slide.description}</p>
            <Link
              href="/booking"
              className="px-8 py-3 bg-white text-[#1a4a8d] rounded-lg font-bold hover:bg-gray-100 transition-colors"
            >
              Book Your Car
            </Link>
          </div>
        </div>
      ))}

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full transition-colors"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full transition-colors"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
