import { useState, useMemo, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getCategories, getCategoryBySlug, initializeCategories } from "@/data/categories";
import { getProductsByCategory, getProducts, initializeProducts } from "@/data/products";
import { ArrowRight } from "lucide-react";

import iconComputers from "@/assets/icon-computers.png";
import iconComponents from "@/assets/icon-components.png";
import iconPhones from "@/assets/icon-phones.png";
import iconTablets from "@/assets/icon-tablets.png";
import iconMobileAcc from "@/assets/icon-mobile-acc.png";
import iconComputerAcc from "@/assets/icon-computer-acc.png";
import iconStorage from "@/assets/icon-storage.png";
import iconAudio from "@/assets/icon-audio.png";
import iconNetworking from "@/assets/icon-networking.png";
import iconGaming from "@/assets/icon-gaming.png";
import iconPrinters from "@/assets/icon-printers.png";
import iconSmartGadgets from "@/assets/icon-smart-gadgets.png";
import iconCables from "@/assets/icon-cables.png";

const categoryIconMap: Record<string, string> = {
  computers: iconComputers,
  components: iconComponents,
  phones: iconPhones,
  tablets: iconTablets,
  "mobile-accessories": iconMobileAcc,
  "computer-accessories": iconComputerAcc,
  storage: iconStorage,
  audio: iconAudio,
  networking: iconNetworking,
  gaming: iconGaming,
  printers: iconPrinters,
  "smart-gadgets": iconSmartGadgets,
  cables: iconCables,
};

function getBadge(p: { isFeatured?: boolean; isNewArrival?: boolean; isTrending?: boolean; isBestSeller?: boolean; discountPrice?: number }) {
  if (p.isNewArrival) return { label: "NOTIFY ME", bg: "bg-teal-600" };
  if (p.isTrending) return { label: "PRE-ORDER", bg: "bg-teal-600" };
  if (p.discountPrice) return { label: "BUY NOW", bg: "bg-teal-600" };
  if (p.isBestSeller) return { label: "BUY NOW", bg: "bg-teal-600" };
  if (p.isFeatured) return { label: "BUY NOW", bg: "bg-teal-600" };
  return { label: "BUY NOW", bg: "bg-teal-600" };
}

