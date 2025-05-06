import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2, Heart, ChevronLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { items, removeFromCart, updateQuantity, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="w-8 h-8 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold mb-4">סל הקניות שלך ריק</h1>
          <p className="text-gray-600 mb-8">לא נמצאו מוצרים בסל הקניות שלך</p>
          <Link
            to="/catalog"
            className="bg-primary text-white px-6 py-3 rounded-lg inline-flex items-center justify-center hover:bg-primary-dark transition-colors"
          >
            המשך בקניות
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">סל קניות</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-dynamic p-6">
            {items.map((item) => (
              <div key={`${item.product.id}-${item.product.size || ''}-${item.product.color || ''}`} className="flex items-center gap-4 py-4 border-b last:border-0">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <Link 
                    to={`/product/${item.product.id}`}
                    className="text-lg font-semibold hover:text-primary transition-colors"
                  >
                    {item.product.name}
                  </Link>
                  {(item.product.size || item.product.color) && (
                    <div className="text-sm text-gray-500 mb-1">
                      {item.product.size && <span className="ml-2">מידה: {item.product.size}</span>}
                      {item.product.color && <span>צבע: {item.product.color}</span>}
                    </div>
                  )}
                  <p className="text-gray-600 text-sm mb-2 line-clamp-1">{item.product.description}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="px-3 py-1 hover:bg-gray-100 transition-colors"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 border-x">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="px-3 py-1 hover:bg-gray-100 transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-red-500 hover:text-red-600 transition-colors"
                        title="הסר מהסל"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <button 
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        title="הוסף למועדפים"
                      >
                        <Heart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="text-xl font-bold">
                  ₪{(item.product.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-dynamic p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-6">סיכום הזמנה</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>סה"כ מוצרים</span>
                <span>₪{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>משלוח</span>
                <span className="text-green-500">חינם</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-xl font-bold">
                  <span>סה"כ לתשלום</span>
                  <span>₪{total.toLocaleString()}</span>
                </div>
              </div>
              <Link
                to="/checkout"
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
              >
                המשך לתשלום
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <Link
                to="/catalog"
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-center"
              >
                המשך בקניות
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}