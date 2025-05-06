import React, { useState, useEffect } from 'react';
import { getProducts } from '../lib/api';
import { Link } from 'react-router-dom';
import { ArrowLeft, Star, ShoppingCart, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';
import BrandsSlider from '../components/BrandsSlider';
import ProductFeatures from '../components/ProductFeatures';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stock: number;
  categories?: {
    name: string;
    parent?: {
      name: string;
    } | null;
  } | null;
  average_rating?: number;
  review_count?: number;
}

export default function Home() {
  const { addToCart } = useCart();
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBestSellers();
  }, []);

  const fetchBestSellers = async () => {
    try {
      const products = await getProducts();
      
      // Filter and sort products based on ratings
      const bestSellers = products
        .filter(product => product.average_rating >= 4.5)
        .sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0))
        .slice(0, 8);

      setBestSellers(bestSellers);
    } catch (error) {
      console.error('Error fetching best sellers:', error);
      setBestSellers([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    {
      title: 'ציוד חילוץ מקצועי',
      image: 'https://images.unsplash.com/photo-1621252179027-94459d278660?auto=format&fit=crop&q=80',
      link: '/catalog?category=recovery',
      overlayColor: 'from-red-500/80',
      description: 'מגוון רחב של ציוד חילוץ איכותי לרכבי שטח'
    },
    {
      title: 'צמיגי שטח',
      image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80',
      link: '/catalog?category=tires',
      overlayColor: 'from-blue-500/80',
      description: 'צמיגים מקצועיים לכל סוגי השטח'
    },
    {
      title: 'תאורה מקצועית',
      image: 'https://images.unsplash.com/photo-1591543620767-582b2469cf5f?auto=format&fit=crop&q=80',
      link: '/catalog?category=lights',
      overlayColor: 'from-yellow-500/80',
      description: 'פתרונות תאורה מתקדמים לרכב'
    },
    {
      title: 'אבזור חיצוני',
      image: 'https://images.unsplash.com/photo-1669215420018-098507d14861?auto=format&fit=crop&q=80',
      link: '/catalog?category=exterior',
      overlayColor: 'from-green-500/80',
      description: 'אביזרי חוץ ומיגון לרכב'
    }
  ];

  const promotions = [
    {
      title: 'משלוח חינם',
      description: 'בהזמנה מעל ₪500',
      image: 'https://images.unsplash.com/photo-1621252179027-94459d278660?auto=format&fit=crop&q=80'
    },
    {
      title: 'מבצעי החודש',
      description: 'הנחות של עד 50%',
      image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80'
    },
    {
      title: 'אחריות יצרן',
      description: 'על כל המוצרים',
      image: 'https://images.unsplash.com/photo-1591543620767-582b2469cf5f?auto=format&fit=crop&q=80'
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <div className="relative h-[80vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80"
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent">
            <div className="container mx-auto px-4 h-full flex items-center">
              <div className="max-w-2xl">
                <h1 className="text-7xl font-bold mb-6 text-white animate-fade-in-up">
                  הציוד המקצועי
                  <br />
                  <span className="text-red-500">לרכב שלך</span>
                </h1>
                <p className="text-2xl text-white/90 mb-8 animate-fade-in-up animation-delay-200">
                  מגוון ענק של ציוד ואביזרים מקצועיים
                  <br />
                  לרכבי שטח וכביש
                </p>
                <div className="flex gap-4 animate-fade-in-up animation-delay-400">
                  <Link
                    to="/catalog"
                    className="bg-red-500 text-white px-8 py-4 rounded-lg text-xl hover:bg-red-600 transition-all duration-300 flex items-center gap-2 hover:gap-4"
                  >
                    לקטלוג המוצרים
                    <ArrowLeft className="w-6 h-6" />
                  </Link>
                  <a
                    href="#categories"
                    className="bg-white/10 text-white px-8 py-4 rounded-lg text-xl hover:bg-white/20 transition-all duration-300 backdrop-blur-sm"
                  >
                    גלה עוד
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-white" />
        </div>
      </div>

      {/* Promotions Grid */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {promotions.map((promo, index) => (
              <div
                key={index}
                className="relative overflow-hidden rounded-2xl aspect-[4/3] group cursor-pointer"
              >
                <img
                  src={promo.image}
                  alt={promo.title}
                  className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{promo.title}</h3>
                    <p className="text-white/90">{promo.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div id="categories" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">קטגוריות מובילות</h2>
            <p className="text-gray-600 text-lg">מגוון רחב של מוצרים איכותיים בקטגוריות השונות</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={category.link}
                className="group relative overflow-hidden rounded-2xl transform transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2"
              >
                <div className="aspect-[4/3]">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${category.overlayColor} to-transparent opacity-90 group-hover:opacity-100 transition-opacity`} />
                  <div className="absolute inset-0 p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-white drop-shadow-lg mb-2">
                        {category.title}
                      </h3>
                      <p className="text-white/90">{category.description}</p>
                    </div>
                    <div className="flex items-center gap-2 text-white">
                      <span>לצפייה במוצרים</span>
                      <ArrowLeft className="w-5 h-5 transform group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Best Sellers */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-4">הנמכרים ביותר</h2>
              <p className="text-gray-600 text-lg">המוצרים האהובים והפופולריים ביותר</p>
            </div>
            <Link 
              to="/catalog?sort=best-sellers"
              className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors"
            >
              <span>לכל המוצרים הנמכרים</span>
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {bestSellers.map((product) => (
                <div key={product.id} className="bg-white rounded-xl overflow-hidden shadow-dynamic group">
                  <Link to={`/product/${product.id}`} className="block">
                    <div className="relative aspect-square">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4">
                        <div className="bg-primary text-white text-sm px-2 py-1 rounded-full">
                          מומלץ
                        </div>
                      </div>
                    </div>
                  </Link>
                  <div className="p-4">
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < Math.round(product.average_rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                      <span className="text-sm text-gray-600 ml-2">({product.review_count})</span>
                    </div>
                    <Link to={`/product/${product.id}`}>
                      <h3 className="font-bold mb-1 line-clamp-1 hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-1">
                        {product.description}
                      </p>
                    </Link>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold">₪{product.price.toLocaleString()}</span>
                      <button 
                        onClick={() => addToCart({
                          id: product.id,
                          name: product.name,
                          description: product.description,
                          price: product.price,
                          image: product.image_url,
                          category: product.categories?.name || ''
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
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">למה לבחור בנו?</h2>
            <p className="text-gray-600 text-lg">אנחנו מספקים את השירות הטוב ביותר ללקוחותינו</p>
          </div>
          <ProductFeatures />
        </div>
      </div>

      {/* Brands Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">המותגים שלנו</h2>
            <p className="text-gray-600 text-lg">עובדים עם המותגים המובילים בתעשייה</p>
          </div>
          <BrandsSlider />
        </div>
      </div>
    </div>
  );
}