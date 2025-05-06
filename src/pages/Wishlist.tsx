import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { supabase } from '../lib/supabase';
import LoadingSpinner from '../components/LoadingSpinner';
import { Product } from '../types';

export default function Wishlist() {
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { items: wishlistIds, removeFromWishlist } = useWishlist();

  useEffect(() => {
    fetchWishlistProducts();
  }, [wishlistIds]);

  const fetchWishlistProducts = async () => {
    if (wishlistIds.length === 0) {
      setWishlistProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories:category_id (
            name,
            parent:categories!parent_id (
              name
            )
          )
        `)
        .in('id', wishlistIds);

      if (error) throw error;
      setWishlistProducts(data || []);
    } catch (error) {
      console.error('Error fetching wishlist products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">המוצרים המועדפים שלי</h1>

      {wishlistProducts.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold mb-2">אין מוצרים ברשימת המועדפים</h2>
          <p className="text-gray-500 mb-4">הוסף מוצרים לרשימה מדף הקטלוג</p>
          <Link
            to="/catalog"
            className="button-3d bg-primary text-white px-6 py-2 rounded-lg inline-flex items-center"
          >
            לקטלוג המוצרים
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistProducts.map(product => (
            <div key={product.id} className="card-3d bg-white rounded-lg shadow-dynamic overflow-hidden">
              <div className="relative">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-5 h-5 text-red-500" />
                </button>
              </div>
              <div className="p-4">
                <Link 
                  to={`/product/${product.id}`}
                  className="block font-semibold mb-2 hover:text-primary transition-colors"
                >
                  {product.name}
                </Link>
                <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold">₪{product.price.toLocaleString()}</span>
                  <button
                    onClick={() => addToCart(product)}
                    className="button-3d bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-dark transition-all duration-300"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    הוסף לסל
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}