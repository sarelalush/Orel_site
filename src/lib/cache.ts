import { z } from 'zod';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class Cache {
  private static instance: Cache;
  private cache: Map<string, CacheItem<any>>;
  private readonly defaultTTL = 5 * 60 * 1000; // 5 minutes in milliseconds

  private constructor() {
    this.cache = new Map();
  }

  public static getInstance(): Cache {
    if (!Cache.instance) {
      Cache.instance = new Cache();
    }
    return Cache.instance;
  }

  public set<T>(key: string, data: T, ttl: number = this.defaultTTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  public get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  public invalidate(key: string): void {
    this.cache.delete(key);
  }

  public invalidatePattern(pattern: string): void {
    const regex = new RegExp(pattern);
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  public clear(): void {
    this.cache.clear();
  }
}

export const cache = Cache.getInstance();

// Cache keys
export const CACHE_KEYS = {
  PRODUCTS: 'products',
  PRODUCT: (id: string) => `product:${id}`,
  CATEGORIES: 'categories',
  CATEGORY: (id: string) => `category:${id}`,
  USER_ORDERS: (userId: string) => `orders:user:${userId}`,
  PRODUCT_REVIEWS: (productId: string) => `reviews:product:${productId}`,
  USER_REVIEWS: (userId: string) => `reviews:user:${userId}`,
  USER_WISHLIST: (userId: string) => `wishlist:user:${userId}`
};