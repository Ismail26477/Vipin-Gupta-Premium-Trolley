// API-based category fetching - Use relative paths that work on any domain
const API_BASE = '/api';

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  parentId: string;
}

export interface Category {
  id: string;
  name: string;
  slug?: string;
  icon?: string;
  image?: string;
  image_url?: string;
  sort_order?: number;
  subcategories?: Subcategory[];
}

// Global cache
let cachedCategories: Category[] = [];
let isInitialized = false;
let initializationPromise: Promise<void> | null = null;

async function fetchFromAPI(endpoint: string): Promise<any[]> {
  try {
    const url = `${API_BASE}${endpoint}`;
    console.log(`[v0] Fetching from ${url}`);
    const response = await fetch(url, { 
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(10000) 
    });
    if (!response.ok) throw new Error(`API error: ${response.statusText}`);
    const data = await response.json();
    return data.success ? data.data : data;
  } catch (error) {
    console.error(`[v0] API fetch failed for ${endpoint}:`, error);
    return [];
  }
}

export async function initializeCategories() {
  // If already initialized, return immediately
  if (isInitialized && cachedCategories.length > 0) {
    return;
  }
  
  // If initialization is in progress, wait for it
  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = (async () => {
    try {
      console.log('[v0] Initializing categories from API...');
      const mongoCategories = await fetchFromAPI('/categories');
      
      if (mongoCategories && mongoCategories.length > 0) {
        cachedCategories = mongoCategories.map((c: any) => ({
          id: c.id,
          name: c.name,
          slug: c.slug || c.id?.replace(/_/g, "-").toLowerCase() || c.name.toLowerCase(),
          image: c.image_url || c.image,
          icon: c.icon_url || "🧳",
          sort_order: c.sort_order,
          is_deal: c.is_deal,
          subcategories: [],
        })).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
        console.log('[v0] Categories loaded from API:', cachedCategories.length);
      } else {
        console.warn('[v0] No categories from API, using defaults');
        cachedCategories = getDefaultCategories();
      }
    } catch (error) {
      console.error('[v0] Failed to initialize categories:', error);
      cachedCategories = getDefaultCategories();
    } finally {
      isInitialized = true;
      initializationPromise = null;
    }
  })();

  return initializationPromise;
}

function getDefaultCategories(): Category[] {
  return [
    {
      id: "trolley-1",
      name: "1 Trolley Bag",
      slug: "luggage?subcategory=cabin-size",
      icon: "🧳",
      image: "/images/category-cabin.jpg",
      subcategories: [
        { id: "cabin-size", name: "Cabin Size", slug: "cabin-size", parentId: "trolley-1" },
      ],
    },
    {
      id: "trolley-2",
      name: "2 Trolley Bag",
      slug: "luggage?subcategory=medium-size",
      icon: "🛄",
      image: "/images/category-medium.jpg",
      subcategories: [
        { id: "medium-size", name: "Medium Size", slug: "medium-size", parentId: "trolley-2" },
      ],
    },
    {
      id: "trolley-3",
      name: "3 Trolley Bag",
      slug: "luggage?subcategory=large-size",
      icon: "🛅",
      image: "/images/category-large.jpg",
      subcategories: [
        { id: "large-size", name: "Large Size", slug: "large-size", parentId: "trolley-3" },
      ],
    },
    {
      id: "trolley-4",
      name: "4 Trolley Bag",
      slug: "luggage?subcategory=travel-sets",
      icon: "👜",
      image: "/images/category-sets.jpg",
      subcategories: [
        { id: "travel-sets", name: "Travel Sets (3-in-1, 4-in-1)", slug: "travel-sets", parentId: "trolley-4" },
      ],
    },
    {
      id: "trolley-5",
      name: "5 Trolley Bag",
      slug: "luggage?subcategory=hard-shell",
      icon: "💼",
      image: "/images/category-hardshell.jpg",
      subcategories: [
        { id: "hard-shell", name: "Hard Shell Luggage", slug: "hard-shell", parentId: "trolley-5" },
      ],
    },
  ];
}

export const getCategories = () => {
  return cachedCategories.length > 0 ? cachedCategories : getDefaultCategories();
};

// For backward compatibility with direct imports
export const categories = cachedCategories.length > 0 ? cachedCategories : getDefaultCategories();

export const getAllSubcategories = () => {
  return getCategories().flatMap(c => c.subcategories || []);
};

export const getCategoryBySlug = (slug: string): Category | undefined => {
  return getCategories().find(c => c.slug === slug);
};

export const getSubcategoryBySlug = (slug: string) => {
  for (const cat of getCategories()) {
    const sub = (cat.subcategories || []).find(s => s.slug === slug);
    if (sub) return { subcategory: sub, category: cat };
  }
  return null;
};

export const getCategoryById = (id: string): Category | undefined => {
  return getCategories().find(c => c.id === id);
};
