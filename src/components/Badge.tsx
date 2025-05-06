import React from 'react';

type BadgeVariant = 'primary' | 'success' | 'warning' | 'error' | 'info';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

export default function Badge({ variant = 'primary', children }: BadgeProps) {
  const variants = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-green-50 text-green-600',
    warning: 'bg-yellow-50 text-yellow-600',
    error: 'bg-red-50 text-red-600',
    info: 'bg-blue-50 text-blue-600'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
}