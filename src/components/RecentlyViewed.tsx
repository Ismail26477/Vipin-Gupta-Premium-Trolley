import ProductCard from "@/components/ProductCard";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { Clock } from "lucide-react";

export default function RecentlyViewed() {
  const { products } = useRecentlyViewed();

  if (products.length === 0) return null;

  return (
    <section className="py-6 md:py-10">
      <div className="container">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-primary" />
          <h2 className="font-heading text-lg md:text-xl font-bold">Recently Viewed</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
          {products.slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  );
}
