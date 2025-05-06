import { loadStripe } from '@stripe/stripe-js';

// Replace with your own publishable key from the Stripe Dashboard
// In a real app, this would be an environment variable
const stripePublishableKey = 'pk_test_51NxXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';

export const stripePromise = loadStripe(stripePublishableKey);

// This would typically be a server-side function
// For demo purposes, we're simulating the payment intent creation
export const createPaymentIntent = async (amount: number) => {
  // In a real app, this would be a server call to create a payment intent
  // For demo purposes, we're returning a mock response
  return {
    clientSecret: 'mock_client_secret_' + Math.random().toString(36).substring(2, 15),
    amount: amount,
    id: 'pi_' + Math.random().toString(36).substring(2, 15)
  };
};