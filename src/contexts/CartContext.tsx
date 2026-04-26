import React, { createContext, useContext, useState, useCallback } from "react";
import { Product } from "@/data/products";
import { toast } from "sonner";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  couponCode: string;
  couponDiscount: number;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const VALID_COUPONS: Record<string, number> = {
  TECH10: 10,
  NOVA20: 20,
  SAVE15: 15,
  FIRST25: 25,
  FLAT500: 500,
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);

  const addToCart = useCallback((product: Product, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        toast.success(`Updated ${product.name} quantity in cart`);
        return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i);
      }
      toast.success(`${product.name} added to cart`);
      return [...prev, { product, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setItems(prev => prev.filter(i => i.product.id !== productId));
    toast.info("Item removed from cart");
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems(prev => prev.filter(i => i.product.id !== productId));
      return;
    }
    setItems(prev => prev.map(i => i.product.id === productId ? { ...i, quantity } : i));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setCouponCode("");
    setCouponDiscount(0);
  }, []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => {
    const price = i.product.discountPrice || i.product.price;
    return sum + price * i.quantity;
  }, 0);

  const applyCoupon = useCallback((code: string) => {
    const upper = code.toUpperCase();
    if (VALID_COUPONS[upper]) {
      setCouponCode(upper);
      const discount = VALID_COUPONS[upper];
      setCouponDiscount(discount > 100 ? discount : Math.round(totalPrice * discount / 100));
      toast.success(`Coupon ${upper} applied!`);
      return true;
    }
    toast.error("Invalid coupon code");
    return false;
  }, [totalPrice]);

  const removeCoupon = useCallback(() => {
    setCouponCode("");
    setCouponDiscount(0);
    toast.info("Coupon removed");
  }, []);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice, couponCode, couponDiscount, applyCoupon, removeCoupon }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
