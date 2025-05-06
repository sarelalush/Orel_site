import { getAuthToken } from './supabase';
import { validateData, productSchema, orderSchema, reviewSchema } from './validation';
import { logger } from './logger';
import { monitor } from './monitoring';
import { handleError, AppError, errorCodes } from './errorHandler';
import { supabase } from './supabase';

// Helper function to make authenticated API requests
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = await getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers
  };

  const response = await fetch(`/api${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }

  return response.json();
};

// User Management API
export const updateUserMetadata = async (userId: string, metadata: {
  full_name?: string;
  role?: 'user' | 'admin';
  address?: string;
  city?: string;
  phone?: string;
  zipCode?: string;
}) => {
  try {
    // Update auth metadata
    const { error: authError } = await supabase.auth.admin.updateUserById(
      userId,
      { user_metadata: metadata }
    );

    if (authError) throw authError;

    // Update users table
    const { error: dbError } = await supabase
      .from('users')
      .update({
        full_name: metadata.full_name,
        phone: metadata.phone,
        address: metadata.address,
        city: metadata.city,
        zip_code: metadata.zipCode
      })
      .eq('id', userId);

    if (dbError) throw dbError;

    return { success: true, error: null };
  } catch (error) {
    logger.error('Error updating user metadata:', error);
    return { success: false, error };
  }
};

export const updateUserRole = async (userId: string, isAdmin: boolean) => {
  try {
    const { error } = await supabase.auth.admin.updateUserById(
      userId,
      { 
        user_metadata: { 
          role: isAdmin ? 'admin' : 'user' 
        }
      }
    );

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    logger.error('Error updating user role:', error);
    return { success: false, error };
  }
};

// Products API
export const getProducts = async () => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories:category_id (
          id,
          name,
          slug,
          parent_id,
          parent:categories!parent_id (
            id,
            name,
            slug,
            parent_id,
            parent:categories!parent_id (
              id,
              name,
              slug
            )
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    logger.error('Error fetching products:', error);
    return [];
  }
};

export const getProduct = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories:category_id (
          id,
          name,
          slug,
          parent_id,
          parent:categories!parent_id (
            id,
            name,
            slug,
            parent_id,
            parent:categories!parent_id (
              id,
              name,
              slug
            )
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    logger.error('Error fetching product:', error);
    return { data: null, error: new Error('שגיאה בטעינת המוצר') };
  }
};

export const deleteProduct = async (id: string) => {
  return monitor(async () => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true, error: null };
    } catch (error) {
      logger.error('Error deleting product:', error);
      return { success: false, error: new Error('שגיאה במחיקת המוצר') };
    }
  }, 'deleteProduct');
};

// Reviews API
export const getProductReviews = async (productId: string) => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        user:users!reviews_user_id_fkey (
          id,
          email,
          full_name
        )
      `)
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    logger.error('Error in getProductReviews:', error);
    return [];
  }
};

export const createReview = async (productId: string, review: { rating: number; comment: string }) => {
  return monitor(async () => {
    try {
      const validation = validateData(reviewSchema, review);
      if (!validation.success) {
        throw new AppError(
          validation.error || 'שגיאת ולידציה',
          errorCodes.VALIDATION_ERROR,
          400
        );
      }

      const { data, error } = await supabase
        .from('reviews')
        .insert({
          product_id: productId,
          ...review
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw handleError(error);
    }
  }, 'createReview');
};

export const markReviewHelpful = async (reviewId: string) => {
  return monitor(async () => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ 
          helpful_count: supabase.raw('helpful_count + 1')
        })
        .eq('id', reviewId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      throw handleError(error);
    }
  }, 'markReviewHelpful');
};

// Orders API
export const createOrder = async (orderData: any) => {
  try {
    const validation = validateData(orderSchema, orderData);
    if (!validation.success) {
      throw new AppError(
        validation.error || 'שגיאת ולידציה',
        errorCodes.VALIDATION_ERROR,
        400
      );
    }

    const { data, error } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

// Coupons API
export const validateCoupon = async (code: string, totalAmount: number) => {
  try {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single();

    if (error) throw error;

    // Validate coupon
    const now = new Date();
    const startDate = new Date(data.start_date);
    const endDate = data.end_date ? new Date(data.end_date) : null;

    if (now < startDate || (endDate && now > endDate)) {
      return { is_valid: false, message: 'קופון לא בתוקף', discount_amount: 0 };
    }

    if (totalAmount < data.min_purchase) {
      return { 
        is_valid: false, 
        message: `סכום מינימום להזמנה: ₪${data.min_purchase}`,
        discount_amount: 0 
      };
    }

    let discountAmount = 0;
    if (data.discount_type === 'percentage') {
      discountAmount = (totalAmount * data.discount_value) / 100;
    } else {
      discountAmount = data.discount_value;
    }

    return { 
      is_valid: true,
      message: 'קופון תקין',
      discount_amount: discountAmount 
    };
  } catch (error) {
    throw handleError(error);
  }
};

// Loyalty Points API
export const getUserLoyaltyPoints = async () => {
  try {
    const { data, error } = await supabase
      .from('user_loyalty_points')
      .select('*')
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getLoyaltyPointsTransactions = async () => {
  try {
    const { data, error } = await supabase
      .from('loyalty_points_transactions')
      .select(`
        *,
        order:orders (
          id,
          total,
          created_at
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    throw handleError(error);
  }
};