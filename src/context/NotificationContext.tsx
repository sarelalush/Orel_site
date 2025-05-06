import React, { createContext, useContext, useState } from 'react';
import NotificationToast, { ToastType } from '../components/NotificationToast';

interface NotificationContextType {
  showNotification: (type: ToastType, message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notification, setNotification] = useState<{
    type: ToastType;
    message: string;
  } | null>(null);

  const showNotification = (type: ToastType, message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notification && (
        <NotificationToast
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}