import React, { createContext, useContext, useState, useCallback } from "react";
import { Product } from "@/data/products";
import { toast } from "sonner";

interface WishlistContextType {
  items: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  totalItems: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);

  const addToWishlist = useCallback((product: Product) => {
    setItems(prev => {
      if (prev.find(i => i.id === product.id)) {
        toast.info("Already in wishlist");
        return prev;
      }
      toast.success(`${product.name} added to wishlist`);
      return [...prev, product];
    });
  }, []);

  const removeFromWishlist = useCallback((productId: string) => {
    setItems(prev => prev.filter(i => i.id !== productId));
    toast.info("Removed from wishlist");
  }, []);

  const isInWishlist = useCallback((productId: string) => items.some(i => i.id === productId), [items]);

  return (
    <WishlistContext.Provider value={{ items, addToWishlist, removeFromWishlist, isInWishlist, totalItems: items.length }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
};
