import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon;
}

export const Input: React.FC<InputProps> = ({ icon: Icon, className = '', ...props }) => {
  return (
    <div className="relative w-full mb-4">
      {Icon && (
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-socieco-dark opacity-60">
          <Icon size={20} />
        </div>
      )}
      <input
        className={`w-full bg-white border-2 border-socieco-dark text-socieco-text placeholder-gray-400 rounded-full py-4 outline-none focus:border-socieco-primary transition-colors focus:ring-4 focus:ring-socieco-primary/20 ${
          Icon ? 'pl-14' : 'pl-6'
        } pr-6 ${className}`}
        {...props}
      />
    </div>
  );
};
