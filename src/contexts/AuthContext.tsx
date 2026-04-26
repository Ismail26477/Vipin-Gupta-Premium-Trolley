import React, { createContext, useContext, useState, useCallback } from "react";
import { toast } from "sonner";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  avatar?: string;
}

export interface Order {
  id: string;
  date: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  address: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  orders: Order[];
  addOrder: (order: Omit<Order, "id" | "date" | "status">) => string;
  cancelOrder: (orderId: string) => void;
  returnOrder: (orderId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const demoOrders: Order[] = [
  {
    id: "ORD-001",
    date: "2025-12-15",
    items: [{ name: "MacBook Air M2", quantity: 1, price: 114900 }],
    total: 114900,
    status: "Delivered",
    address: "123 Tech Street, Mumbai, MH 400001",
  },
  {
    id: "ORD-002",
    date: "2026-01-20",
    items: [
      { name: "Sony WH-1000XM5", quantity: 1, price: 22491 },
      { name: "Anker USB-C Cable", quantity: 2, price: 799 },
    ],
    total: 24089,
    status: "Shipped",
    address: "456 Gadget Road, Delhi, DL 110001",
  },
  {
    id: "ORD-003",
    date: "2026-02-28",
    items: [{ name: "Samsung Galaxy S24 Ultra", quantity: 1, price: 119599 }],
    total: 119599,
    status: "Processing",
    address: "789 Mobile Lane, Bangalore, KA 560001",
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>(demoOrders);

  const login = useCallback((email: string, _password: string) => {
    setUser({
      id: "user-1",
      name: "Demo User",
      email,
      phone: "+91 9876543210",
      address: "123 Tech Street, Mumbai, MH 400001",
    });
    toast.success("Welcome back!");
    return true;
  }, []);

  const signup = useCallback((name: string, email: string, _password: string) => {
    setUser({ id: "user-" + Date.now(), name, email });
    toast.success("Account created successfully!");
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    toast.info("Logged out successfully");
  }, []);

  const updateProfile = useCallback((data: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...data } : null);
    toast.success("Profile updated");
  }, []);

  const addOrder = useCallback((order: Omit<Order, "id" | "date" | "status">) => {
    const id = `ORD-${String(orders.length + 1).padStart(3, "0")}`;
    const newOrder: Order = {
      ...order,
      id,
      date: new Date().toISOString().split("T")[0],
      status: "Processing",
    };
    setOrders(prev => [newOrder, ...prev]);
    return id;
  }, [orders.length]);

  const cancelOrder = useCallback((orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: "Cancelled" as const } : o));
    toast.success(`Order ${orderId} cancelled. Refund will be processed in 5-7 days.`);
  }, []);

  const returnOrder = useCallback((orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: "Cancelled" as const } : o));
    toast.success(`Return request for ${orderId} submitted. Pickup will be scheduled soon.`);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout, updateProfile, orders, addOrder, cancelOrder, returnOrder }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
