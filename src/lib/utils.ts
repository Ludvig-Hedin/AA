import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Password strength checker
export function checkPasswordStrength(password: string): 'weak' | 'medium' | 'strong' {
  // Check for minimum length
  if (password.length < 8) {
    return 'weak';
  }
  
  // Check for complexity
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSpecialChars = /[^A-Za-z0-9]/.test(password);
  
  const complexity = [hasUppercase, hasLowercase, hasNumbers, hasSpecialChars].filter(Boolean).length;
  
  if (complexity === 4 && password.length >= 10) {
    return 'strong';
  } else if (complexity >= 3) {
    return 'medium';
  } else {
    return 'weak';
  }
}

// Email validator
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Format date
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

// Generate random ID
export function generateId(length: number = 8): string {
  return Math.random().toString(36).substring(2, 2 + length);
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return function(...args: Parameters<T>): void {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
} 