import React from 'react';
import { X, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';

interface CompareDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CompareDrawer({ isOpen, onClose }: CompareDrawerProps) {
  const { items, removeFromCompare, clearCompare } = useCompare();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="absolute inset-y-0 left-0 max-w-full flex">
        <div className="relative w-screen max-w-md">
          <div className="h-full flex flex-col bg-white shadow-xl">
            <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-medium text-gray-900">
                  השוואת מוצרים ({items.length}/4)
                </h2>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-500"
                  onClick={onClose}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="mt-8">
                {items.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">
                      לא נבחרו מוצרים להשוואה
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map(item => (
                      <div key={item.id} className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold">{item.name}</h3>
                          <div className="text-sm text-gray-500">
                            {item.categories?.parent?.name} / {item.categories?.name}
                          </div>
                          <div className="text-primary font-bold mt-1">
                            ₪{item.price.toLocaleString()}
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCompare(item.id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {items.length > 0 && (
              <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                <div className="flex justify-between mb-4">
                  <button
                    onClick={clearCompare}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    נקה הכל
                  </button>
                  <Link
                    to="/compare"
                    onClick={onClose}
                    className="flex items-center gap-2 text-primary hover:text-primary-dark"
                  >
                    השווה עכשיו
                    <ArrowLeft className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}