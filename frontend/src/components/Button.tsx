import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg' | string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseStyles = "w-full rounded-full font-bold text-center transition-all active:scale-95";

  const sizes: Record<string, string> = {
    sm: "py-2 px-4 text-sm",
    md: "py-4 px-8",
    lg: "py-5 px-10 text-lg",
  };

  const variants = {
    primary: "bg-socieco-primary text-socieco-dark shadow-md hover:bg-[#cde482]",
    secondary: "bg-socieco-dark text-white shadow-md hover:bg-[#233829]",
    outline: "bg-transparent border-2 border-socieco-dark text-socieco-dark hover:bg-socieco-dark hover:text-white"
  };

  return (
    <button className={`${baseStyles} ${sizes[size] || sizes.md} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};
