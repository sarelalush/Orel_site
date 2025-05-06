export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  sale_price?: number;
  image_url: string;
  image?: string;
  stock: number;
  is_new?: boolean;
  category_id: string;
  has_sizes?: boolean;
  has_colors?: boolean;
  available_sizes?: string[];
  available_colors?: { name: string; label: string; hex: string }[];
  size?: string;
  color?: string;
  quantity?: number;
  categories?: {
    id: string;
    name: string;
    slug: string;
    parent_id: string | null;
    parent?: {
      id: string;
      name: string;
      slug: string;
    };
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface SortOption {
  label: string;
  value: 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';
}

export interface FilterOption {
  category: string;
  priceRange: [number, number] | null;
}