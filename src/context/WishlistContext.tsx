import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';

interface WishlistContextType {
  items: string[];
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<string[]>([]);
  const { user } = useAuth();
  const { showNotification } = useNotification();
  
  // Store wishlist in localStorage for non-authenticated users
  const [localWishlist, setLocalWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error parsing local wishlist:', error);
      return [];
    }
  });

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setItems(localWishlist);
    }
  }, [user]);

  // Save local wishlist to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('wishlist', JSON.stringify(localWishlist));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [localWishlist]);

  const fetchWishlist = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('wishlists')
        .select('product_id')
        .eq('user_id', user.id);

      if (error) throw error;
      setItems(data.map(item => item.product_id));
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      showNotification('error', 'שגיאה בטעינת המועדפים');
    }
  };

  const addToWishlist = async (productId: string) => {
    if (!user) {
      // For non-authenticated users, store in localStorage
      if (!localWishlist.includes(productId)) {
        const newLocalWishlist = [...localWishlist, productId];
        setLocalWishlist(newLocalWishlist);
        setItems(newLocalWishlist);
      }
      showNotification('success', 'המוצר נוסף למועדפים');
      return;
    }

    try {
      // First check if the user exists in the users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single();
      
      if (userError) {
        // User doesn't exist in the users table, create them
        const { error: insertError } = await supabase
          .from('users')
          .insert([{ 
            id: user.id, 
            email: user.email || '',
            full_name: user.user_metadata?.full_name || ''
          }]);
        
        if (insertError) throw insertError;
      }
      
      // Now add to wishlist
      const { error } = await supabase
        .from('wishlists')
        .insert([{ user_id: user.id, product_id: productId }]);

      if (error) {
        // If the item is already in the wishlist, ignore the error
        if (error.code === '23505') { // Unique constraint violation
          return;
        }
        throw error;
      }
      
      setItems([...items, productId]);
      showNotification('success', 'המוצר נוסף למועדפים');
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      showNotification('error', 'שגיאה בהוספה למועדפים');
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) {
      // For non-authenticated users, remove from localStorage
      const newLocalWishlist = localWishlist.filter(id => id !== productId);
      setLocalWishlist(newLocalWishlist);
      setItems(newLocalWishlist);
      showNotification('success', 'המוצר הוסר מהמועדפים');
      return;
    }

    try {
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) throw error;
      setItems(items.filter(id => id !== productId));
      showNotification('success', 'המוצר הוסר מהמועדפים');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      showNotification('error', 'שגיאה בהסרה מהמועדפים');
    }
  };

  const isInWishlist = (productId: string) => {
    return items.includes(productId);
  };

  return (
    <WishlistContext.Provider value={{ items, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}