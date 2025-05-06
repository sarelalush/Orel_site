import React from 'react';
import { Tag } from 'lucide-react';

interface QuantityDiscountProps {
  minQuantity: number;
  discountPercentage: number;
}

export default function QuantityDiscount({ minQuantity, discountPercentage }: QuantityDiscountProps) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <Tag className="w-4 h-4 text-primary" />
      <span>
        {discountPercentage}% הנחה בקנייה מעל {minQuantity} יחידות
      </span>
    </div>
  );
}