export default function CategoryPage() {
  const { slug } = useParams();
  const [categories, setCategories] = useState<any[]>(getCategories());
  const [activeCategory, setActiveCategory] = useState(slug || "");
  const [products, setProducts] = useState<any[]>([]);

  // Initialize data on mount
  useEffect(() => {
    const load = async () => {
      try {
        await Promise.all([initializeProducts(), initializeCategories()]);
        const cats = getCategories();
        setCategories(cats);
        if (slug) {
          setActiveCategory(slug);
        } else if (cats.length > 0) {
          setActiveCategory(cats[0].slug || cats[0].id);
        }
      } catch (error) {
        console.error('[v0] Error initializing categories:', error);
      }
    };
    load();
  }, [slug]);

  useEffect(() => {
    setProducts(getProducts());
  }, [categories]);

  const category = useMemo(() => {
    if (!activeCategory) return null;
    
    const cats = getCategories();
    // Decode the slug in case it's URL-encoded
    const decodedActive = decodeURIComponent(activeCategory);
    
    // Try different matching strategies
    let cat = cats.find(c => c.slug === decodedActive);
    if (!cat) cat = cats.find(c => c.id === decodedActive);
    if (!cat) cat = cats.find(c => c.name === decodedActive);
    if (!cat) cat = cats.find(c => c.name.toLowerCase() === decodedActive.toLowerCase());
    
    return cat || null;
  }, [activeCategory]);

  const prods = useMemo(() => {
    if (!category) {
      return [];
    }
    const filteredProds = getProductsByCategory(category.id);
    return filteredProds;
  }, [category]);

  const popularProds = useMemo(() => prods.filter(p => p.isFeatured || p.isBestSeller).slice(0, 3), [prods]);
  const newProds = useMemo(() => prods.slice(0, 9), [prods]);

  if (!category) {
    return <div className="container py-16 text-center"><h1 className="text-2xl font-bold">Category not found</h1></div>;
  }

  return (
    <div className="flex min-h-[calc(100vh-120px)]">
      {/* Left sidebar - Flipkart style */}
      <aside className="w-[85px] sm:w-[100px] shrink-0 bg-card border-r border-border overflow-y-auto sticky top-[120px] h-[calc(100vh-120px)] no-scrollbar">
        {categories && categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/category/${cat.slug || cat.id}`}
            onClick={() => setActiveCategory(cat.slug || cat.id)}
            className={`flex flex-col items-center gap-1.5 px-1 py-3.5 text-center transition-all relative ${
              (activeCategory === cat.slug || activeCategory === cat.id)
                ? "bg-card border-l-[3px] border-primary"
                : "border-l-[3px] border-transparent hover:bg-secondary/40"
            }`}
          >
            <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center ${
              (activeCategory === cat.slug || activeCategory === cat.id) ? "bg-primary/10" : "bg-secondary/60"
            }`}>
              <img
                src={categoryIconMap[cat.id]}
                alt={cat.name}
                className="w-8 h-8 sm:w-9 sm:h-9 object-contain"
                loading="lazy"
              />
            </div>
            <span className={`text-[10px] sm:text-[11px] leading-tight line-clamp-2 font-medium ${
              (activeCategory === cat.slug || activeCategory === cat.id) ? "text-primary font-bold" : "text-muted-foreground"
            }`}>
              {cat.name}
            </span>
          </Link>
        ))}
      </aside>

      {/* Right content */}
      <main className="flex-1 overflow-y-auto no-scrollbar bg-background">
        <div className="p-3 sm:p-4 space-y-5">

          {/* Sale Banner */}
          <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-yellow-50 to-green-50 dark:from-yellow-950/30 dark:to-green-950/30 border border-border">
            <div className="flex items-center justify-between p-4 sm:p-5">
              <div>
                <p className="text-sm sm:text-base font-semibold text-foreground">Sale is live</p>
                <Link
                  to="/deals"
                  className="mt-2 inline-flex items-center justify-center w-8 h-8 rounded-full bg-foreground text-background"
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="text-right">
                <p className="font-heading text-xl sm:text-2xl font-black text-primary">BIG</p>
                <p className="font-heading text-lg sm:text-xl font-black text-amber-500">SAVING</p>
                <p className="font-heading text-xl sm:text-2xl font-black text-primary">DAYS</p>
              </div>
            </div>
          </div>

          {/* Popular Store */}
          {popularProds.length > 0 && (
            <section>
              <h3 className="font-heading font-bold text-base sm:text-lg mb-3 text-foreground">Popular Store</h3>
              <div className="grid grid-cols-3 gap-3">
                {popularProds.map(p => (
                  <Link
                    key={p.id}
                    to={`/product/${p.id}`}
                    className="flex flex-col items-center group"
                  >
                    <div className="w-full aspect-square rounded-xl overflow-hidden bg-secondary/40 border border-border mb-2">
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <span className="text-[11px] sm:text-xs font-medium text-center text-foreground line-clamp-1">Shop now</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* New & Upcoming Launches */}
          <section>
            <h3 className="font-heading font-bold text-base sm:text-lg mb-3 text-foreground">New & Upcoming Launches</h3>
            <div className="grid grid-cols-3 gap-x-3 gap-y-4">
              {newProds.map(p => {
                const badge = getBadge(p);
                return (
                  <Link
                    key={p.id}
                    to={`/product/${p.id}`}
                    className="flex flex-col items-center group"
                  >
                    <div className="relative w-full">
                      <div className="w-full aspect-square rounded-xl overflow-hidden bg-secondary/30 border border-border">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      {/* Badge at bottom of image */}
                      <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 ${badge.bg} text-white text-[8px] sm:text-[9px] font-bold px-2 py-0.5 rounded-sm whitespace-nowrap uppercase tracking-wide`}>
                        {badge.label}
                      </span>
                    </div>
                    <p className="text-[10px] sm:text-xs font-medium text-center text-foreground mt-3 line-clamp-2 leading-tight">
                      {p.name}
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* All Products in category */}
          {prods.length > 9 && (
            <section>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-heading font-bold text-base sm:text-lg text-foreground">All {category.name}</h3>
                <Link to={`/shop`} className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
                  View All <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="grid grid-cols-3 gap-x-3 gap-y-4">
                {prods.slice(9).map(p => {
                  const badge = getBadge(p);
                  return (
                    <Link
                      key={p.id}
                      to={`/product/${p.id}`}
                      className="flex flex-col items-center group"
                    >
                      <div className="relative w-full">
                        <div className="w-full aspect-square rounded-xl overflow-hidden bg-secondary/30 border border-border">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 ${badge.bg} text-white text-[8px] sm:text-[9px] font-bold px-2 py-0.5 rounded-sm whitespace-nowrap uppercase tracking-wide`}>
                          {badge.label}
                        </span>
                      </div>
                      <p className="text-[10px] sm:text-xs font-medium text-center text-foreground mt-3 line-clamp-2 leading-tight">
                        {p.name}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
