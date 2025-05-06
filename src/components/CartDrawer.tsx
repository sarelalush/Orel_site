import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, updateQuantity, removeFromCart, total, itemCount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleCheckout = () => {
    onClose();
    if (!user) {
      navigate('/auth/login', { state: { from: '/checkout' } });
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="absolute inset-y-0 left-0 max-w-full flex">
        <div className="relative w-screen max-w-md">
          <div className="h-full flex flex-col bg-white shadow-xl">
            <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-medium text-gray-900">סל קניות ({itemCount})</h2>
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
                    <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">הסל ריק</h3>
                    <p className="mt-1 text-sm text-gray-500">התחל לקנות מוצרים</p>
                  </div>
                ) : (
                  <div className="flow-root">
                    <ul className="divide-y divide-gray-200">
                      {items.map((item) => (
                        <li key={`${item.product.id}-${item.product.size || ''}-${item.product.color || ''}`} className="py-6 flex">
                          <div className="flex-shrink-0 w-24 h-24 overflow-hidden rounded-md">
                            <img
                              src={item.product.image_url || item.product.image}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="ml-4 flex-1 flex flex-col">
                            <div>
                              <div className="flex justify-between text-base font-medium text-gray-900">
                                <h3>{item.product.name}</h3>
                                <p className="ml-4">₪{item.product.price.toLocaleString()}</p>
                              </div>
                              {(item.product.size || item.product.color) && (
                                <div className="mt-1 text-sm text-gray-500">
                                  {item.product.size && <span className="ml-2">מידה: {item.product.size}</span>}
                                  {item.product.color && <span>צבע: {item.product.color}</span>}
                                </div>
                              )}
                            </div>
                            <div className="flex-1 flex items-end justify-between text-sm">
                              <div className="flex items-center">
                                <button
                                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                  className="p-1 rounded-full hover:bg-gray-100"
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <span className="mx-2 font-medium">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                  className="p-1 rounded-full hover:bg-gray-100"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeFromCart(item.product.id)}
                                className="font-medium text-red-600 hover:text-red-500"
                              >
                                הסר
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {items.length > 0 && (
              <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>סה"כ</p>
                  <p>₪{total.toLocaleString()}</p>
                </div>
                <p className="mt-0.5 text-sm text-gray-500">משלוח ומיסים יחושבו בקופה</p>
                <div className="mt-6">
                  <button
                    onClick={handleCheckout}
                    className="flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary hover:bg-primary-dark w-full"
                  >
                    {user ? 'המשך לתשלום' : 'התחבר כדי להמשיך לתשלום'}
                  </button>
                </div>
                <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                  <p>
                    או{' '}
                    <button
                      type="button"
                      className="font-medium text-primary hover:text-primary-dark"
                      onClick={onClose}
                    >
                      המשך בקניות
                      <span> &rarr;</span>
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}