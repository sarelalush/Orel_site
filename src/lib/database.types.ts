export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          address: string | null
          city: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          created_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image_url: string | null
          created_at: string
          parent_id: string | null
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          image_url?: string | null
          created_at?: string
          parent_id?: string | null
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          image_url?: string | null
          created_at?: string
          parent_id?: string | null
        }
      }
      products: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          price: number
          sale_price?: number
          category_id: string
          image_url: string | null
          stock: number
          created_at: string
          has_sizes: boolean
          has_colors: boolean
          available_sizes: string[]
          available_colors: Json
          is_new?: boolean
          average_rating?: number
          review_count?: number
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          price: number
          sale_price?: number
          category_id: string
          image_url?: string | null
          stock?: number
          created_at?: string
          has_sizes?: boolean
          has_colors?: boolean
          available_sizes?: string[]
          available_colors?: Json
          is_new?: boolean
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          price?: number
          sale_price?: number
          category_id?: string
          image_url?: string | null
          stock?: number
          created_at?: string
          has_sizes?: boolean
          has_colors?: boolean
          available_sizes?: string[]
          available_colors?: Json
          is_new?: boolean
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          status: string
          total: number
          created_at: string
          coupon_id?: string
          discount_amount?: number
          points_earned?: number
          points_used?: number
        }
        Insert: {
          id?: string
          user_id: string
          status: string
          total: number
          created_at?: string
          coupon_id?: string
          discount_amount?: number
          points_earned?: number
          points_used?: number
        }
        Update: {
          id?: string
          user_id?: string
          status?: string
          total?: number
          created_at?: string
          coupon_id?: string
          discount_amount?: number
          points_earned?: number
          points_used?: number
        }
      }
      coupons: {
        Row: {
          id: string
          code: string
          description: string | null
          discount_type: 'percentage' | 'fixed'
          discount_value: number
          min_purchase: number
          max_uses: number | null
          uses_count: number
          start_date: string
          end_date: string | null
          is_active: boolean
          created_at: string
          created_by: string
        }
        Insert: {
          id?: string
          code: string
          description?: string | null
          discount_type: 'percentage' | 'fixed'
          discount_value: number
          min_purchase?: number
          max_uses?: number | null
          uses_count?: number
          start_date: string
          end_date?: string | null
          is_active?: boolean
          created_at?: string
          created_by: string
        }
        Update: {
          id?: string
          code?: string
          description?: string | null
          discount_type?: 'percentage' | 'fixed'
          discount_value?: number
          min_purchase?: number
          max_uses?: number | null
          uses_count?: number
          start_date?: string
          end_date?: string | null
          is_active?: boolean
          created_at?: string
          created_by?: string
        }
      }
      coupon_usage: {
        Row: {
          id: string
          coupon_id: string
          user_id: string
          order_id: string
          used_at: string
          discount_amount: number
        }
        Insert: {
          id?: string
          coupon_id: string
          user_id: string
          order_id: string
          used_at?: string
          discount_amount: number
        }
        Update: {
          id?: string
          coupon_id?: string
          user_id?: string
          order_id?: string
          used_at?: string
          discount_amount?: number
        }
      }
      quantity_discounts: {
        Row: {
          id: string
          product_id: string
          min_quantity: number
          discount_percentage: number
          start_date: string
          end_date: string | null
          is_active: boolean
          created_at: string
          created_by: string
        }
        Insert: {
          id?: string
          product_id: string
          min_quantity: number
          discount_percentage: number
          start_date: string
          end_date?: string | null
          is_active?: boolean
          created_at?: string
          created_by: string
        }
        Update: {
          id?: string
          product_id?: string
          min_quantity?: number
          discount_percentage?: number
          start_date?: string
          end_date?: string | null
          is_active?: boolean
          created_at?: string
          created_by?: string
        }
      }
      loyalty_program: {
        Row: {
          id: string
          name: string
          points_per_purchase: number
          points_value: number
          min_points_redeem: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          points_per_purchase?: number
          points_value?: number
          min_points_redeem?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          points_per_purchase?: number
          points_value?: number
          min_points_redeem?: number
          created_at?: string
          updated_at?: string
        }
      }
      user_loyalty_points: {
        Row: {
          id: string
          user_id: string
          points: number
          total_earned: number
          total_spent: number
          last_earned_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          points?: number
          total_earned?: number
          total_spent?: number
          last_earned_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          points?: number
          total_earned?: number
          total_spent?: number
          last_earned_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      loyalty_points_transactions: {
        Row: {
          id: string
          user_id: string
          order_id: string | null
          points: number
          transaction_type: 'earn' | 'spend'
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          order_id?: string | null
          points: number
          transaction_type: 'earn' | 'spend'
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          order_id?: string | null
          points?: number
          transaction_type?: 'earn' | 'spend'
          description?: string | null
          created_at?: string
        }
      }
    }
    Functions: {
      execute_sql: {
        Args: {
          query: string
        }
        Returns: undefined
      }
      get_user_metadata: {
        Args: {
          user_id: string
        }
        Returns: Json
      }
      validate_coupon: {
        Args: {
          p_coupon_code: string
          p_user_id: string
          p_total_amount: number
        }
        Returns: {
          is_valid: boolean
          message: string
          discount_amount: number
        }[]
      }
    }
  }
}