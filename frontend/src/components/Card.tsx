import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'base' | 'dark';
}

export const Card: React.FC<CardProps> = ({ children, className = '', variant = 'base' }) => {
  const isDark = variant === 'dark';
  
  return (
    <div className={`
      rounded-[24px] p-6 shadow-soft transition-all
      ${isDark ? 'bg-socieco-dark text-socieco-bg' : 'bg-white text-socieco-text border border-gray-100'} 
      ${className}
    `}>
      {children}
    </div>
  );
};
