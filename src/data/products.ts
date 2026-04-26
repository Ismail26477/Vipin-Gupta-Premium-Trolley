// API-based product fetching - Use relative paths that work on any domain
const API_BASE = '/api';

export interface ProductReview {
  id: string;
  userName?: string;
  customer?: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category?: string;
  category_id?: string;
  subcategory?: string;
  price: number;
  discountPrice?: number;
  discount_price?: number;
  stock: number;
  brand: string;
  rating?: number;
  reviewCount?: number;
  review_count?: number;
  images?: string[];
  specs?: Record<string, string>;
  specifications?: Record<string, any>;
  reviews?: ProductReview[];
  isFeatured?: boolean;
  featured?: boolean;
  isTrending?: boolean;
  trending?: boolean;
  isBestSeller?: boolean;
  best_seller?: boolean;
  isNewArrival?: boolean;
  new_arrival?: boolean;
  tags?: string[];
  status?: string;
}

// Global cache
let cachedProducts: Product[] = [];
let isInitialized = false;

async function fetchFromAPI(endpoint: string): Promise<any[]> {
  try {
    const url = `${API_BASE}${endpoint}`;
    console.log(`[v0] Fetching from ${url}`);
    const response = await fetch(url);
    if (!response.ok) throw new Error(`API error: ${response.statusText}`);
    const data = await response.json();
    console.log(`[v0] API response:`, data);
    return data.success ? data.data : [];
  } catch (error) {
    console.error(`[v0] API fetch failed for ${endpoint}:`, error);
    return [];
  }
}

export async function initializeProducts() {
  if (isInitialized) {
    console.log('[v0] Products already initialized:', cachedProducts.length);
    return;
  }
  
  try {
    console.log('[v0] Starting to initialize products...');
    const products = await fetchFromAPI('/products');
    console.log('[v0] Fetched products count:', products.length);
    
    if (!products || products.length === 0) {
      console.warn('[v0] No products returned from API');
      isInitialized = true;
      return;
    }
    
    cachedProducts = products.map(p => ({
      ...p,
      category: p.category_id || "luggage",
      discountPrice: p.discount_price,
      reviewCount: p.reviews?.length || 0,
      specs: p.specifications || {},
      isFeatured: p.featured || false,
      isTrending: p.trending || false,
      isBestSeller: p.best_seller || false,
      isNewArrival: p.new_arrival || false,
    }));
    isInitialized = true;
    console.log('[v0] Products initialized successfully. Total:', cachedProducts.length);
  } catch (error) {
    console.error('[v0] Failed to initialize products:', error);
    isInitialized = true; // Mark as attempted even on error to prevent infinite retries
  }
}

export const getProducts = () => cachedProducts;

// Export for compatibility with components like AdminDashboardPage
export const products = cachedProducts;

export function getFeaturedProducts(): Product[] {
  return cachedProducts.filter(p => p.isFeatured || p.featured);
}

export function getTrendingProducts(): Product[] {
  return cachedProducts.filter(p => p.isTrending || p.trending);
}

export function getDiscountedProducts(): Product[] {
  return cachedProducts.filter(p => (p.discountPrice || p.discount_price) !== undefined);
}

export function getBestSellerProducts(): Product[] {
  return cachedProducts.filter(p => p.isBestSeller || p.best_seller);
}

export function getNewArrivalProducts(): Product[] {
  return cachedProducts.filter(p => p.isNewArrival || p.new_arrival);
}

export function getProductById(id: string): Product | undefined {
  return cachedProducts.find(p => p.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  return cachedProducts.filter(p => p.category === category);
}

export function getProductsByBrand(brand: string): Product[] {
  return cachedProducts.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase();
  return cachedProducts.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    p.brand.toLowerCase().includes(q) ||
    (p.tags || []).some(tag => tag.toLowerCase().includes(q))
  );
}

export function getProductsByRating(minRating: number): Product[] {
  return cachedProducts.filter(p => p.rating >= minRating);
}

export function getProductsByPriceRange(min: number, max: number): Product[] {
  return cachedProducts.filter(p => {
    const price = p.discountPrice || p.discount_price || p.price;
    return price >= min && price <= max;
  });
}

export function getBestSellers(): Product[] {
  return cachedProducts.filter(p => p.isBestSeller || p.best_seller);
}

export function getNewArrivals(): Product[] {
  return cachedProducts.filter(p => p.isNewArrival || p.new_arrival);
}
