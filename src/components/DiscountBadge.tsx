import React from 'react';
import { Tag } from 'lucide-react';

interface DiscountBadgeProps {
  type: 'sale' | 'quantity' | 'coupon';
  value: number;
  className?: string;
}

export default function DiscountBadge({ type, value, className = '' }: DiscountBadgeProps) {
  const getColor = () => {
    switch (type) {
      case 'sale':
        return 'bg-red-100 text-red-800';
      case 'quantity':
        return 'bg-blue-100 text-blue-800';
      case 'coupon':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm ${getColor()} ${className}`}>
      <Tag className="w-4 h-4" />
      <span>-{value}%</span>
    </div>
  );
}