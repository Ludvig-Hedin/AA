import React from 'react';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated';
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  className,
}) => {
  const baseClasses = 'card p-6';
  const variantClasses = {
    default: '',
    elevated: 'shadow-md',
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${className || ''}`;
  
  return (
    <div className={classes}>
      {children}
    </div>
  );
}; 