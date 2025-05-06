import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import LoadingSpinner from './LoadingSpinner';

interface RelatedProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category_id: string;
}

interface RelatedProductsProps {
  currentProductId: string;
  categoryId: string;
}

export default function RelatedProducts({ currentProductId, categoryId }: RelatedProductsProps) {
  const [products, setProducts] = useState<RelatedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('category_id', categoryId)
          .neq('id', currentProductId)
          .limit(4);

        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching related products:', error);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchRelatedProducts();
    }
  }, [categoryId, currentProductId]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-8">מוצרים דומים</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-lg shadow-dynamic overflow-hidden group">
            <Link to={`/product/${product.id}`} className="block">
              <div className="relative aspect-square">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </Link>
            <div className="p-4">
              <Link to={`/product/${product.id}`}>
                <h3 className="font-bold mb-1 line-clamp-1 hover:text-primary transition-colors">
                  {product.name}
                </h3>
              </Link>
              <div className="flex items-center justify-between mt-2">
                <span className="text-lg font-bold">₪{product.price.toLocaleString()}</span>
                <button 
                  onClick={() => addToCart({
                    id: product.id,
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    image: product.image_url,
                    category: ''
                  })}
                  className="bg-primary text-white p-2 rounded-lg hover:bg-primary-dark transition-colors"
                >
                  <ShoppingCart className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}