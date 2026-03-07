import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = '', hover = true }: CardProps) {
  const hoverClasses = hover ? 'hover:shadow-lg hover:scale-105 transition-all duration-300' : '';
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${hoverClasses} ${className}`}>
      {children}
    </div>
  );
}
