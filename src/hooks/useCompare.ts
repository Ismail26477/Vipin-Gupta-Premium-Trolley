import { useState, useCallback } from "react";
import { Product } from "@/data/products";
import { toast } from "sonner";

const MAX = 3;

export function useCompare() {
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  const addToCompare = useCallback((product: Product) => {
    setCompareList(prev => {
      if (prev.find(p => p.id === product.id)) {
        toast.info("Already in compare list");
        return prev;
      }
      if (prev.length >= MAX) {
        toast.error(`Max ${MAX} products to compare`);
        return prev;
      }
      toast.success(`${product.name} added to compare`);
      return [...prev, product];
    });
  }, []);

  const removeFromCompare = useCallback((id: string) => {
    setCompareList(prev => prev.filter(p => p.id !== id));
  }, []);

  const clearCompare = useCallback(() => {
    setCompareList([]);
    setShowCompare(false);
  }, []);

  return { compareList, addToCompare, removeFromCompare, clearCompare, showCompare, setShowCompare };
}
