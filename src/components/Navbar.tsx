import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Car,
  Bike,
  Wrench,
  Droplet,
  Tent,
  PenTool as Tool,
  ChevronDown,
  LayoutDashboard,
  Package,
  Users,
  Settings,
  LogOut,
  Home,
  FolderPlus,
  MoreHorizontal,
  Hammer,
  Cog,
  Layers,
  RefreshCw,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import SearchOverlay from './SearchOverlay';
import CartDrawer from './CartDrawer';
import CompareDrawer from './CompareDrawer';
import { supabase } from '../lib/supabase';
import { useNotification } from '../context/NotificationContext';

interface MenuItem {
  icon: React.ReactNode;
  categories: {
    title: string;
    id: string;
    items: {
      name: string;
      link: string;
      id: string;
    }[];
  }[];
}

interface MenuItems {
  [key: string]: MenuItem;
}

// Define the fixed categories we want to display
const FIXED_CATEGORIES = [
  'ציוד שטח',
  'חלקי חילוף',
  'כלי עבודה',
  'ספורט ימי',
  'צמיגים',
  'שמנים',
  'חלקי פנים',
  'חלקי חוץ'
];

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [dynamicMenuItems, setDynamicMenuItems] = useState<MenuItems>({});
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { itemCount } = useCart();
  const { user, isAdmin } = useAuth();
  const { showNotification } = useNotification();
  const location = useLocation();
  const navigate = useNavigate();

  // Maximum number of menu items to show before using "More" dropdown
  const MAX_VISIBLE_ITEMS = 8;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      // Create default menu items for the fixed categories
      const defaultMenuItems: MenuItems = {};
      
      // Initialize with empty categories for each fixed category
      FIXED_CATEGORIES.forEach(catName => {
        defaultMenuItems[catName] = {
          icon: getIconForCategory(catName),
          categories: []
        };
      });
      
      // Fetch all categories with their full hierarchy
      const { data, error } = await supabase
        .from('categories')
        .select(`
          id,
          name,
          slug,
          parent_id,
          parent:parent_id (
            id,
            name,
            slug,
            parent_id,
            parent:parent_id (
              id,
              name,
              slug
            )
          )
        `)
        .order('name');
      
      if (error) throw error;
      
      // Skip if no data
      if (!data || data.length === 0) {
        setDynamicMenuItems(defaultMenuItems);
        return;
      }
      
      // Organize categories by level
      const mainCategories = data.filter(c => !c.parent_id);
      const subCategories = data.filter(c => c.parent_id && !c.parent?.parent_id);
      const productCategories = data.filter(c => c.parent_id && c.parent?.parent_id);
      
      // Create dynamic menu items
      const newMenuItems: MenuItems = {...defaultMenuItems};
      
      // Process main categories
      mainCategories.forEach(mainCat => {
        // Find the matching fixed category
        const matchingFixedCategory = FIXED_CATEGORIES.find(fixedCat => 
          mainCat.name.includes(fixedCat) || fixedCat.includes(mainCat.name)
        );
        
        if (!matchingFixedCategory) return;
        
        // Find subcategories for this main category
        const relatedSubCats = subCategories.filter(sc => sc.parent_id === mainCat.id);
        
        // Create menu entry
        if (!newMenuItems[matchingFixedCategory]) {
          newMenuItems[matchingFixedCategory] = {
            icon: getIconForCategory(matchingFixedCategory),
            categories: []
          };
        }
        
        // Add subcategories
        relatedSubCats.forEach(subCat => {
          // Find product categories for this subcategory
          const relatedProductCats = productCategories.filter(pc => pc.parent_id === subCat.id);
          
          // Add to menu structure
          newMenuItems[matchingFixedCategory].categories.push({
            title: subCat.name,
            id: subCat.id,
            items: relatedProductCats.map(pc => ({
              name: pc.name,
              id: pc.id,
              link: `/catalog?category=${mainCat.slug}&type=${subCat.slug}&subtype=${pc.slug}`
            }))
          });
        });
      });
      
      // Ensure all fixed categories exist in the menu
      FIXED_CATEGORIES.forEach(catName => {
        if (!newMenuItems[catName]) {
          newMenuItems[catName] = {
            icon: getIconForCategory(catName),
            categories: []
          };
        }
      });
      
      setDynamicMenuItems(newMenuItems);
    } catch (error) {
      console.error('Error fetching categories for menu:', error);
    }
  };

  const refreshCategories = async () => {
    setIsRefreshing(true);
    try {
      await fetchCategories();
      showNotification('success', 'הקטגוריות עודכנו בהצלחה');
    } catch (error) {
      console.error('Error refreshing categories:', error);
      showNotification('error', 'שגיאה בעדכון הקטגוריות');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Helper function to get an icon for a category
  const getIconForCategory = (categoryName: string) => {
    // Default icons based on category name
    if (categoryName.includes('שטח')) return <Car className="w-5 h-5" />;
    if (categoryName.includes('חילוף')) return <Cog className="w-5 h-5" />;
    if (categoryName.includes('עבודה')) return <Hammer className="w-5 h-5" />;
    if (categoryName.includes('ימי')) return <Droplet className="w-5 h-5" />;
    if (categoryName.includes('צמיגים')) return <Car className="w-5 h-5" />;
    if (categoryName.includes('שמנים')) return <Wrench className="w-5 h-5" />;
    if (categoryName.includes('פנים')) return <Layers className="w-5 h-5" />;
    if (categoryName.includes('חוץ')) return <Car className="w-5 h-5" />;
    
    // Default icon
    return <Tool className="w-5 h-5" />;
  };

  // Close mobile menu and active menu when location changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveMenu(null);
    setIsMoreMenuOpen(false);
  }, [location.pathname, location.search]);

  // Check if we're in a specific category
  const isCatalogPage = location.pathname.includes('/catalog');
  const searchParams = new URLSearchParams(location.search);
  const currentCategory = searchParams.get('category');
  const currentType = searchParams.get('type');
  const currentSubtype = searchParams.get('subtype');

  // Find active main category and subcategory based on URL params
  const findActiveCategory = () => {
    if (!isCatalogPage) return null;
    if (!currentCategory && !currentType && !currentSubtype) return null;
    
    for (const [mainCatName, mainCatData] of Object.entries(dynamicMenuItems)) {
      for (const subCat of mainCatData.categories) {
        for (const item of subCat.items) {
          const itemParams = new URLSearchParams(item.link.split('?')[1]);
          const itemCategory = itemParams.get('category');
          const itemType = itemParams.get('type');
          const itemSubtype = itemParams.get('subtype');
          
          if (
            (currentCategory && itemCategory === currentCategory && currentType && itemType === currentType && currentSubtype && itemSubtype === currentSubtype) ||
            (currentCategory && itemCategory === currentCategory && currentType && itemType === currentType && !currentSubtype) ||
            (currentCategory && itemCategory === currentCategory && !currentType)
          ) {
            return {
              mainCategory: mainCatName,
              subCategory: subCat.title,
              item: item.name
            };
          }
        }
      }
    }
    return null;
  };

  const activeCategory = findActiveCategory();

  // Handle main category click
  const handleMainCategoryClick = (name: string) => {
    // Find the first subcategory and its first item
    const mainCategory = dynamicMenuItems[name];
    if (mainCategory && mainCategory.categories.length > 0) {
      const firstSubCategory = mainCategory.categories[0];
      if (firstSubCategory.items.length > 0) {
        const firstItem = firstSubCategory.items[0];
        navigate(firstItem.link);
      }
    }
    setActiveMenu(null);
    setIsMoreMenuOpen(false);
  };

  // Split menu items based on MAX_VISIBLE_ITEMS
  const getMenuSplit = () => {
    // Get the fixed categories in the order we want
    const orderedItems = FIXED_CATEGORIES.filter(cat => 
      Object.keys(dynamicMenuItems).includes(cat)
    );
    
    const totalItems = orderedItems.length;
    
    // If we have 8 or fewer items, show them all normally
    if (totalItems <= MAX_VISIBLE_ITEMS) {
      const halfPoint = Math.ceil(totalItems / 2);
      return {
        rightItems: orderedItems.slice(0, halfPoint),
        leftItems: orderedItems.slice(halfPoint),
        moreItems: []
      };
    }
    
    // If we have more than 8 items, show 7 and put the rest in "More"
    const visibleItems = MAX_VISIBLE_ITEMS - 1; // -1 for the "More" button
    const halfPoint = Math.ceil(visibleItems / 2);
    
    return {
      rightItems: orderedItems.slice(0, halfPoint),
      leftItems: orderedItems.slice(halfPoint, visibleItems),
      moreItems: orderedItems.slice(visibleItems).map(name => [name, dynamicMenuItems[name]])
    };
  };

  const { rightItems, leftItems, moreItems } = getMenuSplit();
  const hasMoreItems = moreItems.length > 0;

  return (
    <nav
      className={`top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/95 backdrop-blur-sm' : 'bg-black'
      }`}
    >
      {/* Search Bar */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="relative flex-1 max-w-xs">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="w-full bg-white/10 text-white placeholder-white/60 px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-white/30 text-right transition-all duration-300 hover:bg-white/20"
              >
                חיפוש מוצרים...
              </button>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
            </div>
            <div className="flex items-center gap-6 text-white">
              {isAdmin ? (
                <div className="relative">
                  <button
                    onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
                    className="flex items-center gap-2 hover:text-primary transition-colors"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span className="text-sm">ניהול</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        isAdminMenuOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isAdminMenuOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border">
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsAdminMenuOpen(false)}
                      >
                        <LayoutDashboard className="w-5 h-5" />
                        <span>לוח בקרה</span>
                      </Link>
                      <Link
                        to="/admin/products"
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsAdminMenuOpen(false)}
                      >
                        <Package className="w-5 h-5" />
                        <span>ניהול מוצרים</span>
                      </Link>
                      <Link
                        to="/admin/categories"
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsAdminMenuOpen(false)}
                      >
                        <FolderPlus className="w-5 h-5" />
                        <span>ניהול קטגוריות</span>
                      </Link>
                      <Link
                        to="/admin/users"
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsAdminMenuOpen(false)}
                      >
                        <Users className="w-5 h-5" />
                        <span>ניהול משתמשים</span>
                      </Link>
                      <div className="border-t my-1"></div>
                      <button
                        onClick={() => {
                          refreshCategories();
                          setIsAdminMenuOpen(false);
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors w-full text-right"
                        disabled={isRefreshing}
                      >
                        <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                        <span>{isRefreshing ? 'מרענן...' : 'רענן קטגוריות'}</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to={user ? '/account' : '/auth/login'}
                  className="flex items-center gap-2 relative hover:text-primary transition-colors"
                >
                  <div className="relative">
                    <User className="w-5 h-5" />
                    {user && (
                      <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-black"></div>
                    )}
                  </div>
                  <span className="text-sm">
                    {user
                      ? user.user_metadata?.full_name || 'החשבון שלי'
                      : 'התחבר'}
                  </span>
                </Link>
              )}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative hover:text-primary transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                    {itemCount}
                  </span>
                )}
              </button>
              <span className="text-red-500 font-bold">
                ₪{itemCount > 0 ? '2751' : '0'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Overlay */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Cart Drawer */}
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />

      {/* Compare Drawer */}
      <CompareDrawer
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
      />

      {/* Main Navigation */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-28">
            {/* Right Menu */}
            <div className="hidden md:flex items-center gap-4 flex-1 justify-start">
              {rightItems.map((name) => (
                <div
                  key={`main-right-${name}`}
                  className="relative group"
                  onMouseEnter={() => setActiveMenu(name)}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  <button 
                    onClick={() => handleMainCategoryClick(name)}
                    className={`flex items-center gap-2 transition-colors py-2 px-2 whitespace-nowrap text-sm lg:text-base ${
                      activeCategory?.mainCategory === name
                        ? 'text-red-500'
                        : 'text-white hover:text-red-500'
                    }`}
                  >
                    {dynamicMenuItems[name]?.icon}
                    <span>{name}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {activeMenu === name && dynamicMenuItems[name]?.categories.length > 0 && (
                    <div className="absolute top-full right-0 w-[800px] bg-white rounded-lg shadow-xl p-8 grid grid-cols-3 gap-8 border-t-2 border-red-500 z-50">
                      {dynamicMenuItems[name].categories.map((category) => (
                        <div key={`sub-right-${name}-${category.id}`}>
                          <h3 className={`font-bold mb-4 ${
                            activeCategory?.subCategory === category.title
                              ? 'text-red-500'
                              : 'text-gray-800'
                          }`}>
                            {category.title}
                          </h3>
                          <ul className="space-y-2">
                            {category.items.map((item) => {
                              const isActive = 
                                activeCategory?.mainCategory === name && 
                                activeCategory?.subCategory === category.title && 
                                activeCategory?.item === item.name;
                              
                              return (
                                <li key={`item-right-${name}-${category.id}-${item.id}`}>
                                  <Link
                                    to={item.link}
                                    className={`block transition-colors ${
                                      isActive
                                        ? 'text-red-500 font-medium'
                                        : 'text-gray-600 hover:text-red-500'
                                    }`}
                                    onClick={() => setActiveMenu(null)}
                                  >
                                    {item.name}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Centered Logo */}
            <Link
              to="/"
              className="flex-shrink-0 mx-auto transform transition-transform duration-300 hover:scale-105"
            >
              <img
                src="/images/logo.jpeg"
                alt="PRO ATV"
                className="h-[110px] w-auto object-contain"
              />
            </Link>

            {/* Left Menu */}
            <div className="hidden md:flex items-center gap-4 flex-1 justify-end">
              {leftItems.map((name) => (
                <div
                  key={`main-left-${name}`}
                  className="relative group"
                  onMouseEnter={() => setActiveMenu(name)}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  <button 
                    onClick={() => handleMainCategoryClick(name)}
                    className={`flex items-center gap-2 transition-colors py-2 px-2 whitespace-nowrap text-sm lg:text-base ${
                      activeCategory?.mainCategory === name
                        ? 'text-red-500'
                        : 'text-white hover:text-red-500'
                    }`}
                  >
                    {dynamicMenuItems[name]?.icon}
                    <span>{name}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {activeMenu === name && dynamicMenuItems[name]?.categories.length > 0 && (
                    <div className="absolute top-full left-0 w-[800px] bg-white rounded-lg shadow-xl p-8 grid grid-cols-2 gap-8 border-t-2 border-red-500 z-50">
                      {dynamicMenuItems[name].categories.map((category) => (
                        <div key={`sub-left-${name}-${category.id}`}>
                          <h3 className={`font-bold mb-4 ${
                            activeCategory?.subCategory === category.title
                              ? 'text-red-500'
                              : 'text-gray-800'
                          }`}>
                            {category.title}
                          </h3>
                          <ul className="space-y-2">
                            {category.items.map((item) => {
                              const isActive = 
                                activeCategory?.mainCategory === name && 
                                activeCategory?.subCategory === category.title && 
                                activeCategory?.item === item.name;
                              
                              return (
                                <li key={`item-left-${name}-${category.id}-${item.id}`}>
                                  <Link
                                    to={item.link}
                                    className={`block transition-colors ${
                                      isActive
                                        ? 'text-red-500 font-medium'
                                        : 'text-gray-600 hover:text-red-500'
                                    }`}
                                    onClick={() => setActiveMenu(null)}
                                  >
                                    {item.name}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* More Menu */}
              {hasMoreItems && (
                <div
                  className="relative"
                  onMouseEnter={() => setIsMoreMenuOpen(true)}
                  onMouseLeave={() => setIsMoreMenuOpen(false)}
                >
                  <button 
                    className={`flex items-center gap-2 transition-colors py-2 px-2 whitespace-nowrap text-sm lg:text-base text-white hover:text-red-500`}
                  >
                    <MoreHorizontal className="w-5 h-5" />
                    <span>עוד</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  
                  {isMoreMenuOpen && (
                    <div className="absolute top-full left-0 w-64 bg-white rounded-lg shadow-xl py-4 border-t-2 border-red-500 z-50">
                      {moreItems.map(([name, data], index) => (
                        <div key={`more-${name}-${index}`} className="relative px-4 py-2 hover:bg-gray-50 group">
                          <button
                            onClick={() => handleMainCategoryClick(name)}
                            className="flex items-center gap-2 w-full text-right"
                          >
                            {data.icon}
                            <span className="font-medium">{name}</span>
                            <ChevronDown className="w-4 h-4 mr-auto" />
                          </button>
                          
                          <div className="absolute top-0 right-full w-[800px] bg-white rounded-lg shadow-xl p-8 grid grid-cols-2 gap-8 border-t-2 border-red-500 z-50 hidden group-hover:block hover:block">
                            {data.categories.map((category) => (
                              <div key={`more-menu-${name}-${category.id}`}>
                                <h3 className="font-bold mb-4">{category.title}</h3>
                                <ul className="space-y-2">
                                  {category.items.map((item) => (
                                    <li key={`more-item-${name}-${category.id}-${item.id}`}>
                                      <Link
                                        to={item.link}
                                        className="block text-gray-600 hover:text-red-500 transition-colors"
                                        onClick={() => setIsMoreMenuOpen(false)}
                                      >
                                        {item.name}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white hover:text-red-500 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-sm border-t border-white/10 absolute w-full z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="space-y-4">
              {FIXED_CATEGORIES.map((name) => (
                <div key={`mobile-${name}`} className="space-y-2">
                  <button
                    className={`flex items-center gap-2 w-full ${
                      activeCategory?.mainCategory === name
                        ? 'text-red-500'
                        : 'text-white'
                    }`}
                    onClick={() =>
                      setActiveMenu(activeMenu === name ? null : name)
                    }
                  >
                    {dynamicMenuItems[name]?.icon}
                    <span>{name}</span>
                    <ChevronDown
                      className={`w-4 h-4 ml-auto transition-transform ${
                        activeMenu === name ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {activeMenu === name && dynamicMenuItems[name]?.categories.length > 0 && (
                    <div className="pr-4 space-y-4">
                      {dynamicMenuItems[name].categories.map((category) => (
                        <div key={`mobile-sub-${name}-${category.id}`}>
                          <h3 className={`font-bold text-sm ${
                            activeCategory?.subCategory === category.title
                              ? 'text-red-500'
                              : 'text-gray-400'
                          }`}>
                            {category.title}
                          </h3>
                          <ul className="space-y-2 mt-2">
                            {category.items.map((item) => {
                              const isActive = 
                                activeCategory?.mainCategory === name && 
                                activeCategory?.subCategory === category.title && 
                                activeCategory?.item === item.name;
                              
                              return (
                                <li key={`mobile-item-${name}-${category.id}-${item.id}`}>
                                  <Link
                                    to={item.link}
                                    className={`block transition-colors ${
                                      isActive
                                        ? 'text-red-500'
                                        : 'text-white/80 hover:text-red-500'
                                    }`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                  >
                                    {item.name}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

// Export empty menuItems for backward compatibility
export const menuItems = {};