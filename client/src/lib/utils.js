import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Password generation utilities
export function generatePassword(options) {
  const {
    length = 12,
    includeUppercase = true,
    includeLowercase = true,
    includeNumbers = true,
    includeSymbols = true,
    avoidAmbiguous = false
  } = options;

  let chars = '';
  
  if (includeUppercase) {
    chars += avoidAmbiguous ? 'ABCDEFGHJKLMNPQRSTUVWXYZ' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  }
  
  if (includeLowercase) {
    chars += avoidAmbiguous ? 'abcdefghijkmnopqrstuvwxyz' : 'abcdefghijklmnopqrstuvwxyz';
  }
  
  if (includeNumbers) {
    chars += avoidAmbiguous ? '23456789' : '0123456789';
  }
  
  if (includeSymbols) {
    chars += '!@#$%^&*_-+=';
  }
  
  // If no character set is selected, default to lowercase
  if (chars === '') {
    chars = 'abcdefghijklmnopqrstuvwxyz';
  }
  
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    password += chars[randomIndex];
  }
  
  return password;
}

export function calculatePasswordStrength(password) {
  if (!password) return { score: 0, label: 'Weak', color: 'red', percentage: 25 };
  
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  
  const strengthMapping = [
    { score: 0, label: 'Weak', color: 'red', percentage: 25 },
    { score: 3, label: 'Medium', color: 'orange', percentage: 50 },
    { score: 5, label: 'Strong', color: 'yellow', percentage: 75 },
    { score: 6, label: 'Very Strong', color: 'green', percentage: 100 }
  ];
  
  for (let i = strengthMapping.length - 1; i >= 0; i--) {
    if (score >= strengthMapping[i].score) {
      return strengthMapping[i];
    }
  }
  
  return strengthMapping[0]; // Default to weak
}
