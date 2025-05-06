import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import Breadcrumbs from '../components/Breadcrumbs';
import { getProducts } from '../lib/api';

export default function Catalog() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<
      'price-asc' | 'price-desc' | 'name-asc' | 'name-desc'
  >('price-asc');
  const [currentCategory, setCurrentCategory] = useState<{
    name: string;
    slug: string;
    parent_id?: string | null;
    parent?: { name: string; slug: string; parent_id?: string | null; parent?: { name: string; slug: string } | null } | null;
  } | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // ניקוי פרמטרים מה-URL כך שלא יהיו "undefined"
  const rawCategory = searchParams.get('category');
  const rawType = searchParams.get('type');
  const rawSubtype = searchParams.get('subtype');

  const category = rawCategory && rawCategory !== 'undefined' ? rawCategory : null;
  const type = rawType && rawType !== 'undefined' ? rawType : null;
  const subtype = rawSubtype && rawSubtype !== 'undefined' ? rawSubtype : null;


  useEffect(() => {
    fetchProducts();
    // נכלול את המשתנים הנקיים (לא raw) כתלות ב-useEffect
  }, [category, type, subtype]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data || []);

      // עדכון currentCategory בהתאם לפרמטרים, כאשר נבדוק גם product.categories וגם product.categories.parent
      if (subtype || type || category) {
        const filteredCategoryProducts = data.filter(product => {
          if (subtype) {
            // אם subtype קיים – נבדוק האם slug של הקטגוריה תואם
            return product.categories?.slug === subtype;
          } else if (type) {
            // אם type קיים – נבדוק אם ה-slug נמצא בקטגוריה עצמה או ב-parent
            return product.categories?.slug === type || product.categories?.parent?.slug === type;
          } else if (category) {
            // אם category קיים – נבדוק מספר רמות
            return (
                product.categories?.slug === category ||
                product.categories?.parent?.slug === category ||
                product.categories?.parent?.parent?.slug === category
            );
          }
          return false;
        });


        if (filteredCategoryProducts.length > 0) {
          // נעדכן את currentCategory בהתאם למוצר הראשון שהתאים
          setCurrentCategory(filteredCategoryProducts[0].categories || null);
        } else {
          setCurrentCategory(null);
        }
      } else {
        setCurrentCategory(null);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setCurrentCategory(null);
    } finally {
      setLoading(false);
    }
  };

  // סינון מוצרים להצגה – גם כאן נעדכן את התנאים כך שיתאימו ללוגיקה החדשה
  const filteredProducts = products
      .filter((product) => {
        let matchesCategory = true;
        if (subtype) {
          matchesCategory = product.categories?.slug === subtype;
        } else if (type) {
          matchesCategory = product.categories?.slug === type || product.categories?.parent?.slug === type;
        } else if (category) {
          matchesCategory =
              product.categories?.slug === category ||
              product.categories?.parent?.slug === category ||
              product.categories?.parent?.parent?.slug === category;
        }
        const matchesSearch =
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        switch (sortOption) {
          case 'price-asc':
            return a.price - b.price;
          case 'price-desc':
            return b.price - a.price;
          case 'name-asc':
            return a.name.localeCompare(b.name);
          case 'name-desc':
            return b.name.localeCompare(a.name);
          default:
            return 0;
        }
      });

  // בניית פירורי לחם – נוודא שלא נוסיף פרמטרים ללא ערך
  const breadcrumbItems = [{ label: 'קטלוג', href: '/catalog' }];

  if (currentCategory) {
    const parent = currentCategory.parent;
    const grandparent = parent?.parent;

    if (grandparent && grandparent.slug) {
      breadcrumbItems.push({
        label: grandparent.name,
        href: `/catalog?category=${grandparent.slug}`,
      });
      if (parent && parent.slug) {
        breadcrumbItems.push({
          label: parent.name,
          href: `/catalog?category=${grandparent.slug}&type=${parent.slug}`,
        });
      }
      breadcrumbItems.push({
        label: currentCategory.name,
        href: `/catalog?category=${grandparent.slug}${
            parent && parent.slug ? `&type=${parent.slug}` : ''
        }&subtype=${currentCategory.slug}`,
      });
    } else if (parent && parent.slug) {
      breadcrumbItems.push({
        label: parent.name,
        href: `/catalog?category=${parent.slug}`,
      });
      breadcrumbItems.push({
        label: currentCategory.name,
        href: `/catalog?category=${parent.slug}&type=${currentCategory.slug}`,
      });
    } else {
      breadcrumbItems.push({
        label: currentCategory.name,
        href: `/catalog?category=${currentCategory.slug}`,
      });
    }
  }




  if (loading) {
    return (
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <LoadingSpinner />
        </div>
    );
  }

  return (
      <>
        {/* Header עם פירורי לחם בסגנון תפריט עליון */}
        <header className="bg-white shadow">
          <div className="container mx-auto px-4 py-4">
            <Breadcrumbs items={breadcrumbItems} />
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">
              {currentCategory ? (
                  <div className="flex flex-wrap items-center gap-2">
                    {currentCategory.parent?.parent && (
                        <>
                          <span>{currentCategory.parent.parent.name}</span>
                          <span className="text-gray-400 mx-2">›</span>
                        </>
                    )}
                    {currentCategory.parent && (
                        <>
                          <span>{currentCategory.parent.name}</span>
                          <span className="text-gray-400 mx-2">›</span>
                        </>
                    )}
                    <span className="text-primary">{currentCategory.name}</span>
                  </div>
              ) : (
                  'קטלוג מוצרים'
              )}
            </h1>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="חיפוש מוצרים..."
                      className="w-full py-2 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                </div>
              </div>
              <div className="flex gap-4">
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
                >
                  <Filter className="w-5 h-5" />
                  <span>סינון</span>
                </button>
                <select
                    value={sortOption}
                    onChange={(e) =>
                        setSortOption(e.target.value as typeof sortOption)
                    }
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <option value="price-asc">מחיר: מהנמוך לגבוה</option>
                  <option value="price-desc">מחיר: מהגבוה לנמוך</option>
                  <option value="name-asc">שם: א-ת</option>
                  <option value="name-desc">שם: ת-א</option>
                </select>
              </div>
            </div>

            {showFilters && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h3 className="font-medium mb-2 flex items-center">
                        <span>טווח מחירים</span>
                        <ChevronDown className="w-4 h-4 mr-1" />
                      </h3>
                      <div className="flex items-center gap-2">
                        <input
                            type="number"
                            placeholder="מינימום"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                        <span>-</span>
                        <input
                            type="number"
                            placeholder="מקסימום"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2 flex items-center">
                        <span>מותגים</span>
                        <ChevronDown className="w-4 h-4 mr-1" />
                      </h3>
                      <div className="space-y-1">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="rounded text-primary" />
                          <span>ARB</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="rounded text-primary" />
                          <span>Warn</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="rounded text-primary" />
                          <span>BF Goodrich</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2 flex items-center">
                        <span>זמינות</span>
                        <ChevronDown className="w-4 h-4 mr-1" />
                      </h3>
                      <div className="space-y-1">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="rounded text-primary" />
                          <span>במלאי</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="rounded text-primary" />
                          <span>מבצע</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="rounded text-primary" />
                          <span>חדש</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors">
                      החל סינון
                    </button>
                  </div>
                </div>
            )}
          </div>

          {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">לא נמצאו מוצרים התואמים את החיפוש</p>
              </div>
          ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
              </div>
          )}
        </main>
      </>
  );
}
