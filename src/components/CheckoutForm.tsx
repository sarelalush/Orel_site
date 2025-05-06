import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';
import { createPaymentIntent } from '../lib/stripe';
import LoadingSpinner from './LoadingSpinner';

interface CheckoutFormProps {
  shippingDetails: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zipCode: string;
  };
}

export default function CheckoutForm({ shippingDetails }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { total, clearCart } = useCart();
  const { showNotification } = useNotification();
  const [processing, setProcessing] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      return;
    }

    setProcessing(true);
    setCardError(null);

    try {
      // In a real implementation, this would create a payment intent on your server
      const paymentIntent = await createPaymentIntent(total * 100); // amount in cents

      // In a real implementation, this would confirm the payment with the actual client secret
      // For demo purposes, we're simulating a successful payment
      
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate successful payment
      showNotification('success', 'התשלום בוצע בהצלחה!');
      clearCart();
      navigate('/order-confirmation');
    } catch (error) {
      console.error('Payment error:', error);
      setCardError('אירעה שגיאה בעיבוד התשלום. אנא נסה שוב.');
      showNotification('error', 'שגיאה בעיבוד התשלום');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          פרטי כרטיס אשראי
        </label>
        <div className="border border-gray-300 rounded-lg p-4 bg-white">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
              hidePostalCode: true,
            }}
            onChange={(e) => {
              setCardComplete(e.complete);
              setCardError(e.error ? e.error.message : null);
            }}
          />
        </div>
        {cardError && (
          <p className="mt-2 text-sm text-red-600">{cardError}</p>
        )}
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between text-lg font-bold mb-4">
          <span>סה"כ לתשלום:</span>
          <span>₪{total.toLocaleString()}</span>
        </div>

        <button
          type="submit"
          disabled={!stripe || processing || !cardComplete}
          className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {processing ? <LoadingSpinner /> : 'אישור תשלום'}
        </button>
      </div>
    </form>
  );
}