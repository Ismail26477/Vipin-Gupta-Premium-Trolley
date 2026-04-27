// Use relative paths that work on any domain (localhost or production)
const API_BASE = '/api';

export async function fetchAPI<T>(endpoint: string): Promise<T> {
  try {
    const url = `${API_BASE}${endpoint}`;
    console.log(`[v0] Fetching from ${url}`);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.error(`[v0] API returned status ${response.status}`, response.statusText);
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`[v0] Received data from ${endpoint}:`, data);
    
    // API will return success: false if there's an error, but fallback data
    if (data.success === false && !data.data) {
      console.warn(`[v0] API returned error for ${endpoint}:`, data.error);
      return [] as T;
    }
    
    // Return the data (fallback or actual)
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
