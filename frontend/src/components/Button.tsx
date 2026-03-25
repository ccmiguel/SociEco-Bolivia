import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}) => {
  const baseStyles = "w-full py-4 px-8 rounded-full font-bold text-center transition-all active:scale-95";
  
  const variants = {
    primary: "bg-socieco-primary text-socieco-dark shadow-md hover:bg-[#cde482]",
    secondary: "bg-socieco-dark text-white shadow-md hover:bg-[#233829]",
    outline: "bg-transparent border-2 border-socieco-dark text-socieco-dark hover:bg-socieco-dark hover:text-white"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};
