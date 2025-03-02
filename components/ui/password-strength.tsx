"use client";

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { checkPasswordStrength } from '@/lib/utils';

interface PasswordStrengthProps {
  password: string;
  className?: string;
}

export function PasswordStrength({ password, className }: PasswordStrengthProps) {
  const [strength, setStrength] = useState<'weak' | 'medium' | 'strong'>('weak');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!password) {
      setStrength('weak');
      setMessage('');
      return;
    }

    const result = checkPasswordStrength(password);
    setStrength(result);

    switch (result) {
      case 'weak':
        setMessage('Weak - Add more characters, numbers, and symbols');
        break;
      case 'medium':
        setMessage('Medium - Good, but could be stronger');
        break;
      case 'strong':
        setMessage('Strong - Excellent password!');
        break;
    }
  }, [password]);

  if (!password) {
    return null;
  }

  return (
    <div className={cn("mt-2 space-y-2", className)}>
      <div className="flex gap-1 h-1">
        <div 
          className={cn(
            "flex-1 rounded-full transition-colors duration-300",
            strength === 'weak' ? "bg-destructive" : 
            strength === 'medium' ? "bg-amber-500" : 
            "bg-emerald-500"
          )} 
        />
        <div 
          className={cn(
            "flex-1 rounded-full transition-colors duration-300",
            strength === 'weak' ? "bg-muted" : 
            "bg-amber-500"
          )} 
        />
        <div 
          className={cn(
            "flex-1 rounded-full transition-colors duration-300",
            strength === 'strong' ? "bg-emerald-500" : "bg-muted"
          )} 
        />
      </div>
      <p className={cn(
        "text-xs",
        strength === 'weak' ? "text-destructive" : 
        strength === 'medium' ? "text-amber-500" : 
        "text-emerald-500"
      )}>
        {message}
      </p>
    </div>
  );
}