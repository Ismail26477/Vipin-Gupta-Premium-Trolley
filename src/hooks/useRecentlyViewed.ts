import { useState, useEffect, useCallback } from "react";
import { Product, getProductById } from "@/data/products";

const STORAGE_KEY = "recently_viewed";
const MAX_ITEMS = 10;

export function useRecentlyViewed() {
  const [viewedIds, setViewedIds] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(viewedIds));
  }, [viewedIds]);

  const addViewed = useCallback((productId: string) => {
    setViewedIds(prev => {
      const filtered = prev.filter(id => id !== productId);
      return [productId, ...filtered].slice(0, MAX_ITEMS);
    });
  }, []);

  const products: Product[] = viewedIds
    .map(id => getProductById(id))
    .filter((p): p is Product => !!p);

  return { products, addViewed };
}
