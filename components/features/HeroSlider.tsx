'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const slides = [
  {
    id: 1,
    title: 'Fenix Car Hire',
    description: 'Experience luxury and comfort with our premium vehicle selection',
    gradient: 'from-blue-400 via-cyan-300 to-orange-300',
  },
  {
    id: 2,
    title: 'Reliable & Affordable',
    description: 'Quality vehicles at competitive prices with transparent terms',
    gradient: 'from-purple-400 via-pink-300 to-orange-400',
  },
  {
    id: 3,
    title: 'Your Perfect Journey',
    description: 'Professional service for every adventure across Eswatini',
    gradient: 'from-indigo-400 via-amber-300 to-red-300',
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
    <div className="relative h-96 md:h-[500px] overflow-hidden rounded-lg shadow-2xl">
      {/* Gradient Background Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Gradient Background */}
          <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient}`} />
          
          {/* Animated Sunset Sun */}
          <div className={`absolute top-1/4 right-1/4 w-32 h-32 rounded-full blur-3xl opacity-60 ${
            index === currentSlide ? 'animate-pulse' : ''
          }`} 
          style={{
            background: 'radial-gradient(circle, rgba(255,180,0,0.8), rgba(255,100,0,0.3))',
          }} />

          {/* Content */}
          <div className="relative h-full flex flex-col justify-center px-4 md:px-12">
            <div className="max-w-2xl z-10">
              <h2 className="text-4xl md:text-6xl font-bold mb-4 text-white text-shadow drop-shadow-lg">
                {slide.title}
              </h2>
              <p className="text-lg md:text-xl mb-8 text-white/90 drop-shadow-md max-w-xl">
                {slide.description}
              </p>
              <Link
                href="/booking"
                className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl"
              >
                Book Your Car Now
              </Link>
            </div>

            {/* Real Car Image */}
            <div className="absolute bottom-0 right-0 w-80 h-56 md:w-96 md:h-72">
              <Image
                src="/images/white-fortune-car.jpg"
                alt="White Fortune Car"
                fill
                className="object-contain object-bottom drop-shadow-2xl"
                priority
              />
            </div>
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
                ? 'bg-white w-8 shadow-lg'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full transition-colors backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full transition-colors backdrop-blur-sm"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
