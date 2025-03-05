import React, { ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = "primary", size = "md", className = "", ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
    
    const variantStyles = {
      primary: "bg-blue-600 text-white hover:bg-blue-700",
      secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600",
      outline: "border border-gray-300 bg-transparent hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800",
      ghost: "hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-200",
      link: "underline-offset-4 hover:underline text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300",
    };
    
    const sizeStyles = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4 py-2",
      lg: "h-12 px-6 py-3 text-lg",
    };
    
    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;
    
    return (
      <button 
        ref={ref} 
        className={combinedClassName} 
        {...props}
      >
        {children}
      </button>
    );
  }
); 