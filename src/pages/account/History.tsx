import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ChevronLeft, ShoppingCart } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useNotification } from '../../context/NotificationContext';

interface ViewedProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  viewed_at: string;
}

export default function History() {
  const [recentlyViewed, setRecentlyViewed] = useState<ViewedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { showNotification } = useNotification();

  useEffect(() => {
    if (user) {
      fetchViewHistory();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchViewHistory = async () => {
    try {
      setLoading(true);
      const { data: viewData, error } = await supabase
        .from('product_views')
        .select(`
          product_id,
          viewed_at,
          product:products (
            id,
            name,
            description,
            price,
            image_url
          )
        `)
        .eq('user_id', user?.id)
        .order('viewed_at', { ascending: false })
        .limit(12);

      if (error) throw error;

      const processedData = viewData
        ?.filter(item => item.product) // Filter out any null products
        .map(item => ({
          ...item.product,
          viewed_at: item.viewed_at
        }));

      setRecentlyViewed(processedData || []);
    } catch (error) {
      console.error('Error fetching view history:', error);
      showNotification('error', 'שגיאה בטעינת היסטוריית הצפייה');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8 text-gray-400" />
        </div>
        <h2 className="text-xl font-semibold mb-2">יש להתחבר כדי לצפות בהיסטוריה</h2>
        <Link
          to="/auth/login"
          className="text-primary hover:text-primary-dark transition-colors"
        >
          התחבר כאן
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/account" className="text-gray-500 hover:text-primary transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-bold">היסטוריית צפייה</h1>
      </div>

      {recentlyViewed.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold mb-2">אין היסטוריית צפייה</h2>
          <p className="text-gray-500 mb-4">עדיין לא צפית במוצרים באתר</p>
          <Link
            to="/catalog"
            className="text-primary hover:text-primary-dark transition-colors"
          >
            התחל בקניות
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentlyViewed.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-dynamic overflow-hidden">
              <Link to={`/product/${product.id}`}>
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              </Link>
              <div className="p-4">
                <Link 
                  to={`/product/${product.id}`}
                  className="block font-semibold mb-2 hover:text-primary transition-colors"
                >
                  {product.name}
                </Link>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">₪{product.price.toLocaleString()}</span>
                  <button
                    onClick={() => {
                      addToCart({
                        id: product.id,
                        name: product.name,
                        description: product.description,
                        price: product.price,
                        image: product.image_url,
                        category: ''
                      });
                      showNotification('success', 'המוצר נוסף לסל');
                    }}
                    className="bg-primary text-white p-2 rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  נצפה לאחרונה: {new Date(product.viewed_at).toLocaleDateString('he-IL')}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}