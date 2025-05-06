import React from 'react';
import { X, ShoppingCart, Heart } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface QuickViewProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickView({ product, isOpen, onClose }: QuickViewProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = React.useState(1);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex">
          {/* Product Image */}
          <div className="w-1/2">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Details */}
          <div className="w-1/2 p-8">
            <div className="flex justify-between items-start">
              <h2 className="text-2xl font-bold">{product.name}</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mt-4">
              <p className="text-gray-600">{product.description}</p>
              <div className="text-2xl font-bold text-primary mt-4">
                ₪{product.price.toLocaleString()}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                כמות
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 border-x">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <button
                onClick={() => {
                  for (let i = 0; i < quantity; i++) {
                    addToCart(product);
                  }
                  onClose();
                }}
                className="w-full bg-primary text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                הוסף לסל
              </button>
              <button className="w-full border border-primary text-primary py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-colors">
                <Heart className="w-5 h-5" />
                הוסף למועדפים
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}