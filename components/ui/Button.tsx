import React from 'react';
import Link from 'next/link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  href?: string;
  isLink?: boolean;
  className?: string;
}

export function Button({
  children,
  variant = 'primary',
  href,
  isLink = false,
  className = '',
  ...props
}: ButtonProps) {
  const baseClasses =
    'px-6 py-3 rounded-lg font-medium transition-all duration-300 inline-block text-center';

  const variantClasses = {
    primary: 'bg-[#00A8E8] text-white hover:bg-[#0087b8]',
    secondary: 'bg-[#1a4a8d] text-white hover:bg-[#0f2d5a]',
    outline: 'border-2 border-[#00A8E8] text-[#00A8E8] hover:bg-[#00A8E8] hover:text-white',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  if (isLink && href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
