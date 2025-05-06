import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Scale, Tag, Star } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCompare } from '../context/CompareContext';
import { useNotification } from '../context/NotificationContext';
import Badge from './Badge';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { isInCompare, addToCompare } = useCompare();
  const { showNotification } = useNotification();
  const isWishlisted = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);

  // בדיקה אם המוצר במבצע
  const isOnSale = product.sale_price && product.sale_price < product.price;
  const discountPercentage = isOnSale
    ? Math.round(((product.price - product.sale_price!) / product.price) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      description: product.description,
      price: isOnSale ? product.sale_price! : product.price,
      image: product.image_url,
      category: product.categories?.name || ''
    });
    showNotification('success', 'המוצר נוסף לסל');
  };

  const handleToggleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
      showNotification('success', 'המוצר הוסר מהמועדפים');
    } else {
      addToWishlist(product.id);
      showNotification('success', 'המוצר נוסף למועדפים');
    }
  };

  const handleAddToCompare = () => {
    addToCompare(product.id);
  };

  return (
    <div className="card-3d bg-white rounded-lg shadow-dynamic overflow-hidden">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative">
          <img 
            src={product.image_url} 
            alt={product.name} 
            className="w-full h-48 object-cover transform transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-2 right-2 flex flex-col gap-2">
            {product.is_new && (
              <Badge variant="primary">חדש</Badge>
            )}
            {isOnSale && (
              <Badge variant="error">-{discountPercentage}%</Badge>
            )}
            {product.stock <= 5 && product.stock > 0 && (
              <Badge variant="warning">מלאי אחרון</Badge>
            )}
            {product.stock === 0 && (
              <Badge variant="error">אזל המלאי</Badge>
            )}
          </div>
          <div className="absolute top-2 left-2 flex flex-col gap-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                handleToggleWishlist();
              }}
              className={`btn-icon ${
                isWishlisted ? 'bg-red-500 text-white' : 'bg-white text-gray-600'
              }`}
              title={isWishlisted ? 'הסר ממועדפים' : 'הוסף למועדפים'}
            >
              <Heart className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleAddToCompare();
              }}
              className={`btn-icon ${
                isCompared ? 'bg-primary text-white' : 'bg-white text-gray-600'
              }`}
              title={isCompared ? 'נוסף להשוואה' : 'הוסף להשוואה'}
            >
              <Scale className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.round(product.average_rating || 0)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
            <span className="text-sm text-gray-600 ml-2">
              ({product.review_count || 0})
            </span>
          </div>
          <h3 className="font-bold mb-1 line-clamp-1 hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
          {product.categories?.parent && (
            <div className="flex items-center gap-2 mb-4">
              <Tag className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-500">
                {product.categories.parent.name} / {product.categories.name}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              {isOnSale ? (
                <>
                  <span className="text-xl font-bold text-red-500">
                    ₪{product.sale_price!.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    ₪{product.price.toLocaleString()}
                  </span>
                </>
              ) : (
                <span className="text-xl font-bold text-secondary">
                  ₪{product.price.toLocaleString()}
                </span>
              )}
            </div>
            <button 
              onClick={(e) => {
                e.preventDefault();
                handleAddToCart();
              }}
              disabled={product.stock === 0}
              className={`btn-primary hover-lift hover-glow ${
                product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              <span>{product.stock === 0 ? 'אזל המלאי' : 'הוסף לסל'}</span>
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}