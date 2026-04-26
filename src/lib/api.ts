const API_BASE = import.meta.env.VITE_API_URL || 
  (typeof window !== 'undefined' && window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api' 
    : `${window.location.origin}/api`);

export async function fetchAPI<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`);
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'Unknown error');
    }
    return data.data as T;
  } catch (error) {
    console.error(`[v0] API fetch error for ${endpoint}:`, error);
    return [] as T;
  }
}

export async function getAllProducts() {
  return fetchAPI('/products');
}

export async function getFeaturedProducts() {
  return fetchAPI('/products/featured');
}

export async function getTrendingProducts() {
  return fetchAPI('/products/trending');
}

export async function getDiscountedProducts() {
  return fetchAPI('/products/discounted');
}

export async function getBestSellersProducts() {
  return fetchAPI('/products/best-sellers');
}

export async function getNewArrivalsProducts() {
  return fetchAPI('/products/new-arrivals');
}

export async function getProductById(id: string) {
  return fetchAPI(`/products/${id}`);
}

export async function getProductsByCategory(categoryId: string) {
  return fetchAPI(`/products/category/${categoryId}`);
}

export async function searchProducts(query: string) {
  return fetchAPI(`/products/search/${query}`);
}

export async function getAllCategories() {
  return fetchAPI('/categories');
}

export async function getCategoryById(id: string) {
  return fetchAPI(`/categories/${id}`);
}
