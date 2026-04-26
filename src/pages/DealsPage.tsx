import { getDiscountedProducts, getBestSellers, getNewArrivals } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { useState, useEffect } from "react";

export default function DealsPage() {
  const [tab, setTab] = useState<"deals" | "bestsellers" | "new">("deals");
  const [discounted, setDiscounted] = useState<any[]>([]);
  const [best, setBest] = useState<any[]>([]);
  const [newArrivals, setNewArrivals] = useState<any[]>([]);

  useEffect(() => {
    setDiscounted(getDiscountedProducts());
    setBest(getBestSellers());
    setNewArrivals(getNewArrivals());
  }, []);

  const tabs = [
    { id: "deals" as const, label: "🔥 Discount Deals", count: discounted.length },
    { id: "bestsellers" as const, label: "⭐ Best Sellers", count: best.length },
    { id: "new" as const, label: "🆕 New Arrivals", count: newArrivals.length },
  ];

  const items = tab === "deals" ? discounted : tab === "bestsellers" ? best : newArrivals;

  return (
    <div className="container py-6">
      <h1 className="font-heading text-2xl font-bold mb-2">Deals & Offers</h1>
      <p className="text-sm text-muted-foreground mb-6">The best prices on top electronics</p>

      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${tab === t.id ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/80"}`}>
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
        {items.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}
