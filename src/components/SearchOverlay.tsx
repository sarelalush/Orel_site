import React, { useState, useEffect } from 'react';
import { Search, X, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import LoadingSpinner from './LoadingSpinner';

interface SearchProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  categories: {
    name: string;
    parent: {
      name: string;
    } | null;
  };
}

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const searchProducts = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            id,
            name,
            description,
            price,
            image_url,
            categories:category_id (
              name,
              parent:categories!parent_id (
                name
              )
            )
          `)
          .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
          .limit(10);

        if (error) throw error;
        setResults(data || []);

        // Save to recent searches
        if (query.length > 2) {
          const newSearches = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
          setRecentSearches(newSearches);
          localStorage.setItem('recentSearches', JSON.stringify(newSearches));
        }
      } catch (error) {
        console.error('Error searching products:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl mx-auto">
          <div className="p-4 border-b">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="חפש מוצרים..."
                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
                autoFocus
              />
              <Search className="absolute left-3 top-3.5 text-gray-400 w-6 h-6" />
            </div>
          </div>
          
          <div className="max-h-[70vh] overflow-y-auto p-4">
            {loading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : query ? (
              results.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">לא נמצאו תוצאות עבור "{query}"</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.map(product => (
                    <Link
                      key={product.id}
                      to={`/product/${product.id}`}
                      onClick={onClose}
                      className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{product.name}</h3>
                        <div className="text-sm text-gray-500 mb-1">
                          {product.categories?.parent?.name} / {product.categories?.name}
                        </div>
                        <p className="text-sm text-gray-500 line-clamp-1 mb-2">
                          {product.description}
                        </p>
                        <span className="text-primary font-bold">
                          ₪{product.price.toLocaleString()}
                        </span>
                      </div>
                      <ArrowLeft className="w-5 h-5 text-gray-400" />
                    </Link>
                  ))}
                </div>
              )
            ) : recentSearches.length > 0 ? (
              <div>
                <h3 className="text-lg font-semibold mb-4">חיפושים אחרונים</h3>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => setQuery(search)}
                      className="px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <button
          onClick={onClose}
          className="fixed top-4 right-4 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}