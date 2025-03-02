import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className,
  ...props
}) => {
  const id = props.id || `input-${Math.random().toString(36).substring(2, 9)}`;
  
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block mb-2 text-sm font-medium">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`auth-input ${error ? 'border-red-500' : ''} ${className || ''}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}; 