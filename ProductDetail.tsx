import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct } from '../lib/api';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { ArrowRight, ShoppingCart, Heart, Share2, Star, ChevronDown, ChevronUp, Info, Shield, Truck, Package, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';
import { useWishlist } from '../context/WishlistContext';
import ProductFeatures from '../components/ProductFeatures';
import ProductReviews from '../components/ProductReviews';
import RelatedProducts from '../components/RelatedProducts';
import Breadcrumbs from '../components/Breadcrumbs';
import Badge from '../components/Badge';
import LoadingSpinner from '../components/LoadingSpinner';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

interface ProductImage {
  id: string;
  image_url: string;
  sort_order: number;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  images: ProductImage[];
  stock: number;
  category_id: string;
  has_sizes?: boolean;
  has_colors?: boolean;
  available_sizes?: string[];
  available_colors?: { name: string; label: string; hex: string }[];
  detailed_description?: string;
  technical_specs?: Array<{label: string, value: string}>;
  shipping_info?: string;
  categories: {
    id: string;
    name: string;
    slug: string;
    parent_id: string | null;
    parent?: {
      id: string;
      name: string;
      slug: string;
      parent?: {
        id: string;
        name: string;
        slug: string;
      };
    };
  };
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { showNotification } = useNotification();
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [isWishlist, setIsWishlist] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'shipping'>('description');
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productImages, setProductImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error } = await getProduct(id!);
        
        if (error) {
          setError(error.message);
          return;
        }
        
        if (!data) {
          setError('המוצר לא נמצא');
          return;
        }

        setProduct(data);
        setProductImages(data.images?.map(img => img.image_url) || [data.image_url] || []);
        
        // Set default selected size and color if available
        if (data.has_sizes && data.available_sizes?.length > 0) {
          setSelectedSize(data.available_sizes[0]);
        }
        
        if (data.has_colors && data.available_colors?.length > 0) {
          setSelectedColor(data.available_colors[0].name);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('שגיאה בטעינת המוצר');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  useEffect(() => {
    if (product && isInWishlist) {
      setIsWishlist(isInWishlist(product.id));
    }
  }, [product, isInWishlist]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">{error || 'המוצר לא נמצא'}</h1>
        <button
          onClick={() => navigate('/catalog')}
          className="text-primary hover:text-primary-dark flex items-center justify-center gap-2"
        >
          <ArrowRight className="w-5 h-5" />
          חזרה לקטלוג
        </button>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: 'ראשי', href: '/' },
    { label: 'קטלוג', href: '/catalog' }
  ];

  if (product.categories?.parent?.parent) {
    breadcrumbItems.push({
      label: product.categories.parent.parent.name,
      href: `/catalog?category=${product.categories.parent.parent.slug}`
    });
    
    breadcrumbItems.push({
      label: product.categories.parent.name,
      href: `/catalog?category=${product.categories.parent.parent.slug}&type=${product.categories.parent.slug}`
    });
    
    breadcrumbItems.push({
      label: product.categories.name,
      href: `/catalog?category=${product.categories.parent.parent.slug}&type=${product.categories.parent.slug}&subtype=${product.categories.slug}`
    });
  } else if (product.categories?.parent) {
    breadcrumbItems.push({
      label: product.categories.parent.name,
      href: `/catalog?category=${product.categories.parent.slug}`
    });
    
    breadcrumbItems.push({
      label: product.categories.name,
      href: `/catalog?category=${product.categories.parent.slug}&type=${product.categories.slug}`
    });
  } else if (product.categories) {
    breadcrumbItems.push({
      label: product.categories.name,
      href: `/catalog?category=${product.categories.slug}`
    });
  }

  breadcrumbItems.push({ label: product.name, href: `/product/${product.id}` });

  // Ensure we have at least one image
  if (productImages.length === 0) {
    productImages.push('https://via.placeholder.com/800x800?text=No+Image');
  }

  // Default sizes and colors if not provided by the product
  const defaultSizes = ['S', 'M', 'L', 'XL', 'XXL'];
  const defaultColors = [
    { name: 'black', label: 'שחור', hex: '#000000' },
    { name: 'red', label: 'אדום', hex: '#FF0000' },
    { name: 'white', label: 'לבן', hex: '#FFFFFF' }
  ];

  // Use product-specific sizes/colors if available, otherwise use defaults
  const sizes = product.has_sizes ? (product.available_sizes || defaultSizes) : [];
  const colors = product.has_colors ? (product.available_colors || defaultColors) : [];

  const handleAddToCart = () => {
    // Validate that size is selected if product has sizes
    if (product.has_sizes && !selectedSize) {
      showNotification('error', 'אנא בחר מידה');
      return;
    }

    // Validate that color is selected if product has colors
    if (product.has_colors && !selectedColor) {
      showNotification('error', 'אנא בחר צבע');
      return;
    }

    // Create product object with selected options
    const productToAdd = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      image: productImages[0], // Use the first image as the main image
      image_url: productImages[0],
      category: product.categories?.name || '',
      size: selectedSize,
      color: selectedColor,
      quantity: selectedQuantity
    };

    addToCart(productToAdd);
    showNotification('success', 'המוצר נוסף לסל הקניות');
  };

  const handleToggleWishlist = () => {
    if (isWishlist) {
      removeFromWishlist(product.id);
      setIsWishlist(false);
    } else {
      addToWishlist(product.id);
      setIsWishlist(true);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <Swiper
            spaceBetween={10}
            navigation={true}
            thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
            modules={[FreeMode, Navigation, Thumbs]}
            className="aspect-square rounded-lg overflow-hidden"
          >
            {productImages.map((image, index) => (
              <SwiperSlide key={index}>
                <img
                  src={image}
                  alt={`${product.name} - תמונה ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>
          
          <Swiper
            onSwiper={setThumbsSwiper}
            spaceBetween={10}
            slidesPerView={4}
            freeMode={true}
            watchSlidesProgress={true}
            modules={[FreeMode, Navigation, Thumbs]}
            className="h-24"
          >
            {productImages.map((image, index) => (
              <SwiperSlide key={index} className="opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
                <img
                  src={image}
                  alt={`${product.name} - תמונה קטנה ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Product Info */}
        <div>
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                  <span className="text-sm text-gray-500 mr-2">(24 ביקורות)</span>
                </div>
                <Badge variant="success">במלאי</Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleToggleWishlist}
                className={`p-2 rounded-full ${
                  isWishlist ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600'
                } hover:scale-110 transition-all duration-300`}
              >
                <Heart className="w-5 h-5" />
              </button>
              <button 
                className="p-2 rounded-full bg-gray-100 text-gray-600 hover:scale-110 transition-all duration-300"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="mb-8">
            <div className="text-3xl font-bold mb-4">₪{product.price.toLocaleString()}</div>
            <p className="text-gray-600">{product.description}</p>
          </div>

          {/* Size Selection - Only show if product has sizes */}
          {product.has_sizes && sizes.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                מידה
              </label>
              <div className="flex gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-lg border-2 font-medium transition-all ${
                      selectedSize === size
                        ? 'border-primary bg-primary text-white'
                        : 'border-gray-200 hover:border-primary'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selection - Only show if product has colors */}
          {product.has_colors && colors.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                צבע
              </label>
              <div className="flex gap-3">
                {colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`relative w-12 h-12 rounded-full transition-all ${
                      selectedColor === color.name ? 'ring-2 ring-primary ring-offset-2' : ''
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.label}
                  >
                    {selectedColor === color.name && (
                      <Check className={`w-6 h-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
                        color.name === 'white' ? 'text-black' : 'text-white'
                      }`} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selection */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              כמות
            </label>
            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
                  className="px-4 py-2 hover:bg-gray-100 transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-2 border-x min-w-[3rem] text-center">
                  {selectedQuantity}
                </span>
                <button
                  onClick={() => setSelectedQuantity(selectedQuantity + 1)}
                  className="px-4 py-2 hover:bg-gray-100 transition-colors"
                >
                  +
                </button>
              </div>
              {selectedQuantity >= 3 && (
                <span className="text-sm text-primary">
                  <Check className="w-4 h-4 inline-block ml-1" />
                  זכאי למשלוח חינם!
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-primary text-white py-4 rounded-lg font-semibold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 mb-4"
            disabled={product.stock <= 0}
          >
            <ShoppingCart className="w-5 h-5" />
            {product.stock > 0 ? 'הוסף לסל' : 'אזל המלאי'}
          </button>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50">
              <Shield className="w-6 h-6 text-primary" />
              <div>
                <h3 className="font-medium">אחריות יצרן</h3>
                <p className="text-sm text-gray-500">שנה אחריות מלאה</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50">
              <Truck className="w-6 h-6 text-primary" />
              <div>
                <h3 className="font-medium">משלוח חינם</h3>
                <p className="text-sm text-gray-500">בהזמנה מעל ₪500</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-t pt-8">
            <div className="flex border-b overflow-x-auto">
              <button
                className={`px-6 py-2 font-medium whitespace-nowrap ${
                  activeTab === 'description' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'
                }`}
                onClick={() => setActiveTab('description')}
              >
                תיאור מוצר
              </button>
              <button
                className={`px-6 py-2 font-medium whitespace-nowrap ${
                  activeTab === 'specs' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'
                }`}
                onClick={() => setActiveTab('specs')}
              >
                מפרט טכני
              </button>
              <button
                className={`px-6 py-2 font-medium whitespace-nowrap ${
                  activeTab === 'shipping' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'
                }`}
                onClick={() => setActiveTab('shipping')}
              >
                משלוח והחזרות
              </button>
            </div>

            <div className="py-6">
              {activeTab === 'description' && (
                <div className="prose max-w-none">
                  {product.detailed_description ? (
                    <div dangerouslySetInnerHTML={{ __html: product.detailed_description }} />
                  ) : (
                    <p>{product.description}</p>
                  )}
                </div>
              )}

              {activeTab === 'specs' && (
                <div className="grid grid-cols-2 gap-4">
                  {product.technical_specs && product.technical_specs.length > 0 ? (
                    product.technical_specs.map((spec, index) => (
                      <div key={index} className="border-b pb-2">
                        <span className="font-medium">{spec.label}: </span>
                        <span className="text-gray-600">{spec.value}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 col-span-2">אין מפרט טכני זמין</p>
                  )}
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className="space-y-4">
                  {product.shipping_info ? (
                    <div dangerouslySetInnerHTML={{ __html: product.shipping_info }} />
                  ) : (
                    <>
                      <div>
                        <h3 className="font-medium mb-2">מדיניות משלוחים</h3>
                        <p className="text-gray-600">
                          משלוח חינם בהזמנה מעל ₪500. זמן אספקה 1-3 ימי עסקים.
                        </p>
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">מדיניות החזרות</h3>
                        <p className="text-gray-600">
                          ניתן להחזיר את המוצר תוך 14 יום מקבלתו. המוצר חייב להיות באריזתו המקורית ובמצב חדש.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <ProductReviews productId={product.id} />

      {/* Related Products */}
      <RelatedProducts 
        currentProductId={product.id} 
        categoryId={product.category_id} 
      />
    </div>
  );
}