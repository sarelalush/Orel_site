import React, { createContext, useContext, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';

interface RealtimeContextType {
  subscribeToOrderUpdates: (orderId: string) => void;
  unsubscribeFromOrderUpdates: (orderId: string) => void;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { showNotification } = useNotification();

  useEffect(() => {
    if (!user) return;

    // Subscribe to order status changes
    const orderSubscription = supabase
      .channel('orders')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const { new: newOrder } = payload;
          const statusMap = {
            pending: 'ממתין לאישור',
            processing: 'בטיפול',
            completed: 'הושלם',
            cancelled: 'בוטל'
          };
          showNotification('info', `סטטוס ההזמנה שלך עודכן ל-${statusMap[newOrder.status as keyof typeof statusMap]}`);
        }
      )
      .subscribe();

    // Subscribe to price changes for wishlist items
    const priceSubscription = supabase
      .channel('wishlist-prices')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'products',
          filter: `id=in.(select product_id from wishlists where user_id='${user.id}')`
        },
        (payload) => {
          const { old: oldProduct, new: newProduct } = payload;
          if (oldProduct.price > newProduct.price) {
            showNotification('info', `המחיר של ${newProduct.name} ירד!`);
          }
        }
      )
      .subscribe();

    // Subscribe to stock notifications
    const stockSubscription = supabase
      .channel('stock-notifications')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'products',
          filter: `id=in.(select product_id from stock_notifications where user_id='${user.id}')`
        },
        (payload) => {
          const { new: newProduct } = payload;
          if (newProduct.stock > 0) {
            showNotification('success', `${newProduct.name} חזר למלאי!`);
          }
        }
      )
      .subscribe();

    return () => {
      orderSubscription.unsubscribe();
      priceSubscription.unsubscribe();
      stockSubscription.unsubscribe();
    };
  }, [user, showNotification]);

  const subscribeToOrderUpdates = (orderId: string) => {
    // Subscribe to specific order updates
    supabase
      .channel(`order-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`
        },
        (payload) => {
          const { new: newOrder } = payload;
          const statusMap = {
            pending: 'ממתין לאישור',
            processing: 'בטיפול',
            completed: 'הושלם',
            cancelled: 'בוטל'
          };
          showNotification('info', `עדכון להזמנה ${orderId}: ${statusMap[newOrder.status as keyof typeof statusMap]}`);
        }
      )
      .subscribe();
  };

  const unsubscribeFromOrderUpdates = (orderId: string) => {
    supabase.removeChannel(`order-${orderId}`);
  };

  return (
    <RealtimeContext.Provider value={{
      subscribeToOrderUpdates,
      unsubscribeFromOrderUpdates
    }}>
      {children}
    </RealtimeContext.Provider>
  );
}

export function useRealtime() {
  const context = useContext(RealtimeContext);
  if (context === undefined) {
    throw new Error('useRealtime must be used within a RealtimeProvider');
  }
  return context;
}