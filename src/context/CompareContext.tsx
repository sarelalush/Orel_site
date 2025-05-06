import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNotification } from './NotificationContext';

interface CompareProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category_id: string;
  categories: {
    name: string;
    parent: {
      name: string;
    } | null;
  };
}

interface CompareContextType {
  items: CompareProduct[];
  addToCompare: (productId: string) => Promise<void>;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isInCompare: (productId: string) => boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CompareProduct[]>([]);
  const { showNotification } = useNotification();

  const addToCompare = async (productId: string) => {
    if (items.length >= 4) {
      showNotification('error', 'ניתן להשוות עד 4 מוצרים');
      return;
    }

    if (items.some(item => item.id === productId)) {
      showNotification('error', 'המוצר כבר נמצא בהשוואה');
      return;
    }

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
        .eq('id', productId)
        .single();

      if (error) throw error;
      setItems([...items, data]);
      showNotification('success', 'המוצר נוסף להשוואה');
    } catch (error) {
      console.error('Error adding product to compare:', error);
      showNotification('error', 'שגיאה בהוספת המוצר להשוואה');
    }
  };

  const removeFromCompare = (productId: string) => {
    setItems(items.filter(item => item.id !== productId));
    showNotification('success', 'המוצר הוסר מההשוואה');
  };

  const clearCompare = () => {
    setItems([]);
  };

  const isInCompare = (productId: string) => {
    return items.some(item => item.id === productId);
  };

  return (
    <CompareContext.Provider value={{
      items,
      addToCompare,
      removeFromCompare,
      clearCompare,
      isInCompare
    }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (context === undefined) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
}