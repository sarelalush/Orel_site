import { z } from 'zod';

// Product validation schemas
export const productSchema = z.object({
  name: z.string().min(2, 'שם המוצר חייב להכיל לפחות 2 תווים'),
  slug: z.string().min(2, 'slug חייב להכיל לפחות 2 תווים'),
  description: z.string().min(10, 'תיאור המוצר חייב להכיל לפחות 10 תווים'),
  price: z.number().min(0, 'מחיר חייב להיות מספר חיובי'),
  stock: z.number().int().min(0, 'מלאי חייב להיות מספר שלם חיובי'),
  category_id: z.string().uuid('קטגוריה לא תקינה'),
  has_sizes: z.boolean().optional(),
  has_colors: z.boolean().optional(),
  available_sizes: z.array(z.string()).optional(),
  available_colors: z.array(
    z.object({
      name: z.string(),
      label: z.string(),
      hex: z.string().regex(/^#[0-9A-F]{6}$/i, 'קוד צבע לא תקין')
    })
  ).optional()
});

// Order validation schemas
export const orderItemSchema = z.object({
  product_id: z.string().uuid('מזהה מוצר לא תקין'),
  quantity: z.number().int().min(1, 'כמות חייבת להיות לפחות 1'),
  price: z.number().min(0, 'מחיר חייב להיות מספר חיובי')
});

export const orderSchema = z.object({
  items: z.array(orderItemSchema).min(1, 'הזמנה חייבת להכיל לפחות פריט אחד'),
  total: z.number().min(0, 'סכום ההזמנה חייב להיות מספר חיובי'),
  shipping_details: z.object({
    fullName: z.string().min(2, 'שם מלא חייב להכיל לפחות 2 תווים'),
    email: z.string().email('כתובת אימייל לא תקינה'),
    phone: z.string().regex(/^05\d{8}$/, 'מספר טלפון לא תקין'),
    address: z.string().min(5, 'כתובת חייבת להכיל לפחות 5 תווים'),
    city: z.string().min(2, 'עיר חייבת להכיל לפחות 2 תווים'),
    zipCode: z.string().regex(/^\d{5,7}$/, 'מיקוד לא תקין')
  })
});

// Review validation schema
export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5, 'דירוג חייב להיות בין 1 ל-5'),
  comment: z.string().min(10, 'תוכן הביקורת חייב להכיל לפחות 10 תווים').max(1000, 'תוכן הביקורת לא יכול להכיל יותר מ-1000 תווים')
}).strict();

// Helper function to validate data against a schema
export const validateData = <T>(schema: z.Schema<T>, data: unknown): { success: boolean; data?: T; error?: string } => {
  try {
    const validData = schema.parse(data);
    return { success: true, data: validData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      return { 
        success: false, 
        error: firstError.message
      };
    }
    return { 
      success: false, 
      error: 'שגיאת ולידציה לא ידועה' 
    };
  }
};