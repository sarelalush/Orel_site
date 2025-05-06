import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { CartProvider } from './context/CartContext';
import { NotificationProvider } from './context/NotificationContext';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { CompareProvider } from './context/CompareContext';
import { RealtimeProvider } from './context/RealtimeContext';
import { DiscountProvider } from './context/DiscountContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <NotificationProvider>
        <AuthProvider>
          <RealtimeProvider>
            <WishlistProvider>
              <CompareProvider>
                <CartProvider>
                  <DiscountProvider>
                    <App />
                  </DiscountProvider>
                </CartProvider>
              </CompareProvider>
            </WishlistProvider>
          </RealtimeProvider>
        </AuthProvider>
      </NotificationProvider>
    </BrowserRouter>
  </StrictMode>
